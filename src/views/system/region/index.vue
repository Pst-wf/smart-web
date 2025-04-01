<template>
  <div>
    <a-form class="smart-query-form">
      <a-row class="smart-query-form-row">
        <a-form-item label="名称" class="smart-query-form-item">
          <a-input style="width: 300px" v-model:value="queryForm.name" placeholder="请输入名称" allowClear />
        </a-form-item>
        <a-form-item label="行政编号" class="smart-query-form-item">
          <a-input style="width: 300px" v-model:value="queryForm.areaCode" placeholder="请输入行政编号" allowClear />
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
          <a-button v-privilege="'region:add'" type="primary" @click="showForm">
            <template #icon>
              <PlusOutlined />
            </template>
            新增
          </a-button>
          <a-button v-privilege="'region:delete'" type="primary" danger @click="batchDelete" :disabled="!hasSelected">
            <template #icon>
              <DeleteOutlined />
            </template>
            批量删除
          </a-button>
          <a-button v-privilege="'region:export'" type="primary" ghost @click="exportData">
            <template #icon>
              <ExportOutlined />
            </template>
            导出
          </a-button>
          <a-button v-privilege="'region:import'" type="primary" danger ghost @click="openImportModal">
            <template #icon>
              <ImportOutlined />
            </template>
            导入
          </a-button>
        </div>
        <div class="smart-table-setting-block">
          <TableOperator v-model="columns" :refresh="query" />
        </div>
      </a-row>
      <a-table
          v-model:expandedRowKeys="expandedKeys"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          size="small"
          :defaultExpandAllRows="true"
          :dataSource="tableData"
          bordered
          :columns="columns"
          :loading="tableLoading"
          rowKey="id"
          :pagination="false"
          @expand="expandRow"
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
              <a-button type="link" size="small" @click="showForm(record, true)">查看</a-button>
              <a-button v-privilege="'region:update'" type="link" size="small" @click="showForm(record)">编辑</a-button>
              <a-button v-privilege="'region:delete'" danger type="link" @click="singleDelete(record)">删除</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
    <OperateModal ref="operateModal" :tree-data="treeData" @reloadList="query" />
    <ImportData ref="importData" import-url="/system/region/import" @downloadTemplate="downloadTemplate" @finish="query" />
  </div>
</template>
<script setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import _ from 'lodash';
import { computed, createVNode, onMounted, reactive, ref } from 'vue';
import OperateModal from './components/operate-modal.vue';
import { columns } from './columns.js';
import { regionApi } from '/@/api/system/region/region-api.js';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { smartSentry } from '/@/lib/smart-sentry';
import TableOperator from '/@/components/support/table-operator/index.vue';
import { exportFile } from '/@/utils/exportFile.js';
import ImportData from '/@/components/import-data/index.vue';
// ------------------------ 查询表单 ------------------------
const queryFormState = {
  // 行政编号
  areaCode: null,
  // 父级ID
  parentId: null,
  // 名称
  name: null,
  // 排序字段
  sortField: null,
  // 排序规则
  sortOrder: null,
};
const queryForm = reactive({ ...queryFormState });
// ------------------------ table表格数据和查询方法 ------------------------
const tableLoading = ref(false);
const tableData = ref([]);
const expandedKeys = ref([]);
const total = ref(0);

// 重置
function resetQuery() {
  Object.assign(queryForm, queryFormState);
  columns.value.forEach((item) => (item.sortOrder = null));
  query();
}

// 查询
async function query() {
  try {
    expandedKeys.value = [];
    tableLoading.value = true;
    let res = await regionApi.asyncLoading(queryForm);
    res.data.forEach((item) => (item.children = item.children ? item.children : []));
    tableData.value = res.data;
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
      await regionApi.deleteRegion(params);
      // 清除选中
      selectedRowKeys.value = selectedRowKeys.value.filter((x) => params.deleteIds.indexOf(x) === -1);
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

function showForm(rowData, bool) {
  operateModal.value.showForm(_.cloneDeep(rowData), bool);
}

// -------------- 导入导出 --------------
// 导出
async function exportData() {
  try {
    tableLoading.value = true;
    let params = {};
    Object.assign(params, queryForm);
    if (selectedRowKeys.value.length > 0) {
      params = { ...params, selectIds: selectedRowKeys.value };
    }
    let res = await regionApi.exportRegionData(params);
    message.success('操作成功');
    exportFile(res.data, res.headers);
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    tableLoading.value = false;
  }
}

// 打开导入弹窗
const importData = ref();

function openImportModal() {
  importData.value.onOpen();
}

// 下载导入数据模板
async function downloadTemplate() {
  try {
    tableLoading.value = true;
    let res = await regionApi.downloadRegionTemplate();
    message.success('操作成功');
    exportFile(res.data, res.headers);
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    tableLoading.value = false;
  }
}

function expandRow(expanded, record) {
  if (expanded) {
    expandedKeys.value.push(record.id);
    if (record.children.length === 0) {
      regionApi.asyncLoading({ parentId: record.id }).then((res) => {
        if (res.data && res.data.length > 0) {
          res.data.forEach((item) => (item.children = item.children ? item.children : []));
          record.children = res.data;
        } else if (res.data && res.data.length === 0) {
          record.children = null;
        }
      });
    }
  } else {
    expandedKeys.value = expandedKeys.value.filter((x) => x !== record.id);
  }
}

// -------------- 修改状态 --------------
async function updateStatus(record, val) {
  tableLoading.value = true;
  try {
    await regionApi.updateStatus({ id: record.id, status: val });
    record.status = val;
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    tableLoading.value = false;
  }
}
const treeData = ref([]);
async function queryDeptTree() {
  let res = await regionApi.regionTreeFormat();
  treeData.value = res.data;
}
function init() {
  queryDeptTree();
}

onMounted(() => {
  init();
});
</script>
