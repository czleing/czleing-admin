/**
 * 需要在 layout 页面中显示的路由
 */
/**
 * 错误页静态路由
 * 格式参考：./index.js
 */
const errorRoutes = [
  {
    path: '/403',
    component: () => import('@/views/exception/403-page.vue'),
    hidden: true, 
    meta: {
      title: '403'
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404-page.vue'),
    hidden: true, 
    meta: {
      title: '404'
    }
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 开发页面、工具路由、其他匹配等 静态路由
 * 格式参考：./index.js
 */
const developerRoutes = [
  {
    path: '/developer',
    redirect: '/developer/demo',
    hidden: true,
    meta: {
      icon: 'CodeOutlined',
      title: '开发中心'
    },
    children: [
      {
        path: '/developer/demo',
        component: () => import('@/views/demo/demo-page.vue'),
        meta: {
          title: 'Demo',
          isLeaf: true,
          matchedPaths: ['/developer', '/developer/demo'],
          cache: true
        }
      }
    ]
  }
]

/**
 * 根据子菜单路由生成导航页路由信息
 * @param {any[]} routes 接口读取到的路由
 */
export function createNavRoute (routes) {
  // console.log('routes', routes)
  return {
    path: '/',
    // 重定向到首页的第一个页面
    redirect: { name: 'index' },
    component: () => import('@/layout/index.vue'),
    hidden: true,
    children: [
      ...routes,
      ...developerRoutes,
      ...errorRoutes
    ]
  }
}