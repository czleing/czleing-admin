<template>
  <a-layout class="layout" style="height:100vh;">
    <a-layout-sider :collapsed="!menuStore.isSidebarOpen" :trigger="null" :theme="settingStore.mode" :class="{ 'is-radius mt6 ml6 mb6': settingStore.useRadius }" :style="themeStyle" collapsible>
      <!-- 左侧菜单 -->
      <MenuSide />
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="themeStyle" :class="{ 'is-radius mt6 ml6 mr6': settingStore.useRadius }" style="padding:0;">
        <!-- 右侧头部 -->
        <Header />
      </a-layout-header>
      <a-layout-content class="pa5 flex-y y-stretch">
        <!-- 右侧 Tabs 栏 -->
        <div class="">
          <Tabs />
        </div>
        <!-- 右侧工作区 -->
        <div class="view-main flex-auto pa10" :style="themeStyle">
          <!-- {{ tabsStore.cachedViews }} -->
          <router-view v-slot="{ Component, route }">
            <keep-alive :max="20" :include="tabsStore.cachedViews">
              <component v-if="!tabsStore.refreshing" :is="Component" :key="route.fullPath" />
            </keep-alive>
          </router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import MenuSide from './components/side/index.vue'
import Header from './components/header/index.vue'
import Tabs from './components/tabs/index.vue'
import { useMenuStore } from '@/stores/menu-store.js'
import { useTabsStore } from '@/stores/tabs-store.js'
import { useSettingStore } from '@/stores/setting-store.js'
import { useWindowSize } from '../hooks/useWindowSize'
import { useThemeToken } from '../hooks/useThemeToken'

const menuStore = useMenuStore()
const tabsStore = useTabsStore()
const settingStore = useSettingStore()
const { token } = useThemeToken()
const themeStyle = ref()

/** 使用动态色彩，跟随 ant-design 主题 */
watchEffect(() => {
  // 设置整个网页的默认字体颜色跟随主题变化
  document.body.style.color = token.value.colorText
  document.body.setAttribute('theme', settingStore.mode)
  themeStyle.value = {
    backgroundColor: token.value.colorBgContainer,
    color: token.value.colorText,
    borderColor: token.value.colorBorderSecondary
  }
})

/**
 * 监听窗体大小变化，自动展开收起左侧菜单栏
 */
useWindowSize((width) => {
  if (width < 900 && menuStore.isSidebarOpen) {
    menuStore.isSidebarOpen = false
  } else if (width > 900 && !menuStore.isSidebarOpen) {
    menuStore.isSidebarOpen = true
  }
})
</script>

<style scoped lang="less">
.layout {
  .ant-layout-header {
    transition: all .3s;
  }
  .is-radius {
    border-radius: 8px;
    border: solid 1px;
    overflow: hidden;
  }
}
.view-main {
  border-radius: 0 0 8px 8px;
  border: solid 1px;
  border-top: none;
  overflow: auto;
}
</style>
