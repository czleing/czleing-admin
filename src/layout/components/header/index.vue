<template>
  <div class="header flex-x-between px20 nowrap">
    <Logo />
    <span class="pointer ml20" @click="menuStore.toggleSidebar">
      <MenuFoldOutlined v-if="menuStore.isSidebarOpen" />
      <MenuUnfoldOutlined v-else />
    </span>
    <div class="header__menu flex-auto ml30">
      <a-menu
        v-if="settingStore.menuLayout !== 'left'"
        class="menu-side__list"
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        mode="horizontal"
      >
        <template v-for="item in menuStore.headerNavRoutes">
          <template v-if="item.meta?.hidden !== true && !item.children">
            <a-menu-item :key="item.path" @click="onMenuItemClick(item)">
              <a-icon v-if="item.meta?.icon" :type="item.meta?.icon" />
              <span>{{ item.meta?.title }}</span>
            </a-menu-item>
          </template>
          <template v-else-if="item.meta?.hidden !== true">
            <SideItem
              :key="item.path"
              :menu-info="item"
              @menu-click="onMenuItemClick"
            />
          </template>
        </template>
      </a-menu>
    </div>
    <iframe
      v-if="settingStore.useWeather"
      src="http://i.tianqi.com/?c=code&id=26"
      width="180"
      height="25"
      frameborder="0"
      marginwidth="0"
      marginheight="0"
      scrolling="no"
      :style="settingStore.isDark ? 'filter:invert(1);' : ''"
    ></iframe>
    <a-space :size="15">
      <HeaderMessage />
      <HeaderFullscreen />
      <HeaderSetting />
      <HeaderUser />
    </a-space>
  </div>
</template>

<script setup>
import Logo from './logo.vue'
import SideItem from '../side/SideItem.vue'
import { useMenuStore } from '@/stores/menu-store.js'
import { useSettingStore } from '@/stores/setting-store.js'
import HeaderUser from './header-user.vue'
import HeaderMessage from './header-message.vue'
import HeaderFullscreen from './header-fullscreen.vue'
import HeaderSetting from './header-setting.vue'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'

const menuStore = useMenuStore()
const settingStore = useSettingStore()
const selectedKeys = ref([])
const openKeys = ref([])
const route = useRoute()
const router = useRouter()

watchEffect(() => {
  selectedKeys.value = route.meta.matchedPaths ?? [route.path]
  openKeys.value = route.meta?.matchedPaths?.slice(1) ?? [route.path]
  menuStore.firstRoutePath = route.meta?.matchedPaths?.[0] ?? route.path
})

function onMenuItemClick (item) {
  menuStore.handleMenuClick(router, item)
}

</script>

<style lang="less" scoped>
.header {
  height: 100%;
  &__menu {
    overflow: auto;
  }
}
</style>
