<template>
  <a-sub-menu :key="props.menuInfo.name">
    <template #icon>
      <component :is="$antIcons[props.menuInfo.meta.antIcon]" />
    </template>
    <template #title>{{ props.menuInfo.meta.title }}</template>
    <template v-for="item in props.menuInfo.children" :key="item.name">
      <template v-if="!item.meta.hideInMenu">
        <template v-if="!item.children">
          <a-menu-item :key="item.name" @click="turnToPage(item)">
            <template #icon>
              <component :is="$antIcons[item.meta.antIcon]" />
            </template>
            {{ item.meta.title }}
          </a-menu-item>
        </template>
        <template v-else>
          <SubMenu :menu-info="item" :key="item.name" @turnToPage="turnToPage" />
        </template>
      </template>
    </template>
  </a-sub-menu>
</template>
<script setup>
  let props = defineProps({
    menuInfo: Object,
  });
  const emits = defineEmits(['turnToPage']);
  const turnToPage = (route) => {
    emits('turnToPage', route);
  };
</script>
<style scoped lang="less">
  ::v-deep(.ant-menu-item-selected) {
    border-right: 3px !important;
  }
</style>
