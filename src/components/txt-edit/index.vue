<script setup>
  import { ref, watch } from 'vue';
  import { debounceAsync } from '/@/utils/debounce-util.js';

  const emit = defineEmits(['close', 'submit']);
  // 是否展示抽屉
  const visible = ref(false);
  const editValue = ref({});

  watch(
    () => visible.value,
    (val) => {
      if (!val) {
        editValue.value = {};
      }
    }
  );

  const submit = debounceAsync(() => handleSubmit(), 200, true);

  function handleSubmit() {
    emit('submit', editValue.value);
    visible.value = false;
  }
  async function onOpen(params) {
    console.log('params', params);
    editValue.value = params ? params : {};
    visible.value = true;
  }
  function close() {
    emit('close');
    visible.value = false;
  }
  defineExpose({
    onOpen,
  });
</script>

<template>
  <a-modal
    :open="visible"
    :mask="false"
    width="80%"
    class="text-modal-class"
    :closable="false"
    centered
    @cancel="close"
  >
    <div class="text-class">
      <a-textarea v-model:value="editValue.data" :rows="30" />
    </div>
    <template #footer>
      <a-flex justify="center" class="footer-class">
        <a-button style="margin-right: 8px" @click="close">关闭</a-button>
        <a-button style="margin-right: 8px" type="primary" @click="submit()">提交</a-button>
      </a-flex>
    </template>
  </a-modal>
</template>
<style lang="less" scoped>
  .text-class {
    padding: 24px;
  }
  .footer-class {
    margin-bottom: 20px;
  }
</style>
