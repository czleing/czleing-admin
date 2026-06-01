<!-- 字典类型管理 -->
<template>
  <div class="dict-page">
    <CPage
      primary-key="dictId"
      :filter-config="filterConfig"
      :table-config="tableConfig"
      :modal-config="modalConfig"
    />
    <CModal ref="cModal">
      <DictData v-if="currDictType" :dict-type="currDictType" />
    </CModal>
  </div>
</template>

<script setup>
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
      dataIndex: 'dictId',
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
      actionShowNum: 3,
      action: ({ record }) => {
        return [
          {
            name: '字典项管理',
            callback: () => {
              currDictType.value = record.dictType
              cModal.value.open({
                title: `字典【${record.dictName}】字典项列表`,
                width: 1000,
                mode: 'drawer',
                showConfirm: false
              })
            }
          },
          {
            name: record.isEnabled ? '禁用' : '启用',
            confirm: true,
            callback: 'toggle'
          },
          {
            name: '编辑',
            callback: 'edit'
          },
          {
            name: '详情',
            callback: 'detail'
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
  title: '字典类型',
  width: 400,
  mode: 'modal',
  buttonConfig: ({ isAdd, isEdit, isView }) => ({
    confirmText: isEdit ? '确认修改' : '确认提交'
  }),
  formConfig: ({ isAdd, isEdit, isView, detail }) => ({
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    cols: 1,
    fields: [
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
          showTime: true
        }
      }
    ]
  })
}))
</script>

<style lang="scss" scoped>
</style>
