<!-- 岗位信息 -->
<template>
  <CPage
    hasExport
    primary-key="postId"
    :filter-config="filterConfig"
    :before-search="beforeSearch"
    :after-search="afterSearch"
    :before-submit="beforeSubmit"
    :after-open-modal="afterOpenModal"
    :transform-detail="transformDetail"
    :table-config="tableConfig"
    :modal-config="modalConfig"
  />
</template>

<script setup>
  import CPage from '@/components/crud/c-page.vue'
  import { EControlType, EIsEnabled } from '@/enum/index.js'

  /** 查询条件配置 */
  const filterConfig = {
    fields: [
      {
        label: '岗位编码',
        fieldName: 'postCode',
        type: EControlType.eInput,
        props: {
        }
      },
      {
        label: '岗位名称',
        fieldName: 'postName',
        type: EControlType.eInput,
        props: {
        }
      },
      {
        label: '是否启用',
        fieldName: 'isEnabled',
        type: EControlType.eSelect,
        props: {
          options: EIsEnabled._list
        }
      },
    ]
  }
  /** 数据列表配置 */
  const tableConfig = computed(() => ({
    columns: [
      {
        title: '岗位编码',
        dataIndex: 'postCode',
      },
      {
        title: '岗位名称',
        dataIndex: 'postName',
      },
      {
        title: '显示顺序',
        dataIndex: 'postSort',
      },
      {
        title: '是否启用',
        dataIndex: 'isEnabled',
        type: 'isEnabled'
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        actionShowNum: 2, // 展示操作按钮数量，剩余的将收进更多里
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
              callback: 'delete' // 删除操作默认带确认框
            },
            {
              name: record.isEnabled ? '禁用' : '启用',
              confirm: true,
              callback: 'toggle'
            }
          ]
          return btns
        }
      }
    ]
  }))
  /**
   * 新增、修改、详情弹窗配置
   */
  const modalConfig = computed(() => ({
    title: '岗位信息', // 弹窗标题，会自动根据类型拼上新增、编辑、详情关键字
    width: 700, // 弹窗宽度，默认 600
    mode: 'modal', // 弹窗模式, modal 或 drawer
    buttonConfig: ({ isAdd, isEdit, isView }) => ({
      confirmText: isEdit ? '确认修改' : '确认提交', // 默认是确定
    }),
    // 表单配置 Object || ({ isAdd, isEdit, isView, detail }) => Object
    formConfig: ({ isAdd, isEdit, isView, detail }) => ({
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      colSize: 2, // 一行显示几列
      // 表单字段
      fields: [
        {
          label: '岗位编码',
          fieldName: 'postCode',
          type: EControlType.eInput,
          required: true,
          props: {
          }
        },
        {
          label: '岗位名称',
          fieldName: 'postName',
          type: EControlType.eInput,
          required: true,
          props: {
          }
        },
        {
          label: '显示顺序',
          fieldName: 'postSort',
          type: EControlType.eNumber,
          required: false,
          props: {
            precision: 0,
            min: 1,
            max: 100,
          }
        },
        {
          label: '备注',
          fieldName: 'remark',
          type: EControlType.eTextarea,
          required: false,
          singleLine: true,
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          props: {
          }
        },
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

  /**
   * 提交表单数据前处理
   * @param {Object} submitData 提交的数据
   * @param {Object} param 其他参数
   */
  function beforeSubmit (submitData, { isAdd, isEdit, isView, detail }) {
    return submitData
  }

  /**
   * 弹窗(新增、修改、详情弹窗)后执行
   * @param {Object} param 其他参数
   */
  function afterOpenModal ({ isAdd, isEdit, isView, options }) {
  }

  /**
   * 编辑、详情时，对详情数据修改
   * @param {Object} detail 详情数据
   * @param {Object} param 其他参数
   */
  function transformDetail (detail, { isEdit, isView }) {
    return detail
  }
</script>

<style lang="scss" scoped>
</style>
