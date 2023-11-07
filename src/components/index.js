
/**
 * 动态注册全局组件
 */
import { defineAsyncComponent } from 'vue'
import { AIcon } from './global/a-icon'

const components = import.meta.glob('./global/**/**.vue')

export default function install (app) {
  const componentNames = []
  for (const [key, value] of Object.entries(components)) {
    let name = key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'))
    if (name === 'index') { // 如果文件名是 index.vue，则取上一级目录名
      name = key.match(/\/([^/]+)\/[^/]+\.vue/)[1]
    }
    componentNames.push(name)
    app.component(name, defineAsyncComponent(value));
  }
  app.component('AIcon', AIcon)
  componentNames.push('AIcon')
  console.log('注册全局组件：', componentNames.join(', '))
}