<template>
  <div>
    <a-form class="smart-query-form">
      <a-row class="smart-query-form-row">
        <a-form-item label="登录人姓名" class="smart-query-form-item">
          <a-input style="width: 300px" v-model:value="queryForm.userNickname" placeholder="请输入登录人姓名" allowClear/>
        </a-form-item>
        <a-form-item label="登录人账号" class="smart-query-form-item">
          <a-input style="width: 300px" v-model:value="queryForm.username" placeholder="请输入登录人账号" allowClear/>
        </a-form-item>
        <a-form-item label="登录方式" class="smart-query-form-item">
          <SmartEnumSelect width="300px" enum-name="LOGIN_LOG_GRANT_TYPE_ENUM" v-model:value="queryForm.grantType" placeholder="请选择登录方式"/>
        </a-form-item>
        <a-form-item label="登录时间" class="smart-query-form-item">
          <a-range-picker v-model:value="queryForm.createDateValue" :format="['YYYY-MM-DD', 'YYYY-MM-DD']" value-format="YYYY-MM-DD" width="300px" allowClear/>
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
          <template v-if="column.dataIndex === 'grantType'">
            <a-tag :color="text === 'password' ? 'blue' : 'orange'">{{ $smartEnumPlugin.getDescByValue('LOGIN_LOG_GRANT_TYPE_ENUM', text) }}</a-tag>
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
import {loginLogApi} from "/@/api/system/login-log-api.js";
import SmartEnumSelect from "/@/components/framework/smart-enum-select/index.vue";

// ------------------------ 查询表单 ------------------------
const queryFormState = {
  userNickname: null,
  username: null,
  grantType: null,
  createDateValue: null,
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
  columns.value.forEach(item => item.sortOrder = null);
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
    Object.assign(params,queryForm)
    if(params.createDateValue && params.createDateValue.length === 2){
      params.createDateValue[0] = params.createDateValue[0]+" 00:00:00"
      params.createDateValue[1] = params.createDateValue[1]+" 23:59:59"
    }
    let res = await loginLogApi.loginLogPage(params);
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
      await loginLogApi.deleteLoginLog(params);
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
</script>
