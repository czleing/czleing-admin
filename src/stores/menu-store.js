import { defineStore } from 'pinia'
import { createNavRoute } from '@/router/nav.routes'
import router from '@/router'
import axios from '@/api'
import { isEmpty, isNotEmpty } from '@/utils/index'

/**
 * 菜单、路由相关 store
 */
export const useMenuStore = defineStore('menu', {
  state: () => ({
    isSidebarOpen: true,  // 左侧菜单栏是否打开，默认打开侧边栏
    openKeys: [],         // 打开的菜单，用于自动定位到菜单位置
    selectedKeys: [],     // 当前选中的菜单项 key 数组
    menuList: [],         // 当前登录用户能看的所有菜单(路由树)
    navRoutes: null,      // 导航页路由(所有动态路由)
    loaded: false,        // 是否已加载菜单，用于路由拦截器中判断是否需要加载路由
    firstRoutePath: null  // 当前选中的第一级路由，顶部菜单选中项
  }),
  actions: {
    /**
     * 加载菜单数据，生成路由
     */
    async loadMenuToRoute () {
      if (!this.loaded) {
        this.loaded = true
        const tree = await this.getMenuTree()
        const routes = this.menuToRoute(tree)
        this.menuList = routes
        const navRoute = createNavRoute(routes)
        this.navRoutes = navRoute.children
        const navRoute2d = this.to2DRoutes(navRoute)
        router.addRoute(navRoute2d)
      }
    },
    async getMenuTree () {
      const menuList = await axios.get('/getMenuTree')
      return menuList
    },
    /**
     * 将菜单树转成路由树
     * @param {*} menuTree 
     * @returns 
     */
    menuToRoute (menuTree) {
      if (!Array.isArray(menuTree)) {
        menuTree = [menuTree]
      }
      // const views = import.meta.glob('@/views/**/*.vue', { eager: true }) // eager = true 直接拿到组件，而不是拿到按需导入组件的方法
      const views = import.meta.glob('@/views/**/*.vue') // 拿到所有组件的按需加载函数，需要时执行
      const getComponent = component => {
        if (component === 'Layout') {
          return () => import('@/layout/index.vue')
        } else if (component === 'RouterView' || component === 'ParentView') {
          return () => import('@/layout/components/router-view.vue')
        } else if (typeof component === 'function') {
          return component
        } else if (component) {
          const path = `/src/views/${component}.vue`
          return () => { // 返回按需加载函数
            const componentPromise = views[path]()
            return componentPromise.then(result => {
              const def = result.default
              def.name = def.__name = def.__file.split('src')[1].split('.')[0] // 修改组件名为 路径 + 文件名，保证组件名唯一，便于 keepalive 缓存
              return result
            })
          }
        } else {
          return undefined
        }
      }
      const hasNameRoutes = []
      const transform = (list, parentPaths = []) => {
        return list.map(item => {
          if (import.meta.env.VITE_APP_DEBUG_MODE && item.name) {
            hasNameRoutes.push(item)
          }
          let currPath = item.path
          if (currPath && currPath.indexOf(0) !== '/') {
            currPath = '/' + currPath
            currPath = (parentPaths.at(-1) ?? '') + currPath
          }
          return {
            path: currPath,
            query: item.queryParam ? JSON.parse(item.queryParam) : undefined,
            component: getComponent(item.component),
            hidden: item.isHidden,
            redirect: item.redirect,
            name: item.name,
            meta: {
              needLogin: item.needLogin || true,
              title: item.title || item.menuName,
              icon: item.icon,
              cache: item.isCache || false,
              // 保存父级路由链地址，从一级路由开始，用于根据当前路由，获取一级路由，设置顶部菜单选中
              matchedPaths: parentPaths.length > 0 ? parentPaths : [currPath],
              // 是否是一级路由
              isFirst: parentPaths.length === 0,
              // 是否是叶子节点
              isLeaf: isEmpty(item.children)
            },
            children: isNotEmpty(item.children) && transform(item.children, [...parentPaths, currPath])
          }
        })
      }
      const routes = transform(menuTree)
      if (import.meta.env.VITE_APP_DEBUG_MODE) {
        console.log('动态具名路由：', hasNameRoutes.map(item => `${item.name}: ${item.path}`).join(', '))
      }
      return routes
    },
    /**
     * 将多级路由打成二级路由（只留首尾两级）
     * 让所有页面直接挂载在 Layout 下面，以解决 keepalive 只能缓存一层子路由的问题
     * 打平之后，route.mathed 原为匹配到的路由链，改为手动构建的 route.meta.mathedPaths
     * @param {Object} rootRoute nav根路由
     * @returns navRoute object, 导航页路由树(2层)
     */
    to2DRoutes (rootRoute) {
      const parent = { ...rootRoute, children: undefined }
      const children = []
      const appendLeaf = (routes) => {
        routes.forEach(route => {
          if (route.children && route.children.length > 0) {
            if (route.redirect) {
              children.push(route)
            }
            appendLeaf(route.children)
          } else {
            children.push({ ...route })
          }
        })
      }
      appendLeaf(rootRoute.children)
      parent.children = children
      return parent
    },
    toggleSidebar () {
      this.isSidebarOpen = !this.isSidebarOpen
    }
  },
  getters: {
    // 顶部一级路由(用于渲染顶部一级菜单)
    headerNavRoutes () {
      return this.navRoutes
    },
    // 左侧子路由（顶部一级路由的子路由，用于渲染左侧菜单）
    leftNavRoutes () {
      if (this.firstRoutePath) {
        return this.navRoutes?.find(route => route.path === this.firstRoutePath)?.children
      }
      return []
    }
  }
})
