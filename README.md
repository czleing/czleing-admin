# Vue3 + Vite + Pinia + Ant-design-vue4 + JavaScript + axios + vue-router + pnpm

使用最新技术栈封装的一套后台管理前端开发框架，追求精简、优雅，没有多余的代码和依赖，没有个人的包名、前缀、广告，拿来免改，干净整洁，易懂易用易扩展，将常用的功能进行了非常灵活的封装，不再需要编写繁琐的表单、控件、校验、联动逻辑、获取数据逻辑、表单回填逻辑、数据转换逻辑、列表、弹窗等重复性代码，通过简单配置即可解决，个别地方约定大于配置，让开发尽量简单

## 环境要求
- node: 18+
- pnpm: 9+

## 相关技术及依赖
- Vue 3.4+ 开发框架
- Vite 4.4+ 打包构建，目前最快的构建工具
- [pinia 2.1+](https://pinia.web3doc.top/) 全局状态管理，比 vuex 简单好用
- ant-design-vue 4+ UI库，ant-design-vue 最新版，体验与颜值并存
- vue-router 4.4+ 路由管理
- [VueUse](https://vueuse.org/) 集成了很多组合式API的库
- axios 服务请求
- dayjs 日期处理(moment的简化版, ant-design-vue 4 默认的日期处理工具)
- pinia-plugin-persist pinia持久化插件，
- unplugin-auto-import 常用API免导入插件，如使用 ref, reactive 不在需要写 import { ref, reactive } from 'vue'
- pnpm 包管理工具，目前最优的包管理工具，更快速且体积更小
- [后端源码](https://gitee.com/czleing/base-backend-api)

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
- 使用 JavaScript
- 可支持国际化(引入vue-i18n)
- 线上自动检测版本更新
- CRUD 配置化开发
- 系统管理基础功能
- CRUD 可视化代码生成

## 初始化
### 1. 安装依赖
```
 pnpm i
```
### 2. 本地启动
```
npm run dev
```
### 3. 停止本地服务，用 q 或 Ctrl + C
```
q
```
### 4. 访问 http://127.0.0.1:3000/

### 5. 默认登录账号密码：
admin/GfAdmin321@

## 打包
```
npm run build
```

## 预览
<img src='./src/doc/light.png' alt="light">
<img src='./src/doc/light2.png' alt="light">
<img src='./src/doc/light3.png' alt="light">
<img src='./src/doc/light4.png' alt="light">
<img src='./src/doc/light5.png' alt="light">
<img src='./src/doc/dark.png' alt="dark">
<img src='./src/doc/light6-1.png' alt="light">
<img src='./src/doc/light6-2.png' alt="light">
<img src='./src/doc/light7.png' alt="light">
<img src='./src/doc/light8.png' alt="light">

## 其他说明
### 1、规范
- 请保持项目目录/文件干净整洁、风格统一
- 业务模块目录/文件名称默认全部小写，多个单词时以 '-' 连接
- 在 `Vue` 原型上添加属性使用`$`前缀，如：`Vue.prototype.$copy = xxx`
- 编写组件或页面文件首行请注明该组件/页面的说明、用途、用法等
- 使用两个空格代替缩进符，避免不同系统下缩进宽度不一致
- 避免在模板中写复杂逻辑，应仅包含简单的属性绑定，避免写复杂的表达式或函数调用，保持模板清晰
- 给组件添加属性时，遵守一定的优先顺序，指令 > 静态属性 > 动态属性 > 事件，
  如：`<input v-if="xxx" class="xxx" :maxlength="30" @input="onInputHandle" />`
- 组件中 style 标签尽可能添加 `scoped`，避免全局样式污染，如：`<style scoped>`
- 相对独立的小模块，尽可能单独抽离成一个组件，避免一个文件代码过长，同时还要避免过多的组件嵌套

### 2、动态样式
less 中可使用 ant-design 的全局静态变量 @colorPrimary 等，但此变量不会跟随主题动态切换而变化，
需要跟随变化请使用动态方式获取，token 内部的变量名参考[官网](https://www.antdv.com/docs/vue/customize-theme-cn)，如下：
```js
import { useThemeToken } from '@/hooks/useThemeToken.js'
const { token } = useThemeToken()
// 获取动态颜色
token.value.colorPrimary
token.value.colorWarning
token.value.colorSuccess
...
```

### 3、获取当前登录用户
```javascript
import { useAuthStore } from '@/stores/auth-store.js'

const authStore = useAuthStore()
// 用户信息
console.log('当前登录用户：', authStore.userInfo)
```

### 4、消息弹窗
```javascript
import { Modal, message } from 'ant-design-vue'

// 弹出确认框
Modal.confirm({
  title: '温馨提示',
  content: '确认要删除该用户吗？',
  // icon: createVNode(ExclamationCircleOutlined),
  // okText: '确认',
  // okType: 'danger', // 确认按钮类型，a-button 的 type
  // okButtonProps: {},
  // cancelText: '取消',
  // onCancel () {},
  onOk () {
    // 相关操作
  }
})
// 弹出成功提示
message.success('保存成功')

```


### 5、弹出模态框
全局组件 /global/Modal 对 a-modal、a-drawer 进行了合并封装，简化了使用，属性设置支持标签上设置和调用时设置
```vue
<template>
  <div>
    xxx
    <Modal ref="cModal" title="xxx" width="800" :before-confirm="beforeConfirm"...>
      弹出框内部内容
    </Modal>
  </div>
</template>

<script setup>
const cModal = ref()
function openModal () {
  cModal.value.open({
    title: '弹窗标题',
    mode: 'modal', // 弹窗类型，modal | drawer
    width: 600, // 弹窗宽度
    showConfirm: true, // 是否需要确认按钮，默认需要
    // ... 其他属性，参考 src/components/global/Modal/index.vue
    async onConfirm (close) {}, // 点击确认按钮时执行，调用 close() 关闭弹窗
    async onCancel () {} // 点击取消时执行
  }, extraData)
  // 关闭弹窗
  // cModal.value.close()
}
// 也可以通过传入一个函数来执行确认操作，extraData 为调用open时传入的附加数据
function beforeConfirm (close, extraData) {
}
</script>
```


### 6、CRUD快速开发案例(可直接代码生成，系统工具->代码生成)
#### 步骤一：先在数据库中设计表结构
#### 步骤二：然后本地启动进入‘系统工具->代码生成’导入表并编辑相关信息
#### 步骤三：生成CRUD前后端代码

生成结果参考 /src/views/demo/demo-page.vue

```vue
<!-- 传统的写法，需要编写大量 Dom 和 js -->
...
<el-form-item label="选择xxx" prop="xxxId">
  <el-select
    v-model="formData.xxxId"
    placeholder="请选择xxx"
    @change="onXxxChange"
  >
    <el-option
      v-for="tem in xxxList"
      :key="tem.id"
      :label="tem.name"
      :value="tem.id"
    />
  </el-select>
</el-form-item>
...
const xxxList = ref()
async function getXxxList (type = 1) {
  xxxList.value = await this.$axios.get('/api/xxx/select', { type })
}
// type 变化时，重新请求下拉框数据
function onTypeChange (type) {
  getXxxList(type)
}


<!-- 本框架写法，只需编写 js，并自动匹配新增、修改、详情三种模式 -->
...
{
  label: '选择xxx',
  fieldName: 'xxxId',
  type: EControlType.eSelect,
  props: {
    remote: {
      url: '/api/xxx/select',
      params: {
        type: '{formData.type}' // 使用'{}'，自动监听表单的 type 字段，变化时，重新获取数据
      },
      ...
    },
    onChange (id, formData) {}
  }
}
...
```
