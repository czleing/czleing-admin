<!-- 图表示例 -->
<template>
  <div class="">
    <div class="lh2">
      所有图表都使用通用的组件渲染，只需丢一份数据给他，告诉他哪个字段作为x轴，哪个字段作为y轴，自动渲染出图形。<br/>
      隐藏通用逻辑，但提供常用配置及增量配置覆盖选项。<br/>
      通用组件封装了加载中、空数据、自动调整大小、工具箱等功能。<br/>
    </div>
    <h2 class="mt10">一个组件搞定各类线柱图</h2>
    <h3 class="mt20">基础柱图</h3>
    <div class="border radius10 pa10 flex-x gap10">
      <LineBarChart title="手机热度榜" :data="mockData" :colors="[token.colorPrimary]" height="200px" />
      <LineBarChart title="手机销量榜" :data="mockData" :colors="[token.colorPrimary]" :y-fields="['sales']" :target-value="3000" units="万" height="200px" />
    </div>
    <h3 class="mt20">混合线柱图</h3>
    <div class="border radius10 pa10 flex-x gap10">
      <LineBarChart
        title="手机销量占比"
        :data="mockData"
        :types="['bar', 'line']"
        :y-fields="['sales', 'rate']"
        :yAxisTypes="['value', 'percent']"
        :units="['万', '%']"
        :y-names="['销量', '占比']"
        :series-names="['销量', '占比']"
        :colors="colorsBarLine"
        showDownload
        height="200px" 
      />
      <LineBarChart
        title="手机库存"
        useShowLabel
        :data="mockData"
        :y-fields="['y', 'value', 'rate']"
        :types="['bar', 'line', 'line']"
        :yAxisTypes="['value', 'percent']"
        :y-axis-indexs="[0, 0, 1]"
        :units="['台', '', '%']"
        :series-names="['库存', '值1', '占比']"
        :defaultShowLabel="false"
        :min-value="200"
        :max-value="1000"
        :onRefresh="() => { console.log('刷新') }"
        :option="{
          /**增量配置覆盖默认配置 */
        }"
        height="200px"
      />
    </div>
    <h2 class="mt10">一个组件搞定各类饼图</h2>
    <h3 class="mt20">饼图</h3>
    <div class="border radius10 pa10 flex-x gap10">
      ...
    </div>
  </div>
</template>
<script setup>
import LineBarChart from '@/components/common/Chart/LineBarChart.vue'
import useThemeToken from '@/hooks/useThemeToken'
import { colorsBarLine } from '@/utils/color.constants'

defineOptions({
  name: 'ChartExample',
})

const { token } = useThemeToken()
const mockData = [
  { x: '华为', y: 1295, sales: 3213, rate: 0.21, value: 232 },
  { x: '小米', y: 1095, sales: 3421, rate: 0.22, value: 123 },
  { x: '苹果', y: 995, sales: 4313, rate: 0.28, value: 352 },
  { x: 'OPPO', y: 895, sales: 4131, rate: 0.25, value: 244 },
  { x: 'vivo', y: 795, sales: 2231, rate: 0.17, value: 166 },
]
</script>
<style scoped lang="less">
</style>