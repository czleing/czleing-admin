<!-- 表单使用示例 -->
<template>
  <div class="">
    <h3>基础使用</h3>
    <div class="w50p border radius10 pa20">
      <c-form
        :auto-reset="false"
        :show-cancel="false"
        :form-config="formConfig1"
        @submit-handle="onSubmitHandle"
      />
    </div>
    <h3 class="mt20">自由控制</h3>
    <div class="flex-x flex-wrap gap10">
      <a-button @click="validate">校验</a-button>
      <a-button @click="setData">设置数据</a-button>
      <a-button @click="getData1">获取转换前数据</a-button>
      <a-button @click="getData2">获取转换后数据</a-button>
      <a-button @click="submit">提交表单</a-button>
      <a-button @click="reset">重置表单</a-button>
    </div>
    <div class="w50p border radius10 pa20 mt10">
      <c-form
        ref="freeForm"
        :auto-reset="false"
        :footer="null"
        :form-config="formConfig2"
        :onSubmitHandle="onSubmitHandle"
      />
    </div>
  </div>
</template>

<script setup>
import cComponent from '@/components/crud/components/c-component';
import cForm from '@/components/crud/components/c-form.vue';
import { Modal } from 'ant-design-vue';
import dayjs from 'dayjs';
import { EControlType } from '@/enum'
import IconSelect from '@/components/common/IconSelect/index.vue'

defineOptions({ name: 'FormExample' })

// 基础使用
const formConfig1 = {
  fields: [
    {
      label: '姓名',
      fieldName: 'name',
      required: true
    },
    {
      label: '性别',
      fieldName: 'sex',
      type: EControlType.eRadio,
      rules: { required: true, message: '请选择性别' },
      props: {
        dictType: 'sys_user_sex'
      }
    },
    {
      label: '年龄',
      fieldName: 'age',
      type: EControlType.eNumber,
      props: {
        min: 1,
        max: 150
      }
    },
    {
      label: '职位',
      fieldName: 'post',
      type: EControlType.eSelect,
      props: {
        remote: {
          url: '/system/post/select',
          converter (list) {
            return list?.map(item => ({ id: item.postId, name: item.postName }))
          }
        }
      }
    },
  ]
}

// 自由控制
const formConfig2 = {
  cols: 1,
  fields: [
    {
      label: '姓名',
      fieldName: 'name',
      required: true
    },
    {
      label: '图标',
      fieldName: 'icon',
      type: EControlType.eCustom,
      props: {
        component: IconSelect
      }
    },
    {
      label: '性别',
      fieldName: 'sex',
      type: EControlType.eRadio,
      rules: { required: true, message: '请选择性别' },
      props: {
        dictType: 'sys_user_sex'
      }
    },
    {
      label: '出生日期',
      fieldName: 'birthday',
      type: EControlType.eDate,
    },
    {
      label: '日期范围',
      fieldName: 'dateRange',
      type: EControlType.eDateRange,
    }
  ]
}
const freeForm = useTemplateRef('freeForm')
function validate () {
  freeForm.value.validate()
}
function setData () {
  freeForm.value.setFormData({
    name: '张三',
    sex: '1',
    dateRange: [dayjs('2026-01-01'), dayjs('2026-12-30')]
  })
}
async function getData1 () {
  const data = await freeForm.value.validate()
  Modal.success({
    title: '获取到的转换前的数据',
    content: JSON.stringify(data),
  })
}
async function getData2 () {
  const data = await freeForm.value.getSubmitData()
  Modal.success({
    title: '获取到的转换后的数据',
    content: JSON.stringify(data),
  })
}
async function onSubmitHandle (submitData) {
  Modal.success({
    title: '提交的数据',
    content: JSON.stringify(submitData),
  })
}
function submit () {
  freeForm.value.submit()
}
function reset () {
  freeForm.value.reset()
}
</script>

<style lang="scss" scoped>
</style>
