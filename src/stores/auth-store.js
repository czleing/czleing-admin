import { defineStore } from 'pinia'
import router from '@/router'
import axios from '@/api/index'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useMenuStore } from '@/stores/menu-store'
import { createVNode } from 'vue'
import { useTabsStore } from '@/stores/tabs-store'
import { useCacheStore } from '@/stores/cache-store'

/**
 * 登录、授权、用户信息相关 store
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    userInfo: null,
    /** 当前角色字符串数组 ['xxx', 'xxxx'] */
    roles: null,
    /** 支持的权限字符串数组 ['system:user:add', 'xxx:xxx:xxx'] */
    permissions: []
  }),
  actions: {
    getCode () {
      return axios.get('/captchaImage', null, { headers: { isToken: false } })
    },
    /**
     * 登录统一入口
     * @param {} data 
     */
    async login (data) {
      if (data.account && data.password) {
        await this.loginByAccount(data)
      } else {
        throw new Error('未找到匹配的登录方式')
      }
    },
    /**
     * 1、账号密码登录
     * @param {*} param
     */
    async loginByAccount ({ account, password, code, uuid, remember }) {
      const data = {
        username: account, // : window.btoa(window.btoa(account)),
        password, // : window.btoa(window.btoa(password)),
        code,
        uuid,
      }
      const result = await axios.post('/login', data)
      // 保存登录令牌，会自动持久化
      this.token = result.token
      // 只记住账号，不存储密码
      const cacheStore = useCacheStore()
      cacheStore.setLoginAccount(remember ? { account } : undefined)
      // 登录成功后处理
      await this.loginSuccessHandle()
    },
    /**
     * 退出登录
     * @returns 
     */
    async logout () {
      const tabStore = useTabsStore()
      await new Promise(resolve => {
        Modal.confirm({
          title: '退出提示',
          icon: createVNode(ExclamationCircleOutlined),
          content: '确认退出登录吗？',
          onOk: resolve,
          onCancel: resolve
        })
      })
      try {
        await axios.post('/logout')
      } finally {
        // 无论服务端注销是否成功，都清除本地登录态，保证用户可退出
        this.clearAuthInfo()
        tabStore.clearAllTabs()
        router.replace({ name: 'login' })
      }
    },
    /**
     * 清除登录授权信息
     */
    clearAuthInfo () {
      this.token = null
      this.userInfo = null
      this.permissions = []
    },
    /**
     * 登录成功后处理
     */
    async loginSuccessHandle () {
      const menuStore = useMenuStore()
      // 获取菜单生成动态路由
      // 获取最新的登录用户信息
      await Promise.all([
        menuStore.loadMenuToRoute(true),
        this.getUserInfo(true)
      ])
      // 跳转
      const redirect = router.currentRoute.value.query.redirect
      if (typeof redirect === 'string') {
        const url = new URL(redirect, window.location.origin)
        // 仅允许同源 http(s) 地址，防止开放重定向攻击
        if (/^https?:$/.test(url.protocol) && url.origin === window.location.origin) {
          if (redirect.startsWith('http')) {
            window.location.href = url.href // 支持同域名其他系统授权登录跳回
          } else {
            router.replace(redirect) // 本系统登录跳回
          }
          return
        }
      }
      // 跳转到首页
      router.replace('/')
    },
    /** 登录失效处理，跳转到登录页 或者 弹出登录窗体 */
    authExpiredHandle () {
      if (import.meta.env.VITE_APP_IGNORE_LOGIN === 'true') {
        return
      }
      const currentPath = router.currentRoute.value.fullPath
      if (router.currentRoute.value.name !== 'login') {
        const tabStore = useTabsStore()
        tabStore.clearAllTabs()
        this.clearAuthInfo()
        router.replace({
          name: 'login',
          query: { redirect: currentPath }
        })
      }
    },
    /**
     * 获取当前登录用户信息
     * @param {boolean} force 是否强制获取而不使用缓存
     * @returns 
     */
    async getUserInfo (force) {
      if (!force && this.userInfo) {
        return this.userInfo
      } else {
        let authInfo = {}
        try {
          authInfo = await axios.get('/authInfo')
        } catch (e) {
          if (import.meta.env.VITE_APP_IGNORE_LOGIN !== 'true') {
            throw e
          }
        }
        this.userInfo = authInfo?.user
        this.roles = authInfo?.roles
        this.permissions = authInfo?.permissions ?? []
        if (import.meta.env.DEV && import.meta.env.VITE_APP_IGNORE_PERMISSION === 'true') {
          this.permissions.unshift('*:*:*') // 具有所有权限
        }
      }
    }
  },
  getters: {
    /**
     * 判断是否已登录
     * @returns boolean 是否已登录
     */
    hasLogin () {
      return !!this.token
    }
  },
  // 使用插件实现持久化
  persist: {
    key: 'CZ_AUTH_INFO',
    // storage: window.sessionStorage, // 使用的持久化方案，默认 localStorage
    // !!! 不能将 userInfo 加入缓存，userInfo 与 permissions 来自同一个接口，只缓存 userInfo 刷新时会导致 permissions 为空，从而页面权限校验错误，必须与 permissions 一起加入缓存
    // !!! permissions 为敏感信息，有手动修改的可能，最好不要加入缓存，所以 userInfo 和 permissoins 每次刷新时重新获取为好
    pick: ['token'] // 需要持久化的属性，不设置则默认所有属性
  }
})

export default useAuthStore
