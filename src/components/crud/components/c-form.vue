<!-- 表单组件 -->
<template>
  <div class="c-form" :class="{ 'is-view': isView }">
    <a-form
      name="inputForm"
      ref="inputForm"
      :model="formData"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      autocomplete="off"
    >
      <a-row :gutter="15">
        <template v-for="field in currFields" :key="field.fieldName || field.title">
          <template v-if="isFieldGroup(field)">
            <!-- 控件组 -->
            <a-col span="24">
              <FieldGroup :title="getFnValue(field.title, formData)" :subTitle="getFnValue(field.subTitle, formData)">
                <a-row :gutter="15">
                  <template v-for="child in field.fields" :key="child.fieldName">
                    <a-col :span="child.colSpan">
                      <a-form-item v-bind="formItemProps(child)">
                        <CComponent v-model:value="formData[child.fieldName]" :field="child" :is-view="isView" />
                      </a-form-item>
                    </a-col>
                  </template>
                </a-row>
              </FieldGroup>
            </a-col>
          </template>
          <template v-else>
            <!-- 控件 -->
            <a-col :span="field.colSpan">
              <a-form-item v-bind="formItemProps(field)">
                <CComponent v-model:value="formData[field.fieldName]" :field="field" :is-view="isView" />
              </a-form-item>
            </a-col>
          </template>
        </template>
      </a-row>
    </a-form>
    <!-- 提交按钮，单独使用表单组件时使用 -->
    <div v-if="showConfirm || showCancel" class="mt20" :class="alignClass">
      <a-button v-if="showCancel" type="default" :disabled="loading" @click="cancel">{{ cancelText }}</a-button>
      <a-button v-if="showConfirm" type="primary" :loading="loading" @click="submit">{{ confirmText }}</a-button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, provide, inject, reactive, watch, nextTick } from 'vue'
import CComponent from './c-component.js'
import { isDayjs, getFnValue, loadingRequest, isEmpty } from '@/utils/index'
import { EControlType } from '@/enum'

const props = defineProps({
  isAdd: Boolean,
  isEdit: Boolean,
  isView: Boolean,
  primaryKey: { type: String, default: 'id' }, // 主键字段名
  detail: { type: Object, default: () => ({}) }, // 修改、查看详情时的详情数据
  formConfig: { type: Object, required: true }, // 表单配置信息
  beforeSubmit: Function, // 提交表单前，对数据进行手工处理的函数，submitData => modifiedSubmitData
  onSubmitHandle: Function, // 校验通过之后，对提交的数据进行处理，如请求接口将数据提交到服务器、提交成功提示、刷新列表
  // 以下为自定义提交、取消按钮属性
  showConfirm: { type: Boolean, default: true },
  confirmText: { type: String, default: '提交' },
  confirmContinue: { type: [Boolean, Function], default: false },
  showCancel: { type: Boolean, default: true },
  cancelText: { type: String, default: '取消' },
  confirmAlign: { type: String, default: 'right' }, // 提交、取消按钮对齐方式，left，center，right
  autoReset: { type: Boolean, default: true }, // 提交之后自动清空表单
})

const inputForm = ref()
// const inModal = inject('IN_MODAL', false)
const closeModal = inject('CLOSE_MODAL', null)
const formData = reactive({})
const loading = ref(false)
const { labelCol, wrapperCol, colSize } = props.formConfig // 已经解构失去响应式
const colSpan = parseInt(24 / colSize)
let dateFields = [] // 收集的日期字段数组，便于统一转换格式
let dateRangeFields = [] // 收集的日期范围字段数组
let rangeFieldNamesMap = {} // 日期范围，一般有两个值，其字段名用 map 暂存
const currFields = computed(() => {
  // 对字段配置信息做初步整理
  pushDateFields()
  pushDateRangeFields()
  const initFields = (_fields) => {
    return _fields.filter(field => inUse(field)).map(item => {
      // 字段组，递归处理
      if (isFieldGroup(item)) {
        item.fields = initFields(item.fields)
      }
      // 详情时，使用独有的 detailConfig 覆盖原有属性配置
      if (props.isView && item.detailConfig) {
        item = Object.assign({ ...item, detailConfig: undefined }, item.detailConfig)
      }
      // 日期类型字段收集，便于统一数据转换
      if (item.type === EControlType.eDate) {
        pushDateFields(item.fieldName)
      } else if (item.type === EControlType.eDateRange) {
        pushDateRangeFields(item.fieldName, item.props.fieldNames)
      } else if (item.type === EControlType.eTable) {
        // 表格类型，根据 columns 自动生成 rules
        setTableRules(item)
      }
      item.colSpan = item.singleLine ? 24 : colSpan
      if (!props.isView) {
        item.props = item.props ?? {}
        item.props.disabled = getFnValue(item.disabled, formData)
      }
      return item
    })
  }
  return initFields(props.formConfig.fields)
})
const alignClass = computed(() => {
  return {
    'left': 'tl',
    'center': 'tc',
    'right': 'tr'
  }[props.confirmAlign]
})

// 共享给子组件的变量
provide('FORM_DATA', formData)

// 监听详情数据，同步回填至表单
watch(
  () => props.detail,
  () => {
    setFormData(currFields.value)
  },
  { deep: true, immediate: true }
)

// 设置表单值或默认值
setFormData(currFields.value)
function setFormData (fieldTree) {
  fieldTree.forEach(field => {
    if (isFieldGroup(field)) {
      setFormData(field.fields)
    } else {
      formData[field.fieldName] = props.detail[field.fieldName] ?? field.defaultValue
    }
  })
}

/** 是否是字段分组 */
function isFieldGroup (field) {
  return !!field?.fields
}

/** 该字段是否可用 */
function inUse (field) {
  return !getFnValue(field.none, formData)
}

/** 通过字段配置，生成表单项的属性 */
function formItemProps (field) {
  return {
    labelCol: field.labelCol ?? labelCol ?? { span: 6 },
    wrapperCol: field.wrapperCol ?? wrapperCol ?? { span: 18 },
    name: field.fieldName,
    label: getFnValue(field.label, formData),
    disabled: props.isView ? false : getFnValue(field.disabled, formData),
    required: props.isView ? false : getFnValue(field.required, formData),
    tooltip: getFnValue(field.tooltip, formData),
    extra: props.isView ? undefined : getFnValue(field.extra, formData),
    rules: props.isView ? undefined : getFnValue(field.rules, formData)
  }
}

/** 重置表单 */
function reset () {
  inputForm.value.resetFields()
  const resetDatas = (fields) => {
    fields.forEach(field => {
      if (isFieldGroup(field)) {
        resetDatas(field.fields)
      } else {
        formData[field.fieldName] = field.defaultValue
      }
    })
  }
  resetDatas(currFields.value)
}

/** 日期数据统一转换 */
function transferDate (data) {
  for (const key in data) {
    const value = data[key]
    if (dateFields.includes(key) && isDayjs(value)) {
      // 日期字段处理
      data[key] = value.valueOf()
    } else if (dateRangeFields.includes(key) && Array.isArray(value)) {
      // 日期范围字段处理
      const fieldNames = rangeFieldNamesMap[key]
      data[fieldNames[0]] = value[0].valueOf()
      data[fieldNames[1]] = value[1].valueOf()
      delete data[key]
    }
  }
}
function pushDateFields (fieldName) {
  if (fieldName) {
    dateFields.push(fieldName)
  } else {
    dateFields = []
  }
}
function pushDateRangeFields (fieldName, fieldNames) {
  if (fieldName) {
    dateRangeFields.push(fieldName)
    rangeFieldNamesMap[fieldName] = fieldNames
  } else {
    dateRangeFields = []
    rangeFieldNamesMap = {}
  }
}

/** 动态表格类型组件，表单校验封装 */
function setTableRules (field) {
  const columns = field.props?.columns ?? []
  if (columns.length === 0) return
  let isRequired = false
  let hasValidator = false
  columns.forEach(item => {
    if (item.required && !isRequired) {
      isRequired = true
    }
    if (!!item.validate && !hasValidator) {
      hasValidator = true
    }
  })

  field.rules = []
  if (isRequired) {
    field.rules.push({ type: 'array', required: true, message: field.label + '不能为空' })
  }
  if (hasValidator) {
    field.rules.push({
      validator (rule, list) {
        if (Array.isArray(list) && list.length > 0) {
          for (let i in list) {
            const obj = list[i]
            for (let c in columns) {
              const column = columns[c]
              if (column.required && isEmpty(obj[column.dataIndex])) {
                return Promise.reject(`第[${ Number(i) + 1 }]行[${ column.title }]不能为空`)
              } else if (typeof column.validate === 'function') {
                const message = column.validate(Number(i), obj[column.dataIndex], obj)
                if (message) {
                  return Promise.reject(message)
                }
              }
            }
          }
        }
        return Promise.resolve()
      },
      trigger: 'change'
    })
  }
}

/** 取消 */
function cancel () {
  if (closeModal) {
    closeModal()
  }
}

/** 提交表单 */
function submit () {
  loadingRequest(loading, async () => {
    if (import.meta.env.VITE_APP_DEBUG_MODE) {
      console.log('formData', formData)
    }
    await inputForm.value.validate()
    let submitData = { ...formData }
    // 日期统一转成时间戳
    transferDate(submitData)
    if (props.beforeSubmit) {
      submitData = await props.beforeSubmit(submitData, {
        isAdd: props.isAdd,
        isEdit: props.isEdit,
        detail: props.detail
      })
    }
    if (props.isEdit && props.primaryKey) {
      submitData[props.primaryKey] = props.detail[props.primaryKey]
    }
    if (import.meta.env.VITE_APP_DEBUG_MODE) {
      console.log('submitData', submitData)
    }
    if (props.onSubmitHandle) {
      await props.onSubmitHandle(submitData)
    }
    if (props.autoReset) {
      reset()
    }
    if (typeof props.confirmContinue === 'function') {
      await nextTick()
      props.confirmContinue(formData, submitData)
    } else if (closeModal) {
      !props.confirmContinue && closeModal()
    }
  })
}

function validate () {
  return inputForm.value.validate() // 校验成功返回表单数据
}

defineExpose({
  submit,
  validate,
  reset
})
</script>

<style lang="scss" scoped>
.c-form {
  padding-top: 10px;
  &.is-view {
    ::v-deep(.ant-form-item) {
      margin-bottom: 10px;
    }
    ::v-deep(.ant-form-item-label) {
      opacity: .8;
    }
    // ::v-deep(.ant-form-item-control) {
    //   font-weight: bold;
    // }
  }
}
</style>
