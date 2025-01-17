<!-- * 菜单 表单弹窗 -->
<template>
  <a-modal centered :open="visible" title="发布记录" :maskClosable="true" :width="1200" @cancel="onClose" >
    <a-card size="small" :bordered="false" style="min-height: 750px">
      <a-form class="smart-query-form">
        <a-row class="smart-query-form-row">
          <a-form-item label="发布类型" class="smart-query-form-item">
            <a-select
                style="width: 200px"
                v-model:value="queryForm.releaseType"
                placeholder="请选择发布类型"
                :allowClear="true"
                optionFilterProp="dictName"
                :options="dictMap.sys_release_type"
                :field-names="{ label: 'dictName', value: 'dictValue' }"
            />
          </a-form-item>
          <a-form-item label="发布时间" class="smart-query-form-item">
            <a-range-picker v-model:value="queryForm.releaseTimeBetweenList" :format="['YYYY-MM-DD', 'YYYY-MM-DD']"
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
      <a-table
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          size="small"
          :dataSource="tableData"
          bordered
          :columns="recordColumns"
          :loading="tableLoading"
          rowKey="id"
          :pagination="false"
          @change="(pagination, filters, sorter) => $sorterChange(() => query(), sorter, queryForm, recordColumns)"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.dataIndex === 'releaseType'">
            <a-tag color="blue" v-for="(item,index) in getLabel(dictMap.sys_release_type, text)" :key="index">
              {{ item }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'operate'">
            <div class="smart-table-operate">
              <a-button type="link" size="small" @click="showDetail(record)">查看</a-button>
              <a-button danger type="link" @click="singleDelete(record)">删除</a-button>
            </div>
          </template>
        </template>
      </a-table>
      <div class="smart-query-table-page">
        <a-pagination
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
      <RefTable ref="refTable"  v-show="refVisible"/>
    </a-card>
    <template v-slot:footer>
      <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
    </template>
  </a-modal>
</template>
<script setup>
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {message, Modal} from 'ant-design-vue';
import {computed, createVNode, reactive, ref} from 'vue';
import {recordColumns,} from '../columns.js';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {smartSentry} from '/@/lib/smart-sentry';
import {PAGE_SIZE_OPTIONS} from "/@/constants/common-const.js";
import {getLabel} from "/@/utils/dict-util.js";
import {noticeApi} from "/@/api/notice/notice-api.js";
import RefTable from "./ref-table.vue";

const props = defineProps({
  dictMap: {
    type: Object,
    default: () => {
    }
  }
})
// ------------------------ 查询表单 ------------------------
const queryFormState = {
  releaseType: null,
  releaseTimeBetweenList: null,
  current: 1,
  size: 5,
  // 排序字段
  sortField: null,
  // 排序规则
  sortOrder: null
};
const queryForm = reactive({...queryFormState});

// ------------------------ table表格数据和查询方法 ------------------------

const tableLoading = ref(false);
const tableData = ref([]);
// 总数
const total = ref(0);

function resetQuery() {
  Object.assign(queryForm, queryFormState);
  recordColumns.value.forEach(item => item.sortOrder = null)
  query();
}

// 回到第一页
function toFirstPage() {
  Object.assign(queryForm, {current: 1});
  query();
}

async function query() {
  try {
    tableLoading.value = true;
    const params = {...queryForm, noticeId: noticeId.value};
    if (params.releaseTimeBetweenList && params.releaseTimeBetweenList.length === 2) {
      params.releaseTimeBetweenList[0] = params.releaseTimeBetweenList[0] + " 00:00:00"
      params.releaseTimeBetweenList[1] = params.releaseTimeBetweenList[1] + " 23:59:59"
    }
    const res = await noticeApi.noticeRecordPage(params);
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
      await noticeApi.deleteNoticeRecord(params);
      message.success('删除成功!');
      await query();
    } catch (e) {
      smartSentry.captureError(e);
    } finally {
      SmartLoading.hide();
    }
  }
}

// -------------- 新增、修改 右侧抽屉 --------------、
const refTable = ref();
function showDetail(rowData) {
  refVisible.value = true;
  refTable.value.showTable(rowData)
}

// emit
const emit = defineEmits(['reloadList']);

// ----------------------- 展开、隐藏编辑窗口 ------------------------

// 是否展示抽屉
const visible = ref(false);
const refVisible = ref(false);
const noticeId = ref(null);

//展开编辑窗口
async function showDrawer(rowData) {
  noticeId.value = rowData.id;
  await query()
  visible.value = true;
}

// 隐藏窗口
function onClose() {
  tableData.value = []
  refTable.value.tableData = []
  visible.value = false;
  refVisible.value = false;
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
