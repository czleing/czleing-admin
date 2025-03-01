<!-- 饼图组件 -->
<template>
  <div class="xypie">
    <div v-if="title" class="em09 text-gray tc">{{ title }}</div>
    <div ref="chart" class="chart" />
    <div v-if="data.length === 0 && !loading" class="empty">
      <a-empty description="暂无数据" />
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  // 模块标题
  title: String,
  loading: Boolean,
  // 替换默认字段
  replaceFields: {
    type: Object,
    default: () => {
      return {
        x: 'x', // 名称对应的字段名
        y: 'y' // 值对应的字段名
      }
    }
  },
  // 数据 [{name, value}]
  data: {
    type: Array,
    default: () => []
  },
  // 饼图中心的文字，默认总数
  pieTitle: String,
  // 饼图中心文字下面的文字，默认累加value值
  pieSubtitle: [String, Number],
  // 单位，个、条、件...
  unit: { type: String, default: '' },
  // 系列颜色
  colors: { type: Array, default: [] }
})

const getTotal = computed(() => {
  let total = 0
  props.data.forEach(item => {
    total += parseFloat(item[props.replaceFields.y])
  })
  return total + ''
})

watch(
  () => props.data,
  () => {
    drawEchart()
  },
  { deep: true }
)
onMounted(() => {
  drawEchart()
  window.addEventListener('resize', this.resize)
})
onUnmounted(() => {
  window.removeEventListener('resize', this.resize)
})

let myChart = null
let resizeTimer = null
const chart = ref()
function drawEchart () {
  const container = chart.value
  if (!myChart) {
    myChart = echarts.init(container, 'light')
  }
  const option = {
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: `{b}: {c}${props.unit} ({d}%)`
    },
    // color: this.colors,
    title: {
      text: props.pieTitle || '总数',
      subtext: props.pieSubtitle || (getTotal.value + props.unit),
      // textAlign: 'center',
      textVerticalAlign: 'auto',
      left: 'center',
      top: 'middle',
      textStyle: {
        color: props.colors?.[0] ?? '#333',
        fontSize: 18
      },
      subtextStyle: {
        color: props.colors?.[1] ?? '#555',
        fontSize: 18
      }
    },
    grid: {
      containLabel: true,
      top: 50,
      left: 20,
      right: 20,
      bottom: 30
    },
    legend: {
      bottom: 'bottom',
      left: 'center',
      orient: 'vertical',
      itemWidth: 10,
      itemHeight: 10,
      itemStyle: {
        borderRadius: 20
      }
      // data: props.data
    },
    series: [
      {
        // name: props.title || '-',
        type: 'pie',
        radius: ['40%', '55%'],
        // center: ['50%', '50%'], // 中心点设置
        // avoidLabelOverlap: false, // 是否防止label重叠，此处都在中心显示，允许重叠
        label: {
          show: true,
          // position: 'inside',
          // margin: 10,
          formatter: props.data.length > 1 ? `{b}\n{c}${props.unit}\n{d}%` : `{b}：{c}${props.unit}，{d}%`
        },
        labelLine: {
          show: true
          // length: 5,
          // length2: 5
        },
        itemStyle: {
          // borderRadius: 5,
          // borderWidth: 1,
          // borderColor: '#fff'
          // color: ({ dataIndex }) => props.colors[dataIndex]
        },
        data: props.data.map(item => {
          return {
            name: item[props.replaceFields.x],
            value: item[props.replaceFields.y]
          }
        })
      }
    ]
  }
  if (props.data && props.data.length) {
    myChart.setOption(option)
  } else {
    myChart.clear()
  }
  resize()
}

function resize () {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    myChart && myChart.resize()
  }, 500)
}
</script>

<style lang="less" scoped>
.xypie {
  position: relative;
  width: 100%;
  height: 100%;
  .chart {
    min-height: 50px;
    width: 100%;
    height: 100%;
  }
  .empty {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
}
</style>
