<template>
  <a-card class="role-container">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="收件箱">
        <InCollectionBox v-if="activeKey === '1'"/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="发件箱">
        <OutCollectionBox v-if="activeKey === '2'"/>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script setup>
import { ref } from 'vue';
import InCollectionBox from "/@/views/message/components/in-collection-box.vue";
import OutCollectionBox from "/@/views/message/components/out-collection-box.vue";

let activeKey = ref('1');
</script>
<style scoped lang="less">
.role-container {
  height: 100%;
}
</style>
<script setup lang="ts">
</script>
