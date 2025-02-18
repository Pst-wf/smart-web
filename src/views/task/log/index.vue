<template>
  <div>
    <a-form class="smart-query-form">
      <a-row class="smart-query-form-row">
        <a-form-item label="执行器名称" class="smart-query-form-item">
          <a-input style="width: 300px" v-model:value="queryForm.groupName" placeholder="请输入执行器名称" allowClear/>
        </a-form-item>
        <a-form-item label="任务" class="smart-query-form-item">
          <a-input style="width: 300px" v-model:value="queryForm.jobName" placeholder="请输入任务" allowClear/>
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
        <div class="smart-table-error-block">
          <a-button v-privilege="'log:delete'" type="primary" danger @click="batchDelete" :disabled="!hasSelected">
            <template #icon>
              <DeleteOutlined/>
            </template>
            批量删除
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
          <template v-if="column.dataIndex === 'triggerCode'">
            <a-tag v-if="text" :color="text === 200 ? 'green' : 'red'">{{ text === 200 ? '成功' : '失败' }}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'triggerMsg'">
            <a-button v-if="text" type="link" @click="openTriggerMsg(text)">查看</a-button>
            <div v-else>无</div>
          </template>
          <template v-if="column.dataIndex === 'handleMsg'">
            <a-button v-if="text" type="link" @click="openHandleMsg(text)">查看</a-button>
            <div v-else>无</div>
          </template>
          <template v-if="column.dataIndex === 'handleCode'">
            <a-tag v-if="text" :color="text === 200 ? 'green' : 'red'">{{ text === 200 ? '成功' : '失败' }}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'operate'">
            <div class="smart-table-error">
              <a-button v-privilege="'log:delete'" danger type="link" @click="singleDelete(record)">删除</a-button>
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
    <a-drawer
        class="drawerCss"
        :body-style="{ paddingBottom: '80px' }"
        :maskClosable="true"
        title="调度日志"
        :open="visible"
        :width="600"
        @close="closeTriggerMsg"
    >
      <div>
        <h3 class="drawer-title">调度日志</h3>
        <a-list :split="false">
          <a-list-item v-for="item in drawerContent.arr1" :key="item.id">
            {{ item.label }} ： {{ item.value }}
          </a-list-item>
        </a-list>
        <a-divider/>
        <h3 class="drawer-title">触发日志</h3>
        <a-list :split="false">
          <a-list-item v-for="item in drawerContent.arr2" :key="item.id">
            {{ item.label }} ： {{ item.value }}
          </a-list-item>
        </a-list>
      </div>
    </a-drawer>
    <a-modal
        :open="modalVisible"
        title="执行日志"
        :maskClosable="true"
        :width="960"
        @cancel="closeHandleMsg"
    >
      <template v-slot:footer>
        <a-button @click="closeHandleMsg">关闭</a-button>
      </template>
      <h4>{{ modalContent }}</h4>
    </a-modal>
  </div>
</template>
<script setup>
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {message, Modal} from 'ant-design-vue';
import {computed, createVNode, onMounted, reactive, ref} from 'vue';
import {columns} from './columns.js';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {smartSentry} from '/@/lib/smart-sentry';
import TableOperator from '/@/components/support/table-operator/index.vue';
import {PAGE_SIZE_OPTIONS} from "/@/constants/common-const.js";
import {taskLogApi} from "/@/api/task/task-log-api.js";
import {useRoute} from "vue-router";

const route = useRoute();
// ------------------------ 查询表单 ------------------------
const queryFormState = {
  groupName: null,
  jobName: null,
  jobId: route.query.jobId ? route.query.jobId : null,
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
}
// 查询
async function query() {
  try {
    tableLoading.value = true;
    const params = {}
    Object.assign(params, queryForm)
    if (params.createDateValue && params.createDateValue.length === 2) {
      params.createDateValue[0] = params.createDateValue[0] + " 00:00:00"
      params.createDateValue[1] = params.createDateValue[1] + " 23:59:59"
    }
    let res = await taskLogApi.taskLogPage(params);
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
// -------------- 多选登录 --------------
const selectedRowKeys = ref([]);
let selectedRows = [];
const hasSelected = computed(() => selectedRowKeys.value.length > 0);

// 选中触发
function onSelectChange(keyArray, selectRows) {
  selectedRowKeys.value = keyArray;
  selectedRows = selectRows;
}

// -------------- 删除登录 --------------
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
      await taskLogApi.deleteTaskLog(params);
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

const visible = ref(false);
const drawerContent = ref({});
function openTriggerMsg(content) {
  if (content) {
    drawerContent.value = JSON.parse(content);
  }
  visible.value = true
}
function closeTriggerMsg() {
  drawerContent.value = {}
  visible.value = false
}

const modalVisible = ref(false);
const modalContent = ref(null);
function openHandleMsg(content) {
  if (content) {
    modalContent.value = content
  }
  modalVisible.value = true
}
function closeHandleMsg() {
  modalContent.value = null
  modalVisible.value = false
}

</script>
<style lang="less" scoped>
.drawer-title {
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>
