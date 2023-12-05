<!-- c-page 条件过滤组件 -->
<template>
  <div class="c-filter">
    <a-form
      name="searchForm"
      ref="searchForm"
      :model="formData"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      autocomplete="off"
      @finish="onSubmitHandle"
    >
      <a-row :gutter="10">
        <!-- 动态字段 -->
        <a-col v-for="(field, index) in fields" :key="index" v-bind="colSize">
          <a-form-item :label="field.label" :name="field.fieldName" :label-col="field.labelCol" :wrapper-col="field.wrapperCol">
            <CComponent v-model:value="formData[field.fieldName]" :field="field" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item>
            <a-space>
              <a-button type="primary" :loading="loading" :disabled="loading" :icon="h(SearchOutlined)" html-type="submit">查询</a-button>
              <a-button v-if="fields.length > 0" :icon="h(UndoOutlined)" @click="onResetHandle">重置</a-button>
              <!-- 记住查询 及 历史查询 -->
              <a-dropdown-button v-if="config.useCache && fields.length > 0" placement="bottomLeft" @click="onRememberHandle">
                {{ config.cacheBtnText || '记住查询' }}
                <template #overlay>
                  <a-menu>
                    <a-menu-item
                      v-for="cache in cacheList"
                      :key="cache.id"
                    >
                      <div class="flex-x-between">
                        <span class="mr15 flex-auto" @click="onSelectCache(cache.id)">{{ cache.name }}</span>
                        <a-divider type="vertical" />
                        <DeleteOutlined class="text-danger" @click.stop="onDeleteCache(cache.id)" />
                      </div>
                    </a-menu-item>
                    <a-menu-item v-if="!cacheList || cacheList.length === 0">
                      <span class="text-gray">暂无历史记录</span>
                    </a-menu-item>
                  </a-menu>
                </template>
                <template v-if="cacheList && cacheList.length > 0" #icon>
                  ···
                </template>
              </a-dropdown-button>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <Modal ref="cacheNameModal" title="请输入备注" width="300">
      <a-input v-model:value="cacheName" placeholder="请输入备注名" :maxlength="15" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, provide, inject, reactive, h, onMounted, computed, toRaw } from 'vue'
import CComponent from './c-component.js'
import { SearchOutlined, UndoOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useSearchCache } from '@/hooks/useSearchCache.js'
import { isAllFieldEmpty } from '@/utils/index.js'
import { message } from 'ant-design-vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})
const colSize = { sm: 8, lg: 6, xxl: 4 }
const { labelCol, wrapperCol, fields } = props.config
const searchForm = ref()
const loading = inject('LOADING', false)
const formData = reactive({})
const {
  cacheList,
  getCondition,
  setCondition,
  delCondition
} = useSearchCache()
const noCondition = computed(() => isAllFieldEmpty(formData))

provide('FORM_DATA', formData)
provide('A_FORM', searchForm)

onMounted(() => {
  fields.forEach(field => {
    formData[field.fieldName] = field.defaultValue
  })
})
function onSubmitHandle (values) {
  emits('search', formData)
}
function onResetHandle () {
  searchForm.value.resetFields()
  emits('search', {})
}

// ------- 记住查询 start ----------
const cacheNameModal = ref()
const cacheName = ref('')
function onRememberHandle () {
  if (noCondition.value) {
    message.warning('请先填写查询条件')
    return
  }
  cacheName.value = ''
  cacheNameModal.value.open({
    onConfirm (close) {
      if (cacheName.value) {
        setCondition(toRaw(formData), cacheName.value)
        close()
      } else {
        message.error('请输入备注名')
      }
    }
  })
}
function onSelectCache (id) {
  const cacheData = getCondition(id)
  Object.assign(formData, cacheData)
}
function onDeleteCache (id) {
  delCondition(id)
}
// ------- 记住查询 end ----------

const emits = defineEmits(['search'])

</script>

<style lang="less" scoped>
.c-filter {
  :deep(.ant-form-item) {
    margin-bottom: 10px;
  }
}
</style>
