<template>
  <a-card class="role-container">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="系统字典">
        <TableTab v-if="activeKey === '1'" dict-type="1"/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="业务字典">
        <TableTab v-if="activeKey === '2'" dict-type="2"/>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script setup>
import {ref, watch} from 'vue';
import TableTab from './components/table-tab.vue';
import {columns} from "./columns.js";
let activeKey = ref('1');
watch(() => activeKey.value, () => {
  columns.value.forEach(item => item.sortOrder = null);
})
</script>
<style scoped lang="less">
.role-container {
  height: 100%;
}
</style>
