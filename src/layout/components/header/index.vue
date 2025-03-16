<template>
  <div class="header flex-x-between px20 nowrap">
    <Logo />
    <span class="pointer ml20" @click="menuStore.toggleSidebar">
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
      <HeaderFullscreen />
      <HeaderSetting />
      <HeaderUser />
    </a-space>
  </div>
</template>

<script setup>
import Logo from './logo.vue'
import { useMenuStore } from '@/stores/menu-store.js'
import { useSettingStore } from '@/stores/setting-store.js'
import HeaderUser from './header-user.vue'
import HeaderFullscreen from './header-fullscreen.vue'
import HeaderSetting from './header-setting.vue'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'

const menuStore = useMenuStore()
const settingStore = useSettingStore()
const selectedKeys = ref([])
const route = useRoute()
const router = useRouter()
const headerMenus = computed(() => {
  return menuStore.headerNavRoutes?.filter(item => !item.hidden).map(item => {
    return {
      path: item.path,
      icon: item.meta?.icon,
      title: item.meta?.title,
      firstPath: item.matched?.[0]?.path,
      isLeaf: item.meta?.isLeaf
    }
  })
})

watchEffect(() => {
  selectedKeys.value = route.meta.matchedPaths ?? [route.path]
  menuStore.firstRoutePath = route.meta?.matchedPaths?.[0] ?? route.path
})

function onMenuItemClick (item) {
  if (item.isLeaf) { // 是叶子节点，直接打开
    router.push(item.path)
  } else {
    selectedKeys.value = [item.path]
  }
  menuStore.firstRoutePath = item.path
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
