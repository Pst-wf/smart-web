<template>
  <div>
    <a-form class="smart-query-form">
      <a-row class="smart-query-form-row">
        <a-form-item label="表名" class="smart-query-form-item">
          <a-input style="width: 300px" v-model:value="queryForm.tableName" placeholder="请输入表名"/>
        </a-form-item>
        <a-form-item class="smart-query-form-item smart-margin-left10">
          <a-button-group>
            <a-button type="primary" @click="toFirstPage">
              <template #icon>
                <SearchOutlined/>
              </template>
              查询
            </a-button>
            <a-button @click="resetQuery">
              <template #icon>
                <ReloadOutlined/>
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
          <a-button v-privilege="'gen:add'" type="primary" @click="showDrawer">
            <template #icon>
              <PlusOutlined/>
            </template>
            新增
          </a-button>
          <a-button v-privilege="'gen:delete'" type="primary" danger @click="batchDelete" :disabled="!hasSelected">
            <template #icon>
              <DeleteOutlined/>
            </template>
            批量删除
          </a-button>
          <a-button type="default" @click="genCode()" :disabled="!hasSelected">
            <template #icon>
              <ApiOutlined/>
            </template>
            批量生成代码
          </a-button>
        </div>
        <div class="smart-table-setting-block">
          <TableOperator v-model="columns" :refresh="query"/>
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
            <a-tag :color="text ? 'blue' : 'red' ">{{ $smartEnumPlugin.getDescByValue('STATUS_ENUM', text) }}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'operate'">
            <div class="smart-table-operate">
              <a-button type="link" size="small" @click="showDrawer(record, true)">查看</a-button>
              <a-button v-privilege="'gen:update'" type="link" size="small" @click="showDrawer(record)">编辑</a-button>
              <a-button v-privilege="'gen:delete'" danger type="link" @click="singleDelete(record)">删除</a-button>
              <a-dropdown placement="bottomLeft">
                <a-button style="color: #4ab844" type="link">更多</a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a-button type="link" style="color: #1e1e1e" size="small" @click="preview(record)">
                        预览
                      </a-button>
                    </a-menu-item>
                    <a-menu-item>
                      <a-button type="link" style="color: #1e1e1e" size="small" @click="genCode(record)">生成代码
                      </a-button>
                    </a-menu-item>
                    <a-menu-item>
                      <a-button type="link" style="color: #1e1e1e" size="small" @click="saveMenu(record)">生成菜单
                      </a-button>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
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
    <OperateModal ref="operateModal" @reloadList="query"/>
    <PreviewModal ref="previewModal" :preview-data="tree"/>
  </div>
</template>
<script setup>
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {message, Modal} from 'ant-design-vue';
import {computed, createVNode, onMounted, reactive, ref, shallowRef} from 'vue';
import OperateModal from './components/operate-modal.vue';
import PreviewModal from './components/preview-modal.vue';
import {columns} from './columns.js';
import {genTableApi} from '/@/api/tools/gen-api.js';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {smartSentry} from '/@/lib/smart-sentry';
import TableOperator from '/@/components/support/table-operator/index.vue';
import {PAGE_SIZE_OPTIONS} from "/@/constants/common-const.js";
import {menuApi} from "/@/api/system/menu-api.js";
import {exportFile} from "/@/utils/exportFile.js";

// ------------------------ 查询表单 ------------------------
const queryFormState = {
  tableName: null,
  current: 1,
  size: 10,
  // 排序字段
  sortField: null,
  // 排序规则
  sortOrder: null
};
const queryForm = reactive({...queryFormState});

// ------------------------ table表格数据和查询方法 ------------------------
const tableLoading = ref(false);
const tableData = ref([]);
const total = ref(0);

// 重置
function resetQuery() {
  Object.assign(queryForm, queryFormState);
  columns.value.forEach(item => item.sortOrder = null)
  query();
}
// 回到第一页
function toFirstPage() {
  Object.assign(queryForm, { current: 1 });
  query();
}[]
// 查询
async function query() {
  try {
    tableLoading.value = true;
    let res = await genTableApi.genTablePage(queryForm);
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
      requestBatchDelete({deleteIds: deleteIds});
    },
    cancelText: '取消',
    onCancel() {
    },
  });

  async function requestBatchDelete(params) {
    SmartLoading.show();
    try {
      await genTableApi.deleteGenTable(params);
      // 清除选中
      selectedRowKeys.value = selectedRowKeys.value.filter(x => params.deleteIds.indexOf(x) === -1);
      selectedRows = [];
      message.success('删除成功!');
      await query();
    } catch (e) {
      smartSentry.captureError(e);
    } finally {
      SmartLoading.hide();
    }
  }
}

const tree = shallowRef([]);
const previewModal = ref();
async function preview(row) {
  const res = await genTableApi.preview({id: row.id});
  tree.value = res.data;
  // tree.value?.forEach(x => {
  //   x.prefix = () => getPrefix(x.id);
  // });
  previewModal.value.showDrawer();
}

async function genCode(row) {
  let params;
  if (row) {
    params = {selectIds: [row.id]};
  } else {
    params = {selectIds: selectedRowKeys.value};
  }
  const res = await genTableApi.generateCode(params);
  message.success('操作成功');
  exportFile(res.data, res.headers);
}

async function saveMenu(row) {
  try {
    tableLoading.value = true;
    await menuApi.genMenu(row);
    message.success('操作成功')
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    tableLoading.value = false;
  }
}

// -------------- 新增、修改 右侧抽屉 --------------
const operateModal = ref();

function showDrawer(rowData, bool) {
  operateModal.value.showDrawer(rowData, bool);
}
</script>
