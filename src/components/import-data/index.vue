<script setup>
import { onMounted, ref } from 'vue';
import { localRead } from '/@/utils/local-util.js';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';
import { message } from 'ant-design-vue';
const props = defineProps({
  importUrl: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(['finish', 'downloadTemplate']);
const TOKEN_HEADER = 'Authorization';
const DEFAULT_TOKEN = 'Basic c2FiZXI6c2FiZXJfc2VjcmV0';
const actionUrl = import.meta.env.VITE_APP_API_URL + props.importUrl;
const headers = ref({
  'Tenant-Id': '000000',
});

function setHeaders() {
  const token = localRead(LocalStorageKeyConst.USER_TOKEN);
  headers.value[TOKEN_HEADER] = token ? `Bearer ${token}` : DEFAULT_TOKEN;
  const identityId = localRead(LocalStorageKeyConst.IDENTITY_ID);
  if (identityId) {
    headers.value['Identity-Id'] = identityId;
  }
}
// 下载模板
function downloadTemplate() {
  emit('downloadTemplate');
}

const visible = ref(false);

function onOpen() {
  visible.value = true;
}
function onClose() {
  visible.value = false;
}

const handleChange = (info) => {
  console.log("status", info.file.status )
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
    loading.value = false;
  }
  if (info.file.status === 'uploading') {
    loading.value = true;
  }
  if (info.file.status === 'done') {
    message.success(`${info.file.name} 上传成功`);
    onClose();
    emit('finish');
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 上传失败`);
  }
};
const loading = ref(false);
onMounted(setHeaders);
defineExpose({
  onOpen,
});
</script>

<template>
  <a-modal :open="visible" :maskClosable="true" :mask="true" centered :closable="false" @cancel="onClose" :footer="null">
    <a-spin :spinning="loading" size="large">
      <div class="import-data-class">
        <a-upload-dragger :headers="headers" class="upload-class" name="files" :action="actionUrl" :show-upload-list="false" @change="handleChange">
          <div>
            <p class="ant-upload-drag-icon">
              <inbox-outlined />
            </p>
            <p class="ant-upload-text">单击或拖动文件到此区域进行上传</p>
          </div>
        </a-upload-dragger>
        <a-button class="button-class" @click="downloadTemplate">下载导入模板</a-button>
      </div>
    </a-spin>
  </a-modal>
</template>

<style scoped lang="less">
:deep(.upload-class) {
  height: 300px;
  .ant-upload {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
.import-data-class {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.button-class {
  margin: auto;
  margin-top: 20px;
}
</style>
