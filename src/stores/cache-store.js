import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 缓存相关 store
 */
export const useCacheStore = defineStore('cache', () => {
  /** 搜索菜单历史 */
  const searchedMenus = ref([]) // [{ path, title, icon }]

  function clearCache () {
    searchedMenus.value = []
  }
  return {
    searchedMenus,
    clearCache
  }
},
{
  persist: {
    key: 'CZ_CACHE'
  }
})
