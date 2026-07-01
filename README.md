<div align="center">
  <h1>czleing-admin</h1>
  <h3>中后台管理系统配置化框架</h3>
</div>

## 简介
### Vue3.5 + Vite8 + Pinia3 + Ant-design-vue4 + JavaScript + axios + vue-router + pnpm

个人利用业余时间使用最新技术栈封装的一套后台管理前端开发框架，追求精简、优雅，没有个人的包名、前缀、广告，拿来免改，干净整洁，易懂易用易扩展，将常用的功能进行了灵活的封装，不再需要编写繁琐的表单、控件、校验、联动逻辑、获取数据逻辑、表单回填逻辑、数据转换逻辑、列表、弹窗等重复性代码，通过简单配置即可使用，部分约定大于配置，让开发尽量简单

## 环境要求
- node: 20+
- pnpm: 9+

## 相关技术及依赖
- Vue 3.5+ 开发框架
- Vite 8+ 打包构建，目前最快的构建工具
- [pinia 3.0](https://pinia.web3doc.top/) 全局状态管理，比 vuex 更简单好用
- ant-design-vue 4+ UI库，ant-design-vue 最新版，体验与颜值并存
- vue-router 5.1 路由管理
- [VueUse](https://vueuse.org/) 集成了很多组合式API的库
- axios 服务请求
- dayjs 日期处理(moment的简化版, ant-design-vue 4 默认的日期处理工具)
- pinia-plugin-persist pinia持久化插件，
- unplugin-auto-import 常用API免导入插件，如使用 ref, reactive 不在需要写 import { ref, reactive } from 'vue'
- pnpm 包管理工具，目前最优的包管理工具，更快速且体积更小
- [后端源码](https://gitee.com/czleing/czleing-admin-api) 轻量化 spring-boot 单体后端服务

## 框架功能及特点
- 主题色动态切换(使用 CSS 变量 + ThemeToken 双方案)
- 全局明/暗色模式
- 统一动态调整组件大小
- 使用动态路由及权限配置(按钮级功能权限 + 数据权限)
- 统一接口异常拦截及处理
- 统一路由拦截及校验
- 多种菜单布局方式
- 支持标签栏展示多个页面
- 支持多级路由缓存及刷新
- 最新技术、前后端分离
- 使用 JavaScript
- 支持国际化(vue-i18n按模块配置)
- 线上自动检测版本更新
- CRUD 配置化自动生成，告别传统的大量DOM重复堆砌
- 系统管理基础功能
- 集成SSE消息通知
- 定时任务管理及日志
- Swagger 接口文档(入口：打开菜单：开发中心 -> 接口文档)
- CRUD 可视化代码生成
- 一个CRUD页面只有一个文件，不用到处跳，开发不割裂，代码简短，如：一个部门管理只需几十行代码，一个用户管理也仅200多行，菜单管理300多行
- ==========================
- 未来持续更新
- 接下来实现通知公告、用户的权限角色双向设置等...

## 初始化
### 1. 安装依赖
```
 pnpm i
```
### 2. 本地启动
```
npm run dev
```
### 3. 访问 http://127.0.0.1:3000/

### 4. 默认登录账号密码：
admin/123456

### 5. 打包
```
npm run build

```
### 6. 本地预览打包结果
```
npm run preview
```

## 预览
<img src='./src/doc/login.jpg' alt="light">
<img src='./src/doc/light.jpg' alt="light">
<img src='./src/doc/light2.jpg' alt="light">
<img src='./src/doc/light3.jpg' alt="light">
<img src='./src/doc/light4.jpg' alt="light">
<img src='./src/doc/light9.jpg' alt="light">
<img src='./src/doc/light5.jpg' alt="light">
<img src='./src/doc/dark.jpg' alt="dark">
<img src='./src/doc/dark2.jpg' alt="dark">
<img src='./src/doc/light6-1.jpg' alt="light">
<img src='./src/doc/light6-2.jpg' alt="light">
<img src='./src/doc/light7.jpg' alt="light">
<img src='./src/doc/light8.jpg' alt="light">

## 文档
[点击进入](./src/doc/README.doc.md)

## 贡献者

<img src="./src/doc/avatar.png" align="center" />
czleing

## 感谢支持
开源不易，如果觉得对您有帮助，可以帮忙点个 Star, 感激不尽！

或者还可以小费打赏哦 ^_^

| 微信 | 支付宝 |
| --- | --- |
|<img src="./src/doc/wx.jpg" height="150" />|<img src="./src/doc/zfb.jpg" height="150" />|
