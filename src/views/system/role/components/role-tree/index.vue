<template>
  <div>
    <div class="tree-header">
      <p>设置角色对应的功能操作、后台管理权限</p>
      <a-button v-if="selectRoleId" type="primary" @click="saveChange" v-privilege="'role:update'"> 保存 </a-button>
    </div>
    <!-- 功能权限勾选部分 -->
    <RoleTreeCheckbox :tree="tree" />
  </div>
</template>
<script setup>
  import { inject, ref, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import _ from 'lodash';
  import RoleTreeCheckbox from './role-tree-checkbox.vue';
  import { roleMenuApi } from '/src/api/system/role-menu-api';
  import { useRoleStore } from '/src/store/modules/system/role';
  import { SmartLoading } from '/src/components/framework/smart-loading';
  import { smartSentry } from '/src/lib/smart-sentry';
  import {menuApi} from "/@/api/system/menu-api.js";

  let roleStore = useRoleStore();
  let tree = ref();
  let selectRoleId = inject('selectRoleId');

  watch(selectRoleId, () => getRoleSelectedMenu(), {
    immediate: true,
  });

  async function getRoleSelectedMenu() {
    if (!selectRoleId.value) {
      return;
    }
    SmartLoading.show();
    let menuRes = await roleMenuApi.getRoleMenus(selectRoleId.value);
    let buttonRes = await roleMenuApi.getRoleButtons(selectRoleId.value);
    roleStore.initCheckedData(menuRes.data || []);
    roleStore.initButtonsCheckedData(buttonRes.data || []);
    SmartLoading.hide();
  }
  async function saveChange() {
    let checkedData = roleStore.checkedData;
    let buttonsCheckedData = roleStore.buttonsCheckedData;
    SmartLoading.show();
    try {
      await roleMenuApi.setRoleMenus({ id: selectRoleId.value, menuIds: checkedData });
      await roleMenuApi.setRoleButtons({ id: selectRoleId.value, buttonIds: buttonsCheckedData });
      message.success('保存成功');
    } catch (error) {
      smartSentry.captureError(error);
    } finally {
      SmartLoading.hide();
    }
  }
  async function getMenuTree() {
    let menuRes = await menuApi.menuTree();
    if (_.isEmpty(roleStore.treeMap)) {
      roleStore.initTreeMap(menuRes.data || []);
    }
    tree.value = menuRes.data;
  }
  getMenuTree()
</script>
<style scoped lang="less">
  @import 'index.less';
</style>
