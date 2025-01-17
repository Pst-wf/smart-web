<script setup>
import * as echarts from 'echarts';
import {nextTick, onMounted, ref, watch} from 'vue';
import DefaultHomeCard from "/@/views/system/home/components/default-home-card.vue";

const basicColor = ref('#2d2d31')
const option = {

  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['男', '女'],
    textStyle: {
      color: basicColor.value,
    },
    top: 10,
    itemWidth: 15
  },
  tooltip: {
    trigger: 'item',
  },
  radar: {
    // shape: 'circle',
    nameGap: 5,
    radius: '80%',
    indicator: [
      {name: '德', max: 100},
      {name: '智', max: 100},
      {name: '体', max: 100},
      {name: '美', max: 100},
      {name: '劳', max: 100},
    ],
    axisName: {
      color: basicColor.value,
    },
  },
  series: [
    {
      name: '男 vs 女',
      type: 'radar',
      data: [
        {
          value: [75, 56, 87, 47, 88],
          name: '男',
          itemStyle: {
            color: '#ffcf67',
          },
          lineStyle: {
            color: '#ffcf67',
          },
        },
        {
          value: [91, 87, 36, 77, 55],
          name: '女',
          itemStyle: {
            color: '#3bde7c',
          },
          lineStyle: {
            color: '#3bde7c',
          }
        },
      ],
    },
  ],
};

onMounted(() => {
  const chartDom = document.querySelector('#radar');
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
          option.radar.axisName.color = value;
          // option.series[0].label.color = value;
          // option.xAxis.axisLine.lineStyle.color = basicColor.value;
          // option.xAxis.axisLabel.color = value;
          // option.yAxis.axisLabel.color = value;
          myChart.setOption(option, true);
        }
    );
  });
});
</script>

<template>
  <default-home-card icon="RadarChartOutlined" title="雷达图">
    <div class="echarts-box">
      <div id="radar" class="chart-class"></div>
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
