<!-- 递归菜单 -->
<template>
  <div class="recursion-container" v-show="topMenu.children && topMenu.children.length > 0">
    <!-- 顶部顶级菜单名称 -->
    <div class="top-menu">
      <component v-if="topMenu.meta?.antIcon" :is="$antIcons[topMenu.meta?.antIcon]" style="font-size: 14px"
                 class="icon-tab-class"/>
      <span class="ant-menu">{{ topMenu.meta?.title }}</span>
    </div>
    <!-- 次级菜单展示 -->
    <a-menu :selectedKeys="selectedKeys" :openKeys="openKeys" mode="inline">
      <template v-for="item in topMenu.children" :key="item.name">
        <template v-if="!item.meta.hideInMenu">
          <template v-if="$lodash.isEmpty(item.children)">
            <a-menu-item :key="item.name" @click="turnToPage(item)">
              <template #icon v-if="item.meta.antIcon">
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
    </a-menu>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { HOME_PAGE_NAME } from '/@/constants/system/home-const';
import SubMenu from './sub-menu.vue';
import { router } from '/@/router';
import _ from 'lodash';
import menuEmitter from './side-expand-menu-mitt';
import { useUserStore } from '/@/store/modules/system/user';
import $lodash from "lodash";

// 选中的顶级菜单
let topMenu = ref({});
menuEmitter.on('selectTopMenu', onSelectTopMenu);

// 监听选中顶级菜单事件
function onSelectTopMenu(selectedTopMenu) {
  topMenu.value = selectedTopMenu;
  console.log(selectedTopMenu);
  if (selectedTopMenu.children && selectedTopMenu.children.length > 0) {
    openKeys.value = _.map(selectedTopMenu.children, 'path').map((e) => e.toString());
  } else {
    openKeys.value = [];
  }
  selectedKeys.value = [];
}

//展开的菜单
const selectedKeys = ref([]);
const openKeys = ref([]);

function updateSelectKeyAndOpenKey(parentList, currentSelectKey) {
  if (!parentList) {
    return;
  }
  //获取需要展开的menu key集合
  openKeys.value = _.map(parentList, 'path').map((e) => e.toString());
  selectedKeys.value = [currentSelectKey];
}

// 页面跳转
function turnToPage(route) {
  useUserStore().deleteKeepAliveIncludes(route.name);
  const params = { name: route.name }
  if(route.meta.query) {
    const query = {}
    route.meta.query.forEach(x=>{
      query[x.key] = x.value
    })
    params.query = query;
  }
  router.push(params);
}

function goHome() {
  router.push({ name: HOME_PAGE_NAME });
}

defineExpose({ updateSelectKeyAndOpenKey });
</script>
<style scoped lang="less">
.recursion-container {
  height: 100%;
  background: #ffffff;
}

.top-menu {
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-inline: 4px;
  padding-left: 24px;
  height: @header-user-height;
  font-size: 16px;
  color: #515a6e;
  border-bottom: 1px solid #f3f3f3;
  border-right: 1px solid #f3f3f3;
}
.icon-tab-class {
  margin-right: 4px !important;
}
</style>
