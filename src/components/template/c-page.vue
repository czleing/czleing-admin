<!-- CRUD 组件页面 -->
<template>
  <div class="c-page">
    <div v-if="treeConfig" class="c-page__tree">
      树形组件
    </div>
    <div class="c-page__page">
      <slot name="header" />
      <!-- 过滤器 -->
      <CFilter :config="filterConfig" @search="onSearchHandle" />
      <slot name="filter" />
      <!-- 工具栏 -->
      <CTools
        v-model:checkedFieldNames="checkedFieldNames"
        :no-add="noAdd"
        :no-delete="noDelete"
        :has-import="hasImport"
        :has-export="hasExport"
        :has-go-back="hasGoBack"
        :other-tools-btns="otherToolsBtns"
        :api-config="api"
        :permission-config="permission"
        :columns="tableConfig?.columns"
        :pagination="pagination"
        @refresh="onRefreshHandle"
      />
      <slot name="tools" />
      <!-- 表格数据 -->
      <CTable
        ref="cTable"
        :config="tableConfig"
        :api-config="api"
        :api-method-config="apiMethod"
        :permission-config="permission"
        :after-search="afterSearch"
        @action="onActionHandle"
      >
        <!-- 自定义插槽 -->
        <template v-for="sl in tableSlots" #[sl.slot]="options">
          <slot :name="sl.slot" v-bind="options" />
        </template>
      </CTable>
      <slot name="table" />
    </div>
    <!-- 新增修改详情弹窗 -->
    <slot name="modal">
      
    </slot>
    <slot name="detail"></slot>
  </div>
</template>

<script setup>
import CFilter from '@/components/template/components/c-filter.vue'
import CTools from '@/components/template/components/c-tools.vue'
import CTable from '@/components/template/components/c-table.vue'
import { ref, provide, computed } from 'vue'
import { useApiConfig } from './hooks/useApiConfig'
import { usePermissionConfig } from './hooks/usePermissionConfig'
import { useApiMethodConfig } from './hooks/useApiMethodConfig'

const props = defineProps({
  /** 没有新增按钮 */
  noAdd: Boolean,
  /** 没有删除按钮 */
  noDelete: Boolean,
  /** 没有表格多选框 */
  noSelect: Boolean,
  /** 有返回按钮 */
  hasGoBack: Boolean,
  /** 有导入按钮 */
  hasImport: Boolean,
  /** 有导出按钮 */
  hasExport: Boolean,
  /** 操作栏其他操作按钮配置 */
  otherToolsBtns: Array,
  /** 接口配置，可选，默认根据路由及功能生成（如：新增：/system/user -> /system/user/add） */
  apiConfig: Object,
  /** 接口请求方式配置，可选，默认根据是否使用restfull风格自动生成，不使用restfull则全部post请求 */
  apiMethodConfig: Object,
  /** 权限配置，可选，默认根据路由及功能生成（如：新增：/system/user -> system:user:add） */
  permissionConfig: Object,
  /** 左侧树形控件配置，可选 */
  treeConfig: Object,
  /** 过滤条件配置，可选 */
  filterConfig: Object,
  /** 表格配置，必须 */
  tableConfig: Object,
  /** 增改查弹窗配置，可选 */
  modalConfig: Object,
  /** 查询前修改查询参数，可选，params => ({ ...params, type: 1 }) */
  beforeSearch: Function,
  /** 查询后修改查询结果，可选，list => list.map(...) */
  afterSearch: Function
})
const loading = ref(false)
const cTable = ref()
const selectedIds = ref([])
const selectedObjs = ref([])
const searchParams = ref({})
const checkedFieldNames = ref(props.tableConfig.columns?.filter(item => item.hidden !== true)?.map(item => item.dataIndex))
const pagination = ref(Object.assign({
  showSizeChanger: true,
  showTotal: (total, range) => `共 ${total} 条`,
  pageSize: 15,
  current: 1,
  total: 0
}, props.tableConfig?.props?.pagenation))
const tableSlots = computed(() => props.tableConfig?.columns?.filter(column => column.slot))
const { api } = useApiConfig(props.apiConfig)
const { permission } = usePermissionConfig(props.permissionConfig)
const { apiMethod } = useApiMethodConfig(props.apiMethodConfig)

provide('LOADING', loading)
provide('SELECTED_IDS', selectedIds)
provide('SELECTED_OBJS', selectedObjs)
provide('SEARCH_PARAMS', searchParams)
provide('PAGINATION', pagination)
provide('CHECKED_FIELD_NAMES', checkedFieldNames)


function onSearchHandle (params) {
  if (typeof props.beforeSearch === 'function') {
    params = props.beforeSearch(params)
  }
  searchParams.value = params
  cTable.value.search()
}
function onRefreshHandle () {
  cTable.value.refresh()
}
function onActionHandle ({ action, record }) {
  
}

</script>

<style lang="scss" scoped>
.c-page {
  display: flex;
  &__tree {
    width: 200px;
  }
  &__page {
    flex: auto;
  }
}
</style>
