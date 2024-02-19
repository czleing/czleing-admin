import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { isEmpty } from '@/utils/index.js'
import axios from '@/api'
/**
 * 字典相关 store
 */
export const useDictStore = defineStore('dict', () => {
  const dictMap = reactive({}) // key: 字典类型，value: 字典项列表
  let loadingTypes = []
  async function setDatasByTypes (types) {
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

  async function sleep (time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }

  async function getDatasByType (type) {
    // 防止频繁的重复请求
    if (loadingTypes.includes(type)) {
      let count = 0
      while (true) {
        count++
        if (count > 100) {
          return []
        }
        if (dictMap[type]) {
          return dictMap[type]
        } else {
          await sleep(100)
        }
      }
    }
    try {
      loadingTypes.push(type)
      const result = await axios.post(`/system/dict/data/type/${type}`)
      return result?.map(item => ({
        ...item,
        id: item.dictValue,
        name: item.dictLabel,
        label: item.dictLabel,
        value: item.dictValue
      }))
    } catch (e) {
      dictMap[type] = []
    } finally {
      loadingTypes = loadingTypes.filter(t => t !== type)
    }
  }

  return {
    dictMap,
    setDatasByTypes
  }
})