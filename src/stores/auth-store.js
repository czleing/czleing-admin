import { defineStore } from 'pinia'
import router from '@/router'
import axios from '@/api/index'
import { setAccount } from '@/storage/account'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useMenuStore } from '@/stores/menu-store'
import { createVNode } from 'vue'

/**
 * 登录、授权、用户信息相关 store
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    userInfo: null,
    roles: null,
    permissions: []
  }),
  actions: {
    getCode () {
      return axios.get('/captchaImage', null, { headers: { isToken: false } })
    },
    /**
     * 登录
     * @param {} data 
     */
    async login (data) {
      await this.loginByAccount(data)
    },
    /**
     * 账号密码登录
     * @param {*} param
     */
    async loginByAccount ({ account, password, code, uuid, remember }) {
      let menuStore = useMenuStore()
      const data = {
        username: account, // : window.btoa(window.btoa(account)),
        password, // : window.btoa(window.btoa(password)),
        code,
        uuid,
      }
      const result = await axios.post('/login', data)
      // 保存登录令牌，会自动持久化
      this.token = result.token
      // 加密持久化需要记住的账号
      setAccount(account, password, remember)
      // 获取菜单生成动态路由
      await menuStore.loadMenuToRoute(true)
      // 获取最新的登录用户信息
      await this.getUserInfo(true)
      // 跳转到首页
      router.replace('/')
    },
    /**
     * 退出登录
     * @returns 
     */
    logout () {
      const that = this
      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: '退出提示',
          icon: createVNode(ExclamationCircleOutlined),
          content: '确认退出登录吗？',
          async onOk () {
            await axios.post('/logout')
            that.clearAuthInfo()
            router.replace({ name: 'login' })
            resolve()
          },
          onCancel () {
            reject()
          }
        })
      })
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
     * 获取当前登录用户信息
     * @param {boolean} force 是否强制获取而不使用缓存
     * @returns 
     */
    async getUserInfo (force) {
      if (!force && this.userInfo) {
        return this.userInfo
      } else {
        const authInfo = await axios.get('/authInfo')
        this.userInfo = authInfo.user
        this.roles = authInfo.roles
        this.permissions = authInfo.permissions ?? []
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
    enabled: true, // 开启持久化
    strategies: [{ // 可以多种方案组合
      key: 'AUTH_INFO',
      // storage: window.localStorage, // 使用的持久化方案，默认 sessionStorage
      paths: ['token', 'userInfo'] // 需要持久化的属性，不设置则默认所有属性
    }]
  }
})

export default useAuthStore
