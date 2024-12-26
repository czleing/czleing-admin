import App from './App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import directives from './directives'
import AntDesignVue from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import '@/assets/css/index.less'
import components from '@/components/index'
import piniaPersist from 'pinia-plugin-persist'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)

app.use(router).use(pinia).use(directives).use(AntDesignVue).use(components)
app.mount('#app')

app.config.errorHandler = (err, vm, info) => {
  console.log('[全局异常]', err, vm, info)
}

// 定义全局属性
// app.config.globalProperties.$axios = axios
// 获取
// const { $axios } = getCurrentInstance().appContext.config.globalProperties
