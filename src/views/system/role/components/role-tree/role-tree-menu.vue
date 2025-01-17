<!-- 角色 菜单 -->
<template>
  <li v-for="module in props.tree" :key="module.id">
    <div class="menu" :style="{ marginLeft: `${props.index * 4}%` }">
      <a-checkbox @change="selectCheckbox(module)" class="checked-box-label" :value="module.id">{{ module.menuName }} </a-checkbox>
      <div v-if="module.buttons && module.buttons.length > 0">
        <RoleTreePoint :tree="module.buttons" @selectCheckbox="selectCheckbox" />
      </div>
    </div>
    <template v-if="module.children">
      <RoleTreeMenu :tree="module.children" :index="props.index + 1" />
    </template>
  </li>
</template>
<script setup>
  import { useRoleStore } from '/src/store/modules/system/role';
  import RoleTreePoint from './role-tree-point.vue';
  import RoleTreeMenu from './role-tree-menu.vue';

  const props = defineProps({
    tree: {
      type: Array,
      default: () => [],
    },
    index: {
      type: Number,
      default: 0,
    },
  });
  defineEmits(['update:value']);
  let roleStore = useRoleStore();
  function selectCheckbox(module) {
    if (!module.id) {
      return;
    }
    // 是否勾选
    let checkedData = roleStore.checkedData;
    let buttonsCheckedData = roleStore.buttonsCheckedData;
    let findIndex = checkedData.indexOf(module.id);
    let buttonsFindIndex = buttonsCheckedData.indexOf(module.id);
    // 选中
    if (findIndex === -1 && buttonsFindIndex === -1) {
      // 选中本级以及子级
      roleStore.addCheckedDataAndChildren(module);
      // // 选中上级
      // roleStore.selectUpperLevel(module);
      // // 是否有关联菜单 有则选中
      // if (module.contextMenuId) {
      //   roleStore.addCheckedData(module.contextMenuId);
      // }
    } else {
      // 取消选中本级以及子级
      roleStore.deleteCheckedDataAndChildren(module);
    }
  }
</script>
