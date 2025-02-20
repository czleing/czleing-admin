import { defineStore } from 'pinia'
import { isEmpty } from '@/utils/index.js'
import axios from '@/api'
/**
 * 字典相关 store
 */
export const useDictStore = defineStore('dict', () => {
  const dictMap = reactive({}) // key: 字典类型，value: 字典项列表
  const cache = {}
  async function initDictByTypes (types) {
    if (isEmpty(types)) return
    if (!Array.isArray(types)) {
      types = [types]
    }
    types = types.filter(type => !dictMap[type])
    for (const type of types) {
      dictMap[type] = await getDatasByType(type)
    }
    return dictMap
  }

  /**
   * 通过字典类型获取字典数据列表
   * 高并发调用时，相同类型只会请求一次接口，其余的调用则会直接返回 Promise，防止重复请求
   * @param {String} type 
   * @returns 
   */
  async function getDatasByType (type) {
    if (cache[type]) {
      return cache[type]
    }
    cache[type] = axios.post(`/system/dict/data/type/${type}`).then(result => {
      const dicts = result?.map(item => ({
        ...item,
        id: item.dictValue,
        name: item.dictLabel,
        label: item.dictLabel,
        value: item.dictValue
      }))
      cache[type] = dicts
      return dicts
    }).catch(e => {
      console.error('获取字典项数据失败', e)
      return []
    })
    return cache[type]
  }

  return {
    dictMap,
    initDictByTypes
  }
})
