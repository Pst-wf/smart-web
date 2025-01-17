<!-- 登录、登出 日志 -->
<template>
  <a-form class="smart-query-form" ref="queryFormRef">
    <a-row class="smart-query-form-row">
      <a-form-item label="登录方式" class="smart-query-form-item">
        <SmartEnumSelect width="300px" enum-name="LOGIN_LOG_GRANT_TYPE_ENUM" v-model:value="queryForm.grantType"
                         placeholder="请选择登录方式"/>
      </a-form-item>
      <a-form-item label="登录时间" class="smart-query-form-item">
        <a-range-picker v-model:value="queryForm.createDateValue" :format="['YYYY-MM-DD', 'YYYY-MM-DD']"
                        value-format="YYYY-MM-DD" width="300px" allowClear/>
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

  <a-table size="small" :dataSource="tableData" :columns="columns" bordered rowKey="loginLogId" :pagination="false"
           :loading="tableLoading">
    <template #bodyCell="{ text, record, column }">
      <template v-if="column.dataIndex === 'grantType'">
        <a-tag :color="text === 'password' ? 'blue' : 'orange'">
          {{ $smartEnumPlugin.getDescByValue('LOGIN_LOG_GRANT_TYPE_ENUM', text) }}
        </a-tag>
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
</template>
<script setup>
import {onMounted, onUnmounted, reactive, ref} from 'vue';
import {PAGE_SIZE_OPTIONS} from '/@/constants/common-const';
import {smartSentry} from '/@/lib/smart-sentry';
import {calcTableHeight} from '/@/lib/table-auto-height';
import {loginLogApi} from "/@/api/system/login-log-api.js";
import SmartEnumSelect from "/@/components/framework/smart-enum-select/index.vue";

const columns = ref([
  {
    title: '登陆方式',
    dataIndex: 'grantType',
    sorter: true
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    sorter: true
  },
  {
    title: '登录时间',
    dataIndex: 'createDate',
    sorter: true
  },
]);

const queryFormState = {
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

const tableLoading = ref(false);
const tableData = ref([]);
const total = ref(0);

function resetQuery() {
  Object.assign(queryForm, queryFormState);
  columns.value.forEach(item => item.sortOrder = null);
  query();
}

function toFirstPage() {
  Object.assign(queryForm, {current: 1});
  query();
}

async function query() {
  try {
    tableLoading.value = true;
    const params = {}
    Object.assign(params, queryForm)
    if (params.createDateValue && params.createDateValue.length === 2) {
      params.createDateValue[0] = params.createDateValue[0] + " 00:00:00"
      params.createDateValue[1] = params.createDateValue[1] + " 23:59:59"
    }
    let res = await loginLogApi.userLogs(params);
    tableData.value = res.data.records;
    total.value = res.data.total;
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    tableLoading.value = false;
  }
}

// ----------------- 表格自适应高度 --------------------
const scrollY = ref(100);
const queryFormRef = ref();

function autoCalcTableHeight() {
  calcTableHeight(scrollY, [queryFormRef], 10);
}

window.addEventListener('resize', autoCalcTableHeight);

onMounted(() => {
  query();
  autoCalcTableHeight();
});

onUnmounted(() => {
  window.removeEventListener('resize', autoCalcTableHeight);
});
</script>
