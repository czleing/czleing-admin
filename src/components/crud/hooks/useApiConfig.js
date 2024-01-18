import { useRoute } from 'vue-router'

/**
 * 根据当前接口配置及默认配置 生成 接口配置
 * @param {Object} apiConfig 
 * @returns 接口配置对象
 */
export function useApiConfig (apiConfig = {}) {
  const useRestFull = import.meta.env.VITE_APP_USE_RESTFULL ?? false
  const route = useRoute()
  const apiPrex = route.path // 如：/system/user
  const api = {
    ...apiConfig,
    add: apiConfig?.add ?? (useRestFull ? apiPrex : (apiPrex + '/add')), // 如：/system/user/add
    update: apiConfig?.update ?? (useRestFull ? apiPrex : (apiPrex + '/update')),
    detail: apiConfig?.detail ?? (useRestFull ? (apiPrex + '/:id') : (apiPrex + '/detail')),
    list: apiConfig?.list ?? apiPrex + '/list',
    delete: apiConfig?.delete ?? (useRestFull ? `${apiPrex}/:ids` : `${apiPrex}/delete`),
    toggle: apiConfig?.toggle ?? (apiPrex + '/toggle'),
    import: apiConfig?.import ?? (useRestFull ? (apiPrex + '/import') : (apiPrex + '/import')),
    importTemplate: apiConfig?.importTemplate ?? (apiPrex + '/importTemplate'),
    export: apiConfig?.export ?? (useRestFull ? (apiPrex + '/export') : (apiPrex + '/export'))
  }
  return {
    api
  }
}