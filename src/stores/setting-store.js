import { defineStore } from 'pinia'

// ant-design-vue4.x 主题定义
const themes = [
  {
    name: '金色沙滩',
    inUse: false,
    theme: {
      token: {
        colorPrimary: '#d2b48c',
        colorError: '#c84e4e',
        colorWarning: '#e2b14c',
        colorSuccess: '#3dbd3e',
        colorInfo: '#d2b48c'
      }
    }
  },
  {
    name: '薄荷清新',
    theme: {
      token: {
        colorPrimary: '#88c7b1',
        colorError: '#e88f78',
        colorWarning: '#f0c175',
        colorSuccess: '#85b17e',
        colorInfo: '#88c7b1'
      }
    }
  },
  {
    name: '海岸微风',
    theme: {
      token: {
        colorPrimary: '#8db6d2',
        colorError: '#d98f83',
        colorWarning: '#e7c687',
        colorSuccess: '#a3cc9c',
        colorInfo: '#8db6d2'
      }
    }
  }
]

/**
 * 主题、语言、设置相关 store
 */
export const useSettingStore = defineStore('setting', {
  state: () => ({
    theme: themes.find(item => item.inUse)?.theme, // 当前主题色系
    themeName: themes.find(item => item.inUse)?.name, // 当前主题名称
    mode: 'dark', // 昼夜模式 light or dark
    locale: 'zh', // 当前语言 zh or en
    componentSize: 'small', // 当前组件尺寸
    useRadius: true, // 是否使用圆角布局
    useWeather: false // 是否使用天气组件
  }),
  actions: {
    /** 根据主题名称设置主题 */
    setThemeByName (name) {
      if (!name) return
      const theme = themes.find(item => item.name === name)?.theme
      if (theme) {
        this.theme = theme
        this.themeName = name
      }
    },
    setDark () {
      this.mode = 'dark'
    },
    setLight () {
      this.mode = 'light'
    },
    toggleMode () {
      this.mode = this.isDark ? 'light' : 'dark'
    }
  },
  getters: {
    isDark () {
      return this.mode === 'dark'
    },
    themes () {
      return themes
    }
  },
  persist: {
    enabled: true, // 开启持久化
    strategies: [{ // 可以多种方案组合
      key: 'USER_SETTINGS',
      storage: window.localStorage, // 使用的持久化方案，默认 sessionStorage
      // paths: ['theme'] // 需要持久化的属性，默认所有属性
    }]
  }
})
