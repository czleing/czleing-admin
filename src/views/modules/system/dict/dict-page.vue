<!-- 字典类型管理 -->
<template>
  <CPage
    :filter-config="filterConfig"
    :table-config="tableConfig"
    :modal-config="modalConfig"
  />
</template>

<script setup>
import { computed } from 'vue'
import CPage from '@/components/crud/c-page.vue'
import { EControlType } from '@/enum/index.js'
// import { useDict } from '@/hooks/useDict.js'

// const dict = useDict(['is_enabled'])

// console.log('dict-dict', dict)

const filterConfig = computed(() => ({
  fields: [
    {
      label: '名称',
      fieldName: 'name',
      type: EControlType.eInput,
      props: {
        placeholder: '请输入名称'
      }
    },
    {
      label: '类型',
      fieldName: 'type',
      type: EControlType.eInput,
      props: {
        placeholder: '请输入类型'
      }
    }
  ]
}))
const tableConfig = computed(() => ({
  props: {
    // rowClick (record, index, selected) { // 配置数据行点击事件
    //   selectedObj.value = selected ? record : undefined
    // }
  },
  initSearch: true, // 默认 true，初始化时查询
  columns: [
    {
      title: 'ID',
      dataIndex: 'id',
      hidden: true
    },
    {
      title: '类型',
      dataIndex: 'type'
    },
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '状态',
      dataIndex: 'name2',
      dictType: 'is_enabled'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      isDateTime: true
    },
    {
      title: '操作',
      actionShowNum: 4,
      action: [
        {
          name: '详情',
          callback: 'detail'
        },
        {
          name: '编辑',
          callback: 'edit'
        },
        {
          name: '启/禁用',
          confirm: true,
          callback: 'toggle'
        },
        {
          name: '删除',
          callback: 'delete' // 删除操作默认带确认框
        }
      ]
    }
  ]
}))
/**
 * 新增、修改、详情配置
 */
const modalConfig = computed(() => ({
  title: '字典类型', // 弹窗标题，会自动根据类型拼上新增、编辑、详情关键字
  // width: 600, // 弹窗宽度，默认 600
  mode: 'modal', // 弹窗模式, modal 或 drawer
  buttonConfig: ({ isAdd, isEdit, isView }) => ({
    confirmText: isEdit ? '确认修改' : '确认提交' // 默认是确定
  }),
  // 表单配置 Object || ({ isAdd, isEdit, isView, detail }) => Object
  formConfig: ({ isAdd, isEdit, isView, detail }) => ({
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    colSize: 1, // 一行显示几列
    // 表单字段
    fields: [ // 表单字段数组，可分组
      {
        label: '类型',
        fieldName: 'dictType',
        type: EControlType.eInput,
        disabled: isEdit,
        required: true
      },
      {
        label: '名称',
        fieldName: 'dictType',
        type: EControlType.eInput,
        required: true
      },
      {
        label: '排序',
        fieldName: 'sort',
        type: EControlType.eNumber,
        defaultValue: 1,
        props: {
          precision: 0,
          min: 1,
          max: 100
        }
      },
      {
        label: '创建时间',
        fieldName: 'createTime',
        type: EControlType.eDate,
        none: !isView,
        props: {
          showTime: true // 是否需要时分秒
        }
      }
    ]
  })
}))
</script>

<style lang="scss" scoped>
</style>
