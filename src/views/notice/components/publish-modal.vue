<template>
  <a-modal centered :open="visible" title="发布通知公告" :maskClosable="true" :width="600" @cancel="onClose" @ok="onSubmit">
    <a-form ref="formRef" :labelCol="{ span: 3 }" :labelWrap="true" :model="form" :rules="rules">
      <a-form-item label="发布类型" name="type">
        <a-radio-group v-model:value="form.releaseType" button-style="solid" @change="releaseTypeChange">
          <a-radio-button v-for="item in dictMap.sys_release_type" :key="item.id" :value="item.dictValue">
            {{ item.dictName }}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
          v-if="form.releaseType === '1'"
          label="机构" name="releaseValueFormat">
        <a-tree-select
            v-model:value="form.releaseValueFormat"
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
            :tree-data="allDept"
        />
      </a-form-item>
      <a-form-item
          v-if="form.releaseType === '2'"
          label="岗位" name="releaseValueFormat">
        <a-select
            v-model:value="form.releaseValueFormat"
            mode="multiple"
            allowClear
            :options="allPost"
            :field-names="{ label: 'postName', value: 'id' }"
            :showSearch="true"
            optionFilterProp="postName"
            placeholder="请选择岗位"
        />
      </a-form-item>
      <a-form-item
          v-if="form.releaseType === '3'"
          label="角色" name="releaseValueFormat">
        <a-select
            v-model:value="form.releaseValueFormat"
            mode="multiple"
            allowClear
            :options="allRole"
            :field-names="{ label: 'roleName', value: 'id' }"
            :showSearch="true"
            optionFilterProp="roleName"
            placeholder="请选择角色"
        />
      </a-form-item>
      <a-form-item
          v-if="form.releaseType === '4'"
          label="人员" name="releaseValueFormat">
        <a-select
            v-model:value="form.releaseValueFormat"
            mode="multiple"
            allowClear
            :options="allUser"
            :field-names="{ label: 'nickname', value: 'id' }"
            :showSearch="true"
            optionFilterProp="nickname"
            placeholder="请选择人员"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import {message} from 'ant-design-vue';
import _ from 'lodash';
import {reactive, ref, watch} from 'vue';
import {smartSentry} from '/@/lib/smart-sentry';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {SHOW_ALL} from "ant-design-vue/es/vc-tree-select/index.js";
import {noticeApi} from "/@/api/notice/notice-api.js";

// ----------------------- 以下是字段定义 emits props ------------------------
const emit = defineEmits(['reloadList']);
const props = defineProps({
  dictMap: {
    type: Object,
    default: () => {
    },
  },
  allDept: {
    type: Array,
    default: () => [],
  },
  allPost: {
    type: Array,
    default: () => [],
  },
  allRole: {
    type: Array,
    default: () => [],
  },
  allUser: {
    type: Array,
    default: () => [],
  }
});
// ----------------------- 展开、隐藏编辑窗口 ------------------------
const visible = ref(false);

async function showDrawer(rowData) {
  Object.assign(form, formDefault);
  if (rowData && !_.isEmpty(rowData)) {
    form.noticeId = rowData.id
  }
  visible.value = true;
}

function onClose() {
  visible.value = false;
}

// ----------------------- form表单相关操作 ------------------------

const formRef = ref();
const formDefault = {
  noticeId: null,
  releaseType: '1',
  releaseValue: null,
  releaseValueFormat: [],
};
let form = reactive({...formDefault});
const rules = {
  releaseValueFormat: [{required: true, message: '请选择发布对象'}]
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

const onSubmit = async () => {
  let validateFormRes = await validateForm(formRef.value);
  if (!validateFormRes) {
    message.error('参数验证错误，请仔细填写表单数据!');
    return;
  }
  SmartLoading.show();
  try {
    let params = _.cloneDeep(form);
    params.releaseValue = params.releaseValueFormat ? params.releaseValueFormat.join(',') : null;
    await noticeApi.publishNotice(params);
    message.success(`发布成功`);
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

function releaseTypeChange() {
  form.releaseValueFormat = []
  form.releaseValue = null
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
