<template>
  <a-modal
    :open="visible"
    :title="disabled ? '查看' : form.id ? '编辑' : '新增'"
    :maskClosable="true"
    width="60%"
    centered
    :get-container="SmartLoading.spin"
    @cancel="onClose"
  >
    <a-form ref="formRef" :labelCol="{ span: 4 }" :labelWrap="true" :model="form" :rules="rules" :disabled="disabled">
      <a-row>
        <a-col :span="12">
          <a-form-item label="输入框" name="tableColumn1">
            <a-input v-model:value="form.tableColumn1" placeholder="请输入" allowClear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="选择框" name="tableColumn4">
            <a-select
              v-model:value="form.tableColumn4"
              placeholder="请选择"
              :allowClear="true"
              optionFilterProp="dictName"
              :options="dictMap.sys_dept_type"
              :field-names="{ label: 'dictName', value: 'dictValue' }"
            /> </a-form-item
          ></a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="复选框" name="tableColumn7">
            <a-checkbox-group
              v-model:value="tableColumn7CheckBox"
              @change="
                (val) => {
                  if (val) {
                    form.tableColumn7 = val.join(',');
                  }
                }
              "
            >
              <a-checkbox v-for="item in dictMap.sys_oss_type" :key="item.id" :value="item.dictValue">{{ item.dictName }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="单选框" name="tableColumn8">
            <a-radio-group v-model:value="form.tableColumn8">
              <a-radio v-for="item in dictMap.sys_oss_type" :key="item.id" :value="item.dictValue">{{ item.dictName }}</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="级联选择" name="tableColumn5">
            <a-cascader
              v-model:value="tableColumn5Cascader"
              placeholder="请选择"
              allowClear
              change-on-select
              :field-names="{ label: 'dictName', value: 'dictValue' }"
              :options="dictMap.sys_tree_dict"
              @change="
                (val) => {
                  form.tableColumn5 = val ? val[val.length - 1] : '';
                }
              "
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="树形选择" name="tableColumn6">
            <a-tree-select
              v-model:value="form.tableColumn6"
              placeholder="请选择"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              show-search
              allow-clear
              tree-node-filter-prop="dictName"
              :fieldNames="{ label: 'dictName', value: 'dictValue' }"
              :tree-data="dictMap.sys_tree_dict"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12"
        ><a-form-item label="日期选择" name="tableColumn9">
          <a-date-picker
            v-model:value="form.tableColumn9"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            allowClear
            placeholder="请选择"
            style="width: 100%"
          /> </a-form-item
        ></a-col>
        <a-col :span="12">
          <a-form-item label="时间选择" name="tableColumn10">
            <a-time-picker
              v-model:value="form.tableColumn10"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              placeholder="请选择"
              style="width: 100%"
            /> </a-form-item
          ></a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="开关" name="tableColumn11">
            <a-switch v-model:checked="form.tableColumn11" checked-value="1" un-checked-value="0" /> </a-form-item
          ></a-col>
        <a-col :span="12">
          <a-form-item label="数字框" name="tableColumn14">
            <a-input-number v-model:value="form.tableColumn14" placeholder="请输入" style="width: 100%" allowClear /> </a-form-item
          ></a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="图片上传" :label-col="{ span: 2 }" name="tableColumn13">
            <ImageUpload
              v-model:file-list="form.tableColumn13"
              :show-download="!disabled"
              :show-remove="!disabled"
              :tips="{ content: '请上传 1920 x 1080 大小的图片' }"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="文件上传" :label-col="{ span: 2 }" name="tableColumn12">
            <FileUpload v-model:file-list="form.tableColumn12List" @file-change="(ids) => (form.tableColumn12 = ids)" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="多行文本" :label-col="{ span: 2 }" name="tableColumn3">
            <a-textarea :auto-size="{ minRows: 4 }" v-model:value="form.tableColumn3" placeholder="请输入" allowClear show-count :maxlength="255" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="富文本" :label-col="{ span: 2 }" name="tableColumn2">
            <WangEditor v-model:model-value="form.tableColumn2" :height="200" :read-only="disabled"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template #footer>
      <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
      <a-button v-if="!disabled" style="margin-right: 8px" type="primary" @click="submit()">提交</a-button>
    </template>
  </a-modal>
</template>
<script setup>
import { message } from 'ant-design-vue';
import _ from 'lodash';
import { reactive, ref, watch } from 'vue';
import { genDemoApi } from '/@/api/tools/gen-demo/gen-demo-api.js';
import { smartSentry } from '/@/lib/smart-sentry';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { debounceAsync } from '/@/utils/debounce-util.js';
import { getAncestors } from '/@/utils/dict-util.js';
import FileUpload from '/@/components/file-upload/index.vue';
import ImageUpload from '/@/components/image-upload/index.vue';
import WangEditor from '/@/components/framework/wangeditor/index.vue';

/** 复选框字段特殊处理 */
const tableColumn7CheckBox = ref([]);

/** 级联选择器字段特殊处理 */
const tableColumn5Cascader = ref([]);

// ----------------------- 以下是字段定义 emits props ------------------------
const emit = defineEmits(['reloadList']);
const props = defineProps({
  dictMap: {
    type: Object,
    default: () => {},
  },
});
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
    Object.assign(form, rowData);
  }
  if (form.tableColumn5) {
    tableColumn5Cascader.value = getAncestors(props.dictMap.sys_tree_dict, form.tableColumn5);
  }
  if (form.tableColumn7) {
    tableColumn7CheckBox.value = form.tableColumn7.split(',');
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
  tableColumn1: null,
  tableColumn2: null,
  tableColumn3: null,
  tableColumn4: null,
  tableColumn5: null,
  tableColumn6: null,
  tableColumn7: null,
  tableColumn8: null,
  tableColumn9: null,
  tableColumn10: null,
  tableColumn11: null,
  tableColumn12: null,
  tableColumn13: null,
  tableColumn14: null,
  tableColumn12List: null,
};
let form = reactive({ ...formDefault });
const rules = {
  tableColumn1: [
    { required: true, message: '输入框不能为空' },
    { max: 255, message: '长度不能超过255个字符', trigger: 'blur' },
  ],
  tableColumn2: [
    { required: true, message: '富文本不能为空' },
    { max: 255, message: '长度不能超过255个字符', trigger: 'blur' },
  ],
  tableColumn3: [
    { required: true, message: '多行文本不能为空' },
    { max: 255, message: '长度不能超过255个字符', trigger: 'blur' },
  ],
  tableColumn4: [{ required: true, message: '选择框不能为空' }],
  tableColumn5: [{ required: true, message: '级联选择不能为空' }],
  tableColumn6: [{ required: true, message: '树形选择不能为空' }],
  tableColumn7: [{ required: true, message: '复选框不能为空' }],
  tableColumn8: [{ required: true, message: '单选框不能为空' }],
  tableColumn9: [{ required: true, message: '日期选择不能为空' }],
  tableColumn10: [{ required: true, message: '时间选择不能为空' }],
  tableColumn11: [{ required: true, message: '开关不能为空' }],
  tableColumn12: [{ required: true, message: '文件上传不能为空' }],
  tableColumn13: [{ required: true, message: '图片上传不能为空' }],
  tableColumn14: [{ required: true, message: '数字框不能为空' }],
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
      await genDemoApi.updateGenDemo(params);
    } else {
      await genDemoApi.addGenDemo(params);
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
