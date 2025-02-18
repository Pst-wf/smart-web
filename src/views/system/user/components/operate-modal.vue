<template>
  <a-drawer
      :body-style="{ paddingBottom: '80px' }"
      :maskClosable="true"
      :title="disabled ? '查看' : form.id ? '编辑' : '新增'"
      :open="visible"
      :width="960"
      @close="onClose"
  >
    <a-form ref="formRef" :labelCol="{ span: 2 }" :labelWrap="true" :model="form" :rules="rules" :disabled="disabled">
      <a-divider orientation="left">基本信息</a-divider>
      <a-form-item label="姓名" name="nickname">
        <a-input v-model:value="form.nickname" placeholder="请输入姓名" allowClear/>
      </a-form-item>
      <a-form-item label="电话" name="phone">
        <a-input v-model:value="form.phone" placeholder="请输入电话" allowClear/>
      </a-form-item>
      <a-form-item label="账号" name="username">
        <a-input v-model:value="form.username" placeholder="请输入账号" allowClear/>
      </a-form-item>
      <a-form-item label="密码" name="password">
        <a-input-password v-model:value="form.password" placeholder="请输入密码" allowClear/>
      </a-form-item>
      <a-form-item label="角色" name="roles" v-if="configData && configData === '0'">
        <a-select
            v-model:value="form.role"
            allowClear
            :options="roleData"
            :field-names="{ label: 'roleName', value: 'id' }"
            :showSearch="true"
            optionFilterProp="roleName"
            placeholder="请选择角色"
            style="margin: -5px 0;width: 100%"
        />
      </a-form-item>
      <a-form-item label="状态" name="userStatus">
        <a-switch v-model:checked="form.userStatus" checked-value="1" un-checked-value="0" checked-children="启用"
                  un-checked-children="停用"/>
      </a-form-item>
      <a-divider orientation="left" v-if="!configData || configData === '1'">身份信息</a-divider>
      <a-card class="card-class" size="small" :bordered="false" :hoverable="false" v-if="!configData || configData === '1'">
        <a-row class="smart-table-btn-block">
          <div class="smart-table-operate-block">
            <a-button v-privilege="'user:add'" type="primary" size="small" @click="addRow">
              <template #icon>
                <PlusOutlined/>
              </template>
              新增
            </a-button>
          </div>
        </a-row>
        <a-table :columns="identityColumns" :data-source="form.identityList" bordered size="small" :pagination="false">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'deptAncestors'">
              <a-form-item class="table-cell-class" :key="`deptAncestors-${index}`" :name="['identityList', index, 'deptAncestors']"
                           :rules="{ required: true,  message: '组织机构不能为空' }">
                <a-cascader
                    v-model:value="record[column.dataIndex]"
                    allowClear
                    change-on-select
                    :show-search="{ filter }"
                    :options="deptData"
                    :field-names="{ label: 'deptName', value: 'id' }"
                    placeholder="请选择部门"
                    style="margin: -5px 0;width: 100%"
                />
              </a-form-item>
            </template>
            <template v-if="column.dataIndex === 'postId'">
              <a-form-item class="table-cell-class" :key="`postId-${index}`" :name="['identityList', index, 'postId']"
                           :rules="{ required: true,  message: '岗位不能为空' }">
                <a-select
                    v-model:value="record[column.dataIndex]"
                    allowClear
                    :options="postData"
                    :field-names="{ label: 'postName', value: 'id' }"
                    :showSearch="true"
                    optionFilterProp="postName"
                    placeholder="请选择岗位"
                    style="margin: -5px 0;width: 100%"
                />
              </a-form-item>
            </template>
            <template v-if="column.dataIndex === 'roleId'">
              <a-form-item class="table-cell-class" :key="`roleId-${index}`" :name="['identityList', index, 'roleId']"
                           :rules="{ required: true,  message: '角色不能为空' }">
                <a-select
                    v-model:value="record[column.dataIndex]"
                    allowClear
                    :options="roleData"
                    :field-names="{ label: 'roleName', value: 'id' }"
                    :showSearch="true"
                    optionFilterProp="roleName"
                    placeholder="请选择角色"
                    style="margin: -5px 0;width: 100%"
                />
              </a-form-item>
            </template>
            <template v-if="column.dataIndex === 'operate'">
              <div class="editable-row-operations">
                <a-button danger type="link" @click="removeRow(record.id)">删除</a-button>
              </div>
            </template>
          </template>
        </a-table>
      </a-card>
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
import {userApi} from '/@/api/system/user-api.js';
import {smartSentry} from '/@/lib/smart-sentry';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {identityColumns} from "/@/views/system/user/columns.js";
import {encryptData} from "/@/utils/crypto-util.js";
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
    if (form.passwordBase) {
      form.password = encryptData(form.passwordBase);
    }
  }
  visible.value = true;
}

async function onClose() {
  Object.assign(form, formDefault);
  formRef.value.resetFields();
  visible.value = false;
}

// ----------------------- form表单相关操作 ------------------------

const formRef = ref();
const formDefault = {
  id: null,
  nickname: null,
  phone: null,
  username: null,
  password: null,
  userStatus: '1',
  identityList: [],
  deleteIds: [],
  role: null,
};
let form = reactive({...formDefault});
const rules = {
  nickname: [
    {required: true, message: '姓名不能为空'},
  ],
  username: [
    {required: true, message: '账号不能为空'},
  ],
  role: [
    {required: true, message: '角色不能为空'},
  ],
  password: [
    {required: true, message: '密码不能为空'},
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
    if (params.identityList) {
      params.identityList.forEach(identity => {
        if (identity.deptAncestors && identity.deptAncestors.length > 0) {
          identity.deptId = identity.deptAncestors[identity.deptAncestors.length - 1];
        } else {
          identity.deptId = null
        }
        identity.deptAncestors = null
      })
    }
    if (params.id) {
      await userApi.updateUser(params);
    } else {
      await userApi.addUser(params);
    }
    message.success(`${params.id ? '修改' : '新增'}成功`);
    SmartLoading.hide();
    await onClose();
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
        formDefault.identityList = []
        formDefault.deleteIds = []
      }
    },
);
// ----------------------- 可编辑表单 -----------------------
const deptData = ref([])
const postData = ref([])
const roleData = ref([])
const configData = ref('1')

// 级联选择器过滤
const filter = (inputValue, path) => {
  return path.some(option => option.deptName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
};

// 增行
function addRow() {
  const length = form.identityList.length;
  form.identityList.push({
    id: `isNew_${length + 1}`,
    roleId: null,
    deptId: null,
    postId: null,
    deptAncestors: []
  })
}

// 删除
function removeRow(id) {
  if (id && !id.includes('isNew')) {
    form.deleteIds.push(id);
  }
  form.identityList = form.identityList.filter(item => item.id !== id);
}

// ----------------------- 以下是暴露的方法内容 ------------------------
defineExpose({
  deptData,
  postData,
  roleData,
  configData,
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
.table-cell-class {
  margin-bottom: 0 !important;
}
.card-class{
  box-shadow: none;
  padding: 0 0 0 26px
}
:deep(.card-class) .ant-card-body{
  padding: 0 !important;
}
</style>
