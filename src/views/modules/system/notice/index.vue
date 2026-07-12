<!-- 通知公告 -->
<template>
  <CPage
    ref="cPage"
    hasExport
    primary-key="id"
    :filter-config="filterConfig"
    :tools-config="toolsConfig"
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

  const cPage = ref()
  /** 查询条件配置 */
  const filterConfig = {
    fields: [
      {
        label: '通告标题',
        fieldName: 'noticeTitle',
        type: EControlType.eInput,
        props: {
        }
      },
      {
        label: '通告类型',
        fieldName: 'noticeType',
        type: EControlType.eSelect,
        props: {
          dictType: 'sys_notice_type',
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

  /** 自定义工具栏按钮配置 */
  const toolsConfig = {
      // addBtnText: '新增',
      // backBtnText: '返回',
      // otherToolsBtns: [
      //     {
      //         name: '自定义按钮',
      //         permission: 'system:user:diy',
      //         props: {
      //             type: 'link',
      //             icon: 'EditOutlined',
      //             disabled: ({ selectedIds, selectedObjs, pagination }) => selectedObjs.some(item => item.status === 1),
      //             onClick ({ selectedIds, selectedObjs, pagination }) {
      //                 // console.log('我被点击了')
      //                 // Modal.confirm({
      //                 //   title: '温馨提示',
      //                 //   content: '确认要xxx？',
      //                 //   async onOk () {
      //                 //     await axios.post(`/xx/xx`, {...})
      //                 //     message.success('xx成功！')
      //                 //     cPage.value.refresh()
      //                 //     cPage.value.clearSelect()
      //                 //   }
      //                 // })
      //             }
      //         }
      //     }
      // ]
  }

  /** 数据列表配置 */
  const tableConfig = computed(() => ({
    columns: [
      {
        title: '通告标题',
        dataIndex: 'noticeTitle',
      },
      {
        title: '通告类型',
        dataIndex: 'noticeType',
        dictType: 'sys_notice_type',
      },
      {
        title: '是否启用',
        dataIndex: 'isEnabled',
        type: 'isEnabled'
      },
      {
        title: '操作',
        actionShowNum: 4, // 展示操作按钮数量，剩余的将收进更多里
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
    title: '通知公告', // 弹窗标题，会自动根据类型拼上新增、编辑、详情关键字
    width: 900, // 弹窗宽度，默认 600
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
          label: '通告标题',
          fieldName: 'noticeTitle',
          type: EControlType.eInput,
          required: true,
          props: {
          }
        },
        {
          label: '通告类型',
          fieldName: 'noticeType',
          type: EControlType.eSelect,
          required: true,
          props: {
            dictType: 'sys_notice_type',
          }
        },
        {
          label: '通告内容',
          fieldName: 'noticeContent',
          type: EControlType.eEditor,
          singleLine: true,
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          required: true,
          props: {
            height: '300px'
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
