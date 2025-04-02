<template>
  <a-form ref="formRef" layout="vertical" :model="form" :rules="rules" class="form-class">
    <a-form-item label="收件人" name="receiveUserIds">
      <a-select
          v-model:value="form.receiveUserIds"
          mode="multiple"
          allowClear
          :options="allUser"
          :field-names="{ label: 'nickname', value: 'id' }"
          :showSearch="true"
          optionFilterProp="nickname"
          placeholder="请选择收件人"
      />
    </a-form-item>
    <a-form-item label="标题" name="messageTitle">
      <a-input v-model:value="form.messageTitle" placeholder="请输入标题" style="width: 100%" />
    </a-form-item>
    <a-form-item label="是否同步发送网络邮箱" name="isToMail">
      <a-radio-group v-model:value="form.isToMail" @change="radioChange">
        <a-radio value="0">否</a-radio>
        <a-radio value="1">是</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item v-if="form.isToMail === '1'" label="设置发件人姓名" name="mailSendName">
      <a-input v-model:value="form.mailSendName" placeholder="请输入发件人姓名" style="width: 100%" />
    </a-form-item>
    <a-form-item label="内容" name="messageContent">
      <WangEditor v-model:model-value="form.messageContent" :height="300" />
    </a-form-item>
  </a-form>
  <div style="display: flex; justify-content: center; margin-bottom: 24px">
    <a-button style="margin-right: 8px" @click="submit('save')">保存</a-button>
    <a-button type="primary" @click="submit('send')">发送</a-button>
  </div>
</template>
<script setup>
import { message } from 'ant-design-vue';
import _ from 'lodash';
import { reactive, ref } from 'vue';
import { smartSentry } from '/@/lib/smart-sentry';
import { SmartLoading } from '/@/components/framework/smart-loading';
import WangEditor from '/@/components/framework/wangeditor/index.vue';
import { debounceAsync } from '/@/utils/debounce-util.js';
import { messageApi } from '/@/api/message/message-api.js';

const props = defineProps({
  rowData: {
    type: Object,
    default: () => {},
  },
  allUser: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['afterSend']);
// ----------------------- form表单相关操作 ------------------------

const formRef = ref();
const formDefault = {
  id: props.rowData?.id || null,
  messageTitle: props.rowData?.messageTitle || null,
  messageContent: props.rowData?.messageContent || null,
  isToMail: props.rowData?.isToMail || '0',
  mailSendName: props.rowData?.mailSendName || null,
  receiveUserIds: props.rowData?.receiveUsers?.split(',') || [],
  messageStatus: '0',
};
let form = reactive({ ...formDefault });
const rules = {
  receiveUserIds: [{ required: true, message: '收件人不能为空' }],
  messageTitle: [
    { required: true, message: '标题不能为空' },
    { max: 1000, message: '长度不能超过1000个字符', trigger: 'blur' },
  ],
  isToMail: [{ required: true, message: '请选择是否同步发送网络邮箱' }],
};

function validateForm(formRef) {
  return new Promise((resolve) => {
    formRef
        .validate()
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
  });
}

// 防抖
const submit = debounceAsync((operateType) => onSubmit(operateType), 200, true);
const onSubmit = async (operateType) => {
  if (operateType === 'send') {
    let validateFormRes = await validateForm(formRef.value);
    if (!validateFormRes) {
      message.error('参数验证错误，请仔细填写表单数据!');
      return;
    }
  }
  SmartLoading.show();
  try {
    let params = _.cloneDeep(form);
    if (operateType === 'save') {
      if (params.id) {
        await messageApi.updateMessage(params);
      } else {
        await messageApi.saveMessage(params);
      }
    } else {
      params.messageStatus = '1';
      await messageApi.sendMessage(params);
    }
    emit('afterSend', operateType === 'save' ? '保存成功' : '发送成功');
    SmartLoading.hide();
  } catch (error) {
    smartSentry.captureError(error);
  } finally {
    SmartLoading.hide();
  }
};

/** 单选框变更回调 */
function radioChange(e) {
  form.isToMail = e.target.value;
  if (e.target.value === '0') {
    form.mailSendName = null;
  }
}
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

.form-class {
  margin-top: 24px;
}
</style>
