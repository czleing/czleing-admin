import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { isEmpty } from '@/utils/index.js'
import axios from '@/api'
/**
 * 字典相关 store
 */
export const useDictStore = defineStore('dict', () => {
  const dictMap = reactive({}) // key: 字典类型，value: 字典项列表
  async function initDictByTypes (types) {
    if (isEmpty(types)) return
    if (!Array.isArray(types)) {
      types = [types]
    }
    types = types.filter(type => !dictMap[type])
    for (const type of types) {
      if (!dictMap[type]) {
        dictMap[type] = [] // 暂时赋值为空数组，阻止相同 type 的其他调用进入该判断，防止有相同的 type 进来重复请求
        dictMap[type] = await getDatasByType(type)
      }
    }
    return dictMap
  }

  async function getDatasByType (type) {
    try {
      const result = await axios.post(`/system/dict/data/type/${type}`)
      return result?.map(item => ({
        ...item,
        id: item.dictValue,
        name: item.dictLabel,
        label: item.dictLabel,
        value: item.dictValue
      }))
    } catch (e) {
      console.error('获取字典项数据失败', e)
      return []
    }
  }

  return {
    dictMap,
    initDictByTypes
  }
})