<!-- 动态表格，用于表单中动态添加多条数据，或动态展示多条数据 -->
<template>
  <div class="dynamic-table">
    <a-form-item-rest>
      <a-table
        :columns="currColumns"
        :data-source="modelValue"
        :pagination="false"
        v-bind="$attrs"
        :rowKey="primaryKey"
      >
        <template #headerCell="{ column }">
          <template v-if="column.title">
            <span>
              <a-tooltip v-if="column.tooltip" :title="column.tooltip">
                <QuestionCircleOutlined />
              </a-tooltip>
              {{ column.title }}
            </span>
          </template>
        </template>
        <template #bodyCell="{ text, record, index, column }">
          <template v-if="column.field">
            <div class="flex-x x-middle gap2">
              <span v-if="getFnValue(column.required, record, modelValue)" class="text-danger">*</span>
              <CComponent
                v-model:value="record[column.dataIndex]"
                :field="getFinalField(column.field, record)"
                :is-view="column.isView || disabled"
                @update:value="(val) => handleChange(val, record, column.field)"
              />
            </div>
          </template>
          <!-- 操作列 -->
          <template v-else-if="useDelete && column.type === 'action' && !disabled">
            <a-popconfirm
              v-if="modelValue.length > 1"
              placement="left"
              title="确认要删除改行吗？"
              @confirm="deleteHandle(index)"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
      <div v-if="!disabled && modelValue.length <= maxNum" class="tc py10">
        <a class="" href="javascript:;" @click="addHandle">
          <PlusCircleOutlined />
          新增
        </a>
      </div>
    </a-form-item-rest>
  </div>
</template>

<script setup>
import { QuestionCircleOutlined, PlusCircleOutlined } from '@ant-design/icons-vue'
import CComponent from '@/components/crud/components/c-component'
import { getFnValue } from '@/utils'

const props = defineProps({
  // 组件值，对象数组
  value: {
    type: Array,
    default: () => []
  },
  // 主键字段名
  primaryKey: { type: String, default: 'id' },
  // 最大条数限制
  maxNum: {
    type: Number,
    default: 10
  },
  /**
   * 列信息，对象数组
   * title: 表头名称
   * tooltip: 表头提示说明
   * dataIndex: 该列对应字段名
   * width: 100, // 宽度
   * minWidth: 40,
   * maxWidth: 200,
   * type: 控件类型，枚举：EControlType
   * defaultValue: 默认值
   * hidden: true, // 该列隐藏（类似 <input type="hidden" /> 适合需要给每行附加固定字段，又不需要显示出来的场景）
   * required: true, // 该列是否必填，支持函数 Boolean | (record, records) => Boolean
   * disabled: false, // 该列是否禁用，支持函数 Boolean | (record, records) => Boolean
   * isView: false, // 该列是否仅展示文本值
   * props: 组件属性配置
   * props.onChange: // 控件值改变事件，通过修改record里的属性进行多列间联动 (val, record, records) => {}
   */
  columns: {
    type: Array,
    required: true
  },
  // 是否禁用组件，禁用后只能查看，不能操作
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否需要删除按钮
  useDelete: {
    type: Boolean,
    default: true
  }
})

const modelValue = ref([])
const currColumns = ref([
  ...props.columns.filter(item => !item.hidden).map(item => {
    return {
      ...item,
      type: undefined,
      rules: undefined,
      disabled: undefined,
      // align: item.align ?? 'center', // 默认居左，居中会导致部分控件展示怪异
      field: {
        label: item.title,
        fieldName: item.dataIndex,
        type: item.type,
        disabled: item.disabled,
        props: item.props
      }
    }
  })
])
if (props.useDelete) {
  currColumns.value.push(
    {
      title: '操作',
      key: 'action',
      align: 'center',
      type: 'action'
    }
  )
}
onMounted(() => {
  if (!props.disabled && (!props.value || props.value.length === 0)) {
    addHandle()
  }
})

watch(
  () => props.value,
  (val) => {
    setData(val)
  },
  { immediate: true, deep: true }
)

function setData(val) {
  modelValue.value = val ?? []
  modelValue.value.forEach(item => {
    item[props.primaryKey] = item[props.primaryKey] ?? Date.now()
  })
}

// 获取最终的字段配置，将动态的函数形式的值转成具体值
function getFinalField (field, record) {
  return {
    ...field,
    required: getFnValue(field.required, record, modelValue.value),
    props: {
      ...field.props,
      placeholder: getFnValue(field.placeholder, record, modelValue.value),
      disabled: getFnValue(field.disabled, record, modelValue.value),
    }
  }
}

function handleChange (val, record, field) {
  if (typeof field.props?.onChange === 'function') {
    field.props.onChange(val, record, modelValue) // 中转 onUpdate:value 事件，增加事件参数
  }
  emitChange()
}

/** 删除一行 */
function deleteHandle(index) {
  modelValue.value.splice(index, 1)
  emitChange()
}
/** 新增一行 */
function addHandle() {
  const emptyObj = { [props.primaryKey]: Date.now() }
  props.columns.forEach((item) => {
    emptyObj[item.dataIndex] = item.defaultValue ?? null
  })
  modelValue.value.push(emptyObj)
  emitChange()
}

const emit = defineEmits(['update:value', 'change'])
async function emitChange() {
  await nextTick()
  emit('update:value', modelValue.value)
  emit('change', modelValue.value)
}
</script>

<style lang="scss" scoped>
</style>
