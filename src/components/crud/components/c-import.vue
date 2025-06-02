<!-- 导入按钮 -->
<template>
  <div class="c-import">
    <slot>
      <a-button v-if="showBtn" type="dashed" :icon="h(ImportOutlined)" @click="onImportHandle">{{ btnText }}</a-button>
    </slot>
    <CModal ref="cModal" width="450" :confirm-disabled="uploadDisabled" @close="beforeCloseHandle">
      <div class="mb">
        点击此处下载
        <a href="javascript:;" @click="downloadTemplate">导入模板</a>
      </div>
      <a-upload-dragger
        accept=".xls,.xlsx"
        :max-count="1"
        :file-list="fileList"
        :before-upload="beforeUpload"
        @remove="handleRemove"
      >
        <div>
          <p class="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="ant-upload-text">将文件拖到此处，或点击上传</p>
          <p class="ant-upload-hint">
            请上传 .xls, .xlsx 文件
          </p>
        </div>
      </a-upload-dragger>
      <div v-if="showReplace" class="mt">
        重复记录是否覆盖更新：<a-switch v-model:checked="isReplace" />
      </div>
    </CModal>
  </div>
</template>

<script setup>
import { ImportOutlined, InboxOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
import axios from '@/api'
import { loadingRequest } from '@/utils/index.js'

const props = defineProps({
  // 上传地址
  url: { type: String },
  // 模板下载地址
  templateUrl: { type: String },
  // 弹出层标题
  title: { type: String, default: '导入' },
  // 是否显示覆盖更新控制按钮
  showReplace: { type: Boolean, default: true },
  // 是否显示导入按钮
  showBtn: { type: Boolean, default: true },
  // 导入按钮文字
  btnText: { type: String, default: '导入' }
})

const cModal = ref()
const isReplace = ref(false)
const fileList = ref([])
const uploading = ref(false)
const uploadDisabled = computed(() => fileList.value.length === 0 || uploading.value)

const currUrl = ref(props.url)
const currTemplateUrl = ref(props.templateUrl)
const currTitle = ref(props.title)

/** 通过 API 方式调用弹出导入窗，并设置相关属性 */
function open (option = {}) {
  currUrl.value = option.url
  currTemplateUrl.value = option.templateUrl
  currTitle.value = option.title
  onImportHandle()
}

function onImportHandle () {
  if (!currUrl.value) {
    console.error('未配置导入接口[url]')
    return
  }
  cModal.value.open({
    title: currTitle.value,
    onConfirm: upload
  })
}
function downloadTemplate () {
  if (!currTemplateUrl.value) {
    console.error('未配置模板下载接口[templateUrl]')
    return
  }
  axios.download(currTemplateUrl.value)
}
function handleRemove () {
  fileList.value = []
}
function beforeUpload (_file) {
  fileList.value = [_file]
  return false // 返回 false，阻止自动上传
}
function upload (close) {
  const formData = new FormData()
  formData.append('file', fileList.value[0])
  loadingRequest(uploading, async () => {
    await axios.post(currUrl.value + `?updateSupport=${isReplace.value}`, formData)
    beforeCloseHandle()
    close()
    emits('success')
  }, '导入成功')
}
function beforeCloseHandle () {
  fileList.value = []
  isReplace.value = false
}

const emits = defineEmits(['success'])

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
</style>
