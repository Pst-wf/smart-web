<template>
  <div class="login-container">
    <div class="box-item desc">
      <div class="welcome">
        <p>欢迎登录 {{ title }}</p>
      </div>
      <img class="welcome-img" :src="leftBg2" />
    </div>
    <div class="box-item login right-class">
      <div class="login-title">账号登录</div>
      <a-form ref="formRef" class="login-form" :model="loginForm" :rules="rules">
        <a-form-item name="username">
          <a-input v-model:value.trim="loginForm.username" placeholder="请输入用户名" allowClear/>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password
            v-model:value="loginForm.password"
            autocomplete="on"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            allowClear
          />
        </a-form-item>
        <a-form-item name="captchaCode">
          <a-input class="captcha-input" v-model:value.trim="loginForm.captchaCode" placeholder="请输入验证码" allowClear/>
          <img class="captcha-img" :src="captchaBase64Image" @click="getCaptcha" />
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="rememberPwd" @change="remember">记住密码</a-checkbox>
          <span>( 账号：system, 密码：123456 )</span>
        </a-form-item>
        <a-form-item>
          <a-button class="btn" @click="debounce(onLogin(), 500)" :loading="loading" :disabled="loading">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
    <choose-identity ref="chooseIdentity" :data="rowData" @choose="(identityId) => chooseLogin(identityId)" />
  </div>
</template>
<script setup>
  import { message } from 'ant-design-vue';
  import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { loginApi } from '/@/api/system/login-api';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { LOGIN_DEVICE_ENUM } from '/@/constants/system/login-device-const';
  import { useUserStore } from '/@/store/modules/system/user';
  import leftBg2 from '/@/assets/images/login/left-smart-bg.png';

  import { buildRoutes } from '/@/router/index';
  import { smartSentry } from '/@/lib/smart-sentry';
  import { localClear, localRead, localRemove, localSave } from '/@/utils/local-util.js';
  import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';
  import localStorageKeyConst from '/@/constants/local-storage-key-const.js';
  import localKey from '/@/constants/local-storage-key-const.js';
  import ChooseIdentity from '/@/components/login/choose-identity/index.vue';
  import { useAppConfigStore } from '/@/store/modules/system/app-config.js';
  import { debounce } from '/@/utils/debounce-util.js';
  import { appDefaultConfig } from '/@/config/app-config.js';
  import { userConfigApi } from '/@/api/system/user-config-api.js';

  //--------------------- 登录表单 ---------------------------------

  const loginForm = reactive({
    userType: 'pc',
    tenantId: '000000',
    username: '',
    password: '',
    grant_type: 'password',
    captchaCode: '',
    captchaUuid: '',
    loginDevice: LOGIN_DEVICE_ENUM.PC.value,
  });
  const rules = {
    username: [{ required: true, message: '用户名不能为空' }],
    password: [{ required: true, message: '密码不能为空' }],
    captchaCode: [{ required: true, message: '验证码不能为空' }],
  };

  const showPassword = ref(false);
  const router = useRouter();
  const formRef = ref();
  const loading = ref(false);
  const rememberPwd = ref(false);
  const title = computed(() => useAppConfigStore().$state.websiteName);

  onMounted(() => {
    getCaptcha();
    document.onkeyup = (e) => {
      if (e.key === 'Enter') {
        onLogin();
      }
    };
  });

  onUnmounted(() => {
    document.onkeyup = null;
  });
  const rowData = ref([]);
  const chooseIdentity = ref();

  //登录
  async function onLogin() {
    formRef.value.validate().then(async () => {
      try {
        SmartLoading.show();
        loading.value = true;
        // 密码加密
        let encryptPasswordForm = Object.assign({}, loginForm, {
          password: loginForm.password,
        });
        const res = await loginApi.login(encryptPasswordForm);
        if (res.data?.identityList?.length === 0) {
          localClear(LocalStorageKeyConst.USER_TOKEN);
          localClear(LocalStorageKeyConst.IDENTITY_ID);
          localClear(LocalStorageKeyConst.REFRESH_TOKEN);
          localClear(LocalStorageKeyConst.USER_INFO);
          localClear(LocalStorageKeyConst.ROUTERS);
          message.error('用户身份信息为空');
          return;
        }
        if (res.data?.identityList?.length > 1) {
          rowData.value = res.data?.identityList;
          chooseIdentity.value.openModal();
          return;
        }
        const loginUser = res.data;
        localSave(LocalStorageKeyConst.USER_TOKEN, loginUser.accessToken ? loginUser.accessToken : '');
        localSave(LocalStorageKeyConst.IDENTITY_ID, loginUser.identityId ? loginUser.identityId : '');
        localSave(LocalStorageKeyConst.REFRESH_TOKEN, loginUser.refreshToken ? loginUser.refreshToken : '');

        if (rememberPwd.value) {
          localSave('login-username', loginForm.username);
          localSave('login-password', loginForm.password);
        }

        const routeRes = await loginApi.getUserRoutes();
        loginUser.userRoutes = routeRes.data.routes;
        console.log('loginUser', loginUser);
        localSave(LocalStorageKeyConst.USER_INFO, loginUser ? loginUser : '');
        message.success('登录成功');
        //更新用户信息到pinia
        useUserStore().setUserLoginInfo(loginUser);

        localSave(LocalStorageKeyConst.ROUTERS, JSON.stringify(useUserStore().getMenuRouterList));
        //构建系统的路由
        buildRoutes();
        // 个人设置
        await setConfig();
        router.push('/home');
      } catch (e) {
        smartSentry.captureError(e);
      } finally {
        SmartLoading.hide();
        loading.value = false;
      }
    });
  }

  async function setConfig() {
    const res = await userConfigApi.getUserConfig();
    if (res.data && res.data.configValue) {
      useAppConfigStore().setConfig(JSON.parse(res.data.configValue));
      localSave(localStorageKeyConst.APP_CONFIG, res.data.configValue);
    } else {
      useAppConfigStore().setConfig(appDefaultConfig);
      localSave(localStorageKeyConst.APP_CONFIG, JSON.stringify(appDefaultConfig));
    }
    if (res.data && res.data.quickEntryValue) {
      localSave(localKey.HOME_QUICK_ENTRY, res.data.quickEntryValue);
    }
  }

  async function chooseLogin(identityId) {
    localSave(LocalStorageKeyConst.IDENTITY_ID, identityId);
    await onLogin();
  }

  //--------------------- 验证码 ---------------------------------

  const captchaBase64Image = ref('');

  async function getCaptcha() {
    try {
      let captchaResult = await loginApi.getCaptcha();
      captchaBase64Image.value = captchaResult.data.image;
      loginForm.captchaUuid = captchaResult.data.uuid;
      beginRefRestCaptchaInterval(captchaResult.data.expire);
    } catch (e) {
      console.log(e);
    }
  }

  let refRestCaptchaInterval = null;

  function beginRefRestCaptchaInterval(expireSeconds) {
    if (refRestCaptchaInterval === null) {
      refRestCaptchaInterval = setInterval(getCaptcha, (expireSeconds - 5) * 1000);
    }
  }

  function stopRefRestCaptchaInterval() {
    if (refRestCaptchaInterval != null) {
      clearInterval(refRestCaptchaInterval);
      refRestCaptchaInterval = null;
    }
  }

  function remember() {
    if (!rememberPwd.value) {
      localRemove('login-username');
      localRemove('login-password');
    }
  }

  function getCacheUsernameAndPassword() {
    const username = localRead('login-username');
    const password = localRead('login-password');
    loginForm.username = username;
    loginForm.password = password;
    rememberPwd.value = username !== '' && password !== '';
  }

  onMounted(getCacheUsernameAndPassword);
</script>
<style lang="less" scoped>
  @import './login.less';

  .right-class {
    display: flex;
    flex-wrap: wrap;
    align-content: space-around;
    justify-content: space-around;
  }

  .login-container .box-item {
    height: 444px !important;
  }
</style>
