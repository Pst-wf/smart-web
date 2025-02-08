<template>
  <a-drawer
      :body-style="{ paddingBottom: '80px' }"
      :maskClosable="true"
      :title="disabled ? '查看' : form.id ? '编辑' : '新增'"
      :open="visible"
      width="50%"
      @close="onClose"
  >
    <a-form ref="formRef" :labelCol="{ span: 2 }" :labelWrap="true" :model="form" :rules="rules" :disabled="disabled">
      <a-row>
        <a-col :span="24">
          <a-form-item label="值类型" name="valueType">
            <a-radio-group @change="() => form.value = ''" v-model:value="form.valueType">
              <a-radio-button value="string">字符串</a-radio-button>
              <a-radio-button value="object">json</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="键" name="key" :labelCol="{span :4}">
            <a-input v-model:value="form.key" placeholder="请输入键"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="有效期" name="expire" :labelCol="{span :4}">
            <a-input-number v-model:value="form.expire" :min="1" placeholder="请输入有效期" style="width: 100%"
                            addon-after="秒"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="值" name="value">
            <JsonEditorVue v-if="form.valueType === 'object'"
                           :modelValue="form.value"
                           :modeList="couldView"
                           :currentMode="'tree'"
                           language="zh-CN"
                           @update:modelValue="updateModelValue"/>
            <a-textarea v-else v-model:value="form.value" placeholder="请输入值"/>
          </a-form-item>
        </a-col>
      </a-row>
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
import {redisApi} from '/@/api/system/redis-api.js';
import {smartSentry} from '/@/lib/smart-sentry';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {debounceAsync} from "/@/utils/debounce-util.js";
import JsonEditorVue from 'json-editor-vue3';

const couldView = ref(["tree", "code", "form", "view"])
// ----------------------- 以下是字段定义 emits props ------------------------
// emit
const emit = defineEmits(['reloadList']);

// ----------------------- 展开、隐藏编辑窗口 ------------------------

// 是否展示抽屉
const visible = ref(false);
// 是否可编辑
const disabled = ref(false);

//展开编辑窗口
async function showDrawer(rowData, bool) {
  disabled.value = bool;
  Object.assign(form, formDefault);
  if (rowData && !_.isEmpty(rowData)) {
    if (rowData.expire === null) {
      rowData.expire = 0
    }
    Object.assign(form, rowData);
    if (form.expire > 0) {
      startCountdown();
    }
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
  id: null,
  key: '',
  value: '',
  expire: 0,
  className: null,
  valueType: 'string'
};
let form = reactive({...formDefault});

const rules = {
  key: [{required: true, message: '键不能为空'}],
  value: [
    {required: true, message: '值不能为空'},
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
    await redisApi.saveOrUpdateRedis(params);
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

const intervalId = ref(undefined);

// 开始倒数的方法
const startCountdown = () => {
  console.log('form.expire', form.expire)
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
  intervalId.value = setInterval(() => {
    console.log("form.expire", form.expire)
    if (form.expire <= 0) {
      clearInterval(intervalId.value);
      return;
    }
    form.expire--;
  }, 1000);
};

const updateModelValue = (val) => {
  console.log(val, "修改了值");
}


watch(
    () => visible.value,
    (val) => {
      if (!val) {
        formRef.value.resetFields();
        if (intervalId.value) {
          clearInterval(intervalId.value);
        }
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
