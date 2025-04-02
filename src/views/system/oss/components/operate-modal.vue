<template>
  <a-drawer
      :body-style="{ paddingBottom: '80px' }"
      :maskClosable="true"
      :title="disabled ? '查看' : form.id ? '编辑' : '新增'"
      :open="visible"
      :width="600"
      :get-container="SmartLoading.spin"
      @close="onClose"
  >
    <a-form ref="formRef" :labelCol="{ span: 4 }" :labelWrap="true" :model="form" :rules="rules" :disabled="disabled">
      <a-form-item label="存储类型" name="ossType">
        <a-select
            v-model:value="form.ossType"
            placeholder="请选择存储类型"
            :allowClear="true"
            optionFilterProp="dictName"
            :options="dictMap.sys_oss_type"
            :field-names="{ label: 'dictName', value: 'dictValue' }"
            @change="ossTypeChange"
        />
      </a-form-item>
      <a-form-item v-if="form.ossType !== '0'" label="地址" name="ossHost">
        <a-input v-model:value="form.ossHost" placeholder="请输入地址" allowClear />
      </a-form-item>
      <a-form-item v-if="form.ossType !== '0'" label="key" name="accessKey">
        <a-input v-model:value="form.accessKey" placeholder="请输入key" allowClear />
      </a-form-item>
      <a-form-item v-if="form.ossType !== '0'" label="secret" name="accessSecret">
        <a-input v-model:value="form.accessSecret" placeholder="请输入secret" allowClear />
      </a-form-item>
      <a-form-item :label="form.ossType !== '0' ? '桶名' : '访问相对路径'" name="bucket">
        <a-input v-model:value="form.bucket" :placeholder="form.ossType !== '0' ? '请输入桶名' : '请输入访问相对路径'" allowClear />
      </a-form-item>
      <a-form-item label="目录" name="ossDir">
        <a-input v-model:value="form.ossDir" placeholder="请输入目录" allowClear />
      </a-form-item>
      <a-form-item v-if="form.ossType !== '0'" label="地区" name="region">
        <a-input v-model:value="form.region" placeholder="请输入地区" allowClear />
      </a-form-item>
    </a-form>
    <div class="footer">
      <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
      <a-button v-if="!disabled" style="margin-right: 8px" type="primary" @click="submit()">提交</a-button>
    </div>
  </a-drawer>
</template>
<script setup>
import { message } from 'ant-design-vue';
import _ from 'lodash';
import { reactive, ref, watch } from 'vue';
import { ossApi } from '/@/api/system/oss-api.js';
import { smartSentry } from '/@/lib/smart-sentry';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { debounceAsync } from '/@/utils/debounce-util.js';

// ----------------------- 以下是字段定义 emits props ------------------------
const emit = defineEmits(['reloadList']);
const props = defineProps({
  dictMap: {
    type: Object,
    default: () => {},
  },
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
  ossType: null,
  ossHost: null,
  accessKey: null,
  accessSecret: null,
  bucket: null,
  ossStatus: '0',
  ossDir: null,
  region: null,
};
let form = reactive({ ...formDefault });
const rules = {
  ossType: [{ required: true, message: '存储类型不能为空' }],
  ossHost: [{ max: 50, message: '长度不能超过50个字符', trigger: 'blur' }],
  accessKey: [{ max: 255, message: '长度不能超过255个字符', trigger: 'blur' }],
  accessSecret: [{ max: 255, message: '长度不能超过255个字符', trigger: 'blur' }],
  bucket: [{ max: 100, message: '长度不能超过100个字符', trigger: 'blur' }],
  ossDir: [{ max: 2000, message: '长度不能超过2000个字符', trigger: 'blur' }],
  region: [{ max: 255, message: '长度不能超过255个字符', trigger: 'blur' }],
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
    let params = _.cloneDeep(form);
    if (params.id) {
      await ossApi.updateOss(params);
    } else {
      await ossApi.addOss(params);
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

/** 类型切换 */
function ossTypeChange() {
  form.ossHost = null;
  form.accessKey = null;
  form.accessSecret = null;
  form.bucket = null;
  form.ossDir = null;
  form.region = null;
}

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
