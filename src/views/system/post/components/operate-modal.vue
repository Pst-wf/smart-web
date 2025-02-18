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
      <a-form-item label="岗位名称" name="postName">
        <a-input v-model:value="form.postName" placeholder="请输入岗位名称" allowClear/>
      </a-form-item>
      <a-form-item label="岗位编码" name="postCode">
        <a-input v-model:value="form.postCode" placeholder="请输入岗位编码" allowClear/>
      </a-form-item>
      <a-form-item label="岗位状态" name="status">
        <a-switch v-model:checked="form.status" checked-value="1" un-checked-value="0" checked-children="启用" un-checked-children="停用"/>
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
import {postApi} from '/@/api/system/post-api.js';
import {smartSentry} from '/@/lib/smart-sentry';
import {SmartLoading} from '/@/components/framework/smart-loading';
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
  postName: null,
  postCode: null,
  status: '1'
};
let form = reactive({...formDefault});
const rules = {
  postCode: [
    {required: true, message: '岗位编码不能为空'},
  ],
  postName: [
    {required: true, message: '岗位名称不能为空'},
    {max: 20, message: '岗位名称不能大于20个字符', trigger: 'blur'},
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
      await postApi.updatePost(params);
    } else {
      await postApi.addPost(params);
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

