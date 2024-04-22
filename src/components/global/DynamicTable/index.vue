<!-- 动态表格，用于表单中动态添加多条数据，或动态展示多条数据 -->
<template>
  <div class="dynamic-table">
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
            <span v-if="column.required" class="text-danger normal">*</span>
            <a-tooltip v-if="column.tooltip" :title="column.tooltip">
              <QuestionCircleOutlined />
            </a-tooltip>
            {{ column.title }}
          </span>
        </template>
      </template>
      <template #bodyCell="{ text, record, index, column }">
        <template v-if="column.field">
          <a-form-item-rest>
            <CComponent v-model:value="record[column.dataIndex]" :field="column.field" :is-view="column.isView || disabled" @update:value="emitChange" />
          </a-form-item-rest>
        </template>
        <!-- 操作列 -->
        <template v-else-if="useDelete && column.type === 'action' && !disabled">
          <a v-if="modelValue.length > 1" href="javascript:;" @click="deleteHandle(index)">删除</a>
        </template>
      </template>
    </a-table>
    <div v-if="!disabled && modelValue.length <= maxNum" class="tc py10">
      <a class="" href="javascript:;" @click="addHandle">
        <PlusCircleOutlined />
        新增
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, provide, onMounted } from 'vue'
import { QuestionCircleOutlined, PlusCircleOutlined } from '@ant-design/icons-vue'
import CComponent from '@/components/crud/components/c-component'

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
   * required: true, // 该列是否必填
   * props: 组件属性配置
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
  ...props.columns.map(item => {
    return {
      ...item,
      type: undefined,
      rules: undefined,
      // align: item.align ?? 'center', // 默认居左，居中会导致部分控件展示怪异
      field: {
        label: item.title,
        fieldName: item.dataIndex,
        type: item.type,
        props: item.props
      }
    }
  })
])
onMounted(() => {
  if (!props.disabled && (!props.value || props.value.length === 0)) {
    addHandle()
  }
})

provide('FORM_DATA', {})

watch(
  () => props.value,
  (val) => {
    setData(val)
  },
  { immediate: true, deep: true }
)
watch(
  () => props.useDelete,
  (val) => {
    if (val) {
      this.currColumns.push(
        {
          title: '操作',
          key: 'action',
          align: 'center',
          type: 'action'
        }
      )
    }
  },
  { immediate: true }
)

function setData(val) {
  modelValue.value = val
    ? val.map((item) => ({ ...item, [props.primaryKey]: item[props.primaryKey] ?? Date.now() }))
    : []
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
