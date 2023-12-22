/**
 * 生成接口请求方式配置
 * @param {Object} apiMethodConfig 用户配置的接口请求方式
 * @returns 最终使用的请求方式
 */
export function useApiMethodConfig (apiMethodConfig = {}) {
  const useRestFull = import.meta.env.VITE_APP_USE_RESTFULL ?? false
  const apiMethod = {
    ...apiMethodConfig,
    add: apiMethodConfig?.add ?? 'post',
    update: apiMethodConfig?.update ?? (useRestFull ? 'put' : 'post'),
    detail: apiMethodConfig?.detail ?? (useRestFull ? 'get' : 'post'),
    list: apiMethodConfig?.list ?? (useRestFull ? 'get' : 'post'),
    delete: apiMethodConfig?.delete ?? (useRestFull ? 'delete' : 'post'),
    toggle: apiMethodConfig?.toggle ?? 'post',
    import: apiMethodConfig?.import ?? 'post',
    importTemplate: apiMethodConfig?.importTemplate ?? 'post',
    export: apiMethodConfig?.export ?? (useRestFull ? 'get' : 'post')
  }
  return { apiMethod }
}