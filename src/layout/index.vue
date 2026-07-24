<template>
  <a-layout class="layout" style="height:100vh;">
    <a-layout-header :class="{ 'is-radius mt6 ml6 mr6': settingStore.useRadius }" style="padding:0;">
      <!-- 头部 -->
      <Header />
    </a-layout-header>
    <a-layout>
      <a-layout-sider v-show="menuStore.leftNavRoutes && menuStore.leftNavRoutes.length > 0" :collapsed="!menuStore.isSidebarOpen" :trigger="null" :theme="settingStore.mode" :class="{ 'is-radius mt6 ml6 mb6': settingStore.useRadius }" collapsible>
        <!-- 左侧菜单 -->
        <MenuSide />
      </a-layout-sider>
      <a-layout-content>
        <div class="pa5 flex-y y-stretch h100p">
          <!-- 右侧 Tabs 栏 -->
          <div v-if="settingStore.useTabs" class="">
            <Tabs />
          </div>
          <!-- 右侧工作区 -->
          <div class="view-main flex-auto pa10" :style="{ 'overflow': isAnimating ? 'hidden' : 'auto' }">
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
const isAnimating = ref(false)

/** 使用动态色彩，跟随 ant-design 主题 */
watch(
  () => token.value,
  () => {
    // 动态设置css变量，跟随 ant-design 主题，可根据需要扩展，参考： https://www.antdv.com/docs/vue/customize-theme-cn#api
    setRootCssVars('--ant-', {
      colorText: token.value.colorText,
      colorInfo: token.value.colorInfo,
      colorPrimary: token.value.colorPrimary,
      colorSuccess: token.value.colorSuccess,
      colorWarning: token.value.colorWarning,
      colorError: token.value.colorError,
      colorBorder: token.value.colorBorder, // 边框颜色
      colorBorderSecondary: token.value.colorBorderSecondary, // 更淡的边框颜色
      colorBgContainer: token.value.colorBgContainer, // 组件的容器背景色，例如：默认按钮、输入框等。务必不要将其与 `colorBgElevated` 混淆。
      colorBgElevated: token.value.colorBgElevated, // 浮层容器背景色，在暗色模式下该 token 的色值会比 `colorBgContainer` 要亮一些。例如：模态框、弹出框、菜单等。
      colorBgLayout: token.value.colorBgLayout, // 该色用于页面整体布局的背景色，只有需要在页面中处于 B1 的视觉层级时才会使用该 token，其他用法都是错误的
      colorFillSecondary: token.value.colorFillSecondary, // 二级填充色可以较为明显地勾勒出元素形体，如 Rate、Skeleton 等。也可以作为三级填充色的 Hover 状态，如：menu-item hover 状态。
      controlHeight: token.value.controlHeight, // 基础控件高度
      borderRadius: token.value.borderRadius + 'px', // 基础控件圆角大小
      borderRadiusLG: token.value.borderRadiusLG + 'px', // 一般用于容器圆角大小
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
  .ant-layout-header, .ant-layout-sider {
    transition: all .3s;
    border-color: transparent;
  }
  .is-radius {
    border-radius: var(--ant-borderRadiusLG);
    border: solid 1px var(--ant-colorBorderSecondary);
    overflow: hidden;
  }
}
.view-main {
  border-radius: 0 0 var(--ant-borderRadiusLG) var(--ant-borderRadiusLG);
  border: solid 1px;
  border-color: var(--ant-colorBorderSecondary);
  background-color: var(--ant-colorBgContainer);
  border-top: none;
}

/** Tab 切换动画 */
/** 向右滑动 */
.slide-right-enter-active, .slide-right-leave-active { transition: all .2s ease-out; }
.slide-right-enter-from { opacity: 0; transform: translateX(-20px); }
.slide-right-enter-active { transition-delay: .3s; }
.slide-right-leave-to { opacity: 0; transform: translateX(20px); }

/** 淡入淡出 */
.fade-enter-active, .fade-leave-active { transition: all .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-active { transition-delay: .4s; }

/* 缩放动画 */
.scale-enter-active, .scale-leave-active { transition: all 0.3s; }
.scale-enter-from, .scale-leave-to { transform: scale(0.95); opacity: 0; }
.scale-enter-active { transition-delay: .4s; }
</style>
