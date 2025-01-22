<template>
  <a-modal
      :open="visible"
      :title="disabled ? '查看' : form.id ? '编辑' : '新增'"
      :maskClosable="true"
      :width="960"
      @cancel="onClose"
  >
    <a-form ref="formRef" :labelCol="{ span: 3 }" :labelWrap="true" :model="form" :rules="rules" :disabled="disabled" style="width:90%">
      <a-form-item label="标题" name="noticeTitle">
        <a-input v-model:value="form.noticeTitle" placeholder="请输入标题"/>
      </a-form-item>
      <a-form-item label="类型" name="noticeType">
        <a-select
            v-model:value="form.noticeType"
            placeholder="请选择类型"
            :allowClear="true"
            optionFilterProp="dictName"
            :options="dictMap.sys_notice_type"
            :field-names="{ label: 'dictName', value: 'dictValue' }"
        />
      </a-form-item>
      <a-form-item label="类别" name="noticeCategory">
        <a-select
            v-model:value="form.noticeCategory"
            placeholder="请选择类别"
            :allowClear="true"
            optionFilterProp="dictName"
            :options="dictMap.sys_notice_category"
            :field-names="{ label: 'dictName', value: 'dictValue' }"
        />
      </a-form-item>
      <a-form-item label="内容" name="noticeContent">
        <WangEditor v-model:model-value="form.noticeContent"/>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
      <a-button v-if="!disabled" style="margin-right: 8px" type="primary" @click="submit()">提交</a-button>
    </template>
  </a-modal>
</template>
<script setup>
import {message} from 'ant-design-vue';
import _ from 'lodash';
import {reactive, ref, watch} from 'vue';
import {noticeApi} from '/@/api/notice/notice-api.js';
import {smartSentry} from '/@/lib/smart-sentry';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {debounceAsync} from "/@/utils/debounce-util.js";
import WangEditor from '/@/components/framework/wangeditor/index.vue';

// ----------------------- 以下是字段定义 emits props ------------------------
const emit = defineEmits(['reloadList']);
const props = defineProps({
  dictMap: {
    type: Object,
    default: () => {}
  }
})
// ----------------------- 展开、隐藏编辑窗口 ------------------------
// 是否展示抽屉
const visible = ref(false);
// 是否可编辑
const disabled = ref(false);
async function showForm(rowData, bool) {
  disabled.value = bool
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
  noticeTitle: null,
  noticeContent: null,
  noticeType: null,
  noticeCategory: null
};
let form = reactive({...formDefault});
const rules = {
  noticeTitle: [
    {required: true, message: '标题不能为空'}
  ],
  noticeType: [
    {required: true, message: '类型不能为空'}
  ],
  noticeCategory: [
    {required: true, message: '类别不能为空'}
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
      await noticeApi.updateNotice(params);
    } else {
      await noticeApi.addNotice(params);
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
  showForm,
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
