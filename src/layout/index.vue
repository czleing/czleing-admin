<template>
  <a-layout class="layout" style="height:100vh;">
    <a-layout-header :style="themeStyle" :class="{ 'is-radius mt6 ml6 mr6': settingStore.useRadius }" style="padding:0;">
      <!-- 右侧头部 -->
      <Header />
    </a-layout-header>
    <a-layout>
      <a-layout-sider v-show="menuStore.leftNavRoutes && menuStore.leftNavRoutes.length > 0" :collapsed="!menuStore.isSidebarOpen" :trigger="null" :theme="settingStore.mode" :class="{ 'is-radius mt6 ml6 mb6': settingStore.useRadius }" :style="themeStyle" collapsible>
        <!-- 左侧菜单 -->
        <MenuSide />
      </a-layout-sider>
      <a-layout-content>
        <div class="pa5 flex-y y-stretch" style="height:100%;">
          <!-- 右侧 Tabs 栏 -->
          <div v-if="settingStore.useTabs" class="">
            <Tabs />
          </div>
          <!-- 右侧工作区 -->
          <div class="view-main flex-auto pa10" :style="{ ...themeStyle, 'overflow': isAnimating ? 'hidden' : 'auto' }">
            <!-- {{ tabsStore.cachedViews }} -->
            <router-view v-slot="{ Component, route }">
              <Transition :name="settingStore.tabAnimate" :css="!!settingStore.tabAnimate" @before-enter="isAnimating = true" @after-leave="isAnimating = false">
                <keep-alive :max="20" :include="tabsStore.cachedViews">
                  <component v-if="!tabsStore.refreshing" :is="Component" :key="route.fullPath" />
                </keep-alive>
              </Transition>
            </router-view>
          </div>
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
const isAnimating = ref(false)

/** 使用动态色彩，跟随 ant-design 主题 */
watch(
  () => token.value,
  () => {
    // 设置整个网页的默认字体颜色跟随主题变化
    document.body.style.color = token.value.colorText
    document.documentElement.setAttribute('theme', settingStore.mode)
    themeStyle.value = {
      backgroundColor: token.value.colorBgContainer,
      color: token.value.colorText,
      borderColor: token.value.colorBorderSecondary
    }
    // 动态设置css变量，跟随 ant-design 主题，可根据需要扩展
    setRootCssVars('--ant-', {
      colorText: token.value.colorText,
      colorInfo: token.value.colorInfo,
      colorPrimary: token.value.colorPrimary,
      colorSuccess: token.value.colorSuccess,
      colorWarning: token.value.colorWarning,
      colorError: token.value.colorError,
      colorBorder: token.value.colorBorder,
      colorBorderSecondary: token.value.colorBorderSecondary,
      colorBgContainer: token.value.colorBgContainer,
      colorBgElevated: token.value.colorBgElevated,
      colorBgLayout: token.value.colorBgLayout,
      borderRadius: token.value.borderRadius + 'px'
    })
  },
  { deep: true, immediate: true }
)

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
}

/** Tab 切换动画 */
/** 向右滑动动画 */
.slide-right-enter-active, .slide-right-leave-active { transition: all .2s ease-out; }
.slide-right-enter-from { opacity: 0; transform: translateX(-20px); }
.slide-right-enter-active { transition-delay: .2s; }
.slide-right-leave-to { opacity: 0; transform: translateX(20px); }

// Tab 切换动画，淡入淡出
.fade-enter-active, .fade-leave-active { transition: all .25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-active { transition-delay: .25s; }

/* 缩放动画 */
.scale-enter-active, .scale-leave-active { transition: all 0.3s; }
.scale-enter-from, .scale-leave-to { transform: scale(0.95); opacity: 0; }
.scale-enter-active { transition-delay: .3s; }
</style>
