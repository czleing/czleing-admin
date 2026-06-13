<!-- 首页 -->
<template>
  <div class="home-page">
    <div class="ml20 mt20">首页</div>
  </div>
</template>

<script setup>
import { useThemeModeTransition } from '@/layout/components/hooks/useThemeModeTransition'
defineOptions({
  name: 'HomePage'
})
</script>

<style lang="less" scoped>
.home-page {
  .title {
  }
}
</style>
