<!-- 用户管理 -->
<template>
  <CPage
    hasImport
    hasExport
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
      插槽内容123123---{{ record.age }}
    </template>
  </CPage>
</template>

<script setup>
import { h, computed } from 'vue'
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
  initSearch: true,
  columns: [
    {
      title: '姓名',
      description: '用户真实姓名',
      align: 'center',
      dataIndex: 'name',
      resizable: true,
      width: 130
    },
    {
      title: '年龄',
      align: 'center',
      dataIndex: 'age',
      resizable: true,
      width: 80,
      minWidth: 40,
      maxWidth: 200
    },
    {
      title: '合同名称',
      align: 'center',
      dataIndex: 'name2',
      hidden: true
    },
    {
      title: '合同类型',
      align: 'center',
      dataIndex: 'type2',
      customRender: value => '历史'
    },
    {
      title: '合同状态',
      align: 'center',
      dataIndex: 'status',
      customRender: (text, record, index, column) => {
        return h('span', {
          class: 'text-danger'
        }, '状态1')
      }
    },
    {
      title: '地址',
      align: 'center',
      dataIndex: 'address'
    },
    {
      title: '插槽',
      align: 'center',
      dataIndex: 'slotField',
      slot: 'table_slot'
    },
    {
      title: '日期自动格式化',
      align: 'center',
      dataIndex: 'createTime',
      isDateTime: true
    },
    {
      title: '操作',
      align: 'center',
      actionShowNum: 2, // 展示操作按钮数量，剩余的将收进更多里
      actionMoreText: '更多', // 更多按钮名称，默认"更多"
      // action: 操作列配置，T[] || ({ record }) => T[]
      action: ({ record }) => {
        const btns = [
          // 预设：update, detail, delete, toggle
          {
            name: '修改',
            callback: 'update'
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
const modalConfig = computed(() => ({
  title: ''
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
