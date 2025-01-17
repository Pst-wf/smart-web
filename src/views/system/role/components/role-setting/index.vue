<template>
  <a-card class="role-container">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="角色-功能权限">
        <RoleTree />
      </a-tab-pane>
      <a-tab-pane key="2" tab="角色-数据范围" v-if="configData === '1'">
        <RoleDataScope />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script setup>
import {onMounted, ref} from 'vue';
  import RoleDataScope from '../role-data-scope/index.vue';
  import RoleTree from '../role-tree/index.vue';
import {configApi} from "/@/api/system/config-api.js";

  defineProps({
    value: Number,
  });

  defineEmits(['update:value']);

  let activeKey = ref();
  const configData = ref('1')

  async function getConfigData() {
    const configRes = await configApi.getConfigByKeys({keys: 'has_dept_post'});
    configData.value = configRes.data.has_dept_post
  }

  onMounted(getConfigData)
</script>
<style scoped lang="less">
  .role-container {
    height: 100%;
  }
</style>
