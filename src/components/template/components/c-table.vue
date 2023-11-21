<!-- c-page 表格、数据展示组件 -->
<template>
  <div class="c-table">
    <a-table
      :columns="currColumns"
      :data-source="dataSource"
      :pagination="pagination"
      v-bind="config?.props"
      row-class-name="striped-row"
      @resizeColumn="(w, col) => col.width = w"
    >
      <template #headerCell="{ column }">
        <template v-if="column.description">
          <span>
            <a-tooltip :title="column.description">
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
        <template v-else-if="column.isDateTime && text">
          <span>{{ dayjs(text).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
        <!-- 日期格式化 -->
        <template v-else-if="column.isDate && text">
          <span>{{ dayjs(text).format('YYYY-MM-DD') }}</span>
        </template>
        <!-- 操作列 -->
        <template v-if="column.action">
          <CTableAction :record="record" :column="column" :permission-config="permissionConfig" @action="onActionHandle" />
        </template>
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
  config: Object,
  /** 接口配置 */
  apiConfig: Object,
  /** 接口请求方式配置 */
  apiMethodConfig: Object,
  /** 权限配置 */
  permissionConfig: Object,
  /** 查询后修改查询结果 */
  afterSearch: Function
})

const checkedFieldNames = inject('CHECKED_FIELD_NAMES', ref([]))
const searchParams = inject('SEARCH_PARAMS', ref({}))
const pagination = inject('PAGINATION', ref({}))
const loading = inject('LOADING', ref(false))
const currColumns = ref([])
const dataSource = ref([])


// 伸缩列宽时需要 column 可编辑，所以重新定义了 currColumns
watchEffect(() => {
  currColumns.value = props.config?.columns.filter(column => column.action || checkedFieldNames.value.includes(column.dataIndex))
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
    page: {
      pageNum: pagination.value.current,
      pageSize: pagination.value.pageSize
    }
  }
  try {
    loading.value = true
    // const result = await axios[props.apiMethodConfig['list']](url, params)
    console.log('模拟获取列表数据', url, props.apiMethodConfig['list'], params)
    const result = {
      list: data,
      total: 1
    }
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

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
    createTime: Date.now()
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 2 Lake Park, London No. 2 Lake Park',
    tags: ['loser'],
    createTime: Date.now()
  },
  {
    key: '3',
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
