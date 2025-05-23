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
          <a-button v-privilege="'notice:delete'" @click="batchMark" :disabled="!hasSelected">
            <template #icon>
              <TagFilled/>
            </template>
            标记为已读
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
          :columns="columns"
          :loading="tableLoading"
          rowKey="id"
          :pagination="false"
          @change="(pagination, filters, sorter) => $sorterChange(() => query(), sorter, queryForm, columns)"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.dataIndex === 'message'">
            <div :style="{color: record.isRead === '0' ? token.colorPrimary: '#aeb7b9', cursor: 'pointer'}"
                 @click="toDetail(record)">
              {{ record.message.messageTitle }}
            </div>
          </template>
          <template v-if="column.dataIndex === 'isRead'">
            <a-tag :color="text === '0' ? 'blue' : 'green'">
              {{ $smartEnumPlugin.getDescByValue('NOTICE_IS_READ_ENUM', text) }}
            </a-tag>
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
import {columns} from './columns.js';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {smartSentry} from '/@/lib/smart-sentry';
import {PAGE_SIZE_OPTIONS} from "/@/constants/common-const.js";
import MessageDetail from "./message-detail.vue";
import {messageApi} from "/@/api/message/message-api.js";
import {useUserStore} from "/@/store/modules/system/user.js";

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
  deletedStatus: '0',
  messageTitle: null,
  sendUserName: null
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

// 查询
async function query() {
  try {
    tableLoading.value = true;
    let res = await messageApi.messagePage(queryForm);
    tableData.value = res.data.records;
    total.value = res.data.total;
    await useUserStore().queryUnreadMessageCount();
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
        deleteMessage({deleteIds: deleteIds});
      } else {
        updateMessageDeletedStatus({deleteIds: deleteIds, deletedStatus: '1'});
      }
      selectedRows = [];
    },
    cancelText: '取消',
    onCancel() {
    },
  });

  async function updateMessageDeletedStatus(params) {
    SmartLoading.show();
    try {
      await messageApi.updateMessageDeletedStatus(params);
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

  async function deleteMessage(params) {
    SmartLoading.show();
    try {
      await messageApi.deleteMessage(params);
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

// 标记已读
async function batchMark() {
  SmartLoading.show();
  try {
    const selectIds = selectedRows.map((e) => e.id);
    await messageApi.setRead({selectIds: selectIds});
    // 清除选中
    selectedRowKeys.value = selectedRowKeys.value.filter(x => selectIds.indexOf(x) === -1)
    message.success('操作成功!');
    await query();
    await useUserStore().queryUnreadMessageCount();
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    SmartLoading.hide();
  }
}

// -------------- 新增、修改 右侧抽屉 --------------
const messageDetail = ref();

// 进入详情
async function toDetail(data) {
  const res = await messageApi.viewMessage({id: data.id});
  messageDetail.value.showModal(res.data, 'view')
  await useUserStore().queryUnreadMessageCount();
}

function init() {
}

init()
</script>
