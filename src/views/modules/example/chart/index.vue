<!-- 图表示例 -->
<template>
  <div class="">
    <h3>基础柱图</h3>
    <div class="border radius10 pa10 flex-x gap10">
      <LineBarChart title="手机热度榜" :data="mockData" height="200px" />
      <LineBarChart title="手机销量榜" :data="mockData" :y-fields="['sales']" :target-value="3000" unit="万" height="200px" />
    </div>
    <h3 class="mt20">混合线柱图</h3>
    <div class="border radius10 pa10 flex-x gap10">
      <LineBarChart
        title="手机销量占比"
        :data="mockData"
        :types="['bar', 'line']"
        :y-fields="['sales', 'rate']"
        :yAxis="['value', 'percent']"
        :unit="['万', '%']"
        :y-name="['销量', '占比']"
        height="200px" 
      />
      <LineBarChart
        title="手机库存"
        :data="mockData"
        :y-fields="['y', 'value', 'rate']"
        :types="['bar', 'line', 'line']"
        :yAxis="['value', 'value', 'percent']"
        :unit="['台', '', '%']"
        height="200px"
      />
    </div>
  </div>
</template>
<script setup>
import LineBarChart from '@/components/common/Chart/LineBarChart.vue'

const mockData = [
  { x: '华为', y: 1295, sales: 3213, rate: 0.21, value: 32 },
  { x: '小米', y: 1095, sales: 3421, rate: 0.22, value: 23 },
  { x: '苹果', y: 995, sales: 4313, rate: 0.15, value: 52 },
  { x: 'OPPO', y: 895, sales: 4131, rate: 0.18, value: 44 },
  { x: 'vivo', y: 795, sales: 1231, rate: 0.17, value: 66 },
]
</script>
<style scoped lang="less">
</style>