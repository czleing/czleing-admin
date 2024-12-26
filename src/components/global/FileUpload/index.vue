<!--
  文件上传组件
  用法：<file-upload v-model:value="form.files" accept=".zip" :file-size="20" :max-count="1" />
  v-model 数据类型取决于 form.files 类型
  form.files 为数组，组件则使用数组
  form.files 为字符串或 undefined，则组件使用逗号分隔字符串
-->
<template>
  <div class="file-upload">
    <a-upload
      v-model:file-list="fileList"
      :action="uploadUrl"
      :headers="headers"
      :max-count="maxCount"
      :accept="accept"
      :before-upload="beforeUploadHandle"
      v-bind="{ ...$attrs, onChange: undefined }"
      @change="onChangeHandle"
    >
      <a-button v-if="!disabled && fileList.length < maxCount">
        <UploadOutlined />
        {{ btnText }}
      </a-button>
    </a-upload>
  </div>
</template>

<script setup>
import { UploadOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth-store.js'
import { byteFormat, getFullUrl } from '@/utils/index.js'
import { Upload } from 'ant-design-vue'

/**
 * 其他属性：
 * accept:  'image/*,video/*,audio/*,.pdf,.doc,.docx' --- 限制文件类型
 * data, { prefix: 'xxx' } --- 额外参数，prefix：文件服务根目录下的子文件夹名，默认 temp
 * disabled
 * multiple: {boolean} 是否可一次选择多个文件，默认 false
 * name: {string} 定义文件上传字段名，默认 file
 */
const props = defineProps({
  // 文件对象数组或文件地址逗号分隔字符串，[file1, file] 或 'file1Url,file2Url', 默认 ''
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
    default: 'image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar'
  },
  // 上传按钮文字
  btnText: {
    type: String,
    default: '上传文件'
  },
  // 是否禁用
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

watchEffect(() => {
  if (props.value) {
    if (Array.isArray(props.value)) {
      fileList.value = props.value
    } else {
      let i = 0
      fileList.value = props.value.split(',').map(path => {
        i++
        return {
          uid: Date.now() + i,
          name: path.match(/.*\/([^/]+)\.\w+/)?.[1] || path,
          status: 'done',
          url: getFullUrl(path),
          path
        }
      })
    }
  } else {
    fileList.value = []
  }
})
/**
 * 上传文件前的钩子，返回 false 可阻止上传
 * @param {Object} file 要上传的文件
 * @param {Array} files 
 */
function beforeUploadHandle (file, files) {
  if (file.size >> 10 > props.fileSize) {
    _this.$message.warning(`文件大小不能超过${maxFileSize.value}`)
    return Upload.LIST_IGNORE
  }
}

/**
 * 上传中、完成、失败的回调
 * { file, fileList, event }
 * file.status: error|uploading|done|removed
 */
function onChangeHandle ({ file, fileList: files, event }) {
  console.log('文件上传状态：', file.status)
  if (file.status === 'done') {
    const path = file.response?.data?.path // TODO 视接口返回而定
    const currFile = files.find(item => item.uid === file.uid)
    if (currFile) {
      currFile.path = path
      currFile.url = getFullUrl(path)
    }
    emitChange()
  }
}

const emit = defineEmits(['update:value', 'update:fileList'])
/** 提交改变 */
function emitChange () {
  if (Array.isArray(props.value)) {
    emit('update:value', fileList.value)
  } else {
    emit('update:value', fileList.value.map(file => file.url).join(','))
  }
  emit('update:fileList', fileList.value)
}
</script>

<style lang="less" scoped>
.file-upload {
  display: inline-block;
}
</style>
