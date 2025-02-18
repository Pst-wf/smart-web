<template>
  <div>
    <a-drawer
        :body-style="{ paddingBottom: '80px' }"
        :maskClosable="true"
        :title="disabled ? '查看' : form.id ? '编辑' : '新增'"
        :open="visible"
        :width="600"
        @close="onClose"
    >
      <a-form ref="formRef" :labelCol="{ span: 4 }" :labelWrap="true" :model="form" :rules="rules" :disabled="disabled">
        <a-form-item label="字典名称" name="dictName">
          <a-input v-model:value="form.dictName" placeholder="请输入字典名称" allowClear/>
        </a-form-item>
        <a-form-item label="字典编码" name="dictCode">
          <a-input v-model:value="form.dictCode" placeholder="请输入字典编码" allowClear/>
        </a-form-item>
        <a-form-item label="排序" name="sort">
          <a-input-number v-model:value="form.sort" style="width: 100%" allowClear/>
        </a-form-item>
        <div v-if="form.id">
          <a-button @click="showModal(form.id)" :disabled="false">字典设置</a-button>
        </div>
      </a-form>
      <div class="footer">
        <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
        <a-button v-if="!disabled" style="margin-right: 8px" type="primary" @click="submit()">提交</a-button>
      </div>
    </a-drawer>
    <DictValuesModal ref="dictValuesModal"/>
  </div>
</template>
<script setup>
import {message} from 'ant-design-vue';
import _ from 'lodash';
import {reactive, ref, watch} from 'vue';
import {dictApi} from '/@/api/system/dict-api.js';
import {smartSentry} from '/@/lib/smart-sentry';
import {SmartLoading} from '/@/components/framework/smart-loading';
import DictValuesModal from './dict-values-modal.vue';
import {debounceAsync} from "/@/utils/debounce-util.js";


// ----------------------- 以下是字段定义 emits props ------------------------
const emit = defineEmits(['reloadList']);
const props = defineProps({
  dictType: {
    type: String,
    required: true
  }
});

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
  dictName: null,
  dictCode: null,
  dictType: props.dictType,
  sort: null,
};
let form = reactive({...formDefault});
const rules = {
  dictName: [
    {required: true, message: '字典名称不能为空'}
  ],
  dictCode: [
    {required: true, message: '字典编号不能为空'}
  ],
  sort: [
    {required: true, message: '排序不能为空'}
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
      await dictApi.updateDict(params);
    } else {
      await dictApi.addDict(params);
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
const dictValuesModal = ref();

function showModal(id) {
  dictValuesModal.value.showModal(id, disabled.value)
}

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

