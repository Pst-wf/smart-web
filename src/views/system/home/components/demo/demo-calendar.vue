<script setup>

import DefaultHomeCard from "/@/views/system/home/components/default-home-card.vue";
</script>

<template>
  <default-home-card icon="CalendarOutlined" title="日历">
    <a-calendar class="calendar-class"/>
  </default-home-card>
</template>

<style scoped lang="less">
:deep(.calendar-class) .ant-picker-calendar-date-content {
  height: 0 !important;
}

</style>
