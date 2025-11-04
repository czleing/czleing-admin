import axios from 'axios'
import router from '@/router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/auth-store'
import { useTabsStore } from '@/stores/tabs-store'

// 创建 Axios 实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000
})
// 请求拦截器
instance.interceptors.request.use((config) => {
    // 在请求发送之前可以进行一些处理，例如设置 token、添加请求头等
    const authStore = useAuthStore()
    const token = authStore.token
    if (token) {
      config.headers.authorization = config.headers.authorization ?? ('Bearer ' + token)
    }
    return config
  }, (error) => {
    return Promise.reject()
  }
)

// 响应拦截器
instance.interceptors.response.use((response) => {
  const { data } = response
  // 在接收到响应数据之前可以进行一些处理，例如解析响应数据、错误处理等
  // ...
  const contentType = response.headers['content-type']
  if (contentType?.indexOf('application/octet-stream') > -1 ||
    contentType?.indexOf('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') > -1) {
    // 注意：Blob类型文件下载需要请求头参数添加 responseType:'blob'  下载 导出等功能需要
    handleDownload(response)
  } else {
    if (data?.code === 401) {
      message.error('未登录或会话已过期,请重新登录')
      const authStore = useAuthStore()
      const tabStore = useTabsStore()
      authStore.clearAuthInfo()
      tabStore.clearAllTabs()
      const currentPath = router.currentRoute.value.fullPath
      router.replace({
        path: '/login',
        query: { redirect: currentPath }
      })
      return Promise.reject(new Error('未登录或会话已过期,请重新登录'))
    } else if (data?.code === 200) {
      // 响应数据是有效的 JSON 格式，继续处理
      let result = data
      if (data.list !== undefined) { // 分页列表的情况，返回分页对象
        result = data
      } else if (data.data !== undefined) { // 单个对象的情况，返回对象
        result = data.data
      }
      return Promise.resolve(result)
    } else {
      let msg = data?.msg ?? '服务器繁忙'
      msg = msg.length > 100 ? '系统错误' : msg
      message.error(msg)
      return Promise.reject(new Error(msg))
    }
  }
}, (error) => {
  // 统一处理错误
  return handleRequestError(error)
})

// 下载blob二进制文件
const handleDownload = (response) => {
  const filename = response.headers['download-filename']
  const blob = new Blob([response.data])
  if (window.navigator.msSaveBlob) {
    // 兼容 IE，使用 msSaveBlob 方法进行下载
    window.navigator.msSaveBlob(blob, decodeURIComponent(filename))
  } else {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    // 创建一个 <a> 元素
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', decodeURIComponent(filename))
    // 模拟点击下载
    link.click()
    // 清理 URL 和 <a> 元素
    link.remove()
    window.URL.revokeObjectURL(url)
  }
}

// 统一处理错误
const handleRequestError = (error) => {
  // 进行错误处理
  if (error.response) {
    // 服务器响应错误
    let status = error.response.status
    // 在这里可以进行错误处理逻辑，例如弹出错误提示、记录错误日志等
    switch (status) {
      case 400:
        console.error('参数校验失败:', error.response.data.message)
        message.error(error.response.data.message || '参数校验失败')
        return Promise.reject(error.response.data.message ?? '参数json解析失败')
      case 404:
        console.error('404:', error.response.data.message)
        message.error(error.response.data.message || '资源不存在')
        return Promise.reject({ error: '接口不存在', message: error.response.data.message })
      case 500:
        console.error('服务器内部错误:', error.response.data.message)
        message.error(error.response.data.message || '服务器内部错误')
        return Promise.reject({ error: '服务器内部错误', message: error.response.data.message })
      default:
        message.error('服务器响应错误')
        console.error('服务器响应错误:', error.response.data)
    }
  } else if (error.request) {
    // 请求未收到响应
    console.error('请求未收到响应:', error.request)
    message.error('请求未收到响应')
    // 在这里可以进行错误处理逻辑，例如弹出错误提示、记录错误日志等
  } else {
    // 请求配置出错
    console.error('请求配置出错:', error.message)
    message.error('请求配置出错')
    // 在这里可以进行错误处理逻辑，例如弹出错误提示、记录错误日志等
  }
}

// 封装请求方法
class AxiosService {
  constructor () {
    if (AxiosService.instance) {
      return AxiosService.instance
    }
    AxiosService.instance = this
  }

  // GET 请求
  get (url, params = {}, config) {
    return instance({
      method: 'get',
      url,
      params,
      headers: config?.headers
    })
  }

  // POST 请求
  post (url, data = {}, config) {
    return instance.request({
      method: 'post',
      url,
      data,
      responseType: config?.responseType,
      headers: config?.headers
    })
  }

  // 下载 请求
  download (url, data = {}, config) {
    return instance.request({
      method: 'post',
      url,
      data,
      responseType: 'blob',
      headers: config?.headers
    })
  }

  // PUT 请求
  put (url, data = {}) {
    return instance.request({
      method: 'put',
      url,
      data
    })
  }

  // DELETE 请求
  delete (url, data = {}) {
    return instance.request({
      method: 'delete',
      url,
      data
    })
  }
}

// 创建 AxiosService 实例
const axiosService = new AxiosService()

// 导出实例化后的 AxiosService 对象
export default axiosService

export const $axios = axiosService
