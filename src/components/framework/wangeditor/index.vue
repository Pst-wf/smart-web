<template>
  <div style="border: 1px solid #ccc">
    <Toolbar v-if="showToolBar" style="border-bottom: 1px solid #ccc" :editor="editorRef" />
    <a-spin :spinning="loading" size="large">
      <Editor
        style="overflow-y: hidden"
        :style="{ height: `${height}px` }"
        v-model="editorHtml"
        :defaultConfig="editorConfig"
        @onCreated="handleCreated"
        @onChange="handleChange"
      />
    </a-spin>
  </div>
</template>
<script setup>
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import { FILE_FOLDER_TYPE_ENUM } from '/@/constants/support/file-const';
import { fileApi } from '/src/api/file/file-api';
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { smartSentry } from '/@/lib/smart-sentry';

// ----------------------- 以下是公用变量 emits props ----------------
let props = defineProps({
  modelValue: [String, null],
  disabled: {
    type: Boolean,
    default: false,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  showToolBar: {
    type: Boolean,
    default: true,
  },
  height: {
    type: Number,
    default: 500,
  },
});
const domain = window.location.origin;
const baseUrl = import.meta.env.VITE_APP_API_URL;
//菜单
const editorConfig = { MENU_CONF: {}, readOnly: props.readOnly };
const loading = ref(false);
//上传
let customUpload = {
  async customUpload(file, insertFn) {
    try {
      loading.value = true;
      const formData = new FormData();
      formData.append('files', file);
      let res = await fileApi.uploadFile(formData, FILE_FOLDER_TYPE_ENUM.COMMON.value);
      let data = res.data[0];
      if (data.uploadType === '0') {
        insertFn(domain + baseUrl + '/' + data.fileKey);
      } else {
        insertFn(data.filePath);
      }
    } catch (error) {
      smartSentry.captureError(error);
    } finally {
      loading.value = false;
    }
  },
};
editorConfig.MENU_CONF['uploadImage'] = customUpload;
editorConfig.MENU_CONF['uploadVideo'] = customUpload;

const editorHtml = ref();

watch(
  () => props.modelValue,
  (nVal) => {
    editorHtml.value = nVal ? nVal : '';
  },
  {
    immediate: true,
    deep: true,
  }
);

// 获取编辑器实例html
const emit = defineEmits(['update:modelValue']);
const editorRef = shallowRef();
const handleCreated = (editor) => {
  editorRef.value = editor;
  if (props.disabled) {
    editorRef.value.disable();
  }
};
const handleChange = (editor) => {
  emit('update:modelValue', editorHtml.value === '<p><br></p>' ? '' : editorHtml.value);
};

function getHtml() {
  const htmlContent = editorRef.value.getHtml();
  return htmlContent === '<p><br></p>' ? '' : htmlContent;
}

function getText() {
  return editorRef.value.getText();
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

defineExpose({
  editorRef,
  getHtml,
  getText,
});
</script>
<style scoped>
.w-e-full-screen-container {
  z-index: 9999 !important;
}
</style>
