<template>
  <a-modal
      :open="visible"
      :title="disabled ? '查看' : form.id ? '编辑' : '新增'"
      :maskClosable="true"
      :width="960"
      :get-container="SmartLoading.spin"
      centered
      @cancel="onClose"
  >
    <a-form ref="formRef" :labelCol="{ span: 4 }" :labelWrap="true" :model="form" :rules="rules" :disabled="disabled">
      <a-form-item label="上级" name="parentId">
        <a-tree-select
            v-model:value="form.parentId"
            :fieldNames="{ label: 'label', key: 'id', value: 'id' }"
            :treeData="treeData"
            :show-checked-strategy="SHOW_ALL"
            tree-line
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择上级"
            allow-clear
            treeNodeFilterProp="label"
        />
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value="form.name" placeholder="请输入名称" allowClear />
      </a-form-item>
      <a-form-item label="行政编号" name="areaCode">
        <a-input v-model:value="form.areaCode" placeholder="请输入行政编号" allowClear />
      </a-form-item>
      <a-form-item label="经度" name="lng">
        <a-input v-model:value="form.lng" placeholder="请输入经度" allowClear />
      </a-form-item>
      <a-form-item label="纬度" name="lat">
        <a-input v-model:value="form.lat" placeholder="请输入纬度" allowClear />
      </a-form-item>
      <a-form-item label="启用状态" name="status">
        <SmartEnumRadio v-model:value="form.status" enumName="STATUS_ENUM" placeholder="请选择启用状态" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button v-if="!disabled" style="margin-right: 8px" type="primary" @click="submit()">提交</a-button>
    </template>
  </a-modal>
</template>
<script setup>
import { message } from 'ant-design-vue';
import _ from 'lodash';
import { reactive, ref, watch } from 'vue';
import { regionApi } from '/@/api/system/region/region-api.js';
import { smartSentry } from '/@/lib/smart-sentry';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { debounceAsync } from '/@/utils/debounce-util.js';
import SmartEnumRadio from '/@/components/framework/smart-enum-radio/index.vue';
import { SHOW_ALL } from 'ant-design-vue/es/vc-tree-select/index.js';

// ----------------------- 以下是字段定义 emits props ------------------------
defineProps({
  treeData: {
    type: [Array],
    required: true,
  },
});
const emit = defineEmits(['reloadList']);
// ----------------------- 展开、隐藏编辑窗口 ------------------------
// 是否展示抽屉
const visible = ref(false);
// 是否可编辑
const disabled = ref(false);
// 打开表单弹窗
async function showForm(rowData, bool) {
  disabled.value = bool;
  Object.assign(form, formDefault);
  if (rowData && !_.isEmpty(rowData)) {
    if (rowData.parentId === '0') {
      rowData.parentId = null;
    }
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
  level: null,
  parentId: null,
  areaCode: null,
  name: null,
  mergerName: null,
  lng: null,
  lat: null,
  status: '1',
};
let form = reactive({ ...formDefault });
const rules = {
  areaCode: [
    { required: true, message: '行政编号不能为空' },
    { max: 30, message: '长度不能超过30个字符', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '名称不能为空' },
    { max: 255, message: '长度不能超过255个字符', trigger: 'blur' },
  ],
  status: [{ required: true, message: '启用状态不能为空' }],
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
const submit = debounceAsync(() => onSubmit(), 200, true);
const onSubmit = async () => {
  let validateFormRes = await validateForm(formRef.value);
  if (!validateFormRes) {
    message.error('参数验证错误，请仔细填写表单数据!');
    return;
  }
  SmartLoading.show();
  try {
    if (form.parentId === null) {
      form.parentId = '0';
    }
    let params = _.cloneDeep(form);
    if (params.id) {
      await regionApi.updateRegion(params);
    } else {
      await regionApi.addRegion(params);
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
    }
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
