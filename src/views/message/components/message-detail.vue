<template>
  <a-modal centered title="查看详情" :open="visible" :maskClosable="true" :width="960" :get-container="SmartLoading.spin" @cancel="onClose">
    <div class="view-class">
      <div style="text-align: center; font-size: 22px">{{ viewData.messageTitle }}</div>
      <div style="text-align: center; margin-top: 10px">
        <span>
          <span v-if="operateType === 'view'" style="text-align: center; color: #888c8e; font-size: 13px">
            发送人：{{ viewData.createUserName }}</span
          >
          <span v-if="operateType === 'get' || operateType === 'draft'" style="text-align: center; color: #888c8e; font-size: 13px"
            >收件人：{{ viewData.receiveUserNames }}</span
          >
        </span>
        <span style="margin-left: 20px">
          <span v-if="operateType === 'draft'" style="text-align: center; color: #888c8e; font-size: 13px">创建时间：{{ viewData.createDate }}</span>
          <span v-else style="text-align: center; color: #888c8e; font-size: 13px">发送时间：{{ viewData.sendTime }}</span>
        </span>
      </div>
      <div style="margin-top: 10px" v-html="viewData.messageContent"></div>
    </div>
    <template v-slot:footer>
      <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
    </template>
  </a-modal>
</template>
<script setup>
  import { ref } from 'vue';
  import { SmartLoading } from '/@/components/framework/smart-loading/index.js';

  // ----------------------- 以下是字段定义 emits props ------------------------
  const emit = defineEmits(['reloadList']);
  // ----------------------- 展开、隐藏编辑窗口 ------------------------
  // 是否展示抽屉
  const visible = ref(false);
  const viewData = ref(null);
  const operateType = ref('view');
  async function showModal(rowData, operateTypeValue) {
    viewData.value = rowData;
    operateType.value = operateTypeValue;
    visible.value = true;
  }

  function onClose() {
    visible.value = false;
    emit('reloadList');
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
  .view-class {
    overflow-y: scroll;
    height: 80vh;
  }
</style>
