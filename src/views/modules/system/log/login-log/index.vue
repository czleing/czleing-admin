<!-- 登录日志 -->
<template>
  <CPage
    noAdd
    hasExport
    primary-key="infoId"
    ref="cPage"
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

  const cPage = ref()
  /** 查询条件配置 */
  const filterConfig = {
    fields: [
      {
        label: '用户账号',
        fieldName: 'userName',
        type: EControlType.eInput,
        colSize: { span: 4 },
        props: {
        }
      },
      {
        label: '登录IP',
        fieldName: 'ipaddr',
        type: EControlType.eInput,
        colSize: { span: 4 },
        props: {
        }
      },
      {
        label: '登录状态',
        fieldName: 'status',
        type: EControlType.eSelect,
        colSize: { span: 4 },
        props: {
          dictType: 'sys_common_status',
        }
      },
      {
        label: '登录时间',
        fieldName: 'dateRange',
        type: EControlType.eDateRange,
        colSize: { span: 7 },
        props: {
          fieldNames: ['beginTime', 'endTime']
        }
      },
    ]
  }
  /** 自定义工具栏按钮配置 */
  const toolsConfig = {
    otherToolsBtns: [
      {
        name: '账户解锁',
        permission: 'system:loginlog:unlock',
        props: {
          type: 'primary',
          icon: 'UnlockOutlined',
          disabled: ({ selectedIds }) => selectedIds.length !== 1,
          onClick ({ selectedObjs }) {
            Modal.confirm({
              title: '温馨提示',
              content: '确认要解锁该用户？',
              async onOk () {
                await axios.post(`/system/log/login-log/unlock/${selectedObjs[0].userName ?? ''}`)
                message.success('解锁成功！')
                cPage.value.refresh()
                cPage.value.clearSelect()
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
        title: '用户账号',
        dataIndex: 'userName',
      },
      {
        title: '登录IP地址',
        dataIndex: 'ipaddr',
      },
      {
        title: '登录地点',
        dataIndex: 'loginLocation',
      },
      {
        title: '浏览器类型',
        dataIndex: 'browser',
      },
      {
        title: '操作系统',
        dataIndex: 'os',
      },
      {
        title: '登录状态',
        dataIndex: 'status',
        dictType: 'sys_common_status',
      },
      {
        title: '提示消息',
        dataIndex: 'msg',
      },
      {
        title: '登录时间',
        dataIndex: 'loginTime',
      }
    ]
  }))
  /**
   * 新增、修改、详情弹窗配置
   */
  const modalConfig = computed(() => ({
    title: '登录日志', // 弹窗标题，会自动根据类型拼上新增、编辑、详情关键字
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
          label: '用户账号',
          fieldName: 'userName',
          type: EControlType.eInput,
          required: true,
          props: {
          }
        },
        {
          label: '登录IP地址',
          fieldName: 'ipaddr',
          type: EControlType.eInput,
          required: true,
          props: {
          }
        },
        {
          label: '登录地点',
          fieldName: 'loginLocation',
          type: EControlType.eInput,
          required: true,
          props: {
          }
        },
        {
          label: '浏览器类型',
          fieldName: 'browser',
          type: EControlType.eInput,
          required: true,
          props: {
          }
        },
        {
          label: '操作系统',
          fieldName: 'os',
          type: EControlType.eInput,
          required: true,
          props: {
          }
        },
        {
          label: '登录状态',
          fieldName: 'status',
          type: EControlType.eSelect,
          required: true,
          props: {
            dictType: 'sys_common_status',
          }
        },
        {
          label: '提示消息',
          fieldName: 'msg',
          type: EControlType.eTextarea,
          required: true,
          singleLine: true,
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          props: {
          }
        },
        {
          label: '登录时间',
          fieldName: 'loginTime',
          type: EControlType.eDate,
          required: true,
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
    return {
      ...searchParams,
      beginTime: undefined,
      endTime: undefined,
      // 后端对起止时间的接收是通过 params 接收的，此处需要特殊处理
      params: {
        beginTime: searchParams.beginTime,
        endTime: searchParams.endTime
      }
    }
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
