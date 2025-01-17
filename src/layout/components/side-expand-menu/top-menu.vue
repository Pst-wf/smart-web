<template>
  <div class="top-menu-container">
    <!-- 顶部logo区域 -->
    <div class="logo" @click="onGoHome">
      <img class="logo-img" :src="logoImg" />
      <!--      <div class="title smart-logo">{{ websiteName }}</div>-->
    </div>
    <!-- 一级菜单展示 -->
    <a-menu :selectedKeys="selectedKeys" mode="inline" :theme="theme" class="top-menu-class">
      <template v-for="item in menuTree" :key="item.name">
        <template v-if="!item.meta.hideInMenu">
          <a-menu-item :key="item.name" @click="onSelectMenu(item)">
            <template #icon>
              <component :is="$antIcons[item.meta.antIcon]" />
            </template>
            {{ menuNameAdapter(item.meta.title) }}
          </a-menu-item>
        </template>
      </template>
    </a-menu>
  </div>
</template>
<script setup>
import _ from 'lodash';
import {computed, ref} from 'vue';
import {HOME_PAGE_NAME} from '/@/constants/system/home-const';
import {MENU_TYPE_ENUM} from '/@/constants/system/menu-const';
import {router} from '/@/router';
import {useAppConfigStore} from '/@/store/modules/system/app-config';
import {useUserStore} from '/@/store/modules/system/user';
import logoImg from '/@/assets/images/logo/smart-admin-logo.png';
import menuEmitter from './side-expand-menu-mitt';
import $lodash from "lodash";

const websiteName = computed(() => useAppConfigStore().websiteName);
const theme = computed(() => useAppConfigStore().$state.sideMenuTheme);
const menuTree = computed(() => useUserStore().getMenuTree.filter(x => x.path !== '/home') || []);

// 展开菜单的顶级目录名字适配，只展示两个字为好
function menuNameAdapter(name) {
  // return name.substr(0, 2);
  return name;
}

// 选中的顶级菜单
const selectedKeys = ref([]);

// 选中菜单，页面跳转
function onSelectMenu(menuItem) {
  console.log('menuItem', menuItem)
  selectedKeys.value = [menuItem.path];
  // if (menuItem.menuType === MENU_TYPE_ENUM.MENU.value && (_.isEmpty(menuItem.children) || menuItem.children.every((e) => !e.visibleFlag))) {
  //   useUserStore().deleteKeepAliveIncludes(menuItem.path);
  //   router.push({ path: menuItem.path });
  // }
  if ($lodash.isEmpty(menuItem.children)) {
    useUserStore().deleteKeepAliveIncludes(menuItem.name);
    router.push({name: menuItem.name});
  }
  menuEmitter.emit('selectTopMenu', menuItem);
}

// 更新选中的菜单
function updateSelectKey(key) {
  selectedKeys.value = [key];
  let selectMenu = _.find(menuTree.value, {path: key});
  if (selectMenu) {
    menuEmitter.emit('selectTopMenu', selectMenu);
  }
}

//点击logo回到首页
function onGoHome() {
  router.push({name: HOME_PAGE_NAME});
}

defineExpose({updateSelectKey});
</script>
<style scoped lang="less">
.top-menu-container {
  height: 100%;
}

.logo {
  height: @header-user-height;
  line-height: @header-user-height;
  padding: 0px 15px 0px 15px;
  width: 100%;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  .logo-img {
    width: 30px;
    height: 30px;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    overflow: hidden;
    word-wrap: break-word;
    white-space: nowrap;
    color: v-bind('theme === "light" ? "#001529": "#ffffff"');
  }
}

:deep(.top-menu-class) {
  .ant-menu-item {
    display: flex;
    transition: border-color 0.3s, background 0.3s, padding 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
    flex-direction: column;
    align-items: center;
    height: 50px;
    padding: 0 !important;
    margin-top: 12px !important;

    .ant-menu-title-content {
      margin: 0 !important;
    }
  }
}
</style>
