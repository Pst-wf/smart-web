<template>
  <div>
    <a-form class="smart-query-form">
      <a-row class="smart-query-form-row">
        <a-form-item label="文件名称" class="smart-query-form-item">
          <a-input style="width: 300px" v-model:value="queryForm.fileName" placeholder="请输入文件名称" allowClear />
        </a-form-item>
        <a-form-item class="smart-query-form-item smart-margin-left10">
          <a-button-group>
            <a-button type="primary" @click="toFirstPage">
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
          <FileUpload :show-file-list="false" @change="query" />
          <a-button v-privilege="'file:download'" type="default" @click="downloadFiles()" :disabled="!hasSelected">
            <template #icon>
              <DownloadOutlined />
            </template>
            批量下载
          </a-button>
          <a-button v-privilege="'file:delete'" type="primary" danger @click="batchDelete" :disabled="!hasSelected">
            <template #icon>
              <DeleteOutlined />
            </template>
            批量删除
          </a-button>
        </div>
        <div class="smart-table-setting-block">
          <TableOperator v-model="columns" :refresh="query" />
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
          <template v-if="column.dataIndex === 'fileSize'">
            {{ getSize(text) }}
          </template>
          <template v-if="column.dataIndex === 'uploadType'">
            <a-tag color="blue" v-for="(item, index) in getLabel(dictMap.sys_oss_type, text)" :key="index">{{ item }}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'operate'">
            <div class="smart-table-operate">
              <a-button v-privilege="'file:download'" type="link" size="small" @click="downloadFiles(record)">下载 </a-button>
              <a-button v-privilege="'file:delete'" danger type="link" @click="singleDelete(record)">删除</a-button>
              <a-button v-if="record.isEditable === '1'" type="link" size="small" @click="onlineEdit(record.id)">编辑</a-button>
              <a-button v-if="record.isEditable === '0' && record.isTextEditable === '1'" type="link" size="small" @click="onlineEditTxt(record.id)"
              >编辑</a-button
              >
              <a-button v-if="record.contentType?.startsWith('image/')" type="link" size="small" @click="previewImage(record)">预览</a-button>
              <a-button v-if="record.contentType?.startsWith('video/')" type="link" size="small" @click="previewVideo(record)">预览</a-button>
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
    <DocumentEdit ref="documentEdit" :data="editParams" @close="query" />
    <TxtEdit ref="txtEdit" @submit="txtSubmit" @close="query" />
    <div v-show="false">
      <a-image :preview="previewType" :src="imagePreviewUrl" />
    </div>
    <a-modal
        :open="videoVisible"
        class="video-modal-class"
        :closable="false"
        style="width: auto"
        :body-style="{ padding: 0 }"
        centered
        :get-container="SmartLoading.spin"
        :footer="null"
        @cancel="onClose"
    >
      <video v-if="videoVisible" :src="videoPreviewUrl" controls></video>
    </a-modal>
  </div>
</template>
<script setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { computed, createVNode, onMounted, reactive, ref } from 'vue';
import { columns } from './columns.js';
import { fileApi } from '/@/api/file/file-api.js';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { smartSentry } from '/@/lib/smart-sentry';
import TableOperator from '/@/components/support/table-operator/index.vue';
import { PAGE_SIZE_OPTIONS } from '/@/constants/common-const.js';
import FileUpload from '/@/components/file/index.vue';
import { exportFile } from '/@/utils/exportFile.js';
import { dict, getLabel } from '/@/utils/dict-util.js';
import DocumentEdit from '/@/components/document-edit/index.vue';
import TxtEdit from '/@/components/txt-edit/index.vue';
// ------------------------ 查询表单 ------------------------
const queryFormState = {
  fileName: null,
  current: 1,
  size: 10,
  // 排序字段
  sortField: null,
  // 排序规则
  sortOrder: null,
};
const queryForm = reactive({ ...queryFormState });

// ------------------------ table表格数据和查询方法 ------------------------
const tableLoading = ref(false);
const tableData = ref([]);
const total = ref(0);

// 重置
function resetQuery() {
  Object.assign(queryForm, queryFormState);
  columns.value.forEach((item) => (item.sortOrder = null));
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
    let res = await fileApi.filePage(queryForm);
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
      requestBatchDelete({ deleteIds: deleteIds });
    },
    cancelText: '取消',
    onCancel() {},
  });

  async function requestBatchDelete(params) {
    SmartLoading.show();
    try {
      await fileApi.deleteFile(params);
      // 清除选中
      selectedRowKeys.value = selectedRowKeys.value.filter((x) => params.deleteIds.indexOf(x) === -1);
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

const dictMap = ref({});

async function getDict() {
  dictMap.value = await dict(['sys_oss_type']);
}

function getSize(obj) {
  const kb = 1024;
  const mb = kb * 1024;
  const gb = mb * 1024;
  const tb = gb * 1024;
  if (obj < kb) {
    return parseFloat(obj.toString()).toFixed(2) + ' B';
  } else if (obj >= kb && obj < mb) {
    return parseFloat((obj / kb).toString()).toFixed(2) + ' KB';
  } else if (obj >= mb && obj < gb) {
    return parseFloat((obj / mb).toString()).toFixed(2) + ' MB';
  } else if (obj >= gb && obj < tb) {
    return parseFloat((obj / gb).toString()).toFixed(2) + ' GB';
  } else {
    return parseFloat((obj / tb).toString()).toFixed(2) + ' TB';
  }
}

/**
 * 下载文件
 *
 * @param row 文件数据
 */
async function downloadFiles(row) {
  let params;
  if (row) {
    params = { ids: row.id };
  } else {
    params = { ids: selectedRowKeys.value.join(',') };
  }
  const res = await fileApi.downloadFile(params);
  message.success('操作成功');
  exportFile(res.data, res.headers);
}
const editParams = ref(null);
const documentEdit = ref();
/** 在线编辑 */
async function onlineEdit(id) {
  if (id) {
    const { data: res, error } = await fileApi.onlineModal({ id });
    if (!error) {
      editParams.value = res;
      documentEdit.value.onOpen();
    }
  }
}
/** 在线编辑txt */
const txtEdit = ref();
async function onlineEditTxt(id) {
  if (id) {
    const res = await fileApi.onlineTxt({ id: id });
    txtEdit.value.onOpen({ id: id, data: res.data });
  }
}
async function txtSubmit(val) {
  console.log('val', val)
  await fileApi.callbackTxt({ id: val.id, data: val.data });
  message.success('保存成功');
  await query();
}

/** 图片预览 */
const domain = window.location.origin;
const baseUrl = import.meta.env.VITE_APP_API_URL;
const imagePreviewUrl = ref('');
const previewType = ref(false);
function previewImage(row) {
  if (row.uploadType === '0') {
    imagePreviewUrl.value = `${domain + baseUrl}/${row.fileKey}`;
  } else {
    imagePreviewUrl.value = row.filePath;
  }
  // 延迟执行 解决第一次点开没有图片问题
  previewType.value = {
    visible: true,
    onVisibleChange: (visible, prevVisible) => {
      previewType.value.visible = visible;
    },
    getContainer: 'body',
  };
}
/** 视频预览 */
const videoPreviewUrl = ref('');
const videoVisible = ref(false);
function previewVideo(row) {
  if (row.uploadType === '0') {
    videoPreviewUrl.value = `${domain + baseUrl}/${row.fileKey}`;
  } else {
    videoPreviewUrl.value = row.filePath;
  }
  // 延迟执行 解决第一次点开没有图片问题
  setTimeout(() => {
    videoVisible.value = true;
  }, 100);
}
function onClose() {
  videoVisible.value = false;
  videoPreviewUrl.value = '';
}

function init() {
  getDict();
}
init();
</script>
<style>
.video-modal-class {
  .ant-modal-content {
    padding: 0 !important;
    box-shadow: none !important;
    background: none !important;
  }
}
</style>
