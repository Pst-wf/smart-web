<script setup>
import * as echarts from 'echarts';
import {nextTick, onMounted, ref, watch} from 'vue';
import DefaultHomeCard from "/@/views/system/home/components/default-home-card.vue";

const basicColor = ref('#2d2d31')

// prettier-ignore
let dataAxis = [
  '12/01', '12/02', '12/03', '12/04', '12/05',
  '12/06', '12/07', '12/08', '12/09', '12/10',
  '12/11', '12/12'
];
// prettier-ignore
let data1 = [
  220, 182, 191, 234, 290,
  330, 310, 123, 442, 321,
  231, 178
];
let data2 = [320, 142, 151, 204, 340, 229, 456, 445, 219, 170, 453, 453];
const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  legend: {
    data: ['A组', 'B组'],
    textStyle: {
      color: basicColor.value,
    },
    top: 20
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    data: dataAxis,
    axisLabel: {
      color: basicColor.value,
    },
    axisLine: {
      lineStyle: {
        color: basicColor.value,
      },
    },
  },
  yAxis: {
    axisLine: {
      show: false,
    },
    axisLabel: {
      color: basicColor.value,
    },
  },

  series: [
    {
      name: 'A组',
      type: 'bar',
      showBackground: true,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {offset: 0, color: '#83bff6'},
          {offset: 0.5, color: '#188df0'},
          {offset: 1, color: '#188df0'},
        ]),
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#2378f7'},
            {offset: 0.7, color: '#2378f7'},
            {offset: 1, color: '#83bff6'},
          ]),
        },
      },
      data: data1,
    },
    {
      name: 'B组',
      type: 'bar',
      showBackground: true,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {offset: 0, color: '#83f6c2'},
          {offset: 0.5, color: '#26f018'},
          {offset: 1, color: '#26f018'},
        ]),
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#26f018'},
            {offset: 0.7, color: '#26f018'},
            {offset: 1, color: '#83f6c2'},
          ]),
        },
      },
      data: data2,
    },
  ],
};

onMounted(() => {
  const chartDom = document.querySelector('#bar');
  nextTick(() => {
    const myChart = echarts.init(chartDom);
    window.addEventListener('resize', function () {
      myChart.resize();
    });
    myChart.clear();
    myChart.setOption(option, true);
    watch(
        () => basicColor.value,
        (value) => {
          option.legend.textStyle.color = value;
          option.xAxis.axisLine.lineStyle.color = basicColor.value;
          option.xAxis.axisLabel.color = value;
          option.yAxis.axisLabel.color = value;
          myChart.setOption(option, true);
        }
    );
  });
});
</script>

<template>
  <default-home-card icon="BarChartOutlined" title="柱状图">
    <div class="echarts-box">
      <div id="bar" class="chart-class"></div>
    </div>
  </default-home-card>
</template>

<style>
.chart-class {
  width: 100%;
  height: 280px;
  background: #fff;
}

.echarts-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
