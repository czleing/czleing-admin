<template>
  <section class="menu-side">
    <a-menu
      class="menu-side__list"
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      mode="inline"
    >
      <template v-for="item in menuStore.leftNavRoutes">
        <template v-if="item.meta?.hidden !== true && !item.children">
          <a-menu-item :key="item.path" @click="onMenuItemClick(item)">
            <a-icon v-if="item.meta?.icon" :type="item.meta.icon" />
            <span>{{ item.meta?.title ?? item.path }}</span>
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
  </section>
</template>

<script setup>
import { useMenuStore } from '@/stores/menu-store.js'
import SideItem from './SideItem.vue'

const menuStore = useMenuStore()
const router = useRouter()
const route = useRoute()
const openKeys = ref([route.path])
const selectedKeys = ref([route.path])

watchEffect(() => {
  openKeys.value = route.meta?.matchedPaths
  selectedKeys.value = [route.path]
})

// 处理菜单项点击事件
function onMenuItemClick (item) {
  menuStore.handleMenuClick(router, item)
}
</script>

<style lang="less" scoped>
.menu-side {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, .05);
}
</style>
