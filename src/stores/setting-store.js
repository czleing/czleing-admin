import { defineStore } from 'pinia'

// ant-design-vue4.x 主题定义
const themes = [
  {
    name: '金色沙滩',
    inUse: true,
    theme: {
      token: {
        colorPrimary: '#d2b48c',
        colorError: '#c84e4e',
        colorWarning: '#e2b14c',
        colorSuccess: '#3dbd3e',
        colorInfo: '#d2b48c'
        // 可以自定义更多变量值
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
  },
  {
    name: '热情红火',
    theme: {
      token: {
        colorPrimary: '#f64040',
        colorError: '#aa2705',
        colorWarning: '#ff9209',
        colorSuccess: '#a1d267',
        colorInfo: '#f64040'
      }
    }
  }
]

/**
 * 主题、语言、设置相关 store
 */
export const useSettingStore = defineStore('setting', {
  state: () => ({
    theme: { token: { ...themes.find(item => item.inUse)?.theme?.token } }, // 当前主题色系
    themeName: themes.find(item => item.inUse)?.name, // 当前主题名称
    mode: 'light', // 昼夜模式 light or dark
    locale: 'zh-cn', // 当前语言 zh-cn, zh-hk, en
    componentSize: 'middle', // 当前组件尺寸
    menuLayout: 'top',     // 菜单布局方式，top: 全部显示在顶部，left: 全部显示在左侧，top-left: 顶部一级菜单，左侧子菜单
    useRadius: false,   // 是否使用圆润布局
    useWeather: false,  // 是否使用天气组件
    useTabs: true, // 是否使用 tabs 栏
    useDynamicPageTitle: true, // 是否动态设置浏览器标签名，设置为路由上的 meta.title
  }),
  actions: {
    /** 根据主题名称设置主题 */
    setThemeByName (name) {
      if (!name) return
      const theme = themes.find(item => item.name === name)?.theme
      if (theme) {
        this.theme = { token: { ...theme.token } }
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
    },
    setLocale (lang) {
      this.locale = lang
    }
  },
  getters: {
    isDark () {
      return this.mode === 'dark'
    },
    themes () {
      return themes
    },
    langOptions () {
      const langFiles = import.meta.glob('@/locales/langs/*.js', { eager: true })
      const options = []
      Object.entries(langFiles).forEach(item => {
        options.push(item[1].option)
      })
      return options
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
