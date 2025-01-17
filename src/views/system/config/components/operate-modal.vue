<template>
  <a-drawer
      :body-style="{ paddingBottom: '80px' }"
      :maskClosable="true"
      :title="disabled ? '查看' : form.id ? '编辑' : '新增'"
      :open="visible"
      :width="600"
      @close="onClose"
  >
    <a-form ref="formRef" :labelCol="{ span: 4 }" :labelWrap="true" :model="form" :rules="rules" :disabled="disabled">
      <a-form-item label="键" name="configKey">
        <a-input v-model:value="form.configKey" placeholder="请输入键"/>
      </a-form-item>
      <a-form-item label="值" name="configValue">
        <a-input v-model:value="form.configValue" placeholder="请输入值"/>
      </a-form-item>
      <a-form-item label="描述" name="configDesc">
        <a-textarea :auto-size="{ minRows: 2, maxRows: 4 }" v-model:value="form.configDesc" placeholder="请输入描述"/>
      </a-form-item>
    </a-form>
    <div class="footer">
      <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
      <a-button v-if="!disabled" style="margin-right: 8px" type="primary" @click="submit()">提交</a-button>
    </div>
  </a-drawer>
</template>
<script setup>
import {message} from 'ant-design-vue';
import _ from 'lodash';
import {reactive, ref, watch} from 'vue';
import {configApi} from '/@/api/system/config-api.js';
import {smartSentry} from '/@/lib/smart-sentry';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {debounceAsync} from "/@/utils/debounce-util.js";


// ----------------------- 以下是字段定义 emits props ------------------------
const props = defineProps({
  // 分组类型
  isSystem: {
    type: String,
    required: true
  }
});
const emit = defineEmits(['reloadList']);

// ----------------------- 展开、隐藏编辑窗口 ------------------------
const visible = ref(false);
// 是否可编辑
const disabled = ref(false);
async function showDrawer(rowData, bool) {
  disabled.value = bool;
  Object.assign(form, formDefault);
  if (rowData && !_.isEmpty(rowData)) {
    Object.assign(form, rowData);
  }
  visible.value = true;
}
function onClose() {
  Object.assign(form, formDefault);
  formRef.value.resetFields();
  visible.value = false;
}

// ----------------------- form表单相关操作 ------------------------

const formRef = ref();
const formDefault = {
  id: null,
  configKey: null,
  configValue: null,
  configDesc: null,
  isSystem: props.isSystem,
};
let form = reactive({...formDefault});
const rules = {
  configKey: [
    {required: true, message: '键不能为空'}
  ]
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
const submit = debounceAsync(() =>onSubmit(), 200, true);
const onSubmit = async () => {
  let validateFormRes = await validateForm(formRef.value);
  if (!validateFormRes) {
    message.error('参数验证错误，请仔细填写表单数据!');
    return;
  }
  SmartLoading.show();
  try {
    let params = _.cloneDeep(form);
    if (params.id) {
      await configApi.updateConfig(params);
    } else {
      await configApi.addConfig(params);
    }
    message.success(`${params.id ? '修改' : '新增'}成功`);
    SmartLoading.hide();
    onClose();
    emit('reloadList');
  } catch (error) {
    smartSentry.captureError(error);
  } finally {
    SmartLoading.hide();
  }
};
watch(
    () => visible.value,
    (val) => {
      if (!val) {
        formRef.value.resetFields();
      }
    },
);

// ----------------------- 以下是暴露的方法内容 ------------------------
defineExpose({
  showDrawer,
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
</style>

