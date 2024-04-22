<!-- 代码生成-编辑配置 -->
<template>
  <Modal ref="cModal" title="代码生成-编辑" mode="drawer" width="1200" :mask-closable="false" :before-confirm="beforeConfirm">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="基本信息">
        <CForm
          ref="basicForm"
          is-edit
          primary-key="tableId"
          :detail="detail"
          :form-config="basicFormConfig"
          :show-confirm="false"
          :show-cancel="false"
        />
      </a-tab-pane>
      <a-tab-pane key="2" tab="字段信息">
        <CForm
          ref="columnForm"
          is-edit
          :detail="{ columns: rows }"
          :form-config="columnFormConfig"
          :show-confirm="false"
          :show-cancel="false"
        />
      </a-tab-pane>
      <a-tab-pane key="3" tab="生成信息">
        <CForm
          ref="genForm"
          is-edit
          primary-key="tableId"
          :detail="detail"
          :form-config="genFormConfig"
          :show-confirm="false"
          :show-cancel="false"
        />
      </a-tab-pane>
    </a-tabs>
  </Modal>
</template>

<script setup>
import { computed, ref, getCurrentInstance } from 'vue'
import { EControlType } from '@/enum/index.js'
import { isEmpty } from '@/utils/index.js'
import axios from '@/api/index.js'
import CForm from '@/components/crud/components/c-form.vue'

const props = defineProps({
  datasource: String
})

const _this = getCurrentInstance().proxy
const cModal = ref()
const activeKey = ref('1')
const record = ref({}) // 从列表中带过来的列表项 item
const detail = ref({}) // 详情-导入表格的详细信息
const tables = ref([]) // 详情-表格列表，用于选择子表
const rows = ref([]) // 详情-代码生成的字段行配置数据
const subColumns = ref([]) // 通过选择字表关联出来的字表字段，用于选择主外键关联字段

async function getDetail () {
  const result = await axios.post('/tool/gen/detail/' + record.value?.tableId, null, {
    headers: { datasource: props.datasource }
  })
  detail.value = result.info
  tables.value = result.tables
  rows.value = result.rows
}

/** 基础信息表单配置 */
const basicFormConfig = computed(() => ({
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  colSize: 2,
  fields: [
    {
      label: '表名称',
      fieldName: 'tableName',
      type: EControlType.eInput,
      required: true
    },
    {
      label: '表描述',
      fieldName: 'tableComment',
      type: EControlType.eInput,
      required: true
    },
    {
      label: '实体类名称',
      fieldName: 'className',
      type: EControlType.eInput,
      required: true
    },
    {
      label: '作者',
      fieldName: 'functionAuthor',
      type: EControlType.eInput,
      required: true
    },
    {
      label: '备注',
      fieldName: 'remark',
      type: EControlType.eTextarea
    }
  ]
}))

/** 生成信息表单配置 */
const genFormConfig = computed(() => ({
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  colSize: 2,
  fields: [
    {
      label: '生成模板',
      fieldName: 'tplCategory',
      type: EControlType.eRadio,
      required: true,
      props: {
        options: [
          { id: 'crud', name: '单表' },
          { id: 'tree', name: '树表' },
          { id: 'sub', name: '主子表' }
        ],
        optionType: 'button',
        buttonStyle: 'solid'
      }
    },
    {
      label: '生成包路径',
      tooltip: '生成在哪个java包下，例如 “com.base.system”',
      fieldName: 'packageName',
      type: EControlType.eInput,
      disabled: formData => !!formData.packageName,
      required: true
    },
    {
      label: '生成模块名',
      tooltip: '可理解为子系统名，如系统管理 module.system.controller 中的 system',
      fieldName: 'moduleName',
      type: EControlType.eInput,
      required: true,
      props: {
        placeholder: '如：系统管理 modules.system.user 中的 system'
      }
    },
    {
      label: '生成业务名',
      tooltip: '可理解为功能英文名，例如 “user”',
      fieldName: 'businessName',
      type: EControlType.eInput,
      required: true
    },
    {
      label: '生成功能名',
      tooltip: '用作类描述，例如 “用户”',
      fieldName: 'functionName',
      type: EControlType.eInput,
      required: true
    },
    {
      label: '上级菜单',
      tooltip: '分配到指定菜单下，例如用户管理分配在“系统管理”下',
      fieldName: 'parentMenuId',
      type: EControlType.eTreeSelect,
      required: true,
      props: {
        remote: {
          url: '/system/menu/tree',
          params: {
            menuType: 'M'
          }
        },
        fieldNames: {
          value: 'id',
          title: 'label',
          children: 'children'
        }
      }
    },
    {
      label: '生成Controller',
      fieldName: 'genController',
      type: EControlType.eSwitch
    },
    {
      label: '生成Service',
      fieldName: 'genService',
      type: EControlType.eSwitch
    },
    {
      label: '生成页面',
      fieldName: 'genPage',
      type: EControlType.eSwitch
    },
    {
      label: '生成菜单',
      fieldName: 'genMenu',
      type: EControlType.eSwitch
    },
    {
      label: '树编码字段',
      tooltip: '树编码字段名， 如：“dept_id”',
      fieldName: 'treeCode',
      none: formData => formData.tplCategory !== 'tree',
      type: EControlType.eSelect,
      props: {
        options: detail.value?.columns?.map(item => ({ id: item.columnName, name: item.columnName + '：' + item.columnComment })) ?? []
      }
    },
    {
      label: '树父编码字段',
      tooltip: '树父编码字段名， 如：“parent_Id”',
      fieldName: 'treeParentCode',
      none: formData => formData.tplCategory !== 'tree',
      type: EControlType.eSelect,
      props: {
        options: detail.value?.columns?.map(item => ({ id: item.columnName, name: item.columnName + '：' + item.columnComment })) ?? []
      }
    },
    {
      label: '树名称字段',
      tooltip: '树节点显示的名称字段名， 如：“dept_name”',
      fieldName: 'treeName',
      none: formData => formData.tplCategory !== 'tree',
      type: EControlType.eSelect,
      props: {
        options: detail.value?.columns?.map(item => ({ id: item.columnName, name: item.columnName + '：' + item.columnComment })) ?? []
      }
    },
    {
      label: '关联子表的表名',
      tooltip: '关联子表的表名， 如：“sys_user”',
      none: formData => formData.tplCategory !== 'sub',
      fieldName: 'subTableName',
      type: EControlType.eSelect,
      props: {
        options: tables.value?.map(item => ({ id: item.tableName, name: item.tableName + '：' + item.tableComment })) ?? [],
        onChange (tableName, table, formData) {
          formData.subTableFkName = ''
          subColumns.value = table.columns
        }
      }
    },
    {
      label: '子表关联的外键名',
      tooltip: '子表关联的外键名， 如：“user_id”',
      none: formData => formData.tplCategory !== 'sub',
      fieldName: 'subTableFkName',
      type: EControlType.eSelect,
      props: {
        options: subColumns.value?.map(item => ({ id: item.columnName, name: item.columnName + '：' + item.columnComment })) ?? []
      }
    }
  ]
}))

/** 字段信息配置表单 */
const columnFormConfig = computed(() => ({
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
  colSize: 1,
  fields: [
    {
      label: '',
      fieldName: 'columns',
      type: EControlType.eTable,
      required: true,
      props: {
        maxNum: 0, // 最多0条，表示不要新增按钮
        useDelete: false, // 不要删除功能
        columns: [
          {
            title: '序号',
            dataIndex: 'sort',
            type: EControlType.eInput,
            required: true,
            isView: true
          },
          {
            title: '字段列名',
            dataIndex: 'columnName',
            type: EControlType.eInput,
            isView: true
          },
          {
            title: '字段描述',
            dataIndex: 'columnComment',
            type: EControlType.eInput
          },
          {
            title: '物理类型',
            dataIndex: 'columnType',
            type: EControlType.eInput,
            isView: true
          },
          {
            title: 'Java类型',
            dataIndex: 'javaType',
            type: EControlType.eSelect,
            props: {
              options: [
                { id: 'Long', name: 'Long' },
                { id: 'String', name: 'String' },
                { id: 'Integer', name: 'Integer' },
                { id: 'Double', name: 'Double' },
                { id: 'BigDecimal', name: 'BigDecimal' },
                { id: 'Date', name: 'Date' },
                { id: 'Boolean', name: 'Boolean' }
              ]
            }
          },
          {
            title: 'java属性',
            dataIndex: 'javaField',
            type: EControlType.eInput
          },
          {
            title: '新增',
            dataIndex: 'isInsert',
            type: EControlType.eSwitch
          },
          {
            title: '编辑',
            dataIndex: 'isEdit',
            type: EControlType.eSwitch
          },
          {
            title: '列表',
            dataIndex: 'isList',
            type: EControlType.eSwitch
          },
          {
            title: '详情',
            dataIndex: 'isQuery',
            type: EControlType.eSwitch
          },
          {
            title: '查询方式',
            dataIndex: 'queryType',
            type: EControlType.eSelect,
            props: {
              options: [
                { id: '=', name: 'EQ' }
              ]
            }
          },
        ]
      }
    }
  ]
}))


async function beforeConfirm (close) {
}

const emits = defineEmits(['completed'])

function open (options) {
  record.value = options
  cModal.value.open()
  getDetail()
}

function close () {
  cModal.value.close()
}

defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
</style>
