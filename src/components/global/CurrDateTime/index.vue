<!-- 实时显示当前日期时间的组件 -->
<template>
  <span>{{ dayjs(time).format(format) }}</span>
</template>

<script setup>
import dayjs from "dayjs"

const props = defineProps({
  format: {
    type: String,
    default: 'HH:mm:ss'
  }
})
const time = ref()
const timer = ref()
onMounted(() => {
  time.value = Date.now()
  timer.value = setInterval(() => {
    time.value = Date.now()
  }, props.format.includes('ss') ? 1000 : 60000)
})
onUnmounted(() => {
  clearInterval(timer.value)
})
</script>
