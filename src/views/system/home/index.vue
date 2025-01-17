<!-- 首页 -->
<template>
  <div>
    <!--  顶部用户信息-->
    <a-row>
      <HomeHeader/>
    </a-row>
    <DemoCardData/>
    <!--下方左右布局-->
    <a-row :gutter="[10, 10]">
      <!--左侧-->
      <a-col :span="16">
        <a-row :gutter="[10, 10]">
          <!--公告信息-->
          <a-col :span="12">
            <HomeNotice title="公告" icon="NotificationOutlined" notice-category="1"/>
          </a-col>
          <!--企业动态-->
          <a-col :span="12">
            <HomeNotice title="通知" icon="ScheduleOutlined" notice-category="2"/>
          </a-col>
          <!--各类报表-->
          <!--           <a-col :span="6">-->
          <!--             <DemoRadar />-->
          <!--          </a-col>-->
          <a-col :span="16">
            <DemoBar/>
          </a-col>
          <a-col :span="8">
            <DemoPie/>
          </a-col>
          <a-col :span="16">
            <DemoLine/>
          </a-col>
          <a-col :span="8">
            <DemoRadar/>
          </a-col>
        </a-row>
      </a-col>
      <!--右侧-->
      <a-col :span="8">
        <a-row :gutter="[10, 10]">
          <!--快捷入口-->
          <a-col :span="24">
            <HomeQuickEntry/>
          </a-col>
          <a-col :span="24">
            <DemoCalendar/>
          </a-col>
          <!--更新日志-->
          <a-col :span="24">
            <ChangelogCard/>
          </a-col>
          <!--关注公众号-->
          <a-col :span="24">
            <DemoQrCode/>
          </a-col>
          <!--待办、已办-->
          <!--          <a-col :span="24">-->
          <!--            <ToBeDoneCard/>-->
          <!--          </a-col>-->
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<script setup>
import {computed} from 'vue';
import HomeHeader from './home-header.vue';
import HomeNotice from './components/notice/home-notice.vue';
import HomeQuickEntry from './components/quick-entry/home-quick-entry.vue';
import DemoPie from './components/demo/demo-pie.vue';
import DemoLine from './components/demo/demo-line.vue';
import DemoRadar from './components/demo/demo-radar.vue';
import DemoBar from './components/demo/demo-bar.vue';
import DemoCardData from './components/demo/demo-card-data.vue';
import DemoCalendar from './components/demo/demo-calendar.vue';
import DemoQrCode from './components/demo/demo-qr-code.vue';
import ChangelogCard from './components/changelog-card.vue';
// 业绩完成百分比
const saleTargetPercent = computed(() => {
  return 75;
});

</script>
<style lang="less" scoped>
@import './index.less';
</style>
