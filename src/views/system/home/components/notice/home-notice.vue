<!-- 首页的 通知公告 -->
<template>
  <default-home-card extra="更多" :icon="icon" title="通知公告" @extraClick="onMore">
    <a-spin :spinning="loading">
      <div class="content-wrapper">
        <a-empty v-if="$lodash.isEmpty(data)"/>
        <ul v-else>
          <li v-for="(item, index) in data" :key="index" :class="[item.isRead ==='1' ? 'read' : 'un-read']">
            <a-tooltip placement="top">
              <template #title>
                <span>{{ item.noticeTitle }}</span>
              </template>
              <div style="display: flex;cursor: pointer;align-items: center;" @click="toDetail(item)">
                <a class="content">
                  <a-badge :status="item.isRead ==='1' ? 'default' : 'error'"/>
                  {{ item.noticeTitle }}
                </a>
                <a-tag v-if="item.noticeType ==='2'" color="red" class="mark-class">急</a-tag>
              </div>
            </a-tooltip>
            <span class="time"> {{ item.sendTime }}</span>
          </li>
        </ul>
      </div>
    </a-spin>
    <NoticeModal ref="noticeModal" @reload-list="queryNoticeList"/>
    <NoticeTableDrawer ref="noticeTableDrawer" :title="noticeCategory==='1' ? '公告': '通知'" :dict-map="dictMap"
                       @reload-list="queryNoticeList"/>
  </default-home-card>
</template>
<script setup>
import {onMounted, ref} from 'vue';
import DefaultHomeCard from '/@/views/system/home/components/default-home-card.vue';
import {noticeApi} from "/@/api/notice/notice-api.js";
import {smartSentry} from "/@/lib/smart-sentry.js";
import {dict} from "/@/utils/dict-util.js";
import NoticeModal from "./notice-modal.vue";
import NoticeTableDrawer from "/@/views/system/home/components/notice/notice-table-drawer.vue";

const props = defineProps({
  noticeCategory: {
    type: String,
    default: '1',
  },
  icon: {
    type: String,
    default: 'SoundOutlined'
  }
});

const queryForm = {
  noticeCategory: props.noticeCategory,
  current: 1,
  size: 6,
};

let data = ref([]);

const loading = ref(false);

// 查询列表
async function queryNoticeList() {
  try {
    loading.value = true;
    const res = await noticeApi.noticeRefPageForUser(queryForm)
    data.value = res.data.records
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  queryNoticeList();
});


const noticeModal = ref();
const noticeTableDrawer = ref();

// 进入详情
async function toDetail(data) {
  if(data.isRead === '0'){
    await noticeApi.readNoticeRef({id: data.id})
  }
  noticeModal.value.showModal(data)
}

// 查看更多
function onMore() {
  noticeTableDrawer.value.showDrawer(props.noticeCategory)
}

const dictMap = ref({});

async function getDict() {
  dictMap.value = await dict(['sys_notice_type', 'sys_notice_category']);
}

onMounted(getDict)
</script>
<style lang="less" scoped>
@read-color: #666;
.content-wrapper {
  height: 150px;
  overflow-y: hidden;
  overflow-x: hidden;
}

ul li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;

  .content {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    margin-right: 5px;
  }

  .time {
    flex-shrink: 0;
    color: @read-color;
    min-width: 75px;
  }
}

.read a {
  color: @read-color !important;
}

.mark-class {
  height: 15px;
  width: 15px;
  font-size: 11px;
  line-height: 12px;
  text-align: center;
  border-radius: 50%;
  padding-inline: 0;
  margin-top: 3px;
}

.view-class {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: space-around;
}
</style>
