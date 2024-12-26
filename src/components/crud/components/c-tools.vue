<!-- c-page 工具栏组件 -->
<template>
  <div class="c-tools mb10 flex-x-between">
    <div>
      <a-space>
        <!-- 新增 -->
        <a-button v-if="noAdd !== true" v-hasPermi="permissionConfig.add" type="primary" :icon="h(PlusOutlined)" @click="onAddHandle">
          {{ config?.addBtnText ?? '新增' }}
        </a-button>
        <!-- 批量删除 -->
        <a-button v-if="noDelete !== true" v-hasPermi="permissionConfig.delete" type="primary" danger :icon="h(DeleteOutlined)" :disabled="selectNum === 0" @click="onDeleteHandle">批量删除 {{ selectNum > 0 ? `(${ selectNum })` : '' }}</a-button>
        <!-- 自定义按钮 -->
        <a-button
          v-for="btn in config?.otherToolsBtns"
          :key="btn.name"
          :disabled="getDisabled(btn)"
          v-hasPermi="btn.permission"
          v-bind="{ ...btn.props, disabled: undefined, icon: undefined, onClick: undefined }"
          @click="onToolClickHandle(btn)"
        >
          <template #icon v-if="btn.props.icon">
            <a-icon :type="btn.props.icon" />
          </template>
          {{ btn.name }}
        </a-button>
        <!-- 导入 -->
        <CImport v-if="hasImport" v-hasPermi="permissionConfig.import" :url="apiConfig.import" :template-url="apiConfig.importTemplate" @success="onImportSuccessHandle" />
        <!-- 导出 -->
        <a-button v-if="hasExport" v-hasPermi="permissionConfig.export" type="dashed" :icon="h(ExportOutlined)" @click="onExportHandle">导出 {{ selectNum > 0 ? `(${ selectNum })` : '' }}</a-button>
        <!-- 返回 -->
        <a-button v-if="hasGoBack" :icon="h(RollbackOutlined)" @click="$router.back()">{{ config?.backBtnText ?? '返回' }}</a-button>
      </a-space>
    </div>
    <a-space>
      <!-- 刷新 -->
      <a-button :loading="loading" @click="onRefreshHandle">
        <template v-if="!loading" #icon>
          <SyncOutlined :style="{ fontSize: '0.9em' }" />
        </template>
      </a-button>
      <!-- 筛选列 -->
      <a-dropdown placement="bottomLeft">
        <a-button :icon="h(FilterOutlined)" :style="{ fontSize: '0.9em' }" />
        <template #overlay>
          <a-checkbox-group :value="checkedFieldNames" @change="onFieldsFilterChange">
            <a-menu>
              <a-menu-item
                v-for="column in currColumns"
                :key="column.dataIndex"
                @click.stop
              >
                <a-checkbox :value="column.dataIndex" @click.stop>{{ column.title }}</a-checkbox>
              </a-menu-item>
            </a-menu>
          </a-checkbox-group>
        </template>
      </a-dropdown>
    </a-space>
  </div>
</template>

<script setup>
import { PlusOutlined, DeleteOutlined, ExportOutlined, RollbackOutlined, SyncOutlined, FilterOutlined } from '@ant-design/icons-vue'
import CImport from './c-import.vue'
import { Modal } from 'ant-design-vue'
import { h } from 'vue'
import axios from '@/api/index.js'

const props = defineProps({
  /** 没有新增按钮 */
  noAdd: Boolean,
  /** 没有删除按钮 */
  noDelete: Boolean,
  /** 有返回按钮 */
  hasGoBack: Boolean,
  /** 有导入按钮 */
  hasImport: Boolean,
  /** 有导出按钮 */
  hasExport: Boolean,
  /** 工具栏配置 */
  config: Object,
  /** 接口配置 */
  apiConfig: Object,
  /** 接口请求方式配置 */
  apiMethodConfig: Object,
  /** 权限配置 */
  permissionConfig: Object,
  /** 列字段配置 */
  columns: Array,
  /** 分页信息 */
  pagination: Object,
  /** 选中的要展示的列字段名数组 */
  checkedFieldNames: Array
})

const selectedIds = inject('c-page.selectedIds', ref([]))
const selectedObjs = inject('c-page.selectedObjs', ref([]))
const searchParams = inject('c-page.searchParams', ref({}))
const loading = inject('c-page.loading', ref(false))
const refreshTable = inject('c-page.onRefreshHandle', undefined)

const selectNum = computed(() => selectedIds.value.length)
const callbackParams = computed(() => ({
  selectedIds: selectedIds.value,
  selectedObjs: selectedObjs.value,
  pagination: props.pagination ?? {}
}))
const currColumns = computed(() => props.columns.filter(item => !item.action))

function onAddHandle () {
  emits('add')
}
function onDeleteHandle () {
  emits('delete', selectedIds.value)
}
function onImportSuccessHandle () {
  refreshTable()
}
function onExportHandle () {
  if (selectNum.value > 0) { // 有勾选，按选中的导出
    Modal.confirm({
      title: '温馨提示',
      content: () => h('div', [
        '确定导出以下选中的',
        h('b', { class: 'text-danger mx5' }, [`${selectedIds.value.length}`]),
        '项数据记录？'
      ]),
      async onOk () {
        await axios[props.apiMethodConfig.export](props.apiConfig.export, { ids: selectedIds.value }, { responseType: 'blob' })
        selectedIds.value = []
        selectedObjs.value = []
      }
    })
  } else { // 按查询条件导出
    Modal.confirm({
      title: '温馨提示',
      content: '确定根据当前条件导出所有数据？',
      async onOk () {
        await axios[props.apiMethodConfig.export](props.apiConfig.export, searchParams.value, { responseType: 'blob' })
      }
    })
  }
}
function onToolClickHandle (btn) {
  if (typeof btn.props?.onClick === 'function') {
    btn.props?.onClick(callbackParams.value)
  }
}
function getDisabled (btn) {
  if (typeof btn.props?.disabled === 'function') {
    return btn.props?.disabled(callbackParams.value)
  } else {
    return btn.props?.disabled
  }
}


const emits = defineEmits(['add', 'delete', 'refresh', 'update:checkedFieldNames'])
function onRefreshHandle () {
  emits('refresh')
}
function onFieldsFilterChange (values) {
  emits('update:checkedFieldNames', values)
}
</script>

<style lang="scss" scoped>
</style>
