<template>
  <div>
    <a-form class="smart-query-form">
      <a-row class="smart-query-form-row">
        <a-form-item label="标题" class="smart-query-form-item">
          <a-input style="width: 300px" v-model:value="queryForm.noticeTitle" placeholder="请输入标题"/>
        </a-form-item>
        <a-form-item label="类型" class="smart-query-form-item">
          <a-select
              style="width: 300px"
              v-model:value="queryForm.noticeType"
              placeholder="请选择类型"
              :allowClear="true"
              optionFilterProp="dictName"
              :options="dictMap.sys_notice_type"
              :field-names="{ label: 'dictName', value: 'dictValue' }"
          />
        </a-form-item>
        <a-form-item label="类别" class="smart-query-form-item">
          <a-select
              style="width: 300px"
              v-model:value="queryForm.noticeCategory"
              placeholder="请选择类别"
              :allowClear="true"
              optionFilterProp="dictName"
              :options="dictMap.sys_notice_category"
              :field-names="{ label: 'dictName', value: 'dictValue' }"
          />
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
          <a-button v-privilege="'notice:add'" type="primary" @click="showDrawer">
            <template #icon>
              <PlusOutlined/>
            </template>
            新增
          </a-button>
          <a-button v-privilege="'notice:delete'" type="primary" danger @click="batchDelete" :disabled="!hasSelected">
            <template #icon>
              <DeleteOutlined/>
            </template>
            批量删除
          </a-button>
          <a-button v-privilege="'notice:export'" type="primary" ghost @click="exportData">
            <template #icon>
              <ExportOutlined/>
            </template>
            导出
          </a-button>
          <a-button v-privilege="'notice:import'" type="primary" danger ghost @click="openImportModal">
            <template #icon>
              <ImportOutlined/>
            </template>
            导入
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
          <template v-if="column.dataIndex === 'operate'">
            <div class="smart-table-operate">
              <a-button type="link" size="small" @click="showDrawer(record, true)">查看</a-button>
              <a-button v-privilege="'notice:update'" type="link" size="small" @click="showDrawer(record)">编辑
              </a-button>
              <a-button v-privilege="'notice:delete'" danger type="link" @click="singleDelete(record)">删除</a-button>
              <a-dropdown placement="bottom">
                <a-button style="color: #4ab844" type="link">更多</a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a-button v-privilege="'noticeRecord:add'" type="link" size="small" @click="publish(record)">
                        发布
                      </a-button>
                    </a-menu-item>
                    <a-menu-item>
                      <a-button v-privilege="'noticeRecord:view'" type="link" size="small" @click="openRecord(record)">
                        发布记录
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
    <OperateModal ref="operateModal" :dict-map="dictMap" @reloadList="query"/>
    <PublishModal ref="publishModal" :dict-map="dictMap" :all-dept="allDept" :all-post="allPost" :all-role="allRole"
                  :all-user="allUser" @reloadList="query"/>
    <RecordModal ref="recordModal" :dict-map="dictMap" @reloadList="query"/>
    <ImportData ref="importData" import-url="/message/notice/import" @downloadTemplate="downloadTemplate"
                @finish="query"/>
  </div>
</template>
<script setup>
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {message, Modal} from 'ant-design-vue';
import {computed, createVNode, onMounted, reactive, ref} from 'vue';
import OperateModal from './components/operate-modal.vue';
import PublishModal from './components/publish-modal.vue';
import RecordModal from './components/record-modal.vue';
import {columns} from './columns.js';
import {noticeApi} from '/@/api/notice/notice-api.js';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {smartSentry} from '/@/lib/smart-sentry';
import TableOperator from '/@/components/support/table-operator/index.vue';
import {PAGE_SIZE_OPTIONS} from "/@/constants/common-const.js";
import {exportFile} from "/@/utils/exportFile.js";
import ImportData from "/@/components/import-data/index.vue";
import {dict, getLabel} from "/@/utils/dict-util.js";
import {deptApi} from "/@/api/system/dept-api.js";
import {userApi} from "/@/api/system/user-api.js";
import {roleApi} from "/@/api/system/role-api.js";
import {postApi} from "/@/api/system/post-api.js";
import _ from 'lodash';
// ------------------------ 查询表单 ------------------------
const queryFormState = {
  // 标题
  noticeTitle: null,
  // 类型
  noticeType: null,
  // 类别
  noticeCategory: null,
  // 页数
  current: 1,
  // 条数
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
  Object.assign(queryForm, {current: 1});
  query();
}

// 查询
async function query() {
  try {
    tableLoading.value = true;
    let res = await noticeApi.noticePage(queryForm);
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
      selectedRows = [];
    },
    cancelText: '取消',
    onCancel() {
    },
  });

  async function requestBatchDelete(params) {
    SmartLoading.show();
    try {
      await noticeApi.deleteNotice(params);
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
const operateModal = ref();

function showDrawer(rowData, bool) {
  operateModal.value.showDrawer(rowData, bool);
}

// -------------- 导入导出 --------------
// 导出
async function exportData() {
  try {
    tableLoading.value = true;
    let params = {};
    Object.assign(params, queryForm);
    if (selectedRowKeys.value.length > 0) {
      params = {...params, selectIds: selectedRowKeys.value};
    }
    let res = await noticeApi.exportNoticeData(params);
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
  importData.value.onOpen()
}

// 下载导入数据模板
async function downloadTemplate() {
  try {
    tableLoading.value = true;
    let res = await noticeApi.downloadNoticeTemplate();
    message.success('操作成功');
    exportFile(res.data, res.headers);
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    tableLoading.value = false;
  }
}

// -------------- 字典相关 --------------
const dictMap = ref({});

async function getDict() {
  dictMap.value = await dict(['sys_notice_type', 'sys_notice_category', 'sys_release_type']);
}

const allDept = ref([]);
const allPost = ref([]);
const allRole = ref([]);
const allUser = ref([]);

async function getDeptData() {
  const res = await deptApi.deptTree({status: '1'});
  allDept.value = res.data
}

async function getPostData() {
  const res = await postApi.postList({status: '1'});
  allPost.value = res.data
}

async function getRoleData() {
  const res = await roleApi.roleList({status: '1'});
  allRole.value = res.data
}

async function getUserData() {
  const res = await userApi.userList({userStatus: '1'});
  allUser.value = res.data
}

function init() {
  getDict();
  getDeptData();
  getPostData();
  getRoleData();
  getUserData();
}

init()

const publishModal = ref();

function publish(row) {
  const one = _.cloneDeep(row);
  publishModal.value.showDrawer(one);
}

const recordModal = ref();

function openRecord(row) {
  const one = _.cloneDeep(row);
  recordModal.value.showDrawer(one);
}
</script>
