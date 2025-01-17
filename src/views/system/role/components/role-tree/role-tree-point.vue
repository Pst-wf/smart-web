<!-- 角色 功能点 -->
<template>
  <div class="point">
    <div class="point-label">
      <template v-for="module in props.tree" :key="module.id">
        <a-checkbox class="button-checkbox-css" @change="emits('selectCheckbox', module)" :value="module.id"><a-tag :color="roleStore.buttonsCheckedData.indexOf(module.id) === -1 ? '' : 'blue'">{{ module.name }}</a-tag> </a-checkbox>
      </template>
    </div>
  </div>
</template>
<script setup>
import {useRoleStore} from "/@/store/modules/system/role.js";
  let roleStore = useRoleStore();
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
  let emits = defineEmits(['selectCheckbox']);

</script>
<style scoped lang="less">
:deep(.button-checkbox-css) {
  .ant-checkbox {
    display: none;
  }
}
</style>
