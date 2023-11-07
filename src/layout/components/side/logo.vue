<!-- 菜单栏头部LOGO组件 -->
<template>
  <div class="header-logo py10">
    <img :src="settingStore.isDark ? info.logoWhite : info.logo" class="header-logo__img" />
    <Transition name="slide-fade" mode="out-in" appear>
      <span
        v-if="menuStore.isSidebarOpen"
        class="header-logo__title nowrap"
        :class="{
          'text-white': settingStore.isDark
        }"
      >
        {{ info.systemName }}
      </span>
    </Transition>
  </div>
</template>

<script setup>
import settings from '@/config/setting.js'
import { useMenuStore } from '@/stores/menu-store.js'
import { useSettingStore } from '@/stores/setting-store.js'

const { websiteInfo: info } = settings
const menuStore = useMenuStore()
const settingStore = useSettingStore()
</script>

<style lang="scss" scoped>
.header-logo {
  position: relative;
  &__img {
    width: 32px;
    height: 32px;
    margin-left: 24px;
    object-fit: contain;
    border-radius: 5px;
  }
  &__title {
    position: absolute; // 为了不影响DOM及动画更自然
    left: 68px;
    top: 18px;
    font-size: 1.2em;
    font-weight: bold;
  }
}
</style>
