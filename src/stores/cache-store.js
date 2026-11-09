import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 缓存相关 store
 */
export const useCacheStore = defineStore('cache', () => {
  /** 搜索菜单历史 */
  const searchedMenus = ref([]) // [{ path, title, icon }]
  /** 记录登录用户（出于安全考虑，只记住账号，绝不持久化存储密码） */
  const loginAccount = ref() // { account }

  function getLoginAccount () {
    if (!loginAccount.value) return undefined
    // 只返回账号，忽略历史版本可能缓存过的密码字段
    return { account: loginAccount.value.account }
  }

  function setLoginAccount (accountInfo) {
    loginAccount.value = accountInfo ? { account: accountInfo.account } : undefined
  }

  /** 清除缓存 */
  function clearCache () {
    searchedMenus.value = []
    loginAccount.value = undefined
  }
  return {
    searchedMenus,
    loginAccount,
    getLoginAccount,
    setLoginAccount,
    clearCache
  }
},
{
  persist: {
    key: 'CZ_CACHE'
  }
})
