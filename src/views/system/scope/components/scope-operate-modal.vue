<template>
  <a-modal
      :open="visible"
      :title="disabled ? '查看' : form.id ? '编辑' : '新增'"
      :maskClosable="true"
      :width="960"
      @cancel="onClose"
  >
    <a-form ref="formRef" :labelCol="{ span: 4 }" :labelWrap="true" :model="form" :rules="rules" :disabled="disabled">
      <a-form-item label="数据权限名称" name="scopeName">
        <a-input v-model:value="form.scopeName" placeholder="请输入数据权限名称"/>
      </a-form-item>
      <a-form-item label="数据权限类型" name="scopeType">
        <a-select v-model:value="form.scopeType" placeholder="请选择数据权限类型" @change="scopeTypeChange">
          <a-select-option v-for="item in SCOPE_TYPE_ENUM" :key="item.value" :title="item.desc">{{
              item.desc
            }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="数据权限类名" name="scopeClass">
        <a-input v-model:value="form.scopeClass" placeholder="请输入数据权限类名"/>
      </a-form-item>
      <a-form-item
          v-if="form.scopeType === '1' || form.scopeType === '2' || form.scopeType === '3'"
          label="数据权限字段" name="scopeField">
        <a-input v-model:value="form.scopeField" placeholder="请输入数据权限字段"/>
      </a-form-item>
      <a-form-item
          v-if="form.scopeType === '6'"
          label="数据权限sql" name="scopeSql">
        <a-textarea :rows="3" v-model:value="form.scopeSql" placeholder="请输入数据权限sql"/>
      </a-form-item>
      <a-form-item
          v-if="form.scopeType === '4'"
          label="可见范围" name="visibilityValue">
        <a-select
            v-model:value="form.visibilityValue"
            mode="tags"
            allowClear
            :options="userData"
            :field-names="{ label: 'nickname', value: 'id' }"
            :showSearch="true"
            optionFilterProp="nickname"
            placeholder="请选择人员"
        />
      </a-form-item>
      <a-form-item
          v-if="form.scopeType === '5'"
          label="可见范围" name="visibilityValue">
        <a-tree-select
            v-model:value="form.visibilityValue"
            show-search
            multiple
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择机构"
            allow-clear
            :show-checked-strategy="SHOW_ALL"
            :showSearch="true"
            tree-node-filter-prop="deptName"
            :fieldNames="{label:'deptName', value:'id'}"
            :tree-data="deptData"
        />
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
import {scopeApi} from '/@/api/system/scope-api.js';
import {smartSentry} from '/@/lib/smart-sentry';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {SCOPE_TYPE_ENUM} from "/@/constants/system/scope-const.js";
import {SHOW_ALL} from "ant-design-vue/es/vc-tree-select/index.js";
import {debounceAsync} from "/@/utils/debounce-util.js";


// ----------------------- 以下是字段定义 emits props ------------------------
// emit
const emit = defineEmits(['reloadList']);

// ----------------------- 展开、隐藏编辑窗口 ------------------------

// 是否展示抽屉
const visible = ref(false);
// 是否可编辑
const disabled = ref(false);
//展开编辑窗口
async function showModal(rowData, bool) {
  disabled.value = bool
  Object.assign(form, formDefault);
  if (rowData && !_.isEmpty(rowData)) {
    Object.assign(form, rowData);
    scopeTypeValue.value = rowData.scopeType;
  }
  visible.value = true;
}

// 隐藏窗口
function onClose() {
  Object.assign(form, formDefault);
  formRef.value.resetFields();
  visible.value = false;
}

// ----------------------- form表单相关操作 ------------------------

const formRef = ref();
const formDefault = {
  id: undefined,
  menuId: undefined,
  scopeName: '',
  scopeField: '',
  scopeClass: '',
  scopeType: '1',
  scopeSql: '',
  visibilityIds: '',
  visibilityValue: []
};
let form = reactive({...formDefault});

const rules = {
  scopeName: [{required: true, message: '数据权限名称不能为空'}],
  scopeType: [{required: true, message: '数据权限类型不能为空'}],
  scopeClass: [{required: true, message: '数据权限类名不能为空'}],
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
    if (params.visibilityValue && params.visibilityValue.length > 0) {
      params.visibilityIds = params.visibilityValue.join(",")
    } else {
      params.visibilityIds = ''
    }
    if (params.id) {
      await scopeApi.updateScope(params);
    } else {
      await scopeApi.addScope(params);
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

const scopeTypeValue = defineModel('scopeTypeValue', {default: '1'});

function scopeTypeChange(val) {
  if (scopeTypeValue.value !== val) {
    form.scopeField = '';
    form.scopeSql = '';
    form.visibilityValue = [];
    form.visibilityIds = '';
  }
  scopeTypeValue.value = val;
}

const userData = ref();
const deptData = ref();
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
  userData,
  deptData,
  showModal,
});
</script>
<style lang="less" scoped>
//.footer {
//  position: absolute;
//  right: 0;
//  bottom: 0;
//  width: 100%;
//  border-top: 1px solid #e9e9e9;
//  padding: 10px 16px;
//  background: #fff;
//  text-align: left;
//  z-index: 1;
//}
</style>
