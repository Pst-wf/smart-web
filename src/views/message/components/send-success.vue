<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '发送成功'
  }
});
const emit = defineEmits(['back']);
</script>

<template>
  <a-result
      status="success"
      :title="title"
  >
    <template #extra>
      <a-button key="console" type="primary" @click="()=> emit('back')">返回</a-button>
    </template>
  </a-result>
</template>

<style scoped lang="less">

</style>
