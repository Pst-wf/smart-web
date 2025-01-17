<template>
  <a-dropdown class="header-trigger">
    <div class="wrapper">
      <img class="avatar-image" :src="avatar" v-if="avatar"/>
      <a-avatar v-else style="margin: 0 5px; display: flex;justify-content: center;align-items: center" :size="20" id="smartAdminAvatar">
        {{ avatarName }}
      </a-avatar>
      <span class="name">{{ nickname }}</span>
    </div>
    <template #overlay>
      <a-menu :class="['avatar-menu']">
        <a-menu-item @click="toAccount()">
          <span>个人中心</span>
        </a-menu-item>
        <a-menu-item v-if="!configData || configData === '1'" @click="changeIdentity()">
          <span>切换身份</span>
        </a-menu-item>
        <a-menu-item @click="toAccount(ACCOUNT_MENU.PASSWORD.menuId)">
          <span>修改密码</span>
        </a-menu-item>
        <a-menu-item @click="onLogout">
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <choose-identity ref="chooseIdentity" :data="identityData" @choose="(identityId) => chooseLogin(identityId)"/>
</template>
<script setup>
import {computed, onMounted, ref} from 'vue';
import {loginApi} from '/src/api/system/login-api';
import {useUserStore} from '/@/store/modules/system/user';
import {localClear, localSave} from '/@/utils/local-util';
import {useRouter} from 'vue-router';
import {ACCOUNT_MENU} from '/@/views/system/account/account-menu.js';
import ChooseIdentity from "/@/components/login/choose-identity/index.vue";
import LocalStorageKeyConst from "/@/constants/local-storage-key-const.js";
import {configApi} from "/@/api/system/config-api.js";

// 头像背景颜色
const AVATAR_BACKGROUND_COLOR_ARRAY = ['#87d068', '#00B853', '#f56a00', '#1890ff'];

//监听退出登录方法
async function onLogout() {
  localClear();
  useUserStore().logout();
  location.reload();
  // try {
  //   await loginApi.logout();
  // } catch (e) {
  //   smartSentry.captureError(e);
  // } finally {
  //   localClear();
  //   useUserStore().logout();
  //   location.reload();
  // }
}

// ------------------------ 个人中心 ------------------------
const router = useRouter();

function toAccount(menuId) {
  router.push({
    path: '/account',
    query: {menuId},
  });
}

// ------------------------ 切换身份 ------------------------
const identityData = ref([])
const chooseIdentity = ref()

async function changeIdentity() {
  const res = await loginApi.getIdentityList();
  identityData.value = res.data
  chooseIdentity.value.openModal()
}

function chooseLogin(identityId) {
  localSave(LocalStorageKeyConst.IDENTITY_ID, identityId)
  location.reload();
}

// ------------------------ 以下是 头像和姓名 相关 ------------------------

const avatarName = ref('');
const avatar = computed(() => useUserStore().avatar);
const nickname = computed(() => useUserStore().nickname);

// 更新头像信息
function updateAvatar() {
  if (useUserStore().nickname) {
    avatarName.value = useUserStore().nickname.substr(0, 1);
    const avatar = document.getElementById('smartAdminAvatar');
    if (avatar) {
      avatar.style.backgroundColor = AVATAR_BACKGROUND_COLOR_ARRAY[hashcode(avatarName.value) % 4];
    }
  }
}

/**
 * 通过计算固定字符串的hash，来选择颜色，这也每次登录的颜色是相同的
 */
function hashcode(str) {
  let hash = 1,
      i,
      chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

onMounted(updateAvatar);
const configData = ref('1')

async function getConfigData() {
  const configRes = await configApi.getConfigByKeys({keys: 'has_dept_post'});
  configData.value = configRes.data.has_dept_post
}

onMounted(getConfigData)
</script>
<style lang="less" scoped>
.wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;

  .avatar-image {
    width: 20px;
    height: 20px;
    object-fit: cover;
    border-radius: 50%;
  }
}

.header-trigger {
  height: @header-user-height;
  line-height: @header-user-height;

  .avatar {
    vertical-align: middle;
  }

  .name {
    margin-left: 5px;
    font-weight: 500;
  }
}
</style>
