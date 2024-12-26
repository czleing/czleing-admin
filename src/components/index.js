
/**
 * 动态注册全局组件
 */
import { AIcon } from './global/a-icon'

const components = import.meta.glob('./global/**/**.vue')

export default function install (app) {
  const componentNames = []
  const isDebug = import.meta.env.VITE_APP_DEBUG_MODE
  for (const [key, value] of Object.entries(components)) {
    let name = key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.')) // 组件名取其文件名
    if (name === 'index') { // 如果文件名是 index.vue，则取上一级目录名
      name = key.match(/\/([^/]+)\/[^/]+\.vue/)[1]
    }
    if (isDebug) {
      componentNames.push(name)
    }
    app.component(name, defineAsyncComponent(value))
  }
  app.component('AIcon', AIcon)
  if (isDebug) {
    componentNames.push('AIcon')
    console.log('注册全局组件：', componentNames.join(', '))
  }
}