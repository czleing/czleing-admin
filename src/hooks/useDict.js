import { useDictStore } from '@/stores/dict-store.js'
import { reactive } from 'vue'
/**
 * 使用字典相关
 * @param {String | Array} types: 
 */
export function useDict (types) {
  const dictDataMap = reactive({})
  const { getDatasByTypes } = useDictStore()
  getDatasByTypes(types).then(dictMap => {
    for (const type of types) {
      dictDataMap[type] = dictMap[type]
    }
  })
  return dictDataMap
}