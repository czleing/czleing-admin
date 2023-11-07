<template>
  <div class="header-fullscreen">
    <a-tooltip placement="bottom" :title="!isFullscreen ? '全屏' : '退出全屏'">
      <a-icon
        :type="isFullscreen ? 'FullscreenExitOutlined' : 'FullscreenOutlined'"
        style="font-size: 18px;"
        @click="toggle"
      />
    </a-tooltip>
  </div>
</template>

<script setup>
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, toggle } = useFullscreen(document.body)

</script>

<style lang="scss" scoped>
</style>
