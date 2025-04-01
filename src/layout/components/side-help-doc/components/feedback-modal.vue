<!-- 意见反馈提交弹窗 -->
<template>
  <a-modal :open="visible" title="意见反馈" :closable="false" :maskClosable="true" :get-container="SmartLoading.spin">
    <a-form :labelCol="{ span: 6 }">
      <a-form-item label="我要吐槽/建议：">
        <a-textarea v-model:value="form.feedbackContent" placeholder="请输入让您不满意的点，我们争取做到更好～" :rows="3" />
      </a-form-item>
      <a-form-item label="反馈图片：">
        <ImageUpload v-model:file-list="form.feedbackAttachment" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="hide">关闭</a-button>
      <a-button type="primary" @click="submit">提交</a-button>
    </template>
  </a-modal>
</template>
<script setup>
  import { reactive, ref } from 'vue';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { message } from 'ant-design-vue';
  import ImageUpload from '/@/components/image-upload/index.vue';
  import { smartSentry } from '/@/lib/smart-sentry';

  defineExpose({
    show,
  });

  const visible = ref(false);

  function show() {
    Object.assign(form, formDefault);
    console.log(form);
    visible.value = true;
  }

  function hide() {
    visible.value = false;
  }

  const formDefault = {
    feedbackContent: '',
    feedbackAttachment: '',
  };
  const form = reactive({ ...formDefault });

  async function submit() {
    try {
      SmartLoading.show();
      if (!form.feedbackContent) {
        message.warn('请填写具体内容');
        return;
      }
      message.success('提交成功');
      hide();
    } catch (e) {
      smartSentry.captureError(e);
    } finally {
      SmartLoading.hide();
    }
  }

  function changeAttachment(fileList) {
    form.feedbackAttachment = fileList;
  }
</script>
