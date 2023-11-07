<template>
  <div class="header flex-x-between px20">
    <span class="pointer" @click="menuStore.toggleSidebar">
      <MenuFoldOutlined v-if="menuStore.isSidebarOpen" />
      <MenuUnfoldOutlined v-else />
    </span>
    <div class="header__menu flex-auto ml30">
      <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal">
        <template v-for="item in headerMenus">
          <a-menu-item v-if="!item.hidden" :key="item.path" @click="onMenuItemClick(item)">
            <div class="px10">
              <a-icon v-if="item.icon" :type="item.icon" />
              <span>{{ item.title ?? item.path }}</span>
            </div>
          </a-menu-item>
        </template>
      </a-menu>
    </div>
    <iframe
      v-if="settingStore.useWeather"
      src="http://i.tianqi.com/?c=code&id=17"
      width="120"
      height="100%"
      frameborder="0"
      marginwidth="0"
      marginheight="0"
      scrolling="no"
      style="background-color: rgba(255,255,255,.6);border-radius: 10px;margin-right: 30px;"
    ></iframe>
    <a-space :size="15">
      <HeaderFullscreen />
      <HeaderSetting />
      <HeaderUser />
    </a-space>
  </div>
</template>

<script setup>
import { useMenuStore } from '@/stores/menu-store.js'
import { useSettingStore } from '@/stores/setting-store.js'
import HeaderUser from './header-user.vue'
import HeaderFullscreen from './header-fullscreen.vue'
import HeaderSetting from './header-setting.vue'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const menuStore = useMenuStore()
const settingStore = useSettingStore()
const selectedKeys = ref([])
const route = useRoute()
const router = useRouter()
const headerMenus = computed(() => {
  return menuStore.headerNavRoutes.filter(item => !item.hidden).map(item => {
    return {
      path: item.path,
      icon: item.meta.icon,
      title: item.meta.title,
      firstPath: item.meta.matchedPaths[0],
      isLeaf: item.meta.isLeaf
    }
  })
})

watchEffect(() => {
  selectedKeys.value = route.meta.matchedPaths
  menuStore.firstRoutePath = route.meta.matchedPaths[0]
})

function onMenuItemClick (item) {
  if (item.isLeaf) { // 是叶子节点，直接打开
    router.push(item.path)
  } else {
    selectedKeys.value = [item.path]
    menuStore.firstRoutePath = item.path
  }
}

</script>

<style lang="less" scoped>
.header {
  height: 100%;
}
</style>
