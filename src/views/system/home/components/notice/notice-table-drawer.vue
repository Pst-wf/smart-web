<!-- * 菜单 表单弹窗 -->
<template>
  <a-drawer
      :body-style="{ paddingBottom: '80px' }"
      :maskClosable="true"
      :title="title"
      :open="visible"
      width="60%"
      @close="onClose"
  >
    <a-card size="small" :bordered="false" :hoverable="true">
      <a-form class="smart-query-form">
        <a-row class="smart-query-form-row">
          <a-form-item label="标题" class="smart-query-form-item">
            <a-input style="width: 200px" v-model:value="queryForm.noticeTitle" placeholder="请输入标题" allowClear/>
          </a-form-item>
          <a-form-item label="类型" class="smart-query-form-item">
            <a-select
                style="width: 200px"
                v-model:value="queryForm.noticeType"
                placeholder="请选择类型"
                :allowClear="true"
                optionFilterProp="dictName"
                :options="dictMap.sys_notice_type"
                :field-names="{ label: 'dictName', value: 'dictValue' }"
            />
          </a-form-item>
          <a-form-item label="状态" class="smart-query-form-item">
            <SmartEnumSelect width="200px" enum-name="NOTICE_IS_READ_ENUM" v-model:value="queryForm.isRead"
                             placeholder="请选择状态"/>
          </a-form-item>
          <a-form-item label="发送人" class="smart-query-form-item">
            <a-input style="width: 200px" v-model:value="queryForm.sendUsername" placeholder="请输入发送人" allowClear/>
          </a-form-item>
          <a-form-item label="发送时间" class="smart-query-form-item">
            <a-range-picker v-model:value="queryForm.sendTimeBetweenList" :format="['YYYY-MM-DD', 'YYYY-MM-DD']"
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
      <a-row class="smart-table-btn-block">
        <div class="smart-table-operate-block">
          <a-button type="primary" danger @click="batchDelete" :disabled="!hasSelected">
            <template #icon>
              <DeleteOutlined/>
            </template>
            批量删除
          </a-button>
        </div>
        <div class="smart-table-setting-block">
          <TableOperator v-model="columns" :show-full-screen="false" :refresh="query"/>
        </div>
      </a-row>

      <a-table
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          size="small"
          :dataSource="tableData"
          bordered
          :columns="columns"
          :loading="tableLoading"
          rowKey="id"
          :pagination="false"
          @change="(pagination, filters, sorter) => $sorterChange(() => query(), sorter, queryForm, columns)"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.dataIndex === 'noticeType'">
            <a-tag :color="text === '1' ? 'blue' : 'red'"
                   v-for="(item,index) in getLabel(dictMap.sys_notice_type, text)" :key="index">{{ item }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'noticeCategory'">
            <a-tag :color="text === '1' ? 'blue' : 'green'"
                   v-for="(item,index) in getLabel(dictMap.sys_notice_category, text)" :key="index">{{ item }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'isRead'">
            <a-tag :color="text === '0' ? 'blue' : 'green'">
              {{ $smartEnumPlugin.getDescByValue('NOTICE_IS_READ_ENUM', text) }}
            </a-tag>
          </template>

          <template v-if="column.dataIndex === 'operate'">
            <div class="smart-table-operate">
              <a-button type="link" size="small" @click="toDetail(record)">查看</a-button>
              <a-button danger type="link" @click="singleDelete(record)">删除</a-button>
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
    <NoticeModal ref="noticeModal" @reload-list="queryNoticeList"/>
  </a-drawer>
</template>
<script setup>
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {message, Modal} from 'ant-design-vue';
import {computed, createVNode, reactive, ref} from 'vue';
import {columns} from './columns.js';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {smartSentry} from '/@/lib/smart-sentry';
import TableOperator from '/@/components/support/table-operator/index.vue';
import NoticeModal from './notice-modal.vue';
import {PAGE_SIZE_OPTIONS} from "/@/constants/common-const.js";
import {getLabel} from "/@/utils/dict-util.js";
import {noticeApi} from "/@/api/notice/notice-api.js";
import SmartEnumSelect from "/@/components/framework/smart-enum-select/index.vue";

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  dictMap: {
    type: Object,
    default: () => {
    }
  }
});
const emit = defineEmits(['reloadList']);
// ------------------------ 查询表单 ------------------------
const queryFormState = {
  current: 1,
  size: 10,
  noticeTitle: null,
  noticeType: null,
  sendUsername: null,
  sendTimeBetweenList: null,
  isRead: null,
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
  columns.value.forEach(item => item.sortOrder = null);
  query();
}
// 回到第一页
function toFirstPage() {
  Object.assign(queryForm, {current: 1});
  query();
}
const noticeCategory = ref(null);

async function query() {
  try {
    tableLoading.value = true;
    const params = {...queryForm, noticeCategory: noticeCategory.value};
    const res = await noticeApi.noticeRefPageForUser(params);
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
      await noticeApi.deleteNoticeByUser(params);
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
const noticeModal = ref();

// 进入详情
async function toDetail(data) {
  if (data.isRead === '0') {
    await noticeApi.readNoticeRef({id: data.id})
  }
  noticeModal.value.showModal(data)
}

// ----------------------- 展开、隐藏编辑窗口 ------------------------

// 是否展示抽屉
const visible = ref(false);

//展开编辑窗口
async function showDrawer(params) {
  noticeCategory.value = params
  await query()
  visible.value = true;
}

// 隐藏窗口
function onClose() {
  tableData.value = []
  visible.value = false;
}


async function queryNoticeList() {
  await query();
  emit('reloadList')
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
