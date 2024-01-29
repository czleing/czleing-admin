<template>
  <section class="menu-side">
    <Logo />
    <a-menu
      class="menu-side__list"
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      mode="inline"
    >
      <template v-for="item in menuStore.leftNavRoutes">
        <template v-if="!item.hidden && !item.children">
          <a-menu-item :key="item.path" @click="onMenuItemClick(item)">
            <a-icon v-if="item.meta?.icon" :type="item.meta.icon" />
            <span>{{ item.meta?.title ?? item.path }}</span>
          </a-menu-item>
        </template>
        <template v-else-if="!item.hidden">
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
import { useRouter, useRoute } from 'vue-router'
import Logo from './logo.vue'
import { useMenuStore } from '@/stores/menu-store.js'
import SideItem from './SideItem.vue'
import { ref, watchEffect } from 'vue'

const menuStore = useMenuStore()
const router = useRouter()
const route = useRoute()
const openKeys = ref([route.path])
const selectedKeys = ref([route.path])

watchEffect(() => {
  openKeys.value = route.matched.map(m => m.path)
  selectedKeys.value = [route.path]
})

// 处理菜单项点击事件
function onMenuItemClick (item) {
  if (item.meta.isLeaf) {
    router.push(item.fullPath || item.path)
  }
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
