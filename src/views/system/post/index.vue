<template>
  <div>
    <a-form class="smart-query-form">
      <a-row class="smart-query-form-row">
        <a-form-item label="岗位名称" class="smart-query-form-item">
          <a-input style="width: 300px" v-model:value="queryForm.postName" placeholder="请输入岗位名称" allowClear />
        </a-form-item>
        <a-form-item label="岗位编码" class="smart-query-form-item">
          <a-input style="width: 300px" v-model:value="queryForm.postCode" placeholder="请输入岗位编码" allowClear />
        </a-form-item>
        <a-form-item label="状态" class="smart-query-form-item">
          <SmartEnumSelect width="300px" enum-name="STATUS_ENUM" v-model:value="queryForm.status" placeholder="请选择状态" />
        </a-form-item>
        <a-form-item class="smart-query-form-item smart-margin-left10">
          <a-button-group>
            <a-button type="primary" @click="toFirstPage">
              <template #icon>
                <SearchOutlined />
              </template>
              查询
            </a-button>
            <a-button @click="resetQuery">
              <template #icon>
                <ReloadOutlined />
              </template>
              重置
            </a-button>
          </a-button-group>
        </a-form-item>
      </a-row>
    </a-form>
    <a-card size="small" :bordered="false" :hoverable="true">
      <a-row class="smart-table-btn-block">
        <div class="smart-table-operate-block">
          <a-button v-privilege="'post:add'" type="primary" @click="showDrawer">
            <template #icon>
              <PlusOutlined />
            </template>
            新增
          </a-button>
          <a-button v-privilege="'post:delete'" type="primary" danger @click="batchDelete" :disabled="!hasSelected">
            <template #icon>
              <DeleteOutlined />
            </template>
            批量删除
          </a-button>
        </div>
        <div class="smart-table-setting-block">
          <TableOperator v-model="columns" :refresh="query" />
        </div>
      </a-row>
      <a-table
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          size="small"
          :defaultExpandAllRows="true"
          :dataSource="tableData"
          bordered
          :columns="columns"
          :loading="tableLoading"
          rowKey="id"
          :pagination="false"
          @change="(pagination, filters, sorter) => $sorterChange(() => query(), sorter, queryForm, columns)"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.dataIndex === 'status'">
            <a-switch
                @change="(val) => updateStatus(record, val)"
                :checked="text"
                checked-value="1"
                un-checked-value="0"
                checked-children="启用"
                un-checked-children="停用"
            />
          </template>
          <template v-if="column.dataIndex === 'operate'">
            <div class="smart-table-operate">
              <a-button type="link" size="small" @click="showDrawer(record, true)">查看</a-button>
              <a-button v-privilege="'post:update'" type="link" size="small" @click="showDrawer(record)">编辑</a-button>
              <a-button v-privilege="'post:delete'" danger type="link" @click="singleDelete(record)">删除</a-button>
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
    <OperateModal ref="operateModal" @reloadList="query" />
  </div>
</template>
<script setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { computed, createVNode, onMounted, reactive, ref } from 'vue';
import OperateModal from './components/operate-modal.vue';
import { columns } from './columns.js';
import { postApi } from '/@/api/system/post-api.js';
import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { smartSentry } from '/@/lib/smart-sentry';
import TableOperator from '/@/components/support/table-operator/index.vue';
import { PAGE_SIZE_OPTIONS } from '/@/constants/common-const.js';

// ------------------------ 查询表单 ------------------------
const queryFormState = {
  postName: null,
  postCode: null,
  status: null,
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
const total = ref(0);

// 重置
function resetQuery() {
  Object.assign(queryForm, queryFormState);
  columns.value.forEach((item) => (item.sortOrder = null));
  query();
}
// 回到第一页
function toFirstPage() {
  Object.assign(queryForm, { current: 1 });
  query();
}
// 查询
async function query() {
  try {
    tableLoading.value = true;
    let res = await postApi.postPage(queryForm);
    tableData.value = res.data.records;
    total.value = res.data.total;
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    tableLoading.value = false;
  }
}
// Mounted方法
onMounted(query);
// -------------- 多选操作 --------------
const selectedRowKeys = ref([]);
let selectedRows = [];
const hasSelected = computed(() => selectedRowKeys.value.length > 0);
// 选中触发
function onSelectChange(keyArray, selectRows) {
  selectedRowKeys.value = keyArray;
  selectedRows = selectRows;
}

// -------------- 删除操作 --------------
function singleDelete(record) {
  confirmBatchDelete([record]);
}
function batchDelete() {
  confirmBatchDelete(selectedRows);
}
function confirmBatchDelete(array) {
  Modal.confirm({
    title: '请确认是否删除?',
    icon: createVNode(ExclamationCircleOutlined),
    okText: '删除',
    okType: 'danger',
    onOk() {
      const deleteIds = array.map((e) => e.id);
      requestBatchDelete({ deleteIds: deleteIds });
      selectedRows = [];
    },
    cancelText: '取消',
    onCancel() {},
  });

  async function requestBatchDelete(params) {
    SmartLoading.show();
    try {
      await postApi.deletePost(params);
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
const operateModal = ref();
function showDrawer(rowData, bool) {
  operateModal.value.showDrawer(rowData, bool);
}

// -------------- 修改状态 --------------
async function updateStatus(record, val) {
  try {
    record.status = val;
    await postApi.updateStatus({ id: record.id, status: val });
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    tableLoading.value = false;
  }
}
</script>
