import { createI18n } from 'vue-i18n'
import zhCn from './langs/zh-cn'
import zhHk from './langs/zh-hk'
import en from './langs/en'
import { mergeWith } from 'lodash-es'

/**
 * 扫描所有业务模块语言包文件，非业务模块手动引入
 * views 下任意层级下的/langs/*.js 定义的语言包会合并到主包，相同模块名或业务名会被合并
 * 业务模块语言包定义规则：
 * // xx/langs/zh-cn.js
 * export default {
 *   模块名: {
 *     业务名: {
 *       语言Key: '语言值{变量名}',
 *       pleaseEnter: '请输入{text}',
 *     }
 *   }
 * }
 * 用法：$t('模块名.业务名.语言Key', { 变量名: 'xxx' })
 * 用法：$t('模块名.业务名.pleaseEnter', { text: 'xxx' })
 */
function getI18nConfig () {
  const langs = import.meta.glob('@/views/**/langs/*.js', { eager: true })
  const messages = {
    'zh-cn': zhCn,
    'zh-hk': zhHk,
    'en': en,
  }
  Object.entries(langs).forEach(item => {
    const lang = item[0].match(/^.*\/([^\/]*)\.js$/)[1]
    messages[lang] = mergeWith({}, messages[lang], item[1].default)
  })
  const USER_SETTINGS = localStorage.getItem('USER_SETTINGS')
  const settings = USER_SETTINGS && JSON.parse(USER_SETTINGS)
  return {
    legacy: false,
    locale: settings?.locale || 'zh-cn', // 默认语言
    fallbackLocale: 'en', // 回退语言
    messages
  }
}

const i18n = createI18n(getI18nConfig())

export default i18n
