<script setup>
import shangpin from '/src/assets/images/lanhu/chart/icon_shangpin@2x.png';
import yonghu from '/src/assets/images/lanhu/chart/icon_yonghu@2x.png';
import huodong from '/src/assets/images/lanhu/chart/icon_huodong@2x.png';
import money from '/src/assets/images/lanhu/chart/icon_money@2x.png';
import {ref} from "vue";

const value1 = ref(3253);
const value2 = ref(1364);
const value3 = ref(6854);
const value4 = ref(20253);

function formatNumber(num) {
  return Number(num).toLocaleString()

}
</script>

<template>
  <a-row class="row-card-class" :gutter="[10, 10]">
    <a-card class="card-class one" :bordered="false" :hoverable="true">
      <div class="div-class">
        <div class="text-class">
          <div class="title-class one-title-class">用户数量</div>
          <div class="number-class one-title-class">{{ formatNumber(value1) }}</div>
        </div>
        <div class="image-class"><img :src="yonghu" alt="yonghu"/></div>
      </div>
    </a-card>
    <a-card class="card-class two" :bordered="false" :hoverable="true">
      <div class="div-class">
        <div class="text-class">
          <div class="title-class two-title-class">活动报名数量</div>
          <div class="number-class two-title-class">{{ formatNumber(value2) }}</div>
        </div>
        <div class="image-class"><img :src="huodong" alt="huodong"/></div>
      </div>
    </a-card>
    <a-card class="card-class three" :bordered="false" :hoverable="true">
      <div class="div-class">
        <div class="text-class">
          <div class="title-class three-title-class">商品销售数量</div>
          <div class="number-class three-title-class">{{ formatNumber(value3) }}</div>
        </div>
        <div class="image-class"><img :src="shangpin" alt="shangpin"/></div>
      </div>
    </a-card>
    <a-card class="card-class four" :bordered="false" :hoverable="true">
      <div class="div-class">
        <div class="text-class">
          <div class="title-class four-title-class">订单销售额</div>
          <div class="number-class four-title-class">{{ formatNumber(value4) }}</div>
        </div>
        <div class="image-class"><img :src="money" alt="money"/></div>
      </div>
    </a-card>
  </a-row>
</template>

<style scoped lang="less">
.card-class {
  width: calc(25% - 10px);
  height: calc(100% - 30px);
}

.row-card-class {
  background-color: #ffffff;
  display: flex;
  height: 160px;
  align-content: space-around;
  justify-content: space-around;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-bottom: 10px;
}

.one {
  background: #F5F5FF;
  border-radius: 8px;
  border: 1px solid #5A4D98;
}

.two {
  background: #FFF5F9;
  border-radius: 8px;
  border: 1px solid #FC456A;
}

.three {
  background: #F5FFFA;
  border-radius: 8px;
  border: 1px solid #38AB78;
}

.four {
  background: #FFF9F5;
  border-radius: 8px;
  border: 1px solid #DF630F;
}

.title-class {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 18px;
}

.number-class {
  font-family: PingFang SC;
  font-weight: 500;
  font-size: 40px;
}

.one-title-class {
  color: #5A4D98;
}

.two {
  color: #FC456A;
}

.three {
  color: #38AB78;
}

.four {
  color: #DF630F;
}

.text-class {
  width: calc(50% - 10px);
  display: inline-block;
  line-height: 34px;
}

.image-class {
  width: calc(50% - 10px);
  display: flex;
  justify-content: flex-end;
}

.image-class img {
  width: 73px;
  height: 72px;
}

.div-class {
  display: flex;
}
</style>
