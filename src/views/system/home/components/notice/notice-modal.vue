<template>
  <a-modal
      centered
      title="查看详情"
      :open="visible"
      :maskClosable="true"
      :width="960"
      @cancel="onClose"
  >
    <div class="view-class">
      <div style="text-align: center;font-size: 22px">{{ viewData.noticeTitle }}</div>
      <div style="text-align: center;margin-top: 10px">
        <div style="text-align: center;color: #888c8e;font-size: 13px">{{ viewData.sendUsername }}</div>
        <div style="text-align: center;color: #888c8e;font-size: 13px">{{ viewData.sendTime }}</div>
      </div>
      <div style="margin-top: 10px" v-html="viewData.noticeContent"></div>
    </div>
    <template v-slot:footer>
      <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
    </template>
  </a-modal>
</template>
<script setup>
import {ref} from 'vue';

// ----------------------- 以下是字段定义 emits props ------------------------
const emit = defineEmits(['reloadList']);
// ----------------------- 展开、隐藏编辑窗口 ------------------------
// 是否展示抽屉
const visible = ref(false);
const viewData = ref(null);

async function showModal(rowData) {
  viewData.value = rowData
  visible.value = true;
}

function onClose() {
  visible.value = false;
  emit('reloadList')
}

// ----------------------- 以下是暴露的方法内容 ------------------------
defineExpose({
  showModal,
});
</script>
<style lang="less" scoped>
.footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: left;
  z-index: 1;
}
.view-class{
  overflow-y: scroll;
  height: 80vh;
}
</style>
