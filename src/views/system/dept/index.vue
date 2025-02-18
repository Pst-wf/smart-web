<template>
  <div>
    <a-form class="smart-query-form">
      <a-row class="smart-query-form-row">
        <a-form-item label="机构名称" class="smart-query-form-item">
          <a-input style="width: 300px" v-model:value="queryForm.deptName" placeholder="请输入机构名称" allowClear />
        </a-form-item>

        <a-form-item label="机构类型" class="smart-query-form-item">
          <SmartEnumSelect width="300px" enum-name="DEPT_TYPE_ENUM" v-model:value="queryForm.deptType" placeholder="请选择机构类型"/>
        </a-form-item>

        <a-form-item label="状态" class="smart-query-form-item">
          <SmartEnumSelect width="300px" enum-name="STATUS_ENUM" v-model:value="queryForm.status" placeholder="请选择状态"/>
        </a-form-item>

        <a-form-item class="smart-query-form-item smart-margin-left10">
          <a-button-group>
            <a-button type="primary" @click="query">
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
          <a-button v-privilege="'dept:add'" type="primary" @click="showDrawer">
            <template #icon>
              <PlusOutlined />
            </template>
            新增
          </a-button>

          <a-button v-privilege="'dept:delete'" type="primary" danger @click="batchDelete" :disabled="!hasSelected">
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
          <template v-if="column.dataIndex === 'deptType'">
            <a-tag :color="text === '1' ? 'blue' : 'orange'">{{ $smartEnumPlugin.getDescByValue('DEPT_TYPE_ENUM', text) }}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="text ? 'blue' : 'red' ">{{ $smartEnumPlugin.getDescByValue('STATUS_ENUM', text) }}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'operate'">
            <div class="smart-table-operate">
              <a-button type="link" size="small" @click="showDrawer(record, true)">查看</a-button>
              <a-button v-privilege="'dept:update'" type="link" size="small" @click="showDrawer(record)">编辑</a-button>
              <a-button v-privilege="'dept:delete'" danger type="link" @click="singleDelete(record)">删除</a-button>
              <a-button v-privilege="'dept:add'" type="link" size="small" @click="showDrawer({parentId: record.id})">添加下级</a-button>
            </div>
          </template>
        </template>
      </a-table>
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
import { deptApi } from '/@/api/system/dept-api.js';
import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { smartSentry } from '/@/lib/smart-sentry';
import TableOperator from '/@/components/support/table-operator/index.vue';

// ------------------------ 查询表单 ------------------------
const queryFormState = {
  deptName: null,
  deptType: null,
  status: null,
  // 排序字段
  sortField: null,
  // 排序规则
  sortOrder: null
};
const queryForm = reactive({ ...queryFormState });

// ------------------------ table表格数据和查询方法 ------------------------

const tableLoading = ref(false);
const tableData = ref([]);

function resetQuery() {
  Object.assign(queryForm, queryFormState);
  columns.value.forEach(item => item.sortOrder = null)
  query();
}

onMounted(query);

async function query() {
  try {
    tableLoading.value = true;
    let res = await deptApi.deptTree(queryForm);
    tableData.value = res.data;
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
  Modal.confirm({
    title: '删除机构同时删除子机构，请确认是否删除?',
    icon: createVNode(ExclamationCircleOutlined),
    okText: '删除',
    okType: 'danger',
    onOk() {
      const deleteIds = array.map((e) => e.id);
      requestBatchDelete({ deleteIds : deleteIds });
      selectedRows = [];
    },
    cancelText: '取消',
    onCancel() {},
  });

  async function requestBatchDelete(params) {
    SmartLoading.show();
    try {
      await deptApi.deleteDept(params);
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
</script>
