<!-- 角色 表单 -->
<template>
  <a-modal
    :title="disabled ? '查看' : form.id ? '编辑' : '新增'"
    :width="600"
    :open="modalVisible"
    :get-container="SmartLoading.spin"
    @cancel="onClose"
    :footer="null"
  >
    <a-form ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 4 }" :disabled="disabled">
      <a-form-item label="角色名称" name="roleName">
        <a-input style="width: 100%" placeholder="请输入角色名称" v-model:value="form.roleName" allowClear />
      </a-form-item>
      <a-form-item label="角色编码" name="roleCode">
        <a-input style="width: 100%" placeholder="请输入角色编码" v-model:value="form.roleCode" allowClear />
      </a-form-item>
      <a-form-item label="角色备注">
        <a-input style="width: 100%" placeholder="请输入角色备注" v-model:value="form.roleDesc" allowClear />
      </a-form-item>
      <a-form-item label="角色状态" name="status">
        <a-switch v-model:checked="form.status" checked-value="1" un-checked-value="0" checked-children="启用" un-checked-children="停用" />
      </a-form-item>
    </a-form>

    <div class="footer">
      <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
      <a-button v-if="!disabled" type="primary" @click="submitForm">提交</a-button>
    </div>
  </a-modal>
</template>

<script setup>
  import { message } from 'ant-design-vue';
  import { reactive, ref } from 'vue';
  import { roleApi } from '/src/api/system/role-api';
  import { smartSentry } from '/src/lib/smart-sentry';
  import { SmartLoading } from '/src/components/framework/smart-loading';

  // ----------------------- 以下是字段定义 emits props ---------------------
  let emits = defineEmits(['refresh']);

  defineExpose({
    showModal,
  });

  // ----------------------- modal 显示与隐藏 ---------------------
  const modalVisible = ref(false);
  // 是否可编辑
  const disabled = ref(false);

  function showModal(role, bool) {
    disabled.value = bool;
    Object.assign(form, formDefault);
    if (role) {
      Object.assign(form, role);
    }
    modalVisible.value = true;
  }

  function onClose() {
    Object.assign(form, formDefault);
    modalVisible.value = false;
  }

  // ----------------------- 表单 ---------------------

  const formRef = ref();

  const formDefault = {
    id: undefined,
    roleDesc: undefined,
    roleCode: undefined,
    roleName: undefined,
    status: '1',
  };

  let form = reactive({ ...formDefault });

  // 表单规则
  const rules = {
    roleName: [{ required: true, message: '请输入角色名称' }],
    roleCode: [{ required: true, message: '请输入角色编码' }],
  };

  // 提交表单
  async function submitForm() {
    formRef.value
      .validate()
      .then(async () => {
        SmartLoading.show();
        try {
          if (form.id) {
            await roleApi.updateRole(form);
          } else {
            await roleApi.addRole(form);
          }
          message.info(`${form.id ? '编辑' : '添加'}成功`);
          emits('refresh');
          SmartLoading.hide();
          onClose();
        } catch (e) {
          smartSentry.captureError(e);
        } finally {
          SmartLoading.hide();
        }
      })
      .catch((error) => {
        message.error('参数验证错误，请仔细填写表单数据!');
      });
  }
</script>

<style scoped lang="less">
  .footer {
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: right;
    z-index: 1;
  }
</style>
