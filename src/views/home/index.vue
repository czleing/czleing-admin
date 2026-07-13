<!-- 首页 -->
<template>
  <div class="home-page">
    <div class="ml20 mt20">首页</div>
    <Audio />
  </div>
</template>

<script setup>
import Audio from './example/audio.vue'
defineOptions({
  name: 'HomePage'
})
</script>

<style lang="less" scoped>
.home-page {
}
</style>
