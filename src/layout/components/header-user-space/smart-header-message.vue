<!-- 消息通知 -->
<template>
  <a-button type="text" @click="gotoMessage" style="padding: 4px 5px">
    <a-badge :count="unreadMessageCount">
      <div style="width: 26px; height: 26px">
        <BellOutlined :style="{ fontSize: '16px' }"/>
      </div>
    </a-badge>
  </a-button>
</template>

<script setup>
import {computed, ref} from 'vue';
import {BellOutlined} from '@ant-design/icons-vue';
import {useUserStore} from '/@/store/modules/system/user.js';
import {theme} from 'ant-design-vue';
import {useRouter} from 'vue-router';

const {useToken} = theme;
const {token} = useToken();

// ------------------------- 查询消息  -------------------------

// 未读消息
const unreadMessageCount = computed(() => {
  return useUserStore().unreadMessageCount;
});


const router = useRouter();

function gotoMessage() {
  router.push({path: '/message'});
}
</script>

<style lang="less" scoped>

</style>
