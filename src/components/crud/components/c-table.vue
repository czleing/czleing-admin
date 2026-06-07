<!-- c-page 表格、数据展示组件 -->
<template>
  <div class="c-table">
    <a-table
      :columns="currColumns"
      :data-source="dataSource"
      :pagination="config?.props?.usePage === false ? false : pagination"
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
        <!-- 字典转换 -->
        <template v-else-if="column.dictType && text">
          <DictView :dict-type="column.dictType" :value="text" />
        </template>
        <!-- 类型转换 -->
        <template v-else-if="column.type">
          <template v-if="column.type === 'isEnabled'">
            <span :class="EIsEnabled._classOf(text ? 1 : 0)">{{ EIsEnabled._of(text ? 1 : 0) }}</span>
          </template>
        </template>
        <!-- 带单位、带默认值、字符串脱敏 -->
        <template v-else-if="column.hideChar || column.default || column.unit">
          <span v-if="isEmpty(text)" v-html="column.default" />
          <span v-else>{{ column.hideChar ? stringStar(text, ...column.hideChar) : text }}</span>
          {{ column.unit ?? '' }}
        </template>
        <!-- 操作列 -->
        <template v-else-if="column.action">
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
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import axios from '@/api/index.js'
import dayjs from 'dayjs'
import CTableAction from './c-table-action.vue'
import { EIsEnabled } from '@/enum'
import { stringStar, isEmpty } from '@/utils/index.js'

const props = defineProps({
  /** 不要选择框 */
  noSelect: Boolean,
  /** 表格配置 */
  config: Object,
  /** 查询器那边是否自动提交查询(有默认值时会自动提交) */
  filterAutoSearch: Boolean,
  /** 表格配置 */
  primaryKey: { type: String, default: 'id' },
  /** 接口配置 */
  apiConfig: Object,
  /** 接口请求方式配置 */
  apiMethodConfig: Object,
  /** 接口请求其他配置，如 headers */
  apiOptionConfig: Object,
  /** 权限配置 */
  permissionConfig: Object,
  /** 查询前修改查询参数 */
  beforeSearch: Function,
  /** 查询后修改查询结果 */
  afterSearch: Function
})

const checkedFieldNames = inject('c-page.checkedFieldNames', ref([]))
const searchParams = inject('c-page.searchParams', ref({}))
const pagination = inject('c-page.pagination', ref({}))
const cPageSorter = inject('c-page.sorter', ref({}))
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
const usePage = computed(() => props.config?.props?.usePage !== false)
const page = computed(() => {
  return {
    pageNum: usePage.value ? pagination.value.current : undefined,
    pageSize: usePage.value ? pagination.value.pageSize : undefined,
    orderByColumn: cPageSorter.value.field,
    isAsc: cPageSorter.value.order && {ascend: 'asc', descend: 'desc'}[cPageSorter.value.order]
  }
})
// 合计数据
const total = computed(() => {
  if (useTotal.value) {
    return dataSource.value?.reduce((t, c) => {
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
  // 查询器会查我就不查，查询器不查，我就根据配置决定查不查
  const initSearch = props.config.initSearch ?? !props.filterAutoSearch
  if (initSearch !== false) {
    getList()
  }
})

/** 获取数据 */
async function getList () {
  const url = props.apiConfig?.list
  let params = {
    ...searchParams.value,
    page: page.value
  }
  if (typeof props.beforeSearch === 'function') {
    params = props.beforeSearch(params)
  }
  try {
    loading.value = true
    const result = await axios[props.apiMethodConfig['list']](url, params, props.apiOptionConfig?.list)
    let list = result?.list ?? result
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
function clearSelect () {
  selectedIds.value = []
  selectedObjs.value = []
}
function onPageChangeHandle (page, filter, sorter) {
  let needRefresh = false
  if (pagination.value.current !== page.current || pagination.value.pageSize !== page.pageSize) {
    needRefresh = true
  }
  pagination.value.current = page.current
  pagination.value.pageSize = page.pageSize
  if (sorter.order && sorter.column.sorter === true) { // sorter 为 true，服务端排序，sorter 为 function 则客户端排序
    cPageSorter.value.field = sorter.field
    cPageSorter.value.order = sorter.order
  } else {
    cPageSorter.value.field = undefined
    cPageSorter.value.order = undefined
  }
  needRefresh && getList()
}

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
        fn({
          key: record[props.primaryKey],
          index,
          record,
          selected: selectedIds.value.includes(record[props.primaryKey]),
          selectedIds,
          selectedObjs
        })
      }
    }
  }
}

const emits = defineEmits(['action'])
defineExpose({
  refresh: search,
  reload: search,
  clearSelect,
  search,
  dataSource
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
