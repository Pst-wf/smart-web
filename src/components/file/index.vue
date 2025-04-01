<script setup>
import {onMounted, ref} from "vue";
import {localRead} from "/@/utils/local-util.js";
import LocalStorageKeyConst from "/@/constants/local-storage-key-const.js";

const props = defineProps({
  showFileList: {
    type: Boolean,
    default: true
  }
});
const emit = defineEmits(['change']);
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
// 上传列表变更
function handleChange () {
  emit('change')
}
onMounted(setHeaders)
</script>

<template>
  <a-upload
      style="display: inline-block"
      name="files"
      :headers="headers"
      :multiple="true"
      :action="actionUrl"
      :show-upload-list="showFileList"
      @change="handleChange"
  >
    <a-button v-privilege="'file:upload'" type="primary">
      <UploadOutlined />
      上传
    </a-button>
  </a-upload>
</template>

<style scoped lang="less">

</style>
