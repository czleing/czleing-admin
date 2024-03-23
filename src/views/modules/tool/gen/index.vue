<!-- 代码生成-模型列表 -->
<template>
  <div class="gen-page">
    <CPage
      ref="cPage"
      noAdd
      primary-key="tableId"
      :api-option-config="{
        list: {
          headers: {
            datasource
          }
        }
      }"
      :tools-config="toolsConfig"
      :filter-config="filterConfig"
      :table-config="tableConfig"
    />
    <ImportTable ref="importTable" :datasource="datasource" @completed="refresh" />
  </div>
</template>

<script setup>
import { computed, h, ref } from 'vue'
import CPage from '@/components/crud/c-page.vue'
import { EControlType } from '@/enum/index.js'
import ImportTable from './components/import-table.vue'

const cPage = ref()
const importTable = ref()
const datasource = 'master'

const filterConfig = computed(() => ({
  fields: [
    {
      label: '表名称',
      fieldName: 'tableName',
      type: EControlType.eInput,
      props: {
      }
    },
    {
      label: '表描述',
      fieldName: 'tableComment',
      type: EControlType.eInput,
      props: {
      }
    }
  ]
}))
const toolsConfig = computed(() => ({
  otherToolsBtns: [
    {
      name: '导入表',
      permission: 'tool:gen:import',
      props: {
        type: 'primary',
        icon: 'ImportOutlined',
        onClick ({ selectedIds, selectedObjs, pagination }) {
          importTable.value.open()
        }
      }
    }
  ]
}))
const tableConfig = computed(() => ({
  props: {
    // rowClick (record, index, selected) { // 配置数据行点击事件
    //   selectedObj.value = selected ? record : undefined
    // }
  },
  initSearch: true, // 默认 true，初始化时查询
  columns: [
    {
      title: 'ID',
      dataIndex: 'tableId',
      hidden: true
    },
    {
      title: '表名称',
      dataIndex: 'tableName'
    },
    {
      title: '表描述',
      dataIndex: 'tableComment'
    },
    {
      title: '实体',
      dataIndex: 'className'
    },
    {
      title: '状态',
      dataIndex: 'status',
      dictType: 'gen_status'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime'
    },
    {
      title: '操作',
      actionShowNum: 5,
      action: ({ record }) => {
        const btns = [
          {
            name: '预览',
            permission: 'tool:gen:preview',
            callback () {
              handlePreview(record)
            }
          }
        ]
        if (record.status === '0') {
          btns.push(...[
            {
              name: '编辑',
              callback: 'edit'
            },
            {
              name: '删除',
              callback: 'delete' // 删除操作默认带确认框
            },
            {
              name: '同步',
              permission: 'tool:gen:edit',
              callback () {
                handleSyncDb(record)
              }
            },
            {
              name: '生成代码',
              permission: 'tool:gen:code',
              callback () {
                handleGenTable(record)
              }
            }
          ])
        }
        return btns
      }
    }
  ]
}))

/**
 * 预览
 * @param {Object} record 
 */
function handlePreview (record) {

}

/**
 * 同步
 * @param {Object} record 
 */
function handleSyncDb (record) {

}

/**
 * 同步
 * @param {Object} record 
 */
function handleGenTable (record) {

}

function refresh () {
  cPage.value?.refresh()
}
</script>

<style lang="scss" scoped>
</style>

