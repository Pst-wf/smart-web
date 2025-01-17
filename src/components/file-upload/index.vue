<template>
  <div class="clearfix">
    <a-upload
        v-model:file-list="dataSource"
        :multiple="multiple"
        name="files"
        :max-count="limit"
        :headers="headers"
        :action="actionUrl"
        list-type="text"
        :show-upload-list="false"
        :beforeUpload="beforeUpload"
        @change="changeFile"
    >
      <a-button :disabled="tableData.length >= limit" type="primary">
        <upload-outlined/>
        {{ placeholder }}
      </a-button>
    </a-upload>
    <a-table
        style="margin-top: 10px"
        size="small"
        :defaultExpandAllRows="true"
        :dataSource="tableData"
        bordered
        :columns="columns"
        :loading="tableLoading"
        rowKey="id"
        :pagination="false"
    >
      <template #bodyCell="{ text, record, column }">
        <template v-if="column.dataIndex === 'fileSize'">
          {{ getSize(text) }}
        </template>
        <template v-if="column.dataIndex === 'operate'">
          <div class="smart-table-operate">
            <a-button v-privilege="'file:download'" type="link" size="small" @click="downloadFiles(record)">下载
            </a-button>
            <a-button v-privilege="'file:delete'" danger type="link" @click="singleDelete(record)">删除</a-button>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup>
import {onMounted, ref, watch} from 'vue';
import {localRead} from "/@/utils/local-util.js";
import LocalStorageKeyConst from "/@/constants/local-storage-key-const.js";
import {message} from "ant-design-vue";
import {getFileNameSuffix} from "/@/utils/common-util.js";
import {columns} from "./columns.js";
import {fileApi} from "/@/api/file/file-api.js";
import {exportFile} from "/@/utils/exportFile.js";

let props = defineProps({
  fileList: {
    type: [Array, null],
    required: true
  },
  limit: {
    type: Number,
    default: 1
  },
  accept: {
    type: Array,
    default: () => [],
  },
  multiple: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: '上传'
  },
  max: {
    type: Number,
    default: 5
  }
});
const emit = defineEmits(['fileChange']);

const tableLoading = ref(false);
const tableData = ref(props.fileList ? props.fileList : []);
const dataSource = ref([]);
const TOKEN_HEADER = 'Authorization';
const DEFAULT_TOKEN = 'Basic c2FiZXI6c2FiZXJfc2VjcmV0';
const actionUrl = import.meta.env.VITE_APP_API_URL + '/file/upload';
const headers = ref({
  'Tenant-Id': '000000'
})

function setHeaders() {
  const token = localRead(LocalStorageKeyConst.USER_TOKEN);
  headers.value[TOKEN_HEADER] = token ? `Bearer ${token}` : DEFAULT_TOKEN;
  const identityId = localRead(LocalStorageKeyConst.IDENTITY_ID);
  if (identityId) {
    headers.value['Identity-Id'] = identityId;
  }
}

const beforeUpload = (info) => {
  if (info) {
    const name = info.name;
    const suffix = getFileNameSuffix(name);
    if (props.accept && props.accept.length > 0 && props.accept.indexOf(suffix) === -1) {
      message.error(`请上传${props.accept.join(',')}格式的文件`);
      return false
    }
    if (props.max) {
      const format = props.max * 1024 * 1024
      if (format < info.size) {
        message.error(`上传的文件大小不能大于${props.max} MB`);
        return false
      }
    }
  }
  return true
}
const changeFile = (info) => {
  if (info.file.status === 'done') {
    if (info.file.response) {
      if (info.file.response.code === 200) {
        message.success(`${info.file.name} 上传成功`);
        console.log('info.file.response', info.file.response)
        tableData.value.push(info.file.response.data[0]);
        emit('fileChange', tableData.value.map(item => item.id).join(','))
      } else {
        message.error(info.file.response.msg);
      }
    }
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 上传失败`);
  }
}
onMounted(setHeaders)

/**
 * 删除
 *
 * @param row 文件数据
 */
function singleDelete(row) {
  tableData.value = tableData.value.filter(x => x.id !== row.id);
  emit('fileChange', tableData.value.map(item => item.id).join(','))
}

/**
 * 下载文件
 *
 * @param row 文件数据
 */
async function downloadFiles(row) {
  let params;
  if (row) {
    params = {ids: row.id};
  }
  const res = await fileApi.downloadFile(params);
  message.success('操作成功');
  exportFile(res.data, res.headers);
}

/**
 * 计算大小
 *
 * @param obj
 * @returns {string}
 */
function getSize(obj) {
  const kb = 1024
  const mb = kb * 1024
  const gb = mb * 1024
  const tb = gb * 1024
  if (obj < kb) {
    return parseFloat(obj.toString()).toFixed(2) + ' B'
  } else if (obj >= kb && obj < mb) {
    return parseFloat((obj / kb).toString()).toFixed(2) + ' KB'
  } else if (obj >= mb && obj < gb) {
    return parseFloat((obj / mb).toString()).toFixed(2) + ' MB'
  } else if (obj >= gb && obj < tb) {
    return parseFloat((obj / gb).toString()).toFixed(2) + ' GB'
  } else {
    return parseFloat((obj / tb).toString()).toFixed(2) + ' TB'
  }
}

watch(
    () => props.fileList,
    (val) => tableData.value = val
);
</script>
<style scoped>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
