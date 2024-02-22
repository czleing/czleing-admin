<!-- 部门管理页面 -->
<template>
  <CPage
    ref="cPage"
    primary-key="deptId"
    :filter-config="filterConfig"
    :before-search="beforeSearch"
    :after-search="afterSearch"
    :before-submit="beforeSubmit"
    :transform-detail="transformDetail"
    :table-config="tableConfig"
    :modal-config="modalConfig"
  />
</template>

<script setup>
import { h, computed, ref, resolveComponent } from 'vue'
import CPage from '@/components/crud/c-page.vue'
import { EControlType, EIsEnabled, EMenuType } from '@/enum/index.js'
import { listToTree } from '@/utils/index.js'

const cPage = ref()
const filterConfig = computed(() => ({
  fields: [
    {
      label: '部门名称',
      fieldName: 'deptName',
      type: EControlType.eInput
    },
    {
      label: '是否启用',
      fieldName: 'isEnabled',
      type: EControlType.eSelect,
      props: {
        options: EIsEnabled._list
      }
    }
  ]
}))
const tableConfig = computed(() => ({
  props: {
    usePage: false
  },
  columns: [
    {
      title: '部门名称',
      dataIndex: 'deptName',
      align: 'left',
      resizable: true,
      width: 150
    },
    {
      title: '负责人',
      dataIndex: 'leader',
      customRender: ({ value }) => value || '-'
    },
    {
      title: '负责人电话',
      dataIndex: 'phone',
      customRender: ({ value }) => value || '-'
    },
    {
      title: '是否启用',
      dataIndex: 'isEnabled',
      type: 'isEnabled'
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      isDateTime: true
    },
    {
      title: '操作',
      actionShowNum: 5,
      action: ({ record }) => {
        const btns = [
          {
            name: '详情',
            callback: 'detail'
          },
          {
            name: '编辑',
            callback: 'edit'
          },
          {
            name: '新增',
            permission: 'system:dept:add',
            callback () {
              addChildren(record)
            }
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
        return btns
      }
    }
  ]
}))
/**
 * 新增、修改、详情配置
 */
const modalConfig = computed(() => ({
  title: '部门',
  width: 800,
  mode: 'modal',
  buttonConfig: ({ isAdd, isEdit, isView }) => ({
    confirmText: isEdit ? '确认修改' : '确认提交'
  }),
  formConfig: ({ isAdd, isEdit, isView, detail }) => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    colSize: 2, // 一行显示几列
    // 表单字段
    fields: [ // 表单字段数组，可分组
      {
        label: '上级部门',
        fieldName: 'parentId',
        type: EControlType.eTreeSelect,
        required: true,
        singleLine: true,
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
        props: {
          fieldNames: { value: 'id', label: 'label' },
          remote: {
            url: '/system/dept/tree',
            converter (result) {
              return [
                {
                  id: 0,
                  label: '根级部门',
                  parentId: '',
                  children: result
                }
              ]
            }
          }
        }
      },
      {
        label: '部门名称',
        fieldName: 'deptName',
        type: EControlType.eInput,
        required: true,
        props: {
          allowClear: true
        }
      },
      {
        label: '负责人',
        fieldName: 'leader',
        type: EControlType.eInput,
        props: {
          allowClear: true
        }
      },
      {
        label: '负责人电话',
        fieldName: 'phone',
        type: EControlType.eInput,
        rules: {
          pattern: new RegExp(/^1[3456789]\d{9}$/),
          message: '请输入正确的手机号码',
          trigger: 'change'
        },
        props: {
          maxlength: 11
        }
      },
      {
        label: '邮箱地址',
        fieldName: 'email',
        type: EControlType.eInput,
        rules: {
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: 'change'
        }
      },
      {
        label: '排序',
        fieldName: 'sort',
        type: EControlType.eNumber,
        required: true,
        defaultValue: 1,
        props: {
          precision: 0,
          min: 1,
          max: 10000
        }
      }
    ]
  })
}))


/** 新增子部门 */
function addChildren (record) {
  cPage.value.onAddHandle({
    parentId: record.deptId
  })
}

/**
 * 查询前修改查询参数
 * @param {Object} searchParams 查询参数
 */
function beforeSearch (searchParams) {
  return searchParams
}

/**
 * 查询后修改查询结果
 * @param {Array} list 查询结果列表
 */
function afterSearch (list) {
  const tree = listToTree(list, 0, 'deptId')
  return tree
}

/**
 * 提交表单数据前处理
 * @param {Object} submitData 提交的数据
 * @param {Object} param 其他参数
 */
function beforeSubmit (submitData, { isAdd, isEdit, isView, detail }) {
  return submitData
}

/**
 * 编辑回填、详情展示时，对详情数据修改
 * @param {Object} detail 详情数据
 * @param {Object} param 其他参数
 */
function transformDetail (detail, { isEdit, isView }) {
  return detail
}
</script>

<style lang="scss" scoped>
</style>
