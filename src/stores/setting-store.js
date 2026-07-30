import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  },
  {
    name: '自定义',
    theme: {
      isDiy: true,
      token: {
        colorPrimary: '#0099ff',
        colorError: '#c84e4e',
        colorWarning: '#e2b14c',
        colorSuccess: '#3dbd3e',
        colorInfo: '#65a6d1',
      }
    }
  }
]

/**
 * 主题、语言、设置相关 store
 */
export const useSettingStore = defineStore('setting', () => {
  const theme = ref({ token: { ...themes.find(item => item.inUse)?.theme?.token } }) // 当前主题色系
  const themeName = ref(themes.find(item => item.inUse)?.name) // 当前主题名称
  const mode = ref('light') // 昼夜模式 light or dark
  const modeAnimate = ref('fade') // 切换昼夜模式的动画 fade, circle
  const locale = ref('zh-cn') // 当前语言 zh-cn, zh-hk, en
  const componentSize = ref('middle') // 当前组件尺寸
  const menuLayout = ref('top') // 菜单布局方式，top: 全部显示在顶部，left: 全部显示在左侧，top-left: 顶部一级菜单，左侧子菜单
  const useRadius = ref(false) // 是否使用圆润布局
  const useWeather = ref(false) // 是否使用天气组件
  const useTabs = ref(true) // 是否使用 tabs 栏
  const tabAnimate = ref('slide-right') // tab 页签动画，'', 'slide-right', 'fade', 'scale'
  const useDynamicPageTitle = ref(true) // 是否动态设置浏览器标签名，设置为路由上的 meta.title
  const useTableBorder = ref(true) // 表格是否使用竖向边框
  const useBreadcrumbs = ref(true) // 是否使用面包屑目录层级
  const useWatermark = ref(false) // 是否使用水印

  const { locale: l } = useI18n()

  /** 根据主题名称设置主题 */
  function setThemeByName (name) {
    if (!name) return
    const t = themes.find(item => item.name === name)?.theme
    if (t) {
      theme.value = { ...t, token: { ...t.token } }
      themeName.value = name
    }
  }

  function setDark () {
    mode.value = 'dark'
    document.documentElement.setAttribute('theme', 'dark')
  }

  function setLight () {
    mode.value = 'light'
    document.documentElement.setAttribute('theme', 'light')
  }

  function toggleMode () {
    isDark.value ? setLight() : setDark()
  }

  function setLocale (lang) {
    locale.value = lang
    l.value = lang
  }

  const isDark = computed(() => mode.value === 'dark')
  const themesGetter = computed(() => themes)

  return {
    theme,
    themeName,
    mode,
    modeAnimate,
    locale,
    componentSize,
    menuLayout,
    useRadius,
    useWeather,
    useTabs,
    tabAnimate,
    useDynamicPageTitle,
    isDark,
    themes: themesGetter,
    useTableBorder,
    useBreadcrumbs,
    useWatermark,
    setThemeByName,
    setDark,
    setLight,
    toggleMode,
    setLocale,
  }
},
{
  persist: {
    key: 'CZ_USER_SETTINGS'
  }
})
