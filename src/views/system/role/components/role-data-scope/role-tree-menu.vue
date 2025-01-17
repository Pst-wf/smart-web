<template>
  <li v-for="module in props.tree" :key="module.id">
    <div class="menu" :style="{ marginLeft: `${props.index * 4}%`}">
      <div class="label-class">{{ module.label }}</div>
      <template v-if="module.children && module.children.length > 0 && !module.children[0].checkboxDisabled">
        <RoleTreeScope ref="scopeRadio" :radio-option="module.children" :selected="props.selected" @selectRadio="selectRadio"/>
      </template>
    </div>
    <template v-if="module.children && module.children.length > 0 && module.children[0].checkboxDisabled">
      <RoleTreeMenu :tree="module.children" :selected="props.selected" :index="props.index + 1" @changeSelected="selectRadio"/>
    </template>
  </li>
</template>
<script setup>
import RoleTreeMenu from './role-tree-menu.vue';
import RoleTreeScope from './role-tree-scope.vue';
const props = defineProps({
  tree: {
    type: Array,
    default: () => [],
  },
  selected: {
    type: Array,
    default: () => [],
  },
  index: {
    type: Number,
    default: 0,
  },
});
let emits = defineEmits(['changeSelected']);
function selectRadio(val, arr){
  emits('changeSelected',val, arr)
}
</script>
