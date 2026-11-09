import axios from 'axios'
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
    return Promise.reject(error)
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
      message.error({ content: '未登录或会话已过期,请重新登录', key: '401' })
      const authStore = useAuthStore()
      authStore.authExpiredHandle()
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
  const { data, headers } = response
  const filename = headers['download-filename']
  const url = window.URL.createObjectURL(new Blob([data], { type: headers['content-type'] }))
  // 创建一个 <a> 元素并模拟点击下载
  const link = document.createElement('a')
  link.href = url
  link.download = filename ? decodeURIComponent(filename) : 'download'
  link.click()
  // 清理 URL 和 <a> 元素
  link.remove()
  window.URL.revokeObjectURL(url)
}

// HTTP 状态码对应的错误提示
const HTTP_ERROR_MESSAGES = {
  400: '请求参数错误 Bad Request',
  401: '未登录或会话已过期,请重新登录',
  403: '禁止访问 Forbidden',
  404: '资源不存在 Not Found',
  405: '方法不允许 Method Not Allowed',
  408: '请求超时 Request Timeout',
  429: '请求过于频繁 Too Many Requests',
  500: '服务器内部错误 Internal Server Error',
  502: '网关错误 Bad Gateway',
  503: '服务不可用 Service Unavailable',
  504: '网关超时 Gateway Timeout'
}

// 统一处理错误
const handleRequestError = (error) => {
  const response = error.response
  let msg
  if (response) {
    // 服务器响应错误
    const { status } = response
    if (status === 401) {
      // HTTP 状态码 401 与业务 code 401 同样处理登录失效
      useAuthStore().authExpiredHandle()
    }
    msg = response.data?.message || HTTP_ERROR_MESSAGES[status] || '服务器响应错误 Service Error'
    console.error(msg, response)
  } else if (error.request) {
    msg = '请求未收到响应'
    console.error(msg, error.request)
  } else {
    msg = '请求配置出错'
    console.error(msg, error.message)
  }
  message.error({ content: msg, key: msg })
  return Promise.reject(new Error(msg)) // 阻止代码往下执行
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
