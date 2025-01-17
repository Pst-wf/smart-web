<!-- 头部一整行 -->
<template>
  <a-space :size="10">
    <div class="setting">
      <a-button type="text" @click="showSearch" style="padding: 4px 5px">
        <div style="width: 26px; height: 26px">
          <SearchOutlined :style="{ fontSize: '16px' }"/>
        </div>
      </a-button>

      <!--      <a-input-search-->
      <!--        @click="search"-->
      <!--        style="margin-right: 30px; width: 250px"-->
      <!--        placeholder="请输入"-->
      <!--        enter-button="搜索"-->
      <!--        size="small"-->
      <!--      />-->
      <!---消息通知--->
      <SmartHeaderMessage ref="smartHeaderMessage"/>
      <!---国际化--->
      <!-- <a-button type="text" @click="showSetting" class="operate-icon">
        <template #icon><switcher-outlined /></template>
        i18n
      </a-button> -->
      <!---设置--->
      <a-button type="text" @click="showSetting" class="operate-icon">
        <template #icon>
          <setting-outlined/>
        </template>
      </a-button>
    </div>
    <!---头像信息--->
    <div class="user-space-item">
      <HeaderAvatar/>
    </div>
    <!---帮助文档--->
    <div class="user-space-item" @click="showHelpDoc" v-if="showHelpDocFlag">
      <span>帮助文档</span>
      <DoubleLeftOutlined v-if="!helpDocExpandFlag"/>
    </div>

    <HeaderSetting ref="headerSetting"/>
    <RouterSearch ref="routerSearch"/>
  </a-space>
</template>

<script setup>
import HeaderAvatar from './header-avatar.vue';
import HeaderSetting from './header-setting.vue';
import SmartHeaderMessage from './smart-header-message.vue';
import {useAppConfigStore} from '/@/store/modules/system/app-config';
import {computed, ref} from 'vue';
import {theme} from 'ant-design-vue';
import RouterSearch from ".//router-search.vue";

// 设置
const headerSetting = ref();

function showSetting() {
  headerSetting.value.show();
}

// 搜索
const routerSearch = ref();

function showSearch() {
  routerSearch.value.showModal();
}

//帮助文档
function showHelpDoc() {
  useAppConfigStore().showHelpDoc();
}

const showHelpDocFlag = computed(() => {
  return useAppConfigStore().helpDocFlag;
});

const helpDocExpandFlag = computed(() => {
  return useAppConfigStore().helpDocExpandFlag;
});

const {useToken} = theme;
const {token} = useToken();
</script>

<style lang="less" scoped>
.user-space-item {
  height: 100%;
  color: inherit;
  padding: 0 12px;
  cursor: pointer;
  align-self: center;

  a {
    color: inherit;

    i {
      font-size: 16px;
    }
  }
}

.user-space-item:hover {
  color: v-bind('token.colorPrimary');
  background-color: @hover-bg-color !important;
}

.setting {
  height: @header-user-height;
  line-height: @header-user-height;
  vertical-align: middle;
  display: flex;
  align-items: center;
}
.operate-icon {
  margin-left: 20px;
}
</style>
