<script setup>
  import { DocumentEditor } from '@onlyoffice/document-editor-vue';
  import { ref, reactive, watch } from 'vue';
  import { useUserStore } from '/@/store/modules/system/user.js';
  const props = defineProps({
    data: {
      type: [Object, null],
      default: null,
    },
  });
  const emit = defineEmits(['close']);
  // 是否展示抽屉
  const visible = ref(false);

  async function onOpen() {
    visible.value = true;
  }
  function onClose() {
    visible.value = false;
  }
  function createDefaultConfig() {
    return {
      document: {
        fileType: '',
        type: 'desktop',
        title: '',
        url: '',
      },
      documentType: '',
      editorConfig: {
        callbackUrl: '',
        lang: 'zh-CN',
        customization: {
          // 自动保存
          forcesave: true,
        },
        user: {
          id: 'system',
          name: '超级管理员',
        },
      },
    };
  }
  // only office 配置
  const config = reactive(createDefaultConfig());
  function handleInitConfig() {
    Object.keys(config).forEach((key) => {
      config[key] = null;
    });
    Object.assign(config, createDefaultConfig());
    config.document.title = props.data?.fileName || '';
    config.document.fileType = props.data?.fileName?.substring(props.data?.fileName?.lastIndexOf('.') + 1) || '';
    config.document.url = props.data?.url || '';
    config.documentType = props.data?.documentType || '';
    if (props.data && props.data?.callback && props.data?.id) {
      config.editorConfig.callbackUrl = `${props.data.callback}?id=${props.data?.id}`;
    }
    config.editorConfig.user.id = useUserStore().userId;
    config.editorConfig.user.name = useUserStore().nickname;
  }
  function onDocumentReady() {}
  watch(
    () => visible.value,
    (val) => {
      if (!val) {
        emit('close');
      } else {
        handleInitConfig();
      }
    }
  );
  defineExpose({
    onOpen,
  });
</script>

<template>
  <a-modal
    :open="visible"
    :mask="false"
    width="100%"
    wrap-class-name="full-modal-document"
    :closable="false"
    centered
    @cancel="onClose"
    :footer="null"
  >
    <DocumentEditor
      v-if="visible"
      id="docEditor"
      :document-server-url="props.data?.serverUrl || ''"
      :config="config"
      :events_onDocumentReady="onDocumentReady"
    />
    <a-float-button shape="square" @click="onClose" :style="{ right: '50px', bottom: '40px' }"
      >>
      <template #icon>
        <CloseOutlined />
      </template>
    </a-float-button>
  </a-modal>
</template>

<style scoped lang="less"></style>
