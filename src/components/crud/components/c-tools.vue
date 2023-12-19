<!-- c-page 工具栏组件 -->
<template>
  <div class="c-tools mb10 flex-x-between">
    <a-space>
      <!-- 新增 -->
      <a-button v-if="noAdd !== true" v-hasPermi="permissionConfig.add" type="primary" :icon="h(PlusOutlined)" @click="onAddHandle">新增</a-button>
      <!-- 批量删除 -->
      <a-button v-if="noDelete !== true" v-hasPermi="permissionConfig.delete" type="primary" danger :icon="h(DeleteOutlined)" :disabled="selectNum === 0" @click="onDeleteHandle">批量删除 {{ selectNum > 0 ? `(${ selectNum })` : '' }}</a-button>
      <!-- 自定义按钮 -->
      <a-button
        v-for="btn in otherToolsBtns"
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
      <a-button v-if="hasImport" v-hasPermi="permissionConfig.import" type="dashed" :icon="h(ImportOutlined)" @click="onImportHandle">导入</a-button>
      <!-- 导出 -->
      <a-button v-if="hasExport" v-hasPermi="permissionConfig.export" type="dashed" :icon="h(ExportOutlined)" @click="onExportHandle">导出</a-button>
      <!-- 返回 -->
      <a-button v-if="hasGoBack" :icon="h(RollbackOutlined)" @click="$router.back()">返回</a-button>
    </a-space>
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
import { PlusOutlined, DeleteOutlined, ImportOutlined, ExportOutlined, RollbackOutlined, SyncOutlined, FilterOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue'
import { ref, inject, h, computed } from 'vue'

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
  /** 其他操作按钮配置 */
  otherToolsBtns: Array,
  /** 接口配置 */
  apiConfig: Object,
  /** 权限配置 */
  permissionConfig: Object,
  /** 列字段配置 */
  columns: Array,
  /** 分页信息 */
  pagination: Object,
  /** 选中的要展示的列字段名数组 */
  checkedFieldNames: Array
})

const selectedIds = inject('SELECTED_IDS', ref([]))
const selectedObjs = inject('SELECTED_OBJS', ref([]))
const loading = inject('LOADING', ref(false))

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
function onImportHandle () {
  emits('import')
}
function onExportHandle () {
  emits('export')
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


const emits = defineEmits(['add', 'delete', 'import', 'export', 'refresh', 'update:checkedFieldNames'])
function onRefreshHandle () {
  emits('refresh')
}
function onFieldsFilterChange (values) {
  emits('update:checkedFieldNames', values)
}
</script>

<style lang="scss" scoped>
</style>
