<template>
  <a-modal
      :open="visible"
      title="预览"
      :maskClosable="true"
      width="80%"
      @cancel="onClose"
  >
    <a-layout has-sider>
      <a-layout-sider class="sider-class" width="300">
        <a-directory-tree
            v-model:expandedKeys="expandedKeys"
            v-model:selectedKeys="selectedKeys"
            :fieldNames="{key: 'id', title: 'label'}"
            :tree-data="previewData"
            @select="(val,e) =>selectTree(e)"
        />
      </a-layout-sider>
      <a-layout>
        <a-layout-content class="content-class">
          <a-button v-if="language !== ''" type="primary" ghost @click="copy()" style="position: absolute; top: 15px; right: 15px">复制</a-button>
          <highlightjs :language="language" :autodetect="false" :code="content"/>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-modal>
</template>
<script setup>
import {ref, watch} from 'vue';
import {message} from "ant-design-vue";

const props = defineProps({
  previewData: {
    type: Array,
    required: true
  }
});

const visible = ref(false);

const expandedKeys = ref([]);
const selectedKeys = ref([]);

async function showDrawer() {
  visible.value = true;
}

function onClose() {
  visible.value = false;
}

/**
 * 复制
 */
function copy() {
  const textarea = document.createElement('textarea');
  document.body.appendChild(textarea);
  textarea.value = content.value;
  textarea.select();
  document.execCommand('Copy');
  document.body.removeChild(textarea);
  message.success(`已复制到粘贴板`);
}

const content = ref('');
const language = ref('');

function selectTree(e) {
  const option = e.selectedNodes
  if (option && option.length > 0) {
    const id = option[0].id
    if (id?.includes('.vm')) {
      if (id?.includes('.java')) {
        language.value = 'java';
      } else if (id?.includes('.xml')) {
        language.value = 'xml';
      } else if (id?.includes('.js')) {
        language.value = 'javascript';
      } else if (id?.includes('.ts')) {
        language.value = 'typescript';
      } else if (id?.includes('.vue')) {
        language.value = 'html';
      } else {
        language.value = '';
      }
      content.value = option[0].value;
      console.log(language.value)
      console.log(content.value)
    }
  }
}

defineExpose({
  showDrawer
})
watch(()=> visible.value, (value) => {
  if(!value){
    expandedKeys.value = [];
    selectedKeys.value = [];
    content.value = '';
    language.value = '';
  }
})
</script>

<style scoped lang="less">
.sider-class {
  color: #fff;
  background-color: #fff;
  height: 70vh;
  overflow: auto;
}

.content-class {
  color: #fff;
  background-color: #282c34;
  height: 70vh;
  overflow: auto;
  position: relative;
}

:deep(.sider-class) {
  .ant-tree-directory {
    border-radius: 0 !important;
  }

  .ant-tree-node-content-wrapper {
    text-align: left;
  }
}
</style>
