<template>
  <iframe id="template-iframe" ref="iframeWin" :src="src" class="iframeCss" @load="loaded" ></iframe>
</template>

<script setup>
import { computed, ref } from 'vue';

const baseUrl = import.meta.env.VITE_APP_API_URL
const src = computed(() => `${baseUrl}/druid/index.html`);
function loaded() {
  // const cookie = document.cookie;
  // if (iframeWin.value && iframeWin.value.contentWindow) {
  //   iframeWin.value.contentWindow.postMessage(cookie, src.value);
  // }
}
</script>

<style scoped>
.iframeCss {
  width: 100%;
  min-height: 700px;
  border: 0;
}
</style>
