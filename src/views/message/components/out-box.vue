<template>
  <div>
    <a-card size="small" :bordered="false" :hoverable="true">
      <a-row class="smart-table-btn-block">
        <div class="smart-table-operate-block">
          <a-button @click="resetQuery">
            <template #icon>
              <RedoOutlined/>
            </template>
            刷新
          </a-button>
          <a-button v-privilege="'notice:delete'" @click="batchDelete" :disabled="!hasSelected">
            <template #icon>
              <DeleteOutlined/>
            </template>
            删除
          </a-button>
          <a-button v-privilege="'notice:delete'" danger @click="batchRealDelete" :disabled="!hasSelected">
            <template #icon>
              <DeleteFilled/>
            </template>
            彻底删除
          </a-button>
        </div>
        <div class="smart-table-setting-block">
          <a-pagination
              simple
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
      </a-row>
      <a-table
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          size="small"
          :defaultExpandAllRows="true"
          :dataSource="tableData"
          bordered
          :columns="outColumns"
          :loading="tableLoading"
          rowKey="id"
          :pagination="false"
          @change="(pagination, filters, sorter) => $sorterChange(() => query(), sorter, queryForm, outColumns)"
      >
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.dataIndex === 'messageTitle'">
            <div :style="{color: token.colorPrimary, cursor: 'pointer'}"
                 @click="toDetail(record)">
              {{ record.messageTitle }}
            </div>
          </template>
          <template v-if="column.dataIndex === 'isToMail'">
            <a-tag v-if="text" :color="text === '1' ? 'green' : 'red' ">{{ text === '1' ? '是' : '否' }}</a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
    <MessageDetail ref="messageDetail" @reload-list="query"/>
  </div>
</template>
<script setup>
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {message, Modal, theme} from 'ant-design-vue';
import {computed, createVNode, onMounted, reactive, ref} from 'vue';
import {outColumns} from './columns.js';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {smartSentry} from '/@/lib/smart-sentry';
import {PAGE_SIZE_OPTIONS} from "/@/constants/common-const.js";
import MessageDetail from "./message-detail.vue";
import {messageApi} from "/@/api/message/message-api.js";

const {useToken} = theme;
const {token} = useToken();

// ------------------------ 查询表单 ------------------------
const queryFormState = {
  // 页数
  current: 1,
  // 条数
  size: 10,
  // 排序字段
  sortField: null,
  // 排序规则
  sortOrder: null,
  messageStatus: '1',
  messageTitle: null
};
const queryForm = reactive({...queryFormState});
// ------------------------ table表格数据和查询方法 ------------------------
const tableLoading = ref(false);
const tableData = ref([]);
const total = ref(0);

// 重置
function resetQuery() {
  Object.assign(queryForm, queryFormState);
  outColumns.value.forEach(item => item.sortOrder = null)
  query();
}

// 查询
async function query() {
  try {
    tableLoading.value = true;
    let res = await messageApi.sendPage(queryForm);
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
function batchDelete() {
  confirmBatchDelete(selectedRows, false);
}

function batchRealDelete() {
  confirmBatchDelete(selectedRows, true);
}

function confirmBatchDelete(array, bool) {
  Modal.confirm({
    title: '请确认是否删除?',
    icon: createVNode(ExclamationCircleOutlined),
    okText: '删除',
    okType: 'danger',
    onOk() {
      const deleteIds = array.map((e) => e.id);
      if (bool) {
        realDeleteSendMessage({deleteIds: deleteIds});
      } else {
        updateDeletedValue({deleteIds: deleteIds, isDeleted: '2'});
      }
      selectedRows = [];
    },
    cancelText: '取消',
    onCancel() {
    },
  });

  async function updateDeletedValue(params) {
    SmartLoading.show();
    try {
      await messageApi.updateDeletedValue(params);
      // 清除选中
      selectedRowKeys.value = selectedRowKeys.value.filter(x => params.deleteIds.indexOf(x) === -1)
      message.success('删除成功!');
      await query();
    } catch (e) {
      smartSentry.captureError(e);
    } finally {
      SmartLoading.hide();
    }
  }

  async function realDeleteSendMessage(params) {
    SmartLoading.show();
    try {
      await messageApi.realDeleteSendMessage(params);
      // 清除选中
      selectedRowKeys.value = selectedRowKeys.value.filter(x => params.deleteIds.indexOf(x) === -1)
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
const messageDetail = ref();

// 进入详情
async function toDetail(data) {
  const res = await messageApi.getMessage({id: data.id});
  messageDetail.value.showModal(res.data, 'get')
}

function init() {
}

init()
</script>
