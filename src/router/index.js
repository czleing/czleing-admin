import { createRouter, createWebHashHistory } from 'vue-router'
import { beforeInterceptor, afterInterceptor, errorInterceptor } from './interceptors'

/**
 * 静态路由，格式如下：
 * 动态的由接口获取，动态添加，见：menuStore
 * {
    path: '/login',         // 路由地址，全局唯一
    name: 'login',          // 路由别名，全局唯一，用法：router.push({ name: 'login' })
    component: () => import('@/views/login/login-page.vue'), // 静态路由懒加载组件
    meta: {
      title: '欢迎登录',      // 网页标题，动态更新到浏览器选项卡中
      needLogin: false,      // 是否需要登录才能访问，默认 true
      hidden: true,          // 是否在菜单栏中隐藏，默认不隐藏
      hiddenTab: true,       // 是否在Tab栏中隐藏，默认不隐藏
      target: '_blank',      // 在浏览器新窗口打开（如打开外部系统页面）
      cache: true,           // 是否缓存页面，切换 Tabs 时状态不会被清空，默认不缓存
      icon: 'HomeOutlined',  // 菜单图标，ant-design/icons
    },
    children: []             // 子路由
  }
  不需要在 layout 中显示的路由
 */
const staticRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login-page.vue'),
    meta: {
      title: '欢迎登录',
      hidden: true,
      hiddenTab: true,
      needLogin: false
    }
  },
  {
    path: '/',
    // 重定向到首页的第一个页面
    redirect: { name: 'index' },
    component: () => import('@/layout/index.vue'),
    meta: { hidden: true },
    children: [
      {
        path: '/home',
        name: 'index',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          cache: true
        }
      },
      {
        path: '/personal-center',
        name: 'personal-center',
        component: () => import('@/views/modules/personal-center/index.vue'),
        meta: {
          title: '个人中心',
          hidden: true,
          cache: true
        }
      }
    ]
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
