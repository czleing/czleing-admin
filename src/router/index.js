import { createRouter, createWebHashHistory } from 'vue-router'
import { beforeInterceptor, afterInterceptor, errorInterceptor } from './interceptors'

/**
 * 静态路由
 * 动态的由接口获取，动态添加，见：menuStore
 * {
    path: '/login',         // 路由地址，全局唯一
    name: 'login',          // 路由别名，全局唯一，用法：router.push({ name: 'login' })
    component: () => import('@/views/login/login-page.vue'), // 静态路由懒加载组件
    hidden: true,           // 是否在左侧菜单栏中隐藏，默认不隐藏
    meta: {
      title: '欢迎登录',      // 网页标题，动态更新到浏览器选项卡中
      needLogin: false,      // 是否需要登录才能访问，默认 true
      cache: true,           // 是否缓存页面，切换 Tabs 时状态不会被清空，默认不缓存
      icon: '',              // 菜单图标，ant-design/icons
    }
  }
 */
const staticRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login-page.vue'),
    hidden: true, 
    meta: {
      title: '欢迎登录',
      needLogin: false
    }
  }
]

const routes = [
  ...staticRoutes
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

// 路由拦截器
router.beforeEach(beforeInterceptor)
router.afterEach(afterInterceptor)
router.onError(errorInterceptor)

export default router
