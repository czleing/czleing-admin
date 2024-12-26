<!--
  图片上传组件
  用法：<image-upload v-model:value="form.images" :file-size="1024" :max-count="2" />
-->
<template>
  <div class="image-upload">
    <a-upload
      v-model:file-list="fileList"
      list-type="picture-card"
      :action="uploadUrl"
      :headers="headers"
      :max-count="maxCount"
      :accept="accept"
      :before-upload="beforeUploadHandle"
      v-bind="{ ...$attrs, onChange: undefined }"
      @change="onChangeHandle"
      @preview="previewHandle"
    >
      <div v-if="!disabled && fileList.length < maxCount">
        <PlusOutlined class="font20" />
        <div class="mt8">{{ btnText }}</div>
      </div>
    </a-upload>
    <Modal ref="previewModal">
      <img :src="previewUrl" style="max-width: 100%;display:block;margin:0 auto;">
      <template #footer>
        <div class="tr">
          <a-button type="default" @click="previewModal.close">关闭</a-button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { PlusOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth-store.js'
import { byteFormat, getFullUrl } from '@/utils/index.js'
import { Upload } from 'ant-design-vue'

/**
 * 其他属性：
 * accept:  'image/png,.jpg,image/*,.gif,.GIF' --- 限制文件类型
 * data, { prefix: 'xxx' } --- 额外参数，prefix：文件服务根目录下的子文件夹名，不带 '/'，默认 temp
 * disabled
 * multiple: {boolean} 是否可一次选择多个文件，默认 false
 * name: {string} 定义文件上传字段名，默认 file
 */
const props = defineProps({
  // 文件对象数组或文件地址逗号分隔字符串，[] 或 '', 默认 ''
  value: [Array, String],
  // 最大上传文件数
  maxCount: {
    type: Number,
    default: 10
  },
  // 文件大小限制(KB)
  fileSize: {
    type: Number,
    default: 1024 * 5
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  // 上传按钮文字
  btnText: {
    type: String,
    default: '上传图片'
  },
  // 是否禁用，禁用情况只能查看
  disabled: Boolean
})
const _this = getCurrentInstance().proxy
const authStore = useAuthStore()
// 文件上传地址
const uploadUrl = import.meta.env.VITE_APP_BASE_API + '/oss/upload'
const headers = { Authorization: 'Bearer ' + authStore.token }

// 文件列表
const fileList = ref([])
// 文件大小限制格式化字符串
const maxFileSize = computed(() => byteFormat(props.fileSize << 10))

watch(
  () => props.value,  
  () => {
    if (props.value) {
      if (Array.isArray(props.value)) {
        fileList.value = props.value
      } else {
        let i = 0
        const newFileList = []
        props.value.split(',').forEach(path => {
          i++
          const matchedFile = fileList.value?.find(file => file.path === path)
          if (matchedFile) {
            newFileList.push(matchedFile)
          } else {
            newFileList.push({
              uid: Date.now() + i,
              name: path.match(/.*\/([^/]+)\.\w+/)?.[1] || path,
              status: 'done',
              url: getFullUrl(path),
              path
            })
          }
        })
        fileList.value = newFileList
      }
    } else {
      fileList.value = []
    }
  },
  { deep: true, immediate: true }
)
/**
 * 上传文件前的钩子，返回 false 可阻止上传
 * @param {Object} file 要上传的文件
 * @param {Array} files 
 */
function beforeUploadHandle (file, files) {
  if (file.size >> 10 > props.fileSize) {
    _this.$message.warning(`图片大小不能超过${maxFileSize.value}`)
    return Upload.LIST_IGNORE
  }
}

/**
 * 上传中、完成、失败的回调
 * { file, fileList, event }
 * file.status: error|uploading|done|removed
 * file.response: 上传服务器响应内容，从此处获取服务器地址，
 */
function onChangeHandle ({ file, fileList: files, event }) {
  // console.log('文件上传状态：', file.status)
  // console.log('文件上传列表：', fileList)
  if (file.status === 'done') {
    const path = file.response?.data?.path // TODO 视接口返回而定
    const currFile = files.find(item => item.uid === file.uid)
    if (currFile) {
      currFile.path = path
      currFile.url = getFullUrl(path)
    }
    emitChange()
  } else if (file.status === 'removed') {
    fileList.value = fileList.value.filter(item => item.uid !== file.uid)
  }
}

// 预览组件
const previewModal = ref()
// 预览图片地址
const previewUrl = ref()
// 预览
function previewHandle (file) {
  previewUrl.value = file.url
  previewModal.value.open({
    title: `${file.name} ${ file.size > 0 ? ('( ' + byteFormat(file.size) + ' )') : ''}`,
    width: 600
  })
}

const emit = defineEmits(['update:value', 'update:fileList'])
/** 提交改变 */
function emitChange () {
  if (Array.isArray(props.value)) {
    emit('update:value', fileList.value)
  } else {
    emit('update:value', fileList.value.map(file => file.path).join(','))
  }
  emit('update:fileList', fileList.value)
}
</script>

<style lang="less" scoped>
.image-upload {
  display: inline-block;
  // :deep(.ant-upload-list-item) { // 注释原因：上传图片后，鼠标移入的层显示错位
  //   padding: 0 !important;
  // }
}
</style>
