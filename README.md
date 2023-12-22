# Vue3 + Vite + Pinia + Ant design4 + JavaScript + axios + vue-router + pnpm

利用业余时间，边重构边学习，使用最新技术栈封装了一套后台管理前端开发框架，可配置化及可视化开发，目前还在开发中...

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
- CRUD 配置化开发
- 系统管理基础功能(开发中...)
- 可视化开发(开发中...)

## 预览
<img src='./src/doc/light.png' alt="light">
<img src='./src/doc/dark.png' alt="dark">

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
less 中可使用 ant-design 的全局静态变量 @colorPrimary 等，但此变量不会跟随主题动态切换而变化，需要跟随变化请使用动态获取方式，token 内部的变量名参考[官网](https://www.antdv.com/docs/vue/customize-theme-cn)，如下：
```js
import { useThemeToken } from '@/hooks/useThemeToken.js'
const { token } = useThemeToken()
// 获取动态主题色
token.value.colorPrimary
```

### 2、