<template>
  <div class="center-container">
    <!--  页面标题-->
    <div class="header-title">个人中心</div>

    <!--  内容区域-->
    <div class="center-form-area">
      <a-row>
        <a-col flex="350px">
          <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
            <a-form-item label="登录账号" name="username">
              <a-input class="form-item" v-model:value.trim="form.username" placeholder="请输入登录账号" disabled />
            </a-form-item>
            <a-form-item label="用户名称" name="nickname">
              <a-input class="form-item" v-model:value.trim="form.nickname" placeholder="请输入用户名称" />
            </a-form-item>
            <a-form-item label="手机号码" name="phone">
              <a-input class="form-item" v-model:value.trim="form.phone" placeholder="请输入手机号码" />
            </a-form-item>
            <a-form-item label="备注" name="remarks">
              <a-textarea class="form-item" v-model:value="form.remarks" placeholder="请输入备注" :rows="4" />
            </a-form-item>
          </a-form>
          <a-button type="primary" @click="onSubmit">更新个人信息</a-button>
        </a-col>
        <a-col flex="auto">
          <a-flex vertical align="center" :gap="18" class="right-class">
            <a-image v-if="form.avatar" style="border-radius: 50%" :width="200" :height="200" :src="avatarShow" />
            <a-button type="primary" @click="openModal">点击上传</a-button>
          </a-flex>
        </a-col>
      </a-row>
    </div>
    <AvatarModal ref="avatarModal" v-model:file-urls="form.avatar" />
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, computed } from 'vue';
import { regular } from '/@/constants/regular-const.js';
import { loginApi } from '/@/api/system/login-api.js';
import { useUserStore } from '/@/store/modules/system/user.js';
import { message } from 'ant-design-vue';
import { smartSentry } from '/@/lib/smart-sentry.js';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';
import { userApi } from '/@/api/system/user-api.js';
import AvatarModal from '/@/components/avatar-modal/index.vue';
import { fileUtil } from '/@/utils/file-util.js';

// 组件ref
const formRef = ref();

const formDefault = {
  // 员工ID
  id: undefined,
  // 头像
  avatar: undefined,
  // 登录账号
  username: '',
  // 员工名称
  nickname: '',
  // 手机号码
  phone: '',
  // 备注
  remarks: '',
};
let form = reactive({ ...formDefault });
const rules = {
  nickname: [
    { required: true, message: '姓名不能为空' },
    { max: 30, message: '姓名不能大于30个字符', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '手机号不能为空' },
    { pattern: regular.phone, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
};

// 查询登录信息
async function getLoginInfo() {
  try {
    SmartLoading.show();
    //获取登录用户信息
    const res = await loginApi.getUserInfo();
    let data = res.data;
    const routeRes = await loginApi.getUserRoutes();
    data.userRoutes = routeRes.data.routes;
    //更新用户信息到pinia
    useUserStore().setUserLoginInfo(data);
    // 当前form展示
    form.id = data.id;
    form.username = data.username;
    form.nickname = data.nickname;
    form.phone = data.phone;
    form.remarks = data.remarks;
    form.avatar = data.avatar;
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    SmartLoading.hide();
  }
}

// 更新员工信息
async function updateEmployee() {
  SmartLoading.show();
  try {
    await userApi.updateInfo(form);
    message.success('更新成功');
    // 重新获取详情，刷新整体缓存
    await getLoginInfo();
  } catch (error) {
    smartSentry.captureError(error);
  } finally {
    SmartLoading.hide();
  }
}

// 表单提交
function onSubmit() {
  formRef.value
      .validate()
      .then(() => {
        updateEmployee();
      })
      .catch((error) => {
        console.log('error', error);
        message.error('参数验证错误，请仔细填写表单数据!');
      });
}
const avatarShow = computed(() => fileUtil.fileUrlFormat(form.avatar));

const avatarModal = ref();
function openModal() {
  avatarModal.value.showModal();
}
onMounted(() => {
  getLoginInfo();
});
</script>
<style lang="less" scoped>
.center-container {
  .header-title {
    font-size: 20px;
  }

  .center-form-area {
    margin-top: 20px;
  }

  .right-class {
    width: 40%;
  }
  :deep(.right-class .ant-image-mask) {
    border-radius: 50% !important;
  }
}
</style>
