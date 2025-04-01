<!-- 系统更新日志 查看 -->
<template>
  <a-modal title="更新日志" width="700px" :open="visibleFlag" :get-container="SmartLoading.spin" @cancel="onClose">
    <div>
      <pre>{{ content }}</pre>
      <div v-if="link">
        链接：<a :href="link" target="_blank">{{ link }}</a>
      </div>
    </div>

    <template #footer>
      <a-space>
        <a-button type="primary" @click="onClose">关闭</a-button>
      </a-space>
    </template>
  </a-modal>
</template>
<script setup>
  import { ref } from 'vue';
  import { SmartLoading } from '/@/components/framework/smart-loading/index.js';

  const visibleFlag = ref(false);
  const content = ref('');
  const link = ref('');

  function show(changeLog) {
    content.value = changeLog.content;
    link.value = changeLog.link;
    visibleFlag.value = true;
  }

  function onClose() {
    visibleFlag.value = false;
  }

  defineExpose({
    show,
  });
</script>
