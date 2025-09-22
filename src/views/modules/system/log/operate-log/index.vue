<!-- 操作日志 -->
<template>
  <CPage
    ref="cPage"
    hasExport
    noAdd
    primary-key="operId"
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
  import { EControlType } from '@/enum/index.js'
  import axios from '@/api'
  import { Modal, message } from 'ant-design-vue'
  import { EOperateType } from './enum'
  import dayjs from 'dayjs'

  const cPage = ref()
  /** 查询条件配置 */
  const filterConfig = {
    fields: [
      {
        label: '模块标题',
        fieldName: 'title',
        type: EControlType.eInput,
        props: {
        }
      },
      {
        label: '业务类型',
        fieldName: 'businessType',
        type: EControlType.eSelect,
        props: {
          dictType: 'sys_oper_type'
        }
      },
      {
        label: '操作人员',
        fieldName: 'operName',
        type: EControlType.eInput,
        props: {
        }
      },
      {
        label: '操作状态',
        fieldName: 'status',
        type: EControlType.eSelect,
        props: {
          dictType: 'sys_common_status',
        }
      },
      {
        label: '操作时间',
        fieldName: 'operTime',
        type: EControlType.eDateRange,
        props: {
        }
      }
    ]
  }

  /** 自定义工具栏按钮配置 */
  const toolsConfig = {
    otherTools: [
      {
        name: '清空所有日志',
        permission: 'system:operlog:delet',
        props: {
          danger: true,
          icon: 'DeleteOutlined',
          onClick () {
            Modal.confirm({
              title: '温馨提示',
              content: '确认要清空所有日志？',
              async onOk () {
                await axios.post(`/system/operlog/clean`)
                message.success('清空成功！')
                cPage.value.refresh()
              }
            })
          }
        }
      }
    ]
  }

  /** 数据列表配置 */
  const tableConfig = computed(() => ({
    columns: [
      {
        title: '模块标题',
        dataIndex: 'title',
      },
      {
        title: '业务类型',
        dataIndex: 'businessType',
        dictType: 'sys_oper_type'
      },
      {
        title: '操作人员',
        dataIndex: 'operName',
      },
      {
        title: '操作地址',
        dataIndex: 'operIp',
      },
      {
        title: '操作地点',
        dataIndex: 'operLocation',
      },
      {
        title: '操作状态',
        dataIndex: 'status',
        dictType: 'sys_common_status',
      },
      {
        title: '操作时间',
        dataIndex: 'operTime',
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
   * 新增、修改、详情弹窗配置
   */
  const modalConfig = computed(() => ({
    title: '操作日志', // 弹窗标题，会自动根据类型拼上新增、编辑、详情关键字
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
          label: '模块标题',
          fieldName: 'title',
          type: EControlType.eInput,
          required: true,
          props: {
          }
        },
        {
          label: '业务类型',
          fieldName: 'businessType',
          type: EControlType.eSelect,
          required: true,
          props: {
            dictType: 'sys_oper_type'
          }
        },
        {
          label: '方法名称',
          fieldName: 'method',
          type: EControlType.eTextarea,
          required: true,
          singleLine: true,
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          props: {
          }
        },
        {
          label: '请求方式',
          fieldName: 'requestMethod',
          type: EControlType.eInput,
          required: true,
          props: {
          }
        },
        {
          label: '操作类别',
          fieldName: 'operatorType',
          type: EControlType.eSelect,
          required: true,
          props: {
            options: EOperateType._list
          }
        },
        {
          label: '操作人员',
          fieldName: 'operName',
          type: EControlType.eInput,
          required: true,
          props: {
          }
        },
        {
          label: '请求URL',
          fieldName: 'operUrl',
          type: EControlType.eTextarea,
          required: true,
          singleLine: true,
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          props: {
          }
        },
        {
          label: '操作地址',
          fieldName: 'operIp',
          type: EControlType.eTextarea,
          required: true,
          singleLine: true,
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          props: {
          }
        },
        {
          label: '操作地点',
          fieldName: 'operLocation',
          type: EControlType.eTextarea,
          required: true,
          singleLine: true,
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          props: {
          }
        },
        {
          label: '请求参数',
          fieldName: 'operParam',
          type: EControlType.eTextarea,
          required: true,
          singleLine: true,
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          props: {
          }
        },
        {
          label: '返回参数',
          fieldName: 'jsonResult',
          type: EControlType.eTextarea,
          required: true,
          singleLine: true,
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          props: {
          }
        },
        {
          label: '操作状态',
          fieldName: 'status',
          type: EControlType.eSelect,
          required: true,
          props: {
            dictType: 'sys_common_status',
          }
        },
        {
          label: '错误消息',
          fieldName: 'errorMsg',
          type: EControlType.eTextarea,
          required: true,
          singleLine: true,
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          props: {
          }
        },
        {
          label: '操作时间',
          fieldName: 'operTime',
          type: EControlType.eDate,
          required: true,
          props: {
            showTime: true
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
