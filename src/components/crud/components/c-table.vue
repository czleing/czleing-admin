<!-- c-page 表格、数据展示组件 -->
<template>
  <div class="c-table">
    <a-table
      :columns="currColumns"
      :data-source="dataSource"
      :pagination="pagination"
      v-bind="{ ...defaultProps, ...config?.props }"
      :rowKey="primaryKey"
      :row-class-name="`striped-row ${config?.props?.rowClick ? 'pointer' : ''}`"
      :row-selection="currentRowSelection"
      :custom-row="customRow"
      @resizeColumn="(w, col) => col.width = w"
      @change="onPageChangeHandle"
    >
      <template #headerCell="{ column }">
        <template v-if="column.tooltip">
          <span>
            <a-tooltip :title="column.tooltip">
              <QuestionCircleOutlined />
            </a-tooltip>
            {{ column.title }}
          </span>
        </template>
      </template>
      <template #bodyCell="{ text, record, index, column }">
        <!-- 如果使用插槽来渲染单元格内容 -->
        <template v-if="column.slot">
          <slot :name="column.slot" :text="text" :record="record" :index="index" :column="column" />
        </template>
        <!-- 日期时间格式化 -->
        <template v-else-if="column.dateFormat && text">
          <span>{{ dayjs(text).format(column.dateFormat) }}</span>
        </template>
        <template v-else-if="column.isDate && text">
          <span>{{ dayjs(text).format('YYYY-MM-DD') }}</span>
        </template>
        <template v-else-if="column.isDateTime && text">
          <span>{{ dayjs(text).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
        <!-- 字典转换 TODO -->
        <!-- 操作列 -->
        <template v-if="column.action">
          <CTableAction :record="record" :column="column" :permission-config="permissionConfig" @action="onActionHandle" />
        </template>
      </template>
      <!-- 使用合计 -->
      <template v-if="useTotal" #summary>
        <a-table-summary fixed>
          <a-table-summary-row>
            <a-table-summary-cell
              v-for="(column, index) in currColumns"
              :key="column.fieldName"
              :col-span="index === 0 && !noSelect ? 2 : 1"
              class="tc"
            >
              <div v-if="index === 0" class="bold">合计</div>
              <span v-else-if="column.useTotal">{{ total[column.dataIndex] }}</span>
              <span v-else>-</span>
            </a-table-summary-cell>
          </a-table-summary-row>
        </a-table-summary>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, computed, inject, watchEffect, onMounted } from 'vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import axios from '@/api/index.js'
import dayjs from 'dayjs'
import CTableAction from './c-table-action.vue'

const props = defineProps({
  /** 不要选择框 */
  noSelect: Boolean,
  /** 表格配置 */
  config: Object,
  /** 表格配置 */
  primaryKey: { type: String, default: 'id' },
  /** 接口配置 */
  apiConfig: Object,
  /** 接口请求方式配置 */
  apiMethodConfig: Object,
  /** 权限配置 */
  permissionConfig: Object,
  /** 查询后修改查询结果 */
  afterSearch: Function
})

const checkedFieldNames = inject('c-page.checkedFieldNames', ref([]))
const searchParams = inject('c-page.searchParams', ref({}))
const pagination = inject('c-page.pagination', ref({}))
const loading = inject('c-page.loading', ref(false))
const selectedIds = inject('c-page.selectedIds', ref([]))
const selectedObjs = inject('c-page.selectedObjs', ref([]))
const currColumns = ref([])
const dataSource = ref([])
// 表格默认属性
const defaultProps = computed(() => ({
  size: 'small',
  bordered: true
}))
// 表格行选择器定义
const currentRowSelection = computed(() => {
  const option = Object.assign({ selectedRowKeys: selectedIds.value, onChange: onSelectChangeHandle, getCheckboxProps: rowSelectDisabled }, props.config?.props?.rowSelection)
  return !props.noSelect ? option : undefined
})
// 是否使用合计
const useTotal = computed(() => currColumns.value.some(col => col.useTotal))
// 合计数据
const total = computed(() => {
  if (useTotal.value) {
    return dataSource.value.reduce((t, c) => {
      currColumns.value.forEach(col => {
        if (col.useTotal) {
          t[col.dataIndex] = (t[col.dataIndex] ?? 0) + Number(c[col.dataIndex] ?? 0)
        }
      })
      return t
    }, {})
  } else {
    return {}
  }
})

// 伸缩列宽时需要 column 可编辑，所以重新定义了 currColumns
watchEffect(() => {
  currColumns.value = props.config?.columns
  .filter(column => column.action || checkedFieldNames.value.includes(column.dataIndex))
  .map(column => ({ ...column, align: column.align ?? 'center'}))
})
// 初始化后是否查询
onMounted(() => {
  if (props.config.initSearch !== false) {
    getList()
  }
})

/** 获取数据 */
async function getList () {
  const url = props.apiConfig?.list
  const params = {
    ...searchParams.value,
    // page: {
    pageNum: pagination.value.current,
    pageSize: pagination.value.pageSize
    // }
  }
  try {
    loading.value = true
    const result = await axios[props.apiMethodConfig['list']](url, params)
    // console.log('模拟获取列表数据', url, props.apiMethodConfig['list'], params)
    // const result = {
    //   list: data,
    //   total: 3
    // }
    let list = result?.list || result?.rows
    if (typeof props.afterSearch === 'function') {
      list = props.afterSearch(list)
    }
    dataSource.value = list
    pagination.value.total = Number(result?.total)
  } finally {
    loading.value = false
  }
}

// 可以通过数据中的字段 selectDisabled 控制选择框是否禁用
function rowSelectDisabled (record) {
  return { disabled: !!record.selectDisabled }
}
function onSelectChangeHandle (ids, objs) {
  selectedIds.value = ids
  selectedObjs.value = objs
}
function onPageChangeHandle (page) {
  pagination.value.current = page.current
  pagination.value.pageSize = page.pageSize
  getList()
}

const data = [
  {
    id: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
    createTime: Date.now()
  },
  {
    id: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 2 Lake Park, London No. 2 Lake Park',
    tags: ['loser'],
    createTime: Date.now()
  },
  {
    id: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park, Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
    createTime: Date.now()
  }
]

function search () {
  getList()
}

function onActionHandle (data) {
  emits('action', data)
}

/** 行事件配置 */
function customRow (record, index) {
  return {
    onClick () {
      const fn = props.config.props?.rowClick
      if (typeof fn === 'function') { // 如果配置了行点击函数
        if (selectedIds.value.length && selectedIds.value[0] === record[props.primaryKey]) {
          selectedIds.value = []
          selectedObjs.value = []
          fn(record, index, false)
        } else {
          selectedIds.value = [record[props.primaryKey]]
          selectedObjs.value = [record]
          fn(record, index, true)
        }
      }
    }
  }
}

const emits = defineEmits(['action'])
defineExpose({
  refresh: search,
  reload: search,
  search
})
</script>

<style lang="less">
[theme='light'] .striped-row:nth-child(even) {
  background-color: #fcfcfd;
}
[theme='dark'] .striped-row:nth-child(even) {
  background-color: #0a0a0a;
}
</style>
