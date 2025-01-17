<script setup>
import * as echarts from 'echarts';
import {nextTick, onMounted, ref, watch} from 'vue';
import DefaultHomeCard from "/@/views/system/home/components/default-home-card.vue";

const basicColor = ref('#2d2d31')
const option = {
  legend: {
    orient: 'vertical',
    left: 'left',
    textStyle: {
      color: basicColor.value,
    },
    top: 10,
    itemWidth: 15
  },
  tooltip: {
    trigger: 'item',
    position: function (pos, params, dom, rect, size) {
      // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
      const obj = {top: 60};
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
      return obj;
    }
  },
  series: [
    {
      name: '饼状图',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      data: [
        {value: 1048, name: '星期一'},
        {value: 735, name: '星期二'},
        {value: 580, name: '星期三'},
        {value: 484, name: '星期四'},
        {value: 300, name: '星期五'}
      ],
      label: {
        color: basicColor.value,
        show: false,
        position: 'center'
      },
      labelLine: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 28,
          fontWeight: 'bold'
        }
      }
    }
  ]
};

onMounted(() => {
  const chartDom = document.querySelector('#pie');
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
          option.series[0].label.color = value;
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
  <default-home-card icon="PieChartOutlined" title="饼状图">
    <div class="echarts-box">
      <div id="pie" class="chart-class"></div>
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
