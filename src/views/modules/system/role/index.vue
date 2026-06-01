<!-- 角色管理 -->
<template>
  <div class="role-page">
    <CPage
      primary-key="roleId"
      :filter-config="filterConfig"
      :table-config="tableConfig"
      :modal-config="modalConfig"
      :after-open-modal="afterOpenModal"
    />
  </div>
</template>

<script setup>
import CPage from '@/components/crud/c-page.vue'
import { EControlType } from '@/enum/index.js'
import axios from '@/api/index.js'

const filterConfig = computed(() => ({
  fields: [
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
  columns: [
    {
      title: '排序',
      dataIndex: 'roleSort'
    },
    {
      title: '角色编码',
      dataIndex: 'roleId',
      hidden: true
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '角色标识',
      dataIndex: 'roleKey'
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
  title: '角色管理',
  width: 800,
  mode: 'modal',
  buttonConfig: ({ isAdd, isEdit, isView }) => ({
    confirmText: isEdit ? '确认修改' : '确认提交'
  }),
  formConfig: ({ isAdd, isEdit, isView, detail }) => ({
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    cols: 2,
    fields: [
      {
        label: '角色名称',
        fieldName: 'roleName',
        type: EControlType.eInput,
        required: true
      },
      {
        label: '角色标识',
        fieldName: 'roleKey',
        type: EControlType.eInput,
        disabled: isEdit,
        required: true
      },
      {
        label: '排序',
        fieldName: 'roleSort',
        type: EControlType.eNumber,
        required: true,
        defaultValue: 1,
        props: {
          precision: 0,
          min: 1,
          max: 10000
        }
      },
      {
        label: '备注',
        fieldName: 'remark',
        type: EControlType.eTextarea,
        props: {
          rows: 2
        }
      },
      {
        label: '菜单权限',
        fieldName: 'menuIds',
        type: EControlType.eCustom,
        required: true,
        singleLine: true,
        labelCol: { span: 3 },
        wrapperCol: { span: 21 },
        props: {
          useRefresh: false,
          style: { maxHeight: '400px', overflow: 'auto', border: 'solid 1px rgba(128, 128, 128, .2)', padding: '6px', borderRadius: '6px' },
          component: 'a-tree',
          checkable: true,
          remote: {
            url: '/system/menu/tree',
            params: { isEnabled: true }
          },
          fieldNames: {
            key: 'id',
            title: 'label',
            children: 'children'
          },
          defaultExpandAll: true,
          modelProps: 'checkedKeys', // 自定义组件的 v-model:value 字段
          modelEvent: 'onCheck', // 自定义组件的 v-model 事件字段
          modelData: 'treeData', // 自定义组件的 dataSource 字段
          renderNeedDataSource: true // 需要有数据源才渲染
        }
      },
      {
        label: '是否启用',
        fieldName: 'isEnabled',
        type: EControlType.eSwitch,
        none: !isView
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

// 弹出 modal 后执行
async function afterOpenModal ({ record, detail }) {
  detail.value.menuIds = []
  if (record?.roleId) {
    const result = await axios.post('/system/menu/roleMenuTreeselect/' + record.roleId)
    detail.value.menuIds = result?.checkedKeys ?? []
  }
}
</script>

<style lang="scss" scoped>
</style>
