<!-- CRUD 页面组件 -->
<template>
  <div class="c-page">
    <div v-if="treeConfig" class="c-page__tree mr10 pr10">
      <!-- 树 -->
      <CTree :config="treeConfig" @selected="onTreeSelectHandle" />
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
        @add="onAddHandle"
        @delete="onBatchDeleteHandle"
      />
      <slot name="tools" />
      <!-- 表格数据 -->
      <CTable
        ref="cTable"
        :primaryKey="primaryKey"
        :no-select="noSelect"
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
    <!-- 弹窗 -->
    <!-- 新增修改详情弹窗，如果不想要默认的弹窗或行为可以通过自定义操作按钮来实现 -->
    <Modal ref="cModal" :before-cancel="onCancelHandle" :footer="null">
      <CForm v-if="isAdd || isEdit || isView" ref="cForm" v-bind="{ detail, isAdd, isEdit, isView, primaryKey, formConfig, ...buttonConfig, beforeSubmit, onSubmitHandle }" />
    </Modal>
  </div>
</template>

<script setup>
import CFilter from '@/components/crud/components/c-filter.vue'
import CTools from '@/components/crud/components/c-tools.vue'
import CTable from '@/components/crud/components/c-table.vue'
import CForm from '@/components/crud/components/c-form.vue'
import CTree from '@/components/crud/components/c-tree.vue'
import { ref, provide, computed } from 'vue'
import { useApiConfig } from './hooks/useApiConfig'
import { usePermissionConfig } from './hooks/usePermissionConfig'
import { useApiMethodConfig } from './hooks/useApiMethodConfig'
import { useActionHandle } from './hooks/useActionHandle'

const props = defineProps({
  /** 没有新增按钮，可选 */
  noAdd: Boolean,
  /** 没有删除按钮，可选 */
  noDelete: Boolean,
  /** 没有表格多选框，可选 */
  noSelect: Boolean,
  /** 有返回按钮，可选 */
  hasGoBack: Boolean,
  /** 有导入按钮，可选 */
  hasImport: Boolean,
  /** 有导出按钮，可选 */
  hasExport: Boolean,
  /** 主键字段名，默认 id */
  primaryKey: { type: String, default: 'id' },
  /** 操作栏其他操作按钮配置，可选 */
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
  tableConfig: { type: Object, required: true },
  /** 增改查弹窗配置，必须 */
  modalConfig: { type: Object, required: true },
  /** 查询前修改查询参数，可选，params => ({ ...params, type: 1 }) */
  beforeSearch: Function,
  /** 查询后修改查询结果，可选，list => list.map(...) */
  afterSearch: Function,
  /** 提交表单前修改表单数据，可选，data => ({...}) */
  beforeSubmit: Function,
  /** 编辑或查看详情时转换详情数据，可选，detail => ({...}) */
  transformDetail: Function
})
const loading = ref(false)
const cTable = ref()
const cModal = ref()
const cForm = ref()
const selectedIds = ref([])
const selectedObjs = ref([])
const searchParams = ref({})
const checkedFieldNames = ref(props.tableConfig.columns?.filter(item => item.hidden !== true)?.map(item => item.dataIndex))
const pagination = ref({
  showSizeChanger: true,
  showTotal: (total, range) => `共 ${total} 条`,
  pageSize: props.tableConfig?.props?.pageSize ?? 10,
  current: 1,
  total: 0
})
const tableSlots = computed(() => props.tableConfig?.columns?.filter(column => column.slot))
const { api } = useApiConfig(props.apiConfig) // 接口
const { permission } = usePermissionConfig(props.permissionConfig) // 权限
const { apiMethod } = useApiMethodConfig(props.apiMethodConfig) // 接口请求方式
const {
  isAdd,
  isEdit,
  isView,
  detail,
  formConfig,
  buttonConfig,
  onAddHandle,
  onBatchDeleteHandle,
  onActionHandle,
  onSubmitHandle
} = useActionHandle({ cModal, cTable, modalConfig: props.modalConfig, api, apiMethod, transformDetail: props.transformDetail, primaryKey: props.primaryKey })

/** 与子组件共享变量 */
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
function onCancelHandle () {
  cForm.value?.reset()
}
function onTreeSelectHandle (orgId) {
  searchParams.value[props.treeConfig?.searchField ?? 'orgId'] = orgId
  cTable.value.search()
}
</script>

<style lang="scss" scoped>
.c-page {
  display: flex;
  &__tree {
    min-width: 180px;
    max-width: 240px;
    border-right: solid 1px rgba(100, 100, 100, .1);
  }
  &__page {
    flex: auto;
  }
}
</style>
