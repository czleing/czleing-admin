<!-- 省、省市、省市区选择器，绑定值为所选最后一级编码逗号分隔字符串 -->
<!-- 单选 -->
<!-- 省市区用法：<ProvinceCityArea v-model:value="area" /> -->
<!-- 省市用法：<ProvinceCityArea v-model:value="area" :levelNumber="2" /> -->
<!-- 多选 -->
<!-- 省市区用法：<ProvinceCityArea v-model:value="area" multiple /> -->
<template>
  <a-cascader
    v-if="!props.isView"
    v-model:value="selectedValue"
    :options="options"
    :placeholder="placeholder"
    :change-on-select="true"
    :expand-trigger="'hover'"
    v-bind="$attrs"
    @change="handleChange"
  />
  <span v-else>{{ selectedNames }}</span>
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
const placeholder = computed(() => {
  if (props.placeholder) return props.placeholder
  return `请选择${'省市区'.substring(0, props.levelNum)}`
})
const selectedNames = computed(() => {
  if (selectedValue.value && options.value.length) {
    const nameArr = []
    let parent = null
    for (let code in selectedValue.value) {
      if (!parent) {
        parent = options.value.find(o => o.value === code)
      } else {
        parent = parent.children?.find(o => o.value === code)
      }
      nameArr.push(parent.label)
    }
    return nameArr.join(',')
  } else {
    return '-'
  }
})

onMounted(() => {
  initData()
})

watch(
  () => props.value,
  (val) => {
    setValue(val)
  },
  { immediate: true }
)

function setValue (val) {
  // 将只有最后一层还原成 ant-design 组件需要的三层格式
  // 1011 => [1000, 1011]
  // 101102 => [100000,101100,101102]
  // 101102,101103 => [[100000,101100,101102], [100000,101100,101103]]
  const values = val ? val.split(',') : []
  selectedValue.value = values.map(leafCode => {
    const level = leafCode.length / 2
    const codes = []
    for (let i = 0; i < level; i++) {
      if (leafCode.substring(i * 2, i * 2 + 2) !== '00') {
        codes.push(leafCode.substring(0, i * 2 + 2).padEnd(leafCode.length, '0'))
      }
    }
    return codes
  })
}

function initData () {
  // console.log('===province==', province)
  // console.log('===city==', city)
  // console.log('===area==', area)
  options.value = province.map(p => ({
    value: p.code,
    label: p.name,
    children: props.levelNum >= 2
      ? city.filter(c => c.province === p.province).map(c => ({
          value: c.code,
          label: c.name,
          children: props.levelNum >= 3
            ? area.filter(a => a.province === c.province && a.city === c.city).map(a => ({
                value: a.code,
                label: a.name
              }))
            : undefined
        }))
      : undefined
  }))
}

const emits = defineEmits(['update:value'])

function handleChange (val) {
  selectedValue.value = val
  // 只返回最后一层，并且以字符串形式
  // 非三级单选时：[1000,1010] => '1010'
  // 单选时：[100000,101000,101010] => '101010'
  // 多选时：[[100000,101000,101010], [100000,101000,101011]] => '101010,101011'
  function isArrArr (val) {
    return val && Array.isArray(val) && val.length && Array.isArray(val[0])
  }
  const returnValue = isArrArr(val) ? val.map(arr => arr.at(-1)).join(',') : val.at(-1)
  // console.log('returnValue', returnValue)
  emits('update:value', returnValue)
}

</script>

<style lang="scss" scoped>
</style>
