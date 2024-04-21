<!-- 字典项管理 -->
<template>
  <CPage
    ref="cPage"
    primary-key="dictCode"
    :api-config="{
      add: '/system/dict/data/add',
      update: '/system/dict/data/update',
      detail: '/system/dict/data/detail/:id',
      delete: '/system/dict/data/delete/:ids',
      list: '/system/dict/data/list',
      toggle: '/system/dict/data/toggle'
    }"
    :filter-config="filterConfig"
    :table-config="tableConfig"
    :modal-config="modalConfig"
    :before-search="beforeSearch"
    :before-submit="beforeSubmit"
  >
    <template #table_dictLabel="{ text, record }">
      <a-tag :bordered="false" :color="record.tagType">{{ text }}</a-tag>
    </template>
  </CPage>
</template>

<script setup>
import { computed, watch, ref, nextTick } from 'vue'
import CPage from '@/components/crud/c-page.vue'
import { EControlType } from '@/enum/index.js'

const props = defineProps({
  dictType: String
})

const cPage = ref()

watch(
  () => props.dictType,
  async () => {
    await nextTick()
    cPage.value?.refresh()
  }
)

const filterConfig = computed(() => ({
  fields: [
    {
      label: '名称',
      fieldName: 'dictLabel',
      type: EControlType.eInput,
      props: {
        placeholder: '请输入名称'
      }
    }
  ]
}))
const tableConfig = computed(() => ({
  initSearch: true,
  columns: [
    {
      title: '编码',
      dataIndex: 'dictCode',
      hidden: true
    },
    {
      title: '排序',
      dataIndex: 'dictSort'
    },
    {
      title: '类型',
      dataIndex: 'dictType'
    },
    {
      title: '字典值',
      dataIndex: 'dictValue'
    },
    {
      title: '字典名称',
      dataIndex: 'dictLabel',
      slot: 'table_dictLabel'
    },
    {
      title: '是否启用',
      dataIndex: 'isEnabled',
      type: 'isEnabled'
    },
    {
      title: '操作',
      actionShowNum: 4,
      action: ({ record }) => {
        return [
          {
            name: '详情',
            callback: 'detail'
          },
          {
            name: '编辑',
            callback: 'edit'
          },
          {
            name: record.isEnabled ? '禁用' : '启用',
            confirm: true,
            callback: 'toggle'
          },
          {
            name: '删除',
            callback: 'delete'
          }
        ]
      }
    }
  ]
}))
/**
 * 新增、修改、详情配置
 */
const modalConfig = computed(() => ({
  title: '字典数据',
  width: 400,
  mode: 'modal',
  buttonConfig: ({ isAdd, isEdit, isView }) => ({
    confirmText: isEdit ? '确认修改' : '确认提交并继续',
    confirmContinue: (formData, submitData) => {
      formData.dictSort = submitData.dictSort + 1
    }
  }),
  formConfig: ({ isAdd, isEdit, isView, detail }) => ({
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    colSize: 1,
    fields: [
      {
        label: '类型',
        fieldName: 'dictType',
        type: EControlType.eInput,
        defaultValue: props.dictType,
        disabled: true
      },
      {
        label: '字典值',
        fieldName: 'dictValue',
        type: EControlType.eInput,
        disabled: isEdit,
        required: true
      },
      {
        label: '字典名称',
        fieldName: 'dictLabel',
        type: EControlType.eInput,
        required: true
      },
      {
        label: '标签类型',
        fieldName: 'tagType',
        type: EControlType.eSelect,
        props: {
          options: [
            { id: 'default', name: '默认', class: '' },
            { id: 'processing', name: '进行中', class: 'text-primary' },
            { id: 'success', name: '成功', class: 'text-success' },
            { id: 'warning', name: '警告', class: 'text-warning' },
            { id: 'error', name: '错误', class: 'text-danger' }
          ]
        }
      },
      {
        label: '额外样式',
        fieldName: 'cssClass',
        type: EControlType.eInput
      },
      {
        label: '排序',
        fieldName: 'dictSort',
        type: EControlType.eNumber,
        defaultValue: 1,
        props: {
          precision: 0,
          min: 1,
          max: 999
        }
      },
      {
        label: '备注',
        fieldName: 'remark',
        type: EControlType.eTextarea,
        props: {
        }
      },
      {
        label: '是否启用',
        fieldName: 'isEnabled',
        type: EControlType.eSwitch,
        none: !isView,
        props: {
        }
      },
      {
        label: '创建时间',
        fieldName: 'createTime',
        type: EControlType.eDate,
        none: !isView,
        props: {
          showTime: true
        }
      }
    ]
  })
}))

/**
 * 查询前修改查询参数
 * @param {Object} searchParams 查询参数
 */
 function beforeSearch (searchParams) {
  searchParams.dictType = props.dictType
  return searchParams
}

/**
 * 提交表单数据前处理
 * @param {Object} submitData 提交的数据
 * @param {Object} param 其他参数
 */
 function beforeSubmit (submitData, { isAdd, isEdit, isView, detail }) {
  submitData.dictType = props.dictType
  return submitData
}
</script>

<style lang="scss" scoped>
</style>
