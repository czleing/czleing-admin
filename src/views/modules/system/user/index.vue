<!-- 用户管理 -->
<template>
  <CPage
    hasImport
    hasExport
    primary-key="userId"
    :tree-config="treeConfig"
    :filter-config="filterConfig"
    :after-search="afterSearch"
    :after-open-modal="afterOpenModal"
    :transform-detail="transformDetail"
    :table-config="tableConfig"
    :modal-config="modalConfig"
  />
</template>

<script setup>
import CPage from '@/components/crud/c-page.vue'
import { EControlType, EIsEnabled } from '@/enum/index.js'
import axios from '@/api'

const treeConfig = {
  url: '/system/user/deptTree',
  replaceField: { key: 'id', children: 'children', title: 'label' },
  searchField: 'deptId'
}

const filterConfig = {
  useCache: false,
  col: { sm: 8, lg: 7, xxl: 5 },
  fields: [
    {
      label: '用户',
      fieldName: 'userName',
      props: {
        placeholder: '请输入姓名/账号'
      }
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
}
const tableConfig = computed(() => ({
  columns: [
    {
      title: '用户编号',
      dataIndex: 'userId',
      hidden: true
    },
    {
      title: '登录账号',
      dataIndex: 'userName'
    },
    {
      title: '用户姓名',
      dataIndex: 'nickName'
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      resizable: true,
      width: 150,
      customRender: ({ record }) => record.dept?.deptName ?? '-'
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
      hideChar: [3, 4]
    },
    {
      title: '是否启用',
      dataIndex: 'isEnabled',
      type: 'isEnabled'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      isDateTime: true
    },
    {
      title: '操作',
      actionShowNum: 2,
      action: ({ record }) => {
        const btns = [
          {
            name: '详情',
            callback: 'detail'
          },
          record.userId !== 1 ? {
            name: '编辑',
            callback: 'edit'
          } : null,
          record.userId !== 1 ? {
            name: '删除',
            callback: 'delete'
          } : null,
          record.userId !== 1 ? {
            name: record.isEnabled ? '禁用' : '启用',
            confirm: true,
            callback: 'toggle'
          } : null
        ].filter(b => !!b)
        return btns
      }
    }
  ]
}))

const posts = ref([])
const roles = ref([])
/**
 * 新增、修改、详情配置
 */
const modalConfig = computed(() => ({
  title: '用户',
  width: 800,
  mode: 'modal',
  buttonConfig: ({ isAdd, isEdit, isView }) => ({
    confirmText: isEdit ? '确认修改' : '确认提交'
  }),
  formConfig: ({ isAdd, isEdit, isView, detail }) => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    cols: 2,
    fields: [
      {
        label: '用户姓名',
        fieldName: 'nickName',
        required: true,
      },
      {
        label: '所属部门',
        fieldName: 'deptId',
        type: EControlType.eTreeSelect,
        props: {
          remote: {
            url: '/system/user/deptTree'
          },
          fieldNames: {
            value: 'id',
            label: 'label',
            children: 'children'
          }
        }
      },
      {
        label: '登录账号',
        fieldName: 'userName',
        tooltip: isView ? undefined : '可输入数字、字母、下划线，长度为 2 至 20 个字符',
        none: formData => formData.userId !== undefined,
        required: true,
        rules: {
          pattern: new RegExp(/^\w{2,20}$/),
          message: '请输入 2 至 20 个字符',
          trigger: 'change'
        }
      },
      {
        label: '登录密码',
        fieldName: 'password',
        tooltip: '可输入数字、字母、下划线，长度为 5 至 20 个字符',
        none: !isAdd,
        required: true,
        rules: [
          {
            min: 5,
            max: 20,
            message: '密码长度 5 至 20 之间',
            trigger: 'change'
          },
          {
            pattern: new RegExp(/^[\w!@#\$%\^&\*\(\)]*$/),
            message: '只能包含数字、大小写字母、下划线及“!@#$%^&*()”特殊字符'
          }
        ]
      },
      {
        label: '手机号码',
        fieldName: 'phonenumber',
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
        rules: {
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: 'change'
        },
        props: {
        }
      },
      {
        label: '用户性别',
        fieldName: 'sex',
        type: EControlType.eRadio,
        props: {
          useRefresh: false,
          dictType: 'sys_user_sex'
        }
      },
      {
        label: '岗位',
        fieldName: 'postIds',
        type: EControlType.eSelect,
        singleLine: true,
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
        props: {
          options: posts.value,
          allowClear: true,
          mode: 'multiple'
        }
      },
      {
        label: '角色',
        fieldName: 'roleIds',
        type: EControlType.eSelect,
        singleLine: true,
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
        props: {
          options: roles.value,
          allowClear: true,
          mode: 'multiple'
        }
      },
      {
        label: '备注',
        fieldName: 'remark',
        type: EControlType.eTextarea,
        singleLine: true,
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
        props: {
          // rows: 5,
          // maxlength: 100
        }
      }
    ]
  })
}))

/**
 * 查询后修改查询结果
 * @param {Array} list 查询结果列表
 */
function afterSearch (list) {
  return list.map(item => ({ ...item, selectDisabled: item.userId === 1 }))
}

/**
 * 弹窗后执行
 * @param {Object} param 其他参数
 */
async function afterOpenModal ({ isAdd, isEdit, isView }) {
  if (posts.value.length === 0 || roles.value.length === 0) {
    const result = await axios.post('/system/user/detail/0')
    posts.value = (result?.posts ?? []).map(item => ({ id: item.postId, name: item.postName }))
    roles.value = (result?.roles ?? []).map(item => ({ id: item.roleId, name: item.roleName }))
  }
}

/**
 * 编辑回填、详情展示时，对详情数据修改
 * @param {Object} detail 详情数据
 * @param {Object} param 其他参数
 */
function transformDetail (detail, { isEdit, isView }) {
  return {
    ...detail?.user,
    postIds: detail.postIds,
    roleIds: detail.roleIds
  }
}
</script>
