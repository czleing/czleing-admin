<!-- 字典预览 -->
<template>
  <div class="dict-tag">
    <template v-for="(item, index) in currDicts">
      <template v-if="item.label">
        <span
          class="a-tag"
          v-if="item.tagType === 'default' || !item.tagType"
          :key="'s_' + index"
          :class="item.cssClass"
        >{{ item.label }}</span>
        <a-tag
          v-else
          :bordered="false"
          :key="'t_' + index"
          :color="item.tagType"
          :class="item.cssClass"
        >
          {{ item.label }}
        </a-tag>
      </template>
      <template v-else>
        {{ item.value }}
      </template>
    </template>
  </div>
</template>

<script setup>
import { useDict } from '@/hooks/useDict.js'

const props = defineProps({
  dictType: String,
  // 支持：id、id数组、id逗号分隔字符串
  value: [Number, String, Array],
  // 当未找到匹配的数据时，显示value
  showValue: {
    type: Boolean,
    default: true
  }
})

const currDicts = ref()
useDict([props.dictType], dicts => {
  let values = props.value
  if (typeof props.value === 'string') {
    values = props.value.split(',')
  } else if (typeof props.value === 'number') {
    values = [values]
  }
  currDicts.value = values?.map(val => {
    const dict = dicts[props.dictType]?.find(item => item.value === val)
    return dict ?? (props.showValue ? { value: val } : {})
  })
})
</script>

<style lang="scss" scoped>
.a-tag + .a-tag {
  margin-left: 10px;
}
</style>
