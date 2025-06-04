import App from './App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import directives from './directives'
import AntDesignVue from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import '@/assets/css/index.less'
import components from '@/components/index'
import piniaPersist from 'pinia-plugin-persist'
import i18n from '@/locales/index'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)

app.use(router).use(pinia).use(directives).use(AntDesignVue).use(components).use(i18n)
app.mount('#app')

app.config.errorHandler = (err, vm, info) => {
  console.error('[全局异常]', err, vm, info)
}
