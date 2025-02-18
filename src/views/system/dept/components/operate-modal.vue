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
      <a-form-item label="父级机构">
        <a-tree-select
            v-model:value="form.parentId"
            :fieldNames="{ label: 'label', key: 'id', value: 'id' }"
            :treeData="treeData"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择机构"
            allow-clear
            treeNodeFilterProp="label"
        />
      </a-form-item>
      <a-form-item label="机构名称" name="deptName">
        <a-input v-model:value="form.deptName" placeholder="请输入机构名称" allowClear/>
      </a-form-item>
      <a-form-item label="机构编号" name="deptCode">
        <a-input v-model:value="form.deptCode" placeholder="请输入机构编号" allowClear/>
      </a-form-item>

      <a-form-item label="机构类型" name="deptType">
        <a-radio-group v-model:value="form.deptType" button-style="solid">
          <a-radio-button v-for="item in DEPT_TYPE_ENUM" :key="item.value" :value="item.value">
            {{ item.desc }}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="排序" name="sort">
        <a-input-number v-model:value="form.sort" :min="0" placeholder="请输入排序" style="width: 100%" allowClear/>
      </a-form-item>
      <a-form-item label="机构状态" name="status">
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
import {deptApi} from '/@/api/system/dept-api.js';
import {smartSentry} from '/@/lib/smart-sentry';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {DEPT_DEFAULT_PARENT_ID, DEPT_TYPE_ENUM} from "/@/constants/system/dept-const.js";
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
async function showDrawer(rowData, bool) {
  disabled.value = bool;
  Object.assign(form, formDefault);
  if (rowData && !_.isEmpty(rowData)) {
    Object.assign(form, rowData);
    if (form.parentId === DEPT_DEFAULT_PARENT_ID) {
      form.parentId = null;
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
  parentId: '0',
  deptName: null,
  deptCode: null,
  deptType: DEPT_TYPE_ENUM.DEPT_TYPE_1.value,
  status: '1',
  sort: 0
};
let form = reactive({...formDefault});

const rules = {
  deptType: [{required: true, message: '机构类型不能为空'}],
  deptCode: [
    {required: true, message: '机构编号不能为空'},
  ],
  deptName: [
    {required: true, message: '机构名称不能为空'},
    {max: 20, message: '机构名称不能大于20个字符', trigger: 'blur'},
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
    // 若无父级ID 默认设置为0
    if (!params.parentId) {
      params.parentId = '0';
    }
    if (params.id) {
      await deptApi.updateDept(params);
    } else {
      await deptApi.addDept(params);
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

let treeData = ref([]);

async function queryDeptTree() {
  let res = await deptApi.deptTreeFormat();
  treeData.value = res.data;
}

watch(
    () => visible.value,
    (val) => {
      if (val) {
        queryDeptTree();
      } else {
        formRef.value.resetFields();
        treeData.value = []
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
