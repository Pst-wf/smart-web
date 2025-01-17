<!-- 标签页 入口，支持三种模式：默认、a-tabs, chrome-tabs -->
<template>
  <DefaultTab v-if="pageTagStyle === PAGE_TAG_ENUM.DEFAULT.value" />
  <AntdTab v-if="pageTagStyle === PAGE_TAG_ENUM.ANTD.value" />
  <ButtonTab v-if="pageTagStyle === PAGE_TAG_ENUM.BUTTON.value" />
</template>

<script setup>
import { computed } from 'vue';
import { useAppConfigStore } from '/@/store/modules/system/app-config';
import DefaultTab from './components/default-tab.vue';
import AntdTab from './components/antd-tab.vue';
import { PAGE_TAG_ENUM } from '/@/constants/layout-const.js';
import ButtonTab from "./components/button-tab.vue";

const pageTagStyle = computed(() => useAppConfigStore().$state.pageTagStyle);
</script>
