<template>
  <div class="version">
    <a target="_blank" class="smart-copyright" > {{ title }} {{ currentYear }} </a>
    <!--    <a target="_blank" class="smart-version" href="http://www.pstech360.com"> V3.4.0 </a>-->
  </div>
</template>
<script setup>
import dayjs from 'dayjs';
import {computed} from "vue";
import {useAppConfigStore} from "/@/store/modules/system/app-config.js";

const currentYear = dayjs().year();
const title = computed(() => useAppConfigStore().$state.websiteName);
</script>

<style lang="less" scoped>
.version {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);

  a {
    color: rgba(0, 0, 0, 0.45);
  }

  a:hover {
    color: @primary-color;
  }
}
</style>
