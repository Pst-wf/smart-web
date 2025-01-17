<script setup>
import * as echarts from 'echarts';
import {nextTick, onMounted, ref, watch} from 'vue';
import DefaultHomeCard from "/@/views/system/home/components/default-home-card.vue";

const basicColor = ref('#2d2d31')
const option = {
  color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
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
    data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
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
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: {
        lineStyle: {
          color: basicColor.value, // 设置X轴线的颜色为红色
        },
      },
      axisLabel: {
        color: basicColor.value,
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        color: basicColor.value,
      },
    },
  ],
  series: [
    {
      name: 'Line 1',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(128, 255, 165)',
          },
          {
            offset: 1,
            color: 'rgb(1, 191, 236)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [140, 232, 101, 264, 90, 340, 250],
    },
    {
      name: 'Line 2',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(0, 221, 255)',
          },
          {
            offset: 1,
            color: 'rgb(77, 119, 255)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [120, 282, 111, 234, 220, 340, 310],
    },
    {
      name: 'Line 3',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(55, 162, 255)',
          },
          {
            offset: 1,
            color: 'rgb(116, 21, 219)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [320, 132, 201, 334, 190, 130, 220],
    },
    {
      name: 'Line 4',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 0, 135)',
          },
          {
            offset: 1,
            color: 'rgb(135, 0, 157)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [220, 402, 231, 134, 190, 230, 120],
    },
    {
      name: 'Line 5',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      label: {
        show: true,
        position: 'top',
      },
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 191, 0)',
          },
          {
            offset: 1,
            color: 'rgb(224, 62, 76)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [220, 302, 181, 234, 210, 290, 150],
    },
  ],
};
onMounted(() => {
  const chartDom = document.querySelector('#line');
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
          option.xAxis[0].axisLine.lineStyle.color = basicColor.value;
          option.xAxis[0].axisLabel.color = value;
          option.yAxis[0].axisLabel.color = value;
          myChart.setOption(option, true);
        }
    );
  });
});
</script>

<template>
  <default-home-card icon="AreaChartOutlined" title="折线图">
    <div class="echarts-box">
      <div id="line" class="chart-class"></div>
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
