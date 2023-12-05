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
      <a-row>
        <template v-for="field in currFields" :key="field.fieldName || field.title">
          <!-- 控件组 -->
          <template v-if="isFieldGroup(field)">
            <a-col span="24">
              <FieldGroup :title="field.title" :subTitle="getSubTitle(field)">
                <a-row>
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
          <!-- 控件 -->
          <template v-else>
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
    <div v-if="showConfirm || showCancel" class="mt20 tr">
      <a-button v-if="showCancel" type="default" :disabled="loading" @click="cancel">{{ cancelText }}</a-button>
      <a-button v-if="showConfirm" type="primary" :loading="loading" @click="submit">{{ confirmText }}</a-button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, provide, inject, reactive, watch } from 'vue'
import CComponent from './c-component.js'
import { getFnValue, loadingRequest } from '@/utils/index'

const props = defineProps({
  isAdd: Boolean,
  isEdit: Boolean,
  isView: Boolean,
  detail: { type: Object, default: () => ({}) },
  formConfig: { type: Object, required: true },
  beforeSubmit: Function,
  onSubmitHandle: Function,
  showConfirm: { type: Boolean, default: true },
  confirmText: { type: String, default: '提交' },
  showCancel: { type: Boolean, default: true },
  cancelText: { type: String, default: '取消' }
})

const inputForm = ref()
// const inModal = inject('IN_MODAL', false)
const closeModal = inject('CLOSE_MODAL', null)
const formData = reactive({})
const loading = ref(false)
const { labelCol, wrapperCol, colSize } = props.formConfig // 已经解构失去响应式
const colSpan = parseInt(24 / colSize)
const currFields = computed(() => {
  const initFields = (_fields) => {
    return _fields.filter(field => isVisible(field)).map(item => {
      // 字段组，递归处理
      if (isFieldGroup(item)) {
        item.fields = initFields(item.fields)
      }
      // 详情时，覆盖属性配置
      if (props.isView && item.detailConfig) {
        item = Object.assign(item, item.detailConfig)
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

provide('FORM_DATA', formData)
provide('A_FORM', inputForm)

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
function isFieldGroup (field) {
  return field?.fields
}
function isVisible (field) {
  if (typeof field.none === 'function') {
    return !field.none(formData)
  } else {
    return !field.none
  }
}
function getSubTitle (field) {
  if (typeof field.subTitle === 'function') {
    return field.subTitle(formData)
  } else {
    return field.subTitle
  }
}
function formItemProps (field) {
  return {
    labelCol: field.labelCol ?? labelCol ?? { span: 6 },
    wrapperCol: field.wrapperCol ?? wrapperCol ?? { span: 18 },
    name: field.fieldName,
    label: field.label,
    disabled: props.isView ? false : getFnValue(field.disabled, formData),
    required: props.isView ? false : getFnValue(field.required, formData),
    tooltip: getFnValue(field.tooltip, formData),
    extra: props.isView ? undefined : getFnValue(field.extra, formData),
    rules: props.isView ? undefined : field.rules
  }
}

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
/** 取消 */
function cancel () {
  if (closeModal) {
    closeModal()
  }
}
/** 提交表单 */
function submit () {
  loadingRequest(loading, async () => {
    await inputForm.value.validate()
    const submitData = { ...formData }
    if (props.beforeSubmit) {
      submitData = await props.beforeSubmit(submitData, { isAdd: props.isAdd, isEdit: props.isEdit, isView: props.isView, detail: props.detail })
    }
    console.log('submitData', submitData)
    if (props.isEdit) {
      submitData.id = props.detail.id
    }
    if (props.onSubmitHandle) {
      await props.onSubmitHandle(submitData)
    }
    reset()
    if (closeModal) {
      closeModal()
    }
  })
}

defineExpose({
  submit,
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
  }
}
</style>
