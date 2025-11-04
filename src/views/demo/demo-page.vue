<!-- demo CRUD demo 页面 -->
<!-- CPage 封装了查询、列表、新增、修改、详情、删除、导入、导出、启用、禁用等功能，通过配置选择使用 -->
<template>
  <CPage
    ref="cPage"
    hasImport
    hasExport
    hasGoBack
    :no-add="false"
    :no-delete="false"
    :no-select="false"
    :no-tools="false"
    primary-key="id"
    :api-config="{
      // 预设功能接口地址配置，默认根据当前路由生成，如：/system/user 页面下新增接口 => /system/user/add，配置了可进行覆盖
      // add: '',
      // update: '',
      // detail: '',
      // delete: '',
      list: '/system/user/list',
      // toggle: '',
      // import: '',
      // importTemplate: '',
      // export: ''
    }"
    :api-method-config="{
      // 预设功能接口请求方式设置，默认全部post
      // add: '',
      // ...
    }"
    :api-option-config="{
      // 预设功能接口请求额外其他设置，如：headers，设置 headers.Authorization 会覆盖系统默认的 token 设置
      // list: { headers: { Authorization: 'Bearer xxx', datasource: 'xxx' } }
      // ...
    }"
    :permission-config="{
      // 预设功能权限配置，默认根据当前路由生成，如新增权限：/system/user -> system:user:add
      // add: '',
      // ...
    }"
    :tree-config="treeConfig"
    :filter-config="filterConfig"
    :tools-config="toolsConfig"
    :table-config="tableConfig"
    :modal-config="modalConfig"
    :before-search="beforeSearch"
    :after-search="afterSearch"
    :before-submit="beforeSubmit"
    :after-submit="afterSubmit"
    :after-open-modal="afterOpenModal"
    :transform-detail="transformDetail"
  >
    <!-- 表格单元格内容过于复杂时，可以使用插槽 -->
    <template #table_slotField="{ text, record, index, column }">
      插槽内容==={{ record.age }}
    </template>
  </CPage>
</template>

<script setup>
import CPage from '@/components/crud/c-page.vue'
import { EControlType, EIsEnabled } from '@/enum/index.js'

const cPage = ref()
defineOptions({
  name: 'DemoPage'
})
/** 树形配置，不配置则不使用树 */
const treeConfig = {
  url: '/system/user/deptTree',
  params: {}, // 查询参数
  // method: 'post',
  replaceField: { key: 'id', children: 'children', title: 'label' },
  searchField: 'deptId', // 将选中节点的id作为列表的查询参数的参数名，默认orgId
}
/** 查询条件配置 */
const filterConfig = {
  // useCache: true, // 使用查询条件暂存
  // cacheBtnText: '记住查询', // 暂存按钮文字，默认 '记住查询'
  // labelCol: { span: 6 },
  // wrapperCol: { span: 18 },
  // 一行显示几列由每个字段的 colSize 决定，一行 24 格，每个字段可以设置占用格数，一行不够时自动换行，注：查询重置按钮固定占 4-6 格(使用记住查询时占用6格，否则4格)
  // 字段配置
  fields: [
    {
      label: '关键字',
      fieldName: 'key',
      // type: EControlType.eInput, // 默认 eInput 可以不设置
      colSize: { flex: '230px' },
      // 每个字段的宽度可以很灵活控制，固定宽度、同宽、自适应等 参考 ant-design-vue a-col 的属性
      // colSize: { span: 8 }, // 整个字段(包含文本和控件)占整行24栅格的比例，固定宽度可以设置为 { flex: '280px' }, 默认响应式分配：{ sm: 8, lg: 6, xxl: 4 }
      // labelCol: { span: 7 }, // 字段文本部分占整个字段的比例，遵循 24 栅格规则，或使用 flex 布局，{ flex: 2 }
      // wrapperCol: { span: 18 }, // 字段控件部分占整个字段的比例
      props: {
        placeholder: '请输入姓名/手机号/账号'
      }
    },
    {
      label: '是否启用',
      fieldName: 'isEnabled',
      type: EControlType.eSelect,
      colSize: { flex: '0 0 180px' },
      defaultValue: 1, // 给一个默认值，注：设置了默认值后，页面初始化时 c-filter 组件会自动提交一次查询，tableConfig.initSearch 将会默认关闭
      props: {
        options: EIsEnabled._list
      }
    },
    {
      label: '字典下拉',
      fieldName: 'xxxStatus',
      type: EControlType.eSelect,
      props: {
        useRefresh: false, // 是否需要刷新按钮
        dictType: 'audit_status' // 指定字典类型，自动查询出字典项数据
      }
    },
    {
      label: '数字范围',
      fieldName: 'numberRange', // 后端使用数组接收
      type: EControlType.eNumberRange,
      props: {
      }
    },
    {
      label: '时间范围',
      colSize: { flex: '320px' },
      fieldName: 'createTime', // 对应查询数据库中的字段，提交时会删掉，替换成 fieldNames 中设置的两个字段
      type: EControlType.eDateRange,
      props: {
        // showTime: true, // 是否显示时分秒
        // fieldNames: ['createTimeBegin', 'createTimeEnd'] // 默认是 fieldName 后面增加 'Begin', 'End'，可以不填
      }
    }
  ]
}
const uploadFile = ref()
/** 自定义工具栏按钮配置 object | computed(() => object) */
const toolsConfig = computed(() => ({
  // addBtnText: '新增',
  // addInitData: { parentId: 0 }, // 新增时初始化表单的数据
  // backBtnText: '返回',
  otherTools: [
    {
      name: '自定义按钮', // String | ({ selectedIds, selectedObjs, pagination }) => String
      permission: 'system:user:diy',
      props: {
        type: 'link',
        icon: 'EditOutlined',
        disabled: ({ selectedIds, selectedObjs, pagination }) => selectedObjs.some(item => item.status === 1),
        onClick ({ selectedIds, selectedObjs, pagination }) {
          // console.log('我被点击了')
          // Modal.confirm({
          //   title: '温馨提示',
          //   content: '确认要xxx？',
          //   async onOk () {
          //     await axios.post(`/xx/xx`, {...})
          //     message.success('xx成功！')
          //     cPage.value.refresh()
          //     cPage.value.clearSelect()
          //   }
          // })
        }
      }
    },
    // 自定义其他组件
    // {
    //   component: 'FileUpload', // 全局组件，直接写组件名，如 'a-button', 非全局组件，可以在上面 import, 然后指定，如：component: MyComponent
    //   permission: 'system:user:diy',
    //   props: {
    //     value: uploadFile.value,
    //     maxCount: 1,
    //     accept: '.doc,.docx',
    //     showUploadList: false,
    //     btnText: '上传文件',
    //     btnProps: {
    //       // icon: false,
    //       type: 'primary'
    //     }
    //   },
    //   // 事件监听，对象方式
    //   on: {
    //     click () {
    //       // 我被点击了
    //     }
    //   },
    //   // 事件监听，函数方式，可以获取到页面相关信息
    //   // on: ({ selectedIds, selectedObjs, searchParams, pagination }) => {
    //   //   return {
    //   //     'update:value' (fileList) {
    //   //       uploadFile.value = fileList
    //   //       setTimeout(() => {
    //   //         uploadFile.value = undefined
    //   //       })
    //   //     }
    //   //   }
    //   // }
    // }
  ]
}))
/** 数据列表配置 */
const tableConfig = computed(() => ({
  props: {
    scroll: { x: 'max-content' }
    // 参考 a-table props
    // bordered: true, // 是否使用边框线，默认使用
    // size: 'small', // 组件尺寸，默认 small
    // pageSize: 22, // 重写分页大小选项
    // usePage: false, // 不使用分页，默认使用
    // rowClick ({ key, record, index, selected, selectedIds, selectedObjs }) { // 配置数据行点击事件
      // if (!selected) {
      //   selectedIds.value.push(key)
      //   selectedObjs.value.push(record)
      // } else {
      //   selectedIds.value = selectedIds.value.filter(id => id !== key)
      //   selectedObjs.value = selectedObjs.value.filter(item => item.id !== key)
      // }
    // }
  },
  initSearch: true, // 默认 true，初始化时查询
  columns: [
    {
      title: '姓名',
      tooltip: '用户真实姓名',
      dataIndex: 'nickName',
      resizable: true,
      width: 100,
      // sorter: true, // 服务端排序
      sorter: (a, b) => (a.nickName ?? '').localeCompare(b.nickName ?? '', 'zh-Hans-CN') // 本地排序，中文排序
      // sorter: (a, b) => a.totalCount - b.totalCount, // 本地排序，非中文排序
    },
    {
      title: '年龄',
      dataIndex: 'age',
      resizable: true,
      width: 80,
      minWidth: 40,
      maxWidth: 200,
      useTotal: true // 使用合计
    },
    {
      title: '带单位',
      dataIndex: 'withUnit',
      unit: '元', // 在后面拼上单位
      width: 100
    },
    {
      title: '名称2',
      dataIndex: 'name2',
      width: 100,
      hidden: true // 该列暂时隐藏，可通过列筛选勾选显示
    },
    {
      title: '类型',
      dataIndex: 'type2',
      customRender: ({ value }) => '类型1',
      width: 100
    },
    {
      title: '字典',
      dataIndex: 'dict',
      width: 100,
      dictType: 'dict_type' // 自动按指定的字典类型解析出中文
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      customRender: ({ value, record, index, column }) => { // 自定义渲染函数
        return h('span', {
          class: 'text-danger'
        }, '状态1')
      }
    },
    {
      title: '自定义组件',
      dataIndex: 'diy',
      width: 120,
      customRender: ({ value, record, index, column }) => {
        return h(resolveComponent('a-tag'), {
          bordered: false,
          color: record.color
        }, value)
      }
    },
    {
      title: '是否启用',
      dataIndex: 'isEnabled',
      width: 100,
      type: 'isEnabled' // type 预处理类型，isEnabled，格式化为是否启用
    },
    {
      title: '字符串脱敏',
      dataIndex: 'phonenumber',
      width: 100,
      hideChar: [3, 4, '*'] // 字符串脱敏，第一个值为左边显示字符数，第二个参数为右边显示字符数，剩下的使用第三个参数代替，默认'*'可不传
    },
    {
      title: '地址',
      dataIndex: 'address',
      hidden: true,
      width: 180,
      ellipsis: true // ant-design 自带的超出宽度隐藏
    },
    {
      title: '插槽',
      dataIndex: 'slotField',
      width: 100,
      slot: 'table_slotField' // 使用插槽渲染
    },
    {
      title: '日期自动格式化',
      dataIndex: 'createTime',
      width: 150,
      // isDate: true, // 自动格式化为 YYYY-MM-DD
      isDateTime: true, // 或 自动格式化为 YYYY-MM-DD HH:mm
      // dateFormat: 'YYYY-MM-DD HH:mm:ss' // 或 自定义格式
    },
    {
      title: '操作',
      width: 140,
      fixed: 'right',
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
            callback: 'delete' // 删除操作默认带确认框
          },
          {
            name: record.isEnabled ? '启用' : '禁用',
            confirm: true,
            callback: 'toggle'
          },
          // {
          //   name: '自定义',
          //   permission: 'system:user:diy',
          //   confirm: true, // 该操作是否需要确认操作
          //   confirmContent: '', // 确认框提示内容，不填则使用默认模板
          //   callback ({}) {
          //     console.log('我被点击了', record)
          //   }
          // },
          // 更自由的自定义
          // {
          //   name: '自定义2', // 操作名称，当使用了 confirm: true 后，用于弹窗提示中显示，不使用 confirm 可不设置
          //   permission: 'system:user:diy2',
          //   confirm: true,
          //   customRender: data => {
          //     return h('span', { class: '' }, '自定义2') // 定义元素外观
          //   },
          //   callback () { // 点击事件还是使用 callback (方便确认框点击确定时调用)
          //     console.log('自定义2被点击了')
          //   }
          // }
        ]
        if (record.type === '3') {
          btns.push({
            name: '动态操作',
            permission: 'system:user:opt',
            confirm: true,
            confirmContent: `确认xxx${record.name}吗？`,
            callback ({}) {
              //console.log(record.name + 'xxx')
            }
          })
        }
        return btns
      }
    }
  ]
}))
/**
 * 新增、修改、详情弹窗配置
 */
const modalConfig = computed(() => ({
  title: 'Demo', // 弹窗标题，会自动根据类型拼上新增、编辑、详情关键字
  // fullTitle: '', // 全称，不会自动拼接其他字符串
  width: 800, // 弹窗宽度，默认 600
  mode: 'modal', // 弹窗模式, modal 或 drawer
  // props: { maskClosable: false }, // 其他参数, 会直接绑定到 a-modal 或 a-drawer
  // 弹窗按钮属性修改 Object || ({ isAdd, isEdit, isView }) => Object
  buttonConfig: ({ isAdd, isEdit, isView }) => ({
    // showConfirm: !isEdit, // 确认按钮是否可见，默认可见
    confirmText: isEdit ? '确认修改' : '确认提交', // 默认是确定
    // confirmContinue: true, // true || (formData, submitData) => {}，提交之后是否继续，继续则不关闭弹窗，只清空数据，可传一个函数对继续后的表单数据初始化(如给排序序号+1)
    // showCancel: !isEdit // 取消按钮是否可见，默认可见
    cancelText: '关闭', // 默认是关闭
  }),
  // 表单配置 Object || ({ isAdd, isEdit, isView, detail }) => Object
  formConfig: ({ isAdd, isEdit, isView, detail }) => ({
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    colSize: 2, // 一行显示几列
    // 表单字段
    fields: [ // 表单字段数组，可分组
      {
        label: '短文本',
        fieldName: 'shortText',
        // type: EControlType.eInput, // 控件类型，默认文本框
        // required: true, // 是否必填 Boolean || formData => Boolean
        // disabled: isEdit, // 是否禁用 Boolean || formData => Boolean
        // none: isView, // 是否不需要改字段，Boolean || formData => Boolean
        // extra: formData => '222', // 字段额外说明， String || formData => String
        // rules: [], // 校验规则，与 <a-form-item> 一致， object || array
        props: { // 没有属性可以不配
          // 根据 type 继承自对应 ant-design-vue 控件的属性和事件
          // placeholder 会默认生成，可以不配
          allowClear: true
        }
      },
      {
        label: '隐藏域',
        fieldName: 'hidden1',
        type: EControlType.eHidden,
      },
      {
        label: formData => '整数', // 字段描述 String || formData => String
        fieldName: 'int',
        type: EControlType.eNumber,
        tooltip: formData => '111', // 字段提示， String || formData => String
        // extra: formData => '222', // 字段额外说明， String || formData => String
        // required: true, // 是否必填，Boolean || formData => Boolean
        defaultValue: 23,
        // disabled: formData => !formData.userName, // 组件是否禁用，Boolean || formData => Boolean
        // rules: [], // object || array || formData => { return {} || [] }
        props: {
          precision: 0,
          min: 1,
          max: 100
          // placeholder: '请输入年龄', // 默认"请输入+label"， String || formData => String
          // onChange (val, formData) {}
        } // 控件其他属性，所有控件都支持 onChange 事件
      },
      {
        // 字段分组
        title: '分组标题', // String || formData => String
        subTitle: '分组副标题', // String || formData => String
        // none: formData => !formData.userName, // true表示该项不可见(不使用该字段)，Boolean || formData => Boolean
        fields: [
          {
            label: '密码',
            fieldName: 'password',
            type: EControlType.eInput,
            rules: { pattern: /^[\d\w!@#$%\^&*()]{8,16}$/, message: '密码格式错误，应8-16位数字、字母、!@#$%^&*()特殊符号' },
            none: isView, // 详情时不展示该字段
            props: {
              type: 'password',
              maxlength: 16
            }
          },
          {
            label: '确认密码',
            fieldName: 'confirmPassword',
            type: EControlType.eInput,
            required: true,
            rules: (formData) => [ // 为函数时，可以获取到 formData 数据
              { required: true, message: '请输入确认密码' },
              { min: 8, message: '密码至少8位' },
              {
                validator (field, value) {
                  if (value !== formData.password) {
                    return Promise.reject('密码和确认密码不一致')
                  }
                  return Promise.resolve()
                }
              }
            ],
            props: {
              type: 'password',
              maxlength: 20
            }
          },
          {
            label: '百分数',
            fieldName: 'persent',
            type: EControlType.eNumber,
            // required: true,
            props: {
              addonAfter: '%',
              precision: 2,
              min: 0,
              max: 100
            }
          },
          {
            label: '金额',
            fieldName: 'amount',
            type: EControlType.eNumber,
            // required: true,
            tooltip: '描述XXXXXXXX',
            props: {
              addonAfter: '元',
              precision: 2,
              max: 100,
              min: 0
            }
          },
          {
            label: '手机号码',
            fieldName: 'mobile',
            type: EControlType.eInput,
            // required: true,
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
            // required: true,
            rules: {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: 'change'
            },
            props: {
            }
          },
          {
            label: '单位名称',
            fieldName: 'unitName',
            type: EControlType.eInput,
            singleLine: true, // 单独占一行
            // colSpan: 12, // 该字段占一行的多少比例，24栅格
            labelCol: { span: 3 },
            wrapperCol: { span: 21 },
            props: {},
            detailConfig: { // detailConfig 详情时的配置，可对上面(详情时有效的属性)覆盖
              labelCol: undefined,
              wrapperCol: undefined,
              singleLine: false // 如：详情时不单独占一行，或者更换控件类型等
            }
          },
        ]
      },
      {
        label: '单选按钮',
        fieldName: 'radio1',
        type: EControlType.eRadio,
        props: {
          options: [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }],
          // optionType: '', // option 类型， default | button
          // buttonStyle: '' // optionType 为 button 时，button 的风格样式, outline | solid
        }
      },
      {
        label: '字典单选按钮',
        fieldName: 'radio2',
        type: EControlType.eRadio,
        props: {
          dictType: 'sys_user_sex'
          // optionType: '', // option 类型， default | button
          // buttonStyle: '' // optionType 为 button 时，button 的风格样式, outline | solid
        }
      },
      {
        label: '多选框',
        fieldName: 'checkbox',
        type: EControlType.eCheckbox,
        props: {
          options: [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }]
        }
      },
      {
        label: '字典多选框',
        fieldName: 'checkbox2',
        type: EControlType.eCheckbox,
        props: {
          dictType: 'sys_user_sex'
        }
      },
      {
        label: '静态下拉',
        fieldName: 'staticSelect',
        type: EControlType.eSelect,
        props: {
          useAll: true, // 是否在前面添加全部
          // allowClear: true,
          options: [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }]
          // mode: '', // 下拉模式 'multiple' | 'tags' | 'combobox'
        }
      },
      {
        label: '字典下拉',
        fieldName: 'dictSelect',
        type: EControlType.eSelect,
        props: {
          useAll: false, // 是否在前面添加全部，默认 false
          useRefresh: false, // 是否开启手动刷新功能，默认 true，会在控件后面添加刷新图标，点击刷新控件的数据源
          dictType: 'sys_user_sex',
          // allowClear: true,
          // mode: '', // 下拉模式 'multiple' | 'tags' | 'combobox'
        }
      },
      {
        label: '动态下拉',
        fieldName: 'dmSelect',
        type: EControlType.eSelect,
        props: {
          // useRefresh: false, // 有动态数据源的组件特有的属性，是否开启手动刷新功能，默认 true，会在控件后面添加刷新图标，点击刷新控件的数据源
          remote: {
            url: '/system/user/selectUser',
            // method: 'get', // 默认 post
            params: {
              // type: 1,
              type: '{formData.radio1:required}' // 动态参数，formData代表表单数据，required代表是否必填，必填时，有值才获取数据源
            },
            // autoRefresh: true, // 每次弹窗后自动刷新远程数据
            converter (result) { // 对接口返回数据进行修改，转成 [{id, name, xxx}] 格式
              return result.list?.map(item => ({ id: item.userId, name: item.nickName }))
            }
          }
        }
      },
      {
        label: '树形单选',
        fieldName: 'tree',
        type: EControlType.eTreeSelect,
        props: {
          // useRefresh: false, // 有动态数据源的组件特有的属性，是否开启手动刷新功能，默认 true，会在控件后面添加刷新图标，点击刷新控件的数据源
          remote: {
            url: '/system/user/deptTree',
            // method: 'get', // 默认 post
            // params: {}, // 额外请求参数
            // autoRefresh: true, // 每次弹窗后自动刷新远程数据
            // converter
          },
          fieldNames: { // 与默认值一致时可以不用配
            // value: 'id', // value 对应的字段名，默认 id
            label: 'label', // 名称 对应的字段名，默认 name
            // children: 'children' // 子集列表对应的字段名，默认 children
          }
        }
      },
      {
        label: '树形多选',
        fieldName: 'treeMul',
        type: EControlType.eTreeSelect,
        props: {
          remote: {
            url: '/system/user/deptTree'
          },
          treeCheckable: true,
          fieldNames: {
            value: 'id',
            label: 'label',
            children: 'children'
          }
        }
      },
      {
        label: '日期',
        fieldName: 'date',
        type: EControlType.eDate,
        props: {
          // showTime: true // 是否需要时分秒
          // onChange (val, formData) { } // 改变事件
        }
      },
      {
        label: '日期范围',
        // 范围类字段，后端一般是设置为起、止两个字段，此处设置的字段名提交时会删掉，替换成 fieldNames 中设置的两个字段，编辑时会反向解析到该字段
        fieldName: 'dateRange',
        type: EControlType.eDateRange,
        props: {
          // 是否需要时分秒
          // showTime: true
          // 可选，默认是 fieldName 后面增加 'Begin', 'End'
          // fieldNames: ['dateRangeBegin', 'dataRangeEnd']
        }
      },
      {
        label: '是否',
        fieldName: 'switch',
        type: EControlType.eSwitch,
        props: {
        }
      },
      {
        label: '文件上传',
        fieldName: 'fileUpload',
        type: EControlType.eFileUpload,
        tooltip: '仅支持 zip/rar 文件',
        props: {
          accept: '.zip,.rar',
          maxCount: 5, // 最大上传文件数量
          fileSize: 2 * 1024 // kb
        }
      },
      {
        label: '图片上传',
        fieldName: 'imageUpload',
        type: EControlType.eImageUpload,
        props: {
        }
      },
      {
        label: '文本域',
        fieldName: 'remark',
        type: EControlType.eTextarea,
        required: true,
        singleLine: true,
        labelCol: { span: 3 },
        wrapperCol: { span: 21 },
        props: {
          // rows: 5,
          // maxlength: 100
        }
      },
      {
        label: '富文本',
        fieldName: 'editor',
        type: EControlType.eEditor,
        required: true,
        singleLine: true,
        labelCol: { span: 3 },
        wrapperCol: { span: 21 },
        props: {
        }
      },
      {
        label: '动态表格',
        fieldName: 'table',
        type: EControlType.eTable,
        labelCol: { span: 3 },
        wrapperCol: { span: 21 },
        singleLine: true,
        // disabled: true,
        // required: true, // 无效配置，请配置在 props.columns 的每一项里
        // rules: {}, // 无效配置，请配置在 props.columns 的每一项里
        // 动态表格的校验规则，全部配置在 columns 内，只要有一个 column 的 required 为 true，则表示该项为必填项
        // 校验规则 只支持 required, validate: (index, value, record) => {} ()
        props: {
          // primaryKey: 'id',
          // maxNum: 10,
          columns: [
            {
              // 表格列字段参考 DynamicTable 的 props.columns
              title: '字段1',
              tooltip: '字段1描述',
              dataIndex: 'field1',
              type: EControlType.eInput,
              required: true,
              validate: (index, value) => {
                if (value.length < 3) {
                  // 错误时，return 'message'
                  return `第${ index + 1 }行字段1长度不能小于3`
                }
                // 正确时无需返回
              }
            },
            {
              title: '字段2',
              dataIndex: 'field2',
              type: EControlType.eSelect,
              props: {
                useAll: true,
                options: [{id: 1, name: 1}]
              }
            }
          ]
        }
      },
      {
        label: '自定义组件',
        fieldName: 'custom',
        type: EControlType.eCustom,
        // singleLine: true,
        props: {
          // component：对象或返回对象的函数 Object || (formData) => Object
          component: {
            render () { return h('span', {}, '自定义组件8888') }
          }
          // 或者 使用全局组件, import { resolveComponent } from 'vue'
          // component: resolveComponent('DictView'),
          // 或者 外部引入的单文件组件 import MyComponent from 'xxx'
          // component: MyComponent,
          // 其他属性在同级设置
          // props1: ''
          // modelProps: 'checkedKeys', // 自定义组件的 v-model:value 字段 默认是 value
          // modelEvent: 'onCheck', // 自定义组件的 v-model 事件字段，默认是 update:value
          // modelData: 'treeData', // 自定义组件的 dataSource 字段
          // renderNeedDataSource: true // 需要有数据源才渲染
        }
      }
    ]
  })
}))

/**
 * 查询前修改查询参数
 * @param {object} searchParams 查询参数
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
 * 提交表单数据前对提交的数据修改
 * @param {Object} submitData 提交的数据
 * @param {Object} param 其他参数
 * @returns 修改后的数据
 */
function beforeSubmit (submitData, { isAdd, isEdit, isView, detail }) {
  return submitData
}

/**
 * 提交表单数据成功后执行
 * @param {Object} formData 提交的数据
 * @param {Object} param 其他参数
 * @returns 修改后的数据
 */
function afterSubmit ({ isAdd, isEdit, formData, detail }) {
}

/**
 * 弹窗(新增、修改、详情弹窗)后执行
 * @param {Object} param 其他参数
 */
function afterOpenModal ({ isAdd, isEdit, isView, record, detail, cForm }) {
  // const formRemotes = cForm.value.remotes()
  // formRemotes['有远程数据源的字段的字段名']?.() // 手动触发获取某个字段的远程数据源
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
