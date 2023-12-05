<!-- 用户管理 -->
<template>
  <CPage
    hasImport
    hasExport
    primary-key="id"
    :api-config="{
      // 默认根据当前路由生成
      add: '/system/user/add'
    }"
    :api-method-config="{
      // 默认根据是否使用 RestFull 风格生成
      delete: 'delete'
    }"
    :permission-config="{
      // 默认根据当前路由生成
      add: 'system:user:add'
    }"
    :filter-config="filterConfig"
    :other-tools-btns="otherToolsBtns"
    :before-search="beforeSearch"
    :after-search="afterSearch"
    :table-config="tableConfig"
    :modal-config="modalConfig"
  >
    <template #table_slot="{ record }">
      插槽内容123123==={{ record.age }}
    </template>
  </CPage>
</template>

<script setup>
import { h, computed, ref } from 'vue'
import CPage from '@/components/template/c-page.vue'
import { EControlType } from '@/enum'

const filterConfig = computed(() => ({
  useCache: true,
  cacheBtnText: '记住查询',
  fields: [
    {
      label: '关键字',
      fieldName: 'key',
      type: EControlType.eInput,
      props: {
        placeholder: '请输入姓名/手机号/账号'
      }
    },
    {
      label: '部门',
      fieldName: 'deptName',
      type: EControlType.eInput
    }
  ]
}))
const otherToolsBtns = [
  {
    name: '自定义按钮',
    permission: 'system:user:diy',
    props: {
      type: 'link',
      icon: 'EditOutlined',
      disabled: ({ selectedObjs }) => selectedObjs.some(item => item.status === 1),
      onClick ({ pagination }) {
        console.log('我被点击了')
      }
    }
  }
]
const tableConfig = computed(() => ({
  props: {
    // 参考 a-table props
    bordered: true,
    size: 'small',
    // pagenation: { pageSizeOptions: [10, 50, 100] } // 重写分页大小选项
  },
  initSearch: true, // 默认 true，初始化时查询
  columns: [
    {
      title: '姓名',
      description: '用户真实姓名',
      dataIndex: 'name',
      resizable: true,
      width: 130
    },
    {
      title: '年龄',
      dataIndex: 'age',
      resizable: true,
      width: 80,
      minWidth: 40,
      maxWidth: 200
    },
    {
      title: '合同名称',
      dataIndex: 'name2',
      hidden: true
    },
    {
      title: '合同类型',
      dataIndex: 'type2',
      customRender: value => '历史'
    },
    {
      title: '合同状态',
      dataIndex: 'status',
      customRender: (text, record, index, column) => {
        return h('span', {
          class: 'text-danger'
        }, '状态1')
      }
    },
    {
      title: '地址',
      dataIndex: 'address'
    },
    {
      title: '插槽',
      dataIndex: 'slotField',
      slot: 'table_slot'
    },
    {
      title: '日期自动格式化',
      dataIndex: 'createTime',
      dateFormat: 'YYYY-MM-DD HH:mm'
    },
    {
      title: '操作',
      actionShowNum: 2, // 展示操作按钮数量，剩余的将收进更多里
      actionMoreText: '更多', // 更多按钮名称，默认"更多"
      // action: 操作列配置，T[] || ({ record }) => T[]
      action: ({ record }) => {
        const btns = [
          // 预设：edit, detail, delete, toggle
          {
            name: '详情',
            callback: 'detail'
          },
          {
            name: '编辑',
            callback: 'edit'
          },
          {
            name: '删除',
            callback: 'delete'
          },
          {
            name: '启/禁用',
            confirm: true,
            callback: 'toggle'
          },
          {
            name: '自定义',
            permission: 'system:user:diy',
            confirm: true, // 该按钮是否需要确认操作
            callback ({}) {
              console.log('我被点击了', record)
            }
          }
        ]
        if (record.age > 35) {
          btns.push({
            name: '辞退',
            permission: 'system:user:getout',
            confirm: true,
            callback ({}) {
              console.log(record.name + '被辞退了')
            }
          })
        }
        return btns
      }
    }
  ]
}))
/**
 * 新增、修改、详情配置
 */
const modalConfig = computed(() => ({
  title: '用户', // 弹窗标题，会自动拼上新增、编辑、详情
  // fullTitle: '', // 全称，不会自动拼接其他字符串
  width: 700, // 默认600
  mode: 'drawer', // 弹窗模式，modal 或 drawer
  // 弹窗按钮属性修改
  buttonConfig: ({ isAdd, isEdit, isView }) => ({
    confirmText: isEdit ? '确认修改' : '确认提交', // 默认是确定
    cancelText: '关闭', // 默认是关闭
    // showConfirm: !isEdit // 确认按钮是否可见，默认可见
    // showCancel: !isEdit // 取消按钮是否可见，默认可见
  }),
  // 表单配置 Object || ({ isAdd, isEdit, isView, detail }) => Object
  formConfig: ({ isAdd, isEdit, isView, detail }) => ({
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    colSize: 2, // 一行显示几列
    // 表单字段
    fields: [ // 表单字段数组，可分组
      {
        label: '用户姓名',
        fieldName: 'userName',
        type: EControlType.eInput,
        required: true,
        props: {
          allowClear: true
        }
      },
      {
        label: '用户姓名2',
        fieldName: 'userName2',
        type: EControlType.eInput,
        required: true,
        props: {
          allowClear: true
        }
      },
      {
        label: '用户姓名3',
        fieldName: 'userName3',
        type: EControlType.eInput,
        required: false,
        props: {
          allowClear: true
        }
      },
      {
        label: '年龄',
        fieldName: 'age',
        type: EControlType.eInput,
        tooltip: formData => '111', // 字段提示， String || formData => {}
        extra: formData => '222', // 字段额外说明， String || formData => {}
        defaultValue: 23,
        disabled: formData => !formData.userName,
        rules: [], // object | array
        props: {} // 控件其他属性
      },
      {
        // 字段分组
        title: '单位信息',
        subTitle: '(2)',
        // invisible: formData => !formData.userName, // true表示该项不可见(不使用该字段)，Boolean || formData => {}
        fields: [
          {
            label: '单位名称1',
            fieldName: 'unitName1',
            type: EControlType.eInput,
            invisible: isEdit, // 编辑时不可见
            props: {}
          },
          {
            label: '单位名称',
            fieldName: 'unitName',
            type: EControlType.eInput,
            singleLine: true,
            labelCol: { span: 3 },
            wrapperCol: { span: 21 },
            props: {},
            detailConfig: { // 详情时配置，可对上面(详情时有效的属性)覆盖
              labelCol: undefined,
              wrapperCol: undefined,
              singleLine: false // 如：详情时不单独占一行，或者更换控件类型等
            }
          },
          {
            label: '单位名称2',
            fieldName: 'unitName2',
            type: EControlType.eInput,
            props: {}
          },
        ]
      }
    ]
  })
}))

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
  return list
}
</script>

<style lang="scss" scoped>
</style>
