<!-- 省、省市、省市区选择器，单选、多选，绑定值为所选最后一级编码逗号分隔字符串，如：'110101' 或 '110101,110102' -->
<!-- 单选 -->
<!-- 省市区用法：<ProvinceCityArea v-model:value="area" /> -->
<!-- 省市用法：<ProvinceCityArea v-model:value="area" :levelNum="2" /> -->
<!-- 多选 -->
<!-- 省市区用法：<ProvinceCityArea v-model:value="area" multiple /> -->
<template>
  <a-spin :spinning="loading">
    <a-cascader
      v-if="!props.isView"
      v-model:value="selectedValue"
      :options="options"
      :placeholder="currPlaceholder"
      :change-on-select="true"
      :expand-trigger="'hover'"
      v-bind="$attrs"
      @change="handleChange"
    />
    <span v-else>{{ selectedNames }}</span>
  </a-spin>
</template>

<script setup>
import { province, city, area } from 'province-city-china/data'
const props = defineProps({
  // 省市(区)编码逗号分隔字符串, 只存放最后一级，单选：'101010'，多选：'101010,101109'
  value: String,
  /** 层级数，省：1， 省市：2， 省市区：3 */
  levelNum: { type: Number, default: 3 },
  placeholder: { type: String },
  // 查看模式，不会显示控件，直接显示值
  isView: { type: Boolean, default: false }
})
const selectedValue = ref([])
const options = ref([])
const loading = ref(true)
const currPlaceholder = computed(() => {
  if (props.placeholder) return props.placeholder
  return `请选择${'省市区'.substring(0, props.levelNum)}`
})
const selectedNames = computed(() => {
  if (selectedValue.value && options.value.length) {
    const nameArr = []
    let currItem = null
    for (let code of selectedValue.value) {
      if (!currItem) {
        currItem = options.value.find(o => o.value === code)
      } else {
        currItem = currItem.children?.find(o => o.value === code)
      }
      if (currItem?.label) {
        nameArr.push(currItem.label)
      }
    }
    return nameArr.join(',')
  } else {
    return ''
  }
})
// 直辖市、特别行政区 Codes，这种 code 数据的省级下面没有市，要直接跳到区，需要特殊处理
const specialCodes = ['110000', '120000', '310000', '500000', '810000', '820000']
// 还原层级时需要排除的 codes
const excludeCodes = specialCodes.map(code => code.substring(0, 2) + '0100')

initData()

watch(
  () => props.value,
  (val) => {
    setValue(val)
  },
  { immediate: true }
)

function setValue (val) {
  // 将只有最后一层还原成 ant-design 组件需要的三层格式，此处特殊的直辖市、经济特区只有两层，需排除中间一层
  // '1011' => [1000, 1011] // 选择的是第二级，还原时只需还原两级
  // '110000' => [110000] // 选择的是第一级，还原时只还原一级
  // '101102' => [100000,101100,101102] // 选择的是第三级，还原时需还原三级
  // '101102,221103' => [[100000,101100,101102], [220000,221100,221103]] // 多选时，选择多个第三级，还原时每个还原出三级
  const values = val ? val.split(',') : []
  let backValues = values.map(leafCode => {
    const level = leafCode.length / 2
    const codes = []
    for (let i = 0; i < level; i++) {
      if (leafCode.substring(i * 2, i * 2 + 2) !== '00') {
        const code = leafCode.substring(0, i * 2 + 2).padEnd(leafCode.length, '0')
        if (!excludeCodes.includes(code.padEnd(6, '0'))) {
          codes.push(code)
        }
      }
    }
    return codes
  })
  if (values.length === 1) {
    selectedValue.value = backValues[0]
  } else {
    selectedValue.value = backValues
  }
}

async function initData () {
  // console.log('===province==', province)
  // console.log('===city==', city)
  // console.log('===area==', area)
  try {
    loading.value = true
    await nextTick()
    const getArea = (province, city) => {
      return props.levelNum >= 3 ? area.filter(a => a.province === province && a.city === city).map(a => ({
        value: a.code,
        label: a.name
      })) : undefined
    }
  
    const getCity = (province) => {
      return props.levelNum >= 2 ? city.filter(c => c.province === province).map(c => ({
        value: c.code,
        label: c.name,
        children: getArea(c.province, c.city)
      })) : undefined
    }
    options.value = province.map(p => ({
      value: p.code,
      label: p.name,
      children: specialCodes.includes(p.code) ? getArea(p.province, '01') : getCity(p.province)
    }))
  } finally {
    loading.value = false
  }
}

const emits = defineEmits(['update:value', 'change'])

async function handleChange (val) {
  selectedValue.value = val
  // 只返回最后一层，并且以字符串形式逗号拼接
  // 非三级单选时：[1000,1010] => '1010'
  // 单选时：[100000,101000,101010] => '101010'
  // 多选时：[[100000,101000,101010], [100000,101000,101011]] => '101010,101011'
  const returnValue = isArrArr(val) ? val.map(arr => arr.at(-1)).join(',') : val?.at(-1)
  emits('update:value', returnValue)
  await nextTick()
  emits('change', returnValue, selectedNames.value)
}

function isArrArr (value) {
  return value && Array.isArray(value) && value.length && Array.isArray(value[0])
}
</script>

<style lang="scss" scoped>
</style>
