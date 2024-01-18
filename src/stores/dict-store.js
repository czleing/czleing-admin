import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { isEmpty } from '@/utils/index.js'
// import axios from '@/api'
/**
 * 字典相关 store
 */
export const useDictStore = defineStore('dict', () => {
  const dictMap = reactive({}) // key: 字典类型，value: 字典项列表
  
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
    setDatasByTypes
  }
})