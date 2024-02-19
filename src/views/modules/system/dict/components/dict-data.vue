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
    :before-search="beforeSearch"
    :before-submit="beforeSubmit"
    :table-config="tableConfig"
    :modal-config="modalConfig"
  >
  </CPage>
</template>

<script setup>
import { computed, watch, ref, h, nextTick } from 'vue'
import CPage from '@/components/crud/c-page.vue'
import { EControlType, EIsEnabled } from '@/enum/index.js'

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
  props: {
    // rowClick (record, index, selected) { // 配置数据行点击事件
    //   selectedObj.value = selected ? record : undefined
    // }
  },
  initSearch: true, // 默认 true，初始化时查询
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
      dataIndex: 'dictLabel'
    },
    {
      title: '是否启用',
      dataIndex: 'isEnabled',
      customRender: ({ value, record, index, column }) => { // 自定义渲染函数
        return h('span', {
          class: EIsEnabled._classOf(value ? 1 : 0)
        }, EIsEnabled._of(value ? 1 : 0))
      }
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createTime'
    // },
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
  title: '字典数据', // 弹窗标题，会自动根据类型拼上新增、编辑、详情关键字
  width: 400, // 弹窗宽度，默认 600
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
        label: '列表样式',
        fieldName: 'tagType',
        type: EControlType.eInput
      },
      {
        label: '额外样式',
        fieldName: 'cssClass',
        type: EControlType.eInput
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
          showTime: true // 是否需要时分秒
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
