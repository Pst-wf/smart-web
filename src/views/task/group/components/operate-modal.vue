<template>
  <a-drawer
      :body-style="{ paddingBottom: '80px' }"
      :maskClosable="true"
      :title="disabled ? '查看' : form.id ? '编辑' : '新增'"
      :open="visible"
      :width="640"
      @close="onClose"
  >
    <a-form ref="formRef" :labelCol="{ span: 4 }" :labelWrap="true" :model="form" :rules="rules" :disabled="disabled">
      <a-form-item label="执行器" name="appName">
        <a-input v-model:value="form.appName" placeholder="请输入执行器"/>
      </a-form-item>
      <a-form-item label="执行器名称" name="title">
        <a-input v-model:value="form.title" placeholder="请输入执行器名称"/>
      </a-form-item>
      <a-form-item label="执行器类型" name="addressType">
        <SmartEnumRadio v-model:value="form.addressType" enumName="ADDRESS_TYPE_ENUM" placeholder="请选择执行器类型"/>
      </a-form-item>
      <a-form-item label="执行器地址列表" name="addressList">
        <a-textarea :auto-size="{ minRows: 2, maxRows: 4 }" v-model:value="form.addressList"
                    placeholder="执行器地址列表"/>
      </a-form-item>
    </a-form>
    <div class="footer">
      <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
      <a-button v-if="!disabled" style="margin-right: 8px" type="primary" @click="submit()">
        提交
      </a-button>
    </div>
  </a-drawer>
</template>
<script setup>
import {message} from 'ant-design-vue';
import _ from 'lodash';
import {reactive, ref, watch} from 'vue';
import {taskGroupApi} from '/@/api/task/task-group-api.js';
import {smartSentry} from '/@/lib/smart-sentry';
import {SmartLoading} from '/@/components/framework/smart-loading';
import SmartEnumRadio from '/@/components/framework/smart-enum-radio/index.vue';
import {debounceAsync} from "/@/utils/debounce-util.js";


// ----------------------- 以下是字段定义 emits props ------------------------
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
  appName: null,
  title: null,
  addressType: "0",
  addressList: null,
};
let form = reactive({...formDefault});
const rules = {
  appName: [
    {required: true, message: '执行器不能为空'}
  ],
  title: [
    {required: true, message: '执行器名称不能为空'}
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
      await taskGroupApi.updateTaskGroup(params);
    } else {
      await taskGroupApi.addTaskGroup(params);
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

