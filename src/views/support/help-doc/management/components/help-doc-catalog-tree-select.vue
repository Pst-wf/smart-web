<!-- 目录下拉框 -->
<template>
  <a-tree-select
    :value="props.value"
    :treeData="treeData"
    :fieldNames="{ label: 'name', key: 'helpDocCatalogId', value: 'helpDocCatalogId' }"
    show-search
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="请选择目录"
    allow-clear
    tree-default-expand-all
    :multiple="props.multiple"
    @change="treeSelectChange"
  />
</template>
<script setup>
import {onMounted, ref} from 'vue';
import _ from 'lodash';

const props = defineProps({
    // 绑定值
    value: Number,
    // 单选多选
    multiple: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:value']);

  let treeData = ref([]);
  onMounted(queryCatalogTree);
  // 外部调用初始化
  async function queryCatalogTree() {
    const data = []
    treeData.value = buildHelpDocCatalogTree(data, 0);
  }

  // 构建目录树
  function buildHelpDocCatalogTree(data, parentId) {
    let children = data.filter((e) => e.parentId === parentId) || [];
    children = _.sortBy(children, (e) => e.sort);
    children.forEach((e) => {
      e.children = buildHelpDocCatalogTree(data, e.helpDocCatalogId);
    });
    updateHelpDocCatalogPreIdAndNextId(children);
    return children;
  }

  // 更新树的前置id和后置id
  function updateHelpDocCatalogPreIdAndNextId(data) {
    for (let index = 0; index < data.length; index++) {
      if (index === 0) {
        data[index].nextId = data.length > 1 ? data[1].helpDocCatalogId : undefined;
        continue;
      }

      if (index === data.length - 1) {
        data[index].preId = data[index - 1].helpDocCatalogId;
        data[index].nextId = undefined;
        continue;
      }

      data[index].preId = data[index - 1].helpDocCatalogId;
      data[index].nextId = data[index + 1].helpDocCatalogId;
    }
  }

  function treeSelectChange(e) {
    emit('update:value', e);
  }

  // ----------------------- 以下是暴露的方法内容 ------------------------
  defineExpose({
    queryCatalogTree,
  });
</script>
