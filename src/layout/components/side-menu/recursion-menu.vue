<!-- 传统菜单-递归菜单 -->
<template>
  <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      class="smart-menu"
      mode="inline"
      :theme="theme"
      :inlineCollapsed="collapsed"
  >
    <template v-for="item in menuTree" :key="item.name">
      <template v-if="!item.meta.hideInMenu">
        <template v-if="$lodash.isEmpty(item.children)">
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
  </a-menu>
</template>
<script setup>
import _ from 'lodash';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import SubMenu from './sub-menu.vue';
import { router } from '/@/router/index';
import { useAppConfigStore } from '/@/store/modules/system/app-config';
import { useUserStore } from '/@/store/modules/system/user';
import $lodash from "lodash";

const theme = computed(() => useAppConfigStore().$state.sideMenuTheme);

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});

const menuTree = computed(() => useUserStore().getMenuTree.filter(x=> x.path !== '/home') || []);
//展开的菜单
let currentRoute = useRoute();
const selectedKeys = ref([]);
const openKeys = ref([]);

// 页面跳转
function turnToPage(menu) {
  useUserStore().deleteKeepAliveIncludes(menu.name);
  const params = { name: menu.name }
  if(menu.meta.query) {
    const query = {}
    menu.meta.query.forEach(x=>{
      query[x.key] = x.value
    })
    params.query = query;
  }
  router.push(params);
}

/**
 * SmartWeb中 router的name 就是 后端存储menu的id
 * 所以此处可以直接监听路由，根据路由更新菜单的选中和展开
 */
function updateOpenKeysAndSelectKeys() {
  // 更新选中
  selectedKeys.value = [currentRoute.name];

  /**
   * 更新展开（1、获取新展开的menu key集合；2、保留原有的openkeys，然后把新展开的与之合并）
   */
      //获取需要展开的menu key集合
  let menuParentIdListMap = useUserStore().getMenuParentIdListMap;
  let parentList = menuParentIdListMap.get(currentRoute.name) || [];

  // 如果是折叠菜单的话，则不需要设置openkey
  if(!props.collapsed){
    // 使用lodash的union函数，进行 去重合并两个数组
    let needOpenKeys = _.map(parentList, 'name').map(String);
    // openKeys.value = _.union(openKeys.value, needOpenKeys);
    openKeys.value = needOpenKeys
  }
}

watch(
    currentRoute,
    () => {
      updateOpenKeysAndSelectKeys();
    },
    {
      immediate: true,
    }
);

defineExpose({
  updateOpenKeysAndSelectKeys,
});
</script>

<style lang="less" scoped>
.smart-menu {
  position: relative;
}
</style>
