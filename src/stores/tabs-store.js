import { defineStore } from 'pinia'
import router from '@/router'

/**
 * Tabs 栏相关 store
 */
export const useTabsStore = defineStore('tabs', {
  state: () => ({
    tabList: [], // 当前已打开过的路由数组，用于渲染 Tab 栏
    refreshing: false // 当前页是否正在刷新
  }),
  actions: {
    // 打开 Tab，新增并选中 或 已存在则选中，遵循幂等性原则
    openTab (route) {
      if (!route || !route.path || route.name === 'login') return
      const exist = this.tabList.find(item => item.path === route.path)
      if (!exist) {
        // 对象瘦身，把不需要用到的属性剔除，只留下需要的属性
        // Tab 对象保留了大部分路由属性
        this.tabList.push({
          path: route.path,
          name: route.name,
          fullPath: route.fullPath,
          query: route.query,
          params: route.params,
          hash: route.hash,
          meta: route.meta,
          matched: route.matched.map(match => {
            return {
              path: match.path,
              name: match.name,
              redirect: match.redirect,
              meta: match.meta,
              components: match.components,
              componentName: match.components?.default?.name
            }
          })
        })
      }
    },
    // 删除 Tab
    removeTab (path) {
      // 要删除的索引
      const index = this.tabList.findIndex(item => item.path === path)
      // 如果删除的是当前选中的索引
      let newIndex = this.currentIndex
      if (index === this.currentIndex) {
        if (this.tabList?.[newIndex + 1]) { // 如果后面有，选中后面一个
          newIndex = newIndex + 1
        } else if (newIndex > 0 && this.tabList?.[newIndex - 1]) { // 否则选中前面一个
          newIndex = newIndex - 1
        }
        if (newIndex !== this.currentIndex) {
          router.push(this.tabList[newIndex].fullPath)
        }
      }
      this.tabList.splice(index, 1)
      if (this.tabList.length === 0) {
        router.push({ name: 'index' })
      }
    },
    // 清除其他 Tab
    clearOtherTabs () {
      this.tabList = this.tabList.filter((item, index) => item.name === 'index' || index === this.currentIndex)
    },
    // 清除左边 Tab
    clearLeftTabs () {
      this.tabList = this.tabList.filter((item, index) => item.name === 'index' || index >= this.currentIndex)
    },
    // 清除右边 Tab
    clearRightTabs () {
      this.tabList = this.tabList.filter((item, index) => item.name === 'index' || index <= this.currentIndex)
    },
    // 刷新当前 Tab
    refreshTab () {
      this.refreshing = true
      setTimeout(() => {
        this.refreshing = false
      }, 300)
    }
  },
  getters: {
    // 当前 Tab 激活项的索引
    currentIndex () {
      return this.tabList.findIndex(item => item.path === router.currentRoute?.value?.path)
    },
    // 当前 tabList 中支持缓存的路由组件名称数组，用于 Tab 缓存
    // 从 tabList 中筛选出需要缓存的页面组件名数组，用于 keepalive 缓存
    cachedViews () {
      if (this.tabList.length === 0) {
        return []
      }
      const currTab = this.tabList[this.currentIndex]
      const currComName = currTab?.matched?.at(-1)?.componentName
      const cachedViews = this.tabList.map(tab => {
        const componentName = tab.matched.at(-1)?.componentName
        const useCache = tab.meta?.cache
        if (useCache && componentName) {
          return componentName
        } else {
          return null
        }
      }).filter(name => {
        // 刷新中的 Tab 暂时移除缓存
        const noRefreshFilter = !this.refreshing && !!name
        const refreshFilter = this.refreshing && name && name !== currComName
        return noRefreshFilter || refreshFilter
      })
      return cachedViews
    }
  }
})
