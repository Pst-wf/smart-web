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
        :beforeUpload="beforeUpload"
        @change="changeFile"
    >
      <a-button :disabled="dataSource.length >= limit">
        <upload-outlined/>
        {{ placeholder }}
      </a-button>
    </a-upload>
  </div>
</template>
<script setup>
import {onMounted, ref} from 'vue';
import {localRead} from "/@/utils/local-util.js";
import LocalStorageKeyConst from "/@/constants/local-storage-key-const.js";
import {message} from "ant-design-vue";
import {getFileNameSuffix} from "/@/utils/common-util.js";

let props = defineProps({
  fileList: {
    type: [String, null],
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
    default: '点击上传'
  },
  max: {
    type: Number,
    default: 5
  }
});
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
  if (info.file.status === 'removed') {
    const filePathList = dataSource.value.map(x => x.id)
    emit('update:fileList', filePathList.join(','))
  }
  if (info.file.status === 'done') {
    if (info.file.response) {
      if (info.file.response.code === 200) {
        message.success(`${info.file.name} 上传成功`);
        const filePathList = dataSource.value.map(x => x.response?.data[0].id)
        emit('update:fileList', filePathList.join(','))
      } else {
        message.error(info.file.response.msg);
      }
    }
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 上传失败`);
  }
}
onMounted(setHeaders)

function clear(){
  dataSource.value = [];
}

const emit = defineEmits(['update:fileList']);
defineExpose({
  clear
})
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
