<!-- * 菜单 表单弹窗 -->
<template>
  <a-drawer
    :body-style="{ paddingBottom: '80px' }"
    :maskClosable="true"
    title="权限设置"
    :open="visible"
    :width="1500"
    :get-container="SmartLoading.spin"
    @close="onClose"
  >
    <a-card size="small" :bordered="false" :hoverable="true">
      <a-row class="smart-table-btn-block">
        <div class="smart-table-operate-block">
          <a-button v-privilege="'scope:add'" type="primary" @click="showModal({ menuId: queryForm.menuId })">
            <template #icon>
              <PlusOutlined />
            </template>
            新增
          </a-button>

          <a-button v-privilege="'scope:delete'" type="primary" danger @click="batchDelete" :disabled="!hasSelected">
            <template #icon>
              <DeleteOutlined />
            </template>
            批量删除
          </a-button>
        </div>
        <div class="smart-table-setting-block">
          <TableOperator v-model="scopeColumns" :tableId="TABLE_ID_CONST.SYSTEM.SCOPE" :show-full-screen="false" :refresh="query" />
        </div>
      </a-row>

      <a-table
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        size="small"
        :dataSource="tableData"
        bordered
        :columns="scopeColumns"
        :loading="tableLoading"
        rowKey="id"
      >
        <template #expandedRowRender="{ record }">
          <p style="margin: 0">
            {{ record.scopeSql }}
          </p>
        </template>
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.dataIndex === 'scopeType'">
            <a-tag color="blue">{{ $smartEnumPlugin.getDescByValue('SCOPE_TYPE_ENUM', text) }}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'operate'">
            <div class="smart-table-operate">
              <a-button type="link" size="small" @click="showModal(record, true)">查看</a-button>
              <a-button v-privilege="'scope:update'" type="link" size="small" @click="showModal(record)">编辑</a-button>
              <a-button v-privilege="'scope:delete'" danger type="link" @click="singleDelete(record)">删除</a-button>
            </div>
          </template>
        </template>
      </a-table>
      <div class="smart-query-table-page">
        <a-pagination
          showSizeChanger
          showQuickJumper
          show-less-items
          :pageSizeOptions="PAGE_SIZE_OPTIONS"
          :defaultPageSize="queryForm.size"
          v-model:current="queryForm.current"
          v-model:pageSize="queryForm.size"
          :total="total"
          @change="query"
          @showSizeChange="query"
          :show-total="() => `共${total}条`"
        />
      </div>
    </a-card>
    <ScopeOperateModal ref="scopeOperateModal" @reloadList="query" />
  </a-drawer>
</template>
<script setup>
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { message, Modal } from 'ant-design-vue';
  import _ from 'lodash';
  import { computed, createVNode, reactive, ref } from 'vue';
  import { scopeColumns } from '../columns.js';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { smartSentry } from '/@/lib/smart-sentry';
  import TableOperator from '/@/components/support/table-operator/index.vue';
  import ScopeOperateModal from './scope-operate-modal.vue';
  import { TABLE_ID_CONST } from '/@/constants/support/table-id-const';
  import { scopeApi } from '/@/api/system/scope-api.js';
  import { PAGE_SIZE_OPTIONS } from '/@/constants/common-const.js';
  import { userApi } from '/@/api/system/user-api.js';
  import { deptApi } from '/@/api/system/dept-api.js';

  // ------------------------ 查询表单 ------------------------
  const queryFormState = {
    menuId: null,
    current: 1,
    size: 10,
    // 排序字段
    sortField: null,
    // 排序规则
    sortOrder: null,
  };
  const queryForm = reactive({ ...queryFormState });

  // ------------------------ table表格数据和查询方法 ------------------------

  const tableLoading = ref(false);
  const tableData = ref([]);
  // 总数
  const total = ref(0);

  function resetQuery() {
    Object.assign(queryForm, queryFormState);
    scopeColumns.value.forEach((item) => (item.sortOrder = null));
    query();
  }

  async function query() {
    try {
      tableLoading.value = true;
      const res = await scopeApi.scopePage(queryForm);
      tableData.value = res.data.records;
      total.value = res.data.total;
    } catch (e) {
      smartSentry.captureError(e);
    } finally {
      tableLoading.value = false;
    }
  }

  // -------------- 多选操作 --------------
  const selectedRowKeys = ref([]);
  let selectedRows = [];
  const hasSelected = computed(() => selectedRowKeys.value.length > 0);

  function onSelectChange(keyArray, selectRows) {
    selectedRowKeys.value = keyArray;
    selectedRows = selectRows;
  }

  function singleDelete(record) {
    confirmBatchDelete([record]);
  }

  function batchDelete() {
    confirmBatchDelete(selectedRows);
  }

  function confirmBatchDelete(array) {
    const scopeNameArray = array.map((e) => e.scopeName);
    Modal.confirm({
      title: '确认是否删除以下数据?',
      icon: createVNode(ExclamationCircleOutlined),
      content: _.join(scopeNameArray, '、'),
      okText: '删除',
      okType: 'danger',
      onOk() {
        const scopeIdList = array.map((e) => e.id);
        requestBatchDelete({ deleteIds: scopeIdList });
        selectedRows = [];
      },
      cancelText: '取消',
      onCancel() {},
    });

    async function requestBatchDelete(params) {
      SmartLoading.show();
      try {
        await scopeApi.batchDeleteScope(params);
        message.success('删除成功!');
        await query();
      } catch (e) {
        smartSentry.captureError(e);
      } finally {
        SmartLoading.hide();
      }
    }
  }

  // -------------- 新增、修改 右侧抽屉 --------------
  const scopeOperateModal = ref();

  async function showModal(rowData, bool) {
    if (rowData.visibilityIds && rowData.visibilityIds.length > 0) {
      rowData.visibilityValue = rowData.visibilityIds.split(',');
    }
    const userRes = await userApi.userList();
    scopeOperateModal.value.userData = userRes.data;
    const deptRes = await deptApi.deptTree();
    scopeOperateModal.value.deptData = deptRes.data;
    scopeOperateModal.value.showModal(rowData, bool);
  }

  // emit
  const emit = defineEmits(['reloadList']);

  // ----------------------- 展开、隐藏编辑窗口 ------------------------

  // 是否展示抽屉
  const visible = ref(false);

  //展开编辑窗口
  async function showDrawer(rowData) {
    queryForm.menuId = rowData.id;
    await query();
    visible.value = true;
  }

  // 隐藏窗口
  function onClose() {
    tableData.value = [];
    visible.value = false;
  }

  defineExpose({
    showDrawer,
  });
</script>
<style lang="less" scoped>
  .footer {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: left;
    z-index: 1;
  }
</style>
