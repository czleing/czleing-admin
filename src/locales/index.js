import { createI18n } from 'vue-i18n'

const i18n = createI18n(getI18nConfig())

/**
 * 扫描所有语言包文件
 */
function getI18nConfig () {
  const langs = import.meta.glob('@/locales/langs/*.js', { eager: true })
  const messages = {}
  Object.entries(langs).forEach(item => {
    const key = item[0].match(/^.*\/([^\/]*)\.js$/)[1]
    messages[key] = item[1].default
  })
  return {
    legacy: false,
    locale: 'zh-cn', // 默认语言
    fallbackLocale: 'en', // 回退语言
    messages
  }
}

export default i18n