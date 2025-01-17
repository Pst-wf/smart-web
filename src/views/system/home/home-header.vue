<template>
  <div class="user-header">
    <a-page-header :title="welcomeSentence">
      <template #subTitle>
        <span style="color: #666; margin-left: 20px">所属部门：{{ deptName }} </span>
      </template>
      <template #extra>
        <p style="color: #333">{{ dayInfo }}</p>
      </template>
      <a-row class="content">
        <span class="left-content">
          <p class="last-login-info"><AlertOutlined />{{ lastLoginInfo }}</p>
          <a class="sentence" target="_blank"> <smile-outlined spin /> {{ heartSentence }} </a>
        </span>
        <div class="weather">
          <iframe
            width="100%"
            scrolling="no"
            height="50"
            frameborder="0"
            allowtransparency="true"
            src="//i.tianqi.com/index.php?c=code&id=12&icon=1&num=3&site=12"
          ></iframe>
        </div>
      </a-row>
    </a-page-header>
  </div>
</template>
<script setup>
  import { computed } from 'vue';
  import { useUserStore } from '/@/store/modules/system/user';
  import uaparser from 'ua-parser-js';
  import { Solar, Lunar } from 'lunar-javascript';
  import _ from 'lodash';
  import heartSentenceArray from './heart-sentence';

  const userStore = useUserStore();

  const deptName = computed(() => userStore.deptName);

  // 欢迎语
  const welcomeSentence = computed(() => {
    let now = new Date().getHours();
    if (now > 0 && now <= 6) {
      return`夜深了，${userStore.$state.nickname}, 凌晨的问候，带去我深深的思念，愿你的一天顺心如意!`
    } else if (now > 6 && now <= 11) {
      return  `早安，${userStore.$state.nickname}， 今天又是充满活力的一天!`
    } else if (now > 11 && now <= 14) {
      return `午安，${userStore.$state.nickname}， 愿这美好的时光给你带来一丝温馨，一份愉悦!`
    } else if (now > 14 && now <= 18) {
      return `下午好，${userStore.$state.nickname}, 愿你拥有一个美好的下午时光！`
    } else {
      return `晚安，${userStore.$state.nickname}，愿你今夜有个好梦，明天醒来笑口常开！`
    }
  });

  //上次登录信息
  const lastLoginInfo = computed(() => {
    let info = '';
    if (userStore.$state.lastLoginDate) {
      info = info + '上次登录:' + userStore.$state.lastLoginDate;
    }

    if (userStore.$state.lastLoginUserAgent) {
      let ua = uaparser(userStore.$state.lastLoginUserAgent);
      info = info + '; 设备:';
      if (ua.browser.name) {
        info = info + ' ' + ua.browser.name;
      }
      if (ua.os.name) {
        info = info + ' ' + ua.os.name;
      }
      let device = ua.device.vendor ? ua.device.vendor + ua.device.model : null;
      if (device) {
        info = info + ' ' + device + ';';
      }
    }

    if (userStore.$state.lastLoginIpRegion) {
      info = info + '; ' + userStore.$state.lastLoginIpRegion;
    }
    if (userStore.$state.lastLoginIp) {
      info = info + '; ' + userStore.$state.lastLoginIp;
    }
    return info;
  });

  //日期、节日、节气
  const dayInfo = computed(() => {
    //阳历
    let solar = Solar.fromDate(new Date());
    let day = solar.toString();
    let week = solar.getWeekInChinese();
    //阴历
    let lunar = Lunar.fromDate(new Date());
    let lunarMonth = lunar.getMonthInChinese();
    let lunarDay = lunar.getDayInChinese();
    //节气
    let jieqi = lunar.getPrevJieQi().getName();
    let next = lunar.getNextJieQi();
    let nextJieqi = next.getName() + ' ' + next.getSolar().toYmd();

    return `${day} 星期${week}，农历${lunarMonth}${lunarDay}（当前${jieqi}，${nextJieqi} ）`;
  });

  // 毒鸡汤
  const heartSentence = computed(() => {
    return heartSentenceArray[_.random(0, heartSentenceArray.length - 1)];
  });
</script>
<style scoped lang="less">
  .user-header {
    width: 100%;
    background-color: #fff;
    margin-bottom: 10px;

    .left-content {
      width: calc(100% - 420px);
      h3 {
        color: rgba(0, 0, 0, 0.75);
      }
    }

    .content {
      display: flex;
      justify-content: space-between;
      .weather {
        width: 400px;
      }
    }

    .last-login-info {
      font-size: 13px;
      color: #333;
      overflow-wrap: break-word;
      padding: 0;
      margin: 1px 0 0 0;
    }

    .sentence {
      display: block;
      font-size: 12px;
      color: #acacac;
      overflow-wrap: break-word;
      padding: 5px 0 0 0;
      margin: 6px 0 0 0;
    }
    .sentence:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
</style>
