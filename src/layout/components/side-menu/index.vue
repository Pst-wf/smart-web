<!-- 传统菜单 -->
<template>
  <!--左侧菜单分为两部分：1、顶部logo区域，包含 logo和名称;2、下方菜单区域-->

  <!-- 1、顶部logo区域 -->
  <div class="logo" @click="onGoHome" :style="sideMenuWidth" v-if="!collapsed">
    <img class="logo-img" :src="logoImg" />
    <div class="title smart-logo">{{ websiteName }}</div>
  </div>
  <div class="min-logo" @click="onGoHome" v-if="collapsed">
    <img class="logo-img" :src="logoImg" />
  </div>

  <!-- 2、下方菜单区域： 这里使用一个递归菜单解决 -->
  <div class="menu">
    <RecursionMenu :collapsed="collapsed" ref="menuRef" />
  </div>
</template>

<script setup>
  import { computed, nextTick, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import RecursionMenu from './recursion-menu.vue';
  import logoImg from '/@/assets/images/logo/smart-logo.png';
  import { HOME_PAGE_NAME } from '/@/constants/system/home-const';
  import { useAppConfigStore } from '/@/store/modules/system/app-config';
  import { themeMode } from '/@/theme/theme.js';

  const websiteName = computed(() => useAppConfigStore().websiteName);
  const sideMenuWidth = computed(() => 'width:' + useAppConfigStore().sideMenuWidth + 'px');
  const sideMenuTheme = computed(() => useAppConfigStore().sideMenuTheme);
  const sideColor = computed(() => (sideMenuTheme.value === 'light' ? themeMode.dark.sideColor : themeMode.light.sideColor));
  const props = defineProps({
    collapsed: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  const menuRef = ref();

  watch(
    () => props.collapsed,
    (newValue, oldValue) => {
      // 如果是展开菜单的话，重新获取更新菜单的展开项: openkeys和selectKeys
      if (!newValue) {
        nextTick(() => menuRef.value.updateOpenKeysAndSelectKeys());
      }
    }
  );

  const router = useRouter();
  function onGoHome() {
    router.push({ name: HOME_PAGE_NAME });
  }

  const color = computed(() => {
    let isLight = useAppConfigStore().$state.sideMenuTheme === 'light';
    return {
      background: isLight ? themeMode.light.sideColor : themeMode.dark.sideColor,
    };
  });
</script>

<style lang="less" scoped>
  .shadow {
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  }
  .side-menu {
    min-height: 100vh;
    overflow-y: auto;
    z-index: 10;

    .min-logo {
      height: @header-user-height;
      line-height: @header-user-height;
      padding: 0px 15px 0px 15px;
      background-color: v-bind('color.background');
      position: fixed;
      width: 80px;
      z-index: 21;
      display: flex;
      justify-content: center;
      align-items: center;
      .logo-img {
        width: 30px;
        height: 30px;
      }
    }

    .logo {
      height: @header-user-height;
      line-height: @header-user-height;
      background-color: v-bind('color.background');
      padding: 0px 15px 0px 15px;
      position: fixed;
      z-index: 21;
      display: flex;
      cursor: pointer;
      justify-content: center;
      align-items: center;

      .logo-img {
        width: 30px;
        height: 30px;
      }

      .title {
        font-size: 16px;
        font-weight: 600;
        margin-left: 8px;
        color: v-bind('sideColor');
      }
    }
  }
  .menu {
    margin-top: @header-user-height;
  }
</style>
