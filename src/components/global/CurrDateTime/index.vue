<!-- 实时显示当前日期时间的组件 -->
<template>
  <span>{{ time.format(format) }}</span>
</template>

<script setup>
import dayjs from "dayjs"

const props = defineProps({
  format: {
    type: String,
    default: 'HH:mm:ss'
  }
})
const time = ref(dayjs())
const timer = ref()

const hasSecond = computed(() => props.format.includes('ss'))
const hasMinute = computed(() => props.format.includes('mm'))
const duration = computed(() => hasSecond.value ? 1000 : 6000)

onMounted(() => {
  time.value = dayjs()
  timer.value = setInterval(() => {
    if (hasSecond.value) {
      time.value = time.value.subtract(1, 'second')
    } else if (hasMinute.value) {
      time.value = time.value.subtract(1, 'minute')
    } else {
      time.value = dayjs()
    }
  }, duration.value)
})
onUnmounted(() => {
  clearInterval(timer.value)
})
</script>
