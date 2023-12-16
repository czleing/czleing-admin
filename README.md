# Vue3 + Vite + Pinia + Ant design4 + js + Axios + VueRouter + pnpm

由于网上 Vue3 + ant-design-vue 框架大都是使用 TypeScript 开发，基本没有 JavaScript 版，ant-design-vue 也很少有4.x版本的，而且大部分开源框架，功能代码实现不够优雅简洁，另外也很少有真正实现了多级路由缓存、基础功能封装的，基本的CRUD还需要编写大量Dom，于是利用业余时间搭建了这个基础框架，并免费开源

## 环境要求
- node: 14.19+
- npm: 6+

## 相关技术及依赖
- Vue 3.3+ 开发框架
- Vite 4.4+ 打包构建
- [pinia 2.1+](https://pinia.web3doc.top/) 全局状态管理
- ant-design-vue 4+ UI库
- vue-router 4.2+ 路由管理
- [VueUse](https://vueuse.org/) 集成了很多组合式API的库
- axios 1.5+ 服务请求
- dayjs 日期处理(moment的简化版, ant-design4 默认的日期处理工具)
- pinia-plugin-persist [pinia]持久化插件
- pnpm 包管理工具

## 框架功能及特点
- 主题色动态切换
- 全局明/暗色模式
- 统一动态调整组件大小
- 使用动态路由及权限配置
- 统一接口异常拦截及处理
- 统一路由拦截及校验
- 采用顶部一级菜单和左侧子菜单布局
- 支持 Tab 栏展示多个页面
- 支持多级路由缓存及刷新
- 最新技术、前后端分离
- 代码简洁、清爽、优雅
- 使用 Javascript
- 可支持国际化(引入vue-i18n)
- 自动检测版本更新
- 系统管理基础功能(开发中...)
- CRUD 配置化及可视化开发(开发中...)


## 初始化
### 1. 安装依赖
```
 pnpm i
```
### 2. 本地启动
```
npm run dev
```
### 3. 停止本地服务，用 q 不用 Ctrl + C
```
q
```

## 打包
```
npm run build
```

## 其他说明
### 1、动态样式
less 中可使用 ant-design 的全局静态变量 @colorPrimary 等，但此变量不会跟随主题动态切换而变化，需要跟随变化请使用动态获取方式，如下：
```js
import { useThemeToken } from '@/hooks/useThemeToken.js'
const { token } = useThemeToken()
// 获取动态主题色
token.value.colorPrimary
```

### 2、