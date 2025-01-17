<!-- 统菜单-递归菜单 -->
<template>
  <a-sub-menu :key="menuInfo.name">
    <template #icon>
      <component :is="$antIcons[menuInfo.meta.antIcon]" />
    </template>
    <template #title>{{ menuInfo.meta.title }}</template>
    <template v-for="item in menuInfo.children" :key="item.name">
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
  const props = defineProps({
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  });

  const emits = defineEmits(['turnToPage']);
  const turnToPage = (menu) => {
    emits('turnToPage', menu);
  };
</script>
