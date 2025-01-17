<script setup>
import {computed, onMounted, ref} from "vue";
import {debounce} from "/@/utils/debounce-util.js"
import SendMail from "/@/views/message/components/send-mail.vue";
import SendSuccess from "/@/views/message/components/send-success.vue";
import InBox from "/@/views/message/components/in-box.vue";
import OutBox from "/@/views/message/components/out-box.vue";
import DraftBox from "/@/views/message/components/draft-box.vue";
import CollectionBox from "/@/views/message/components/collection-box.vue";
import {useUserStore} from "/@/store/modules/system/user.js";
import {userApi} from "/@/api/system/user-api.js";

const menuOptions = computed(() => {
  return [
    {label: '写邮件', value: 'sendMail', icon: 'HomeOutlined'},
    {label: '收件箱', value: 'inBox', icon: 'HomeOutlined'},
    {label: '发件箱', value: 'outBox', icon: 'HomeOutlined'},
    {label: '草稿箱', value: 'draftBox', icon: 'HomeOutlined'},
    {label: '回收站', value: 'collectionBox', con: 'HomeOutlined'}
  ];
});

function handleClick(value) {
  updateData(false);
  selectedKeys.value = [value];
}

// 未读消息
const unreadMessageCount = computed(() => {
  return useUserStore().unreadMessageCount;
});
const selectedKeys = ref(['sendMail']);
const sendSuccess = ref(false);
const resultTitle = ref('发送成功');

function updateData(value, title) {
  sendSuccess.value = value;
  rowData.value = null;
  if (title) {
    resultTitle.value = title;
  }
}
const rowData = ref(null);
function edit(item) {
  selectedKeys.value = ['sendMail'];
  rowData.value = item;
}

const allUser = ref([]);

// 加载用户信息
async function getUserData() {
  const res = await userApi.userList({userStatus: '1'});
  allUser.value = res.data
}
onMounted(getUserData)
</script>

<template>
  <a-layout has-sider style="height: 100%">
    <a-layout-sider class="sider-class" width="15%">
      <a-menu v-model:selectedKeys="selectedKeys" class="menu-class" mode="inline">
        <div v-for="(item, index) in menuOptions" :key="index">
          <a-menu-item :key="item.value">
            <template #icon>
              <HomeOutlined/>
            </template>
            <a-badge v-if="item.value ==='inBox'" :count="unreadMessageCount" :offset="[5,-2]">
              <div @click="debounce(handleClick(item.value), 100)">
                {{ item.label }}
              </div>
            </a-badge>
            <div v-else @click="debounce(handleClick(item.value), 100)">
              {{ item.label }}
            </div>
          </a-menu-item>
        </div>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content class="content-class">
        <SendSuccess v-if="sendSuccess" :title="resultTitle" @back="updateData(false)"/>
        <div v-else>
          <SendMail v-if="selectedKeys[0] === 'sendMail'" :rowData="rowData" :all-user="allUser"
                    @after-send="(title) => updateData(true, title)"/>
          <InBox v-if="selectedKeys[0] === 'inBox'"/>
          <OutBox v-if="selectedKeys[0] === 'outBox'"/>
          <DraftBox v-if="selectedKeys[0] === 'draftBox'" @callback="(val) => edit(val)"/>
          <CollectionBox v-if="selectedKeys[0] === 'collectionBox'"/>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="less">
.menu-class {
  border: 0 !important;
}

.sider-class {
  background: #fff;
  min-height: 800px;
  border-right: 1px solid #f0f0f0;
  padding: 10px;
}

.content-class {
  padding-left: 20px;
  padding-right: 20px;
  background: #fff;
}
</style>
