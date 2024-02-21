import { useDictStore } from '@/stores/dict-store.js'
import { reactive } from 'vue'

/**
 * 使用字典功能
 * 
 * 用法：
 * import { useDict } from '@/hooks/useDict.js'
 * 一：
 * const dict = useDict(['is_delete', 'audit_status'])
 * dict['is_delete'] // 异步赋值 reactive 响应式对象 dict，dict['is_delete'] 将等于 [{id, name, ...}, {...}]
 * 二：
 * useDict(['is_delete'], dict => {
 *   console.log(dict['is_delete']) // 通过回调函数通知 dict 已加载好 => [{id, name, ...}, {...}]
 * })
 * 
 * @param {String | Array} types: 字典类型 或 字典类型数组
 * @param {Function} callback: 字典加载好了的回调函数
 */
export function useDict (types, callback) {
  const dictDataMap = reactive({})
  if (!Array.isArray(types)) {
    types = [types]
  }
  const { setDatasByTypes } = useDictStore()
  setDatasByTypes(types).then(dictMap => {
    for (const type of types) {
      dictDataMap[type] = dictMap[type]
    }
    if (typeof callback === 'function') {
      callback(dictDataMap)
    }
  })
  return dictDataMap
}
