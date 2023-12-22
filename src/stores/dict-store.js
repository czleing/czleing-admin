import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { isEmpty } from '@/utils/index.js'
// import axios from '@/api'
/**
 * 字典相关 store
 */
export const useDictStore = defineStore('dict', () => {
  const dictMap = reactive({}) // key: dictType，value: 字典项列表
  
  async function getDatasByTypes (types) {
    if (isEmpty(types)) return
    if (!Array.isArray(types)) {
      types = [types]
    }
    for (const type of types) {
      if (!dictMap[type]) {
        dictMap[type] = await getDatasByType(type)
      }
    }
    return dictMap
  }

  async function getDatasByType (type) {
    // const result = await axios.get(`/system/dict/data/type/${type}`)
    // return result?.map(item => ({ ...item, id: item.dictValue, name: item.dictLabel }))
    console.log('模拟获取字典数据')
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          { type, id: 1, name: '启用', class: 'text-success' },
          { type, id: 0, name: '禁用', class: 'text-danger' },
        ])
      }, 1000)
    })
  }

  return {
    dictMap,
    getDatasByTypes
  }
})