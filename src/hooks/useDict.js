import { useDictStore } from '@/stores/dict-store.js'
import { reactive } from 'vue'

/**
 * 使用字典相关
 * 
 * 用法：
 * import { useDict } from '@/hooks/useDict.js'
 * 
 * const dict = useDict(['is_delete', 'audit_status'])
 * console.log(dict['is_delete']) // => [{id, name, ...}, {...}]
 * 
 * @param {String | Array} types: 字典类型 或 字典类型数组
 */
export function useDict (types) {
  const dictDataMap = reactive({})
  if (!Array.isArray(types)) {
    types = [types]
  }
  const { setDatasByTypes } = useDictStore()
  setDatasByTypes(types).then(dictMap => {
    for (const type of types) {
      dictDataMap[type] = dictMap[type]
    }
  })
  return dictDataMap
}
