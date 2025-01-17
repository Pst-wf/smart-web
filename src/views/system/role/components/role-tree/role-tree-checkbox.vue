<!-- 角色 -->
<template>
  <div style="overflow: auto">
    <a-checkbox-group v-model:value="checkedData">
      <div class="checked-box">
        <ul>
          <!--li 菜单模块 start-->
          <RoleTreeMenu :tree="props.tree" :index="0"/>
          <!--li 菜单模块 end-->
        </ul>
      </div>
    </a-checkbox-group>
  </div>
</template>
<script setup>
import {computed, ref, watch} from 'vue';
import {useRoleStore} from '/src/store/modules/system/role';
import RoleTreeMenu from './role-tree-menu.vue';

let props = defineProps({
  tree: {
    type: Array,
    default: () => [],
  },
});
defineEmits(['update:value']);

let roleStore = useRoleStore();
let menuCheckData = ref([]);
let buttonCheckedData = ref([]);
const checkedData = computed(()=>[...menuCheckData.value, ...buttonCheckedData.value])


watch(
  () => roleStore.checkedData,
  (e) => {
    menuCheckData.value = e
  },
  {
    deep: true,
  }
);
watch(
    () => roleStore.buttonsCheckedData,
    (e) => {
      buttonCheckedData.value = e
    },
    {
      deep: true,
    }
);
</script>
<style scoped lang="less">
@import 'index.less';
</style>
