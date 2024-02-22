<!-- 字典类型管理 -->
<template>
  <div class="dict-page">
    <CPage
      primary-key="dictId"
      :filter-config="filterConfig"
      :table-config="tableConfig"
      :modal-config="modalConfig"
    />
    <Modal ref="cModal">
      <DictData v-if="currDictType" :dict-type="currDictType" />
    </Modal>
  </div>
</template>

<script setup>
import { computed, h, ref } from 'vue'
import CPage from '@/components/crud/c-page.vue'
import { EControlType } from '@/enum/index.js'
import DictData from './components/dict-data.vue'

const cModal = ref()
const currDictType = ref()

const filterConfig = computed(() => ({
  fields: [
    {
      label: '类型',
      fieldName: 'dictType',
      type: EControlType.eInput,
      props: {
        placeholder: '请输入类型'
      }
    },
    {
      label: '名称',
      fieldName: 'dictName',
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
      title: 'ID',
      dataIndex: 'id',
      hidden: true
    },
    {
      title: '类型',
      dataIndex: 'dictType',
      customRender: ({ value, record, index, column }) => {
        return h('a', {
          href: 'javascript:;',
          onClick () {
            currDictType.value = value
            cModal.value.open({
              title: `字典【${record.dictName}】字典项列表`,
              width: 1000,
              mode: 'drawer',
              showConfirm: false
            })
          }
        }, value)
      }
    },
    {
      title: '名称',
      dataIndex: 'dictName'
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
      title: '是否启用',
      dataIndex: 'isEnabled',
      type: 'isEnabled'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
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
            callback: 'delete' // 删除操作默认带确认框
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
  title: '字典类型', // 弹窗标题，会自动根据类型拼上新增、编辑、详情关键字
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
        tooltip: !isView ? '字典类型必须以字母开头，且只能为（小写字母，数字，下滑线）' : undefined,
        disabled: isEdit,
        required: true
      },
      {
        label: '名称',
        fieldName: 'dictName',
        type: EControlType.eInput,
        required: true
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
</script>

<style lang="scss" scoped>
</style>
