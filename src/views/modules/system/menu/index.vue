<!-- 菜单管理页面 -->
<template>
  <CPage
    primary-key="menuId"
    no-delete
    :tools-config="{ addBtnText: '新增根级菜单' }"
    :filter-config="filterConfig"
    :before-search="beforeSearch"
    :after-search="afterSearch"
    :before-submit="beforeSubmit"
    :transform-detail="transformDetail"
    :table-config="tableConfig"
    :modal-config="modalConfig"
  >
    <template #table_menuName="{ record }">
      {{ record.sort }}、
      <a-icon v-if="record.icon" :type="record.icon" />
      <a-button
        :type="getButtonType(record.menuType)"
        size="small"
      >
        {{ record.menuName }}
      </a-button>
    </template>
  </CPage>
</template>

<script setup>
import { h, computed, ref, resolveComponent } from 'vue'
import CPage from '@/components/crud/c-page.vue'
import { EControlType, EIsEnabled, EMenuType } from '@/enum/index.js'
import { listToTree } from '@/utils/index.js'

const filterConfig = computed(() => ({
  fields: [
    {
      label: '菜单名称',
      fieldName: 'menuName',
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
      title: '菜单名称',
      dataIndex: 'menuName',
      resizable: true,
      width: 280,
      align: 'left',
      slot: 'table_menuName'
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      width: 100,
      customRender: ({ value }) => value || '-'
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      customRender: ({ value }) => value || '-'
    },
    {
      title: '组件地址',
      dataIndex: 'component',
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
      actionShowNum: 4, // 展示操作按钮数量，剩余的将收进更多里
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
            name: '启/禁用',
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
  title: '菜单', // 弹窗标题，会自动根据类型拼上新增、编辑、详情关键字
  width: 800, // 弹窗宽度，默认 600
  mode: 'modal', // 弹窗模式, modal 或 drawer
  // 弹窗按钮属性修改 Object || ({ isAdd, isEdit, isView }) => Object
  buttonConfig: ({ isAdd, isEdit, isView }) => ({
    confirmText: isEdit ? '确认修改' : '确认提交', // 默认是确定
    // cancelText: '关闭', // 默认是关闭
    // showConfirm: !isEdit // 确认按钮是否可见，默认可见
    // showCancel: !isEdit // 取消按钮是否可见，默认可见
  }),
  // 表单配置 Object || ({ isAdd, isEdit, isView, detail }) => Object
  formConfig: ({ isAdd, isEdit, isView, detail }) => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    colSize: 2, // 一行显示几列
    // 表单字段
    fields: [ // 表单字段数组，可分组
      {
        label: '上级菜单',
        fieldName: 'parentId',
        extra: '注：菜单只能挂载在目录下，按钮只能挂载在菜单下，否则无法显示',
        type: EControlType.eTreeSelect,
        required: true,
        singleLine: true,
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
        props: {
          fieldNames: { value: 'id', label: 'label' },
          remote: {
            url: '/system/menu/treeselect',
            params: {
              menuType: `${EMenuType.eDir},${EMenuType.eMenu}`,
            },
            converter (result) {
              return [
                {
                  id: 0,
                  label: '根目录',
                  parentId: '',
                  children: result
                }
              ]
            }
          }
        }
      },
      {
        label: '菜单类型',
        fieldName: 'menuType',
        type: EControlType.eRadio,
        required: true,
        singleLine: true,
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
        defaultValue: EMenuType.eMenu,
        props: {
          options: EMenuType._list,
          optionType: 'button', // option 类型， default | button
          buttonStyle: 'solid' // optionType 为 button 时，button 的风格样式, outline | solid
        }
      },
      {
        label: formData => EMenuType._of(formData.menuType) + '名称',
        fieldName: 'menuName',
        type: EControlType.eInput,
        required: true,
        props: {
        }
      },
      {
        label: formData => EMenuType._of(formData.menuType) + '图标',
        none: formData => formData.menuType === EMenuType.eBtn,
        fieldName: 'icon',
        type: EControlType.eCustom,
        props: {
          component: resolveComponent('IconSelect')
        }
      },
      {
        label: '路由地址',
        fieldName: 'path',
        none: formData => formData.menuType === EMenuType.eBtn,
        type: EControlType.eInput,
        tooltip: '访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头',
        required: true,
        props: {
        }
      },
      {
        label: '是否外链',
        fieldName: 'isFrame',
        type: EControlType.eSwitch,
        tooltip: '是外链则路由地址需要以`http(s)://`开头',
        defaultValue: false,
        none: formData => formData.menuType !== EMenuType.eMenu,
        props: {
        }
      },
      {
        label: '组件路径',
        fieldName: 'component',
        none: formData => formData.menuType !== EMenuType.eMenu || formData.isFrame,
        type: EControlType.eInput,
        tooltip: '访问的组件路径，如：`system/user/index`，默认在`views`目录下',
        // required: true,
        props: {
          addonBefore: '@/views/'
        }
      },
      {
        label: '权限字符',
        fieldName: 'permission',
        none: formData => formData.menuType === EMenuType.eDir,
        type: EControlType.eInput,
        tooltip: '控制器中定义的权限字符，如：@SaCheckPermission(\'system:user:list\')',
        // required: true,
        props: {
        }
      },
      {
        label: '路由参数',
        fieldName: 'queryParam',
        none: formData => formData.menuType !== EMenuType.eMenu || formData.isFrame,
        type: EControlType.eInput,
        tooltip: '访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`',
        // required: true,
        props: {
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
      },
      {
        label: '是否隐藏',
        fieldName: 'isHidden',
        type: EControlType.eSwitch,
        tooltip: '是则不显示在菜单栏',
        defaultValue: false,
        none: formData => formData.menuType === EMenuType.eBtn,
        props: {
        }
      },
      {
        label: '是否缓存',
        fieldName: 'isCache',
        type: EControlType.eSwitch,
        tooltip: '是则切换Tabs栏时不会清空数据',
        defaultValue: false,
        none: formData => formData.menuType !== EMenuType.eMenu,
        props: {
        }
      },
      {
        label: '是否需要登录',
        fieldName: 'needLogin',
        type: EControlType.eSwitch,
        defaultValue: true,
        none: formData => formData.menuType === EMenuType.eBtn,
        props: {
        }
      },
      {
        label: '是否启用',
        fieldName: 'isEnabled',
        type: EControlType.eSwitch,
        none: !isView
      }
    ]
  })
}))

function getButtonType (type) {
  switch(type) {
    case 'M': return 'text';
    case 'C': return 'link';
    case 'F': return 'primary';
  }
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
  const tree = listToTree(list, 0, 'menuId')
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
