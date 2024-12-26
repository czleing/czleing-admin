<!-- WangEditor 富文本编辑器 -->
<!-- https://www.wangeditor.com/v5/getting-started.html -->
<!-- 需要安装依赖： @wangeditor/editor, @wangeditor/editor-for-vue@next -->
<template>
  <div style="border: 1px solid #ccc;">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      :disabled="disabled"
    />
    <Editor
      style="height: 500px; overflow-y: hidden;"
      v-model="editorContent"
      :defaultConfig="editorConfig"
      :mode="mode"
      :disabled="disabled"
      @onCreated="onCreated"
      @onChange="onChange"
    />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { useAuthStore } from '@/stores/auth-store'

const props = defineProps({
  value: String,
  disabled: Boolean
})
const mode = 'default'
const editor = shallowRef()
const editorContent = ref('')
const authStore = useAuthStore()
const token = authStore.token
// 工具栏配置，会覆盖默认配置，只控制顺序和是否显示
const toolbarConfig = {
  excludeKeys: ['group-video', 'codeBlock', 'todo', 'emotion', '|']
}
// 编辑器配置，会覆盖默认配置
const editorConfig = {
  // 进一步控制工具栏里面的菜单
  MENU_CONF: {
    // 上传图片配置
    uploadImage: {
      server: process.env.VUE_APP_BASE_API + '/oss/upload',
      headers: {
        Authorization: "Bearer " + token,
      },
      fieldName: 'file',
      // 由于后端返回的结构与默认的不一致，需要自定义插入图片
      customInsert (res, insertFn) {
        insertFn(process.env.VUE_APP_RESOURCE_API + res.data.path, '图片')
      }
    },
    // 行高配置
    lineHeight: {
      lineHeightList: ['1', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '2.0', '2.2', '2.4', '2.5', '2.8', '3', '3.5', '4']
    }
  },
  placeholder: '请输入内容...'
}

watch(
  () => props.value,
  (val) => {
    editorContent.value = val
  },
  { immediate: true }
)
onUnmounted(() => {
  if (!editor.value) return
  editor.value.destroy() // 组件销毁时，及时销毁编辑器
})

function onCreated (_editor) {
  editor.value = Object.seal(_editor) // 一定要用 Object.seal() ，否则会报错
}
async function onChange (_editor) {
  await nextTick()
  emits('update:value', editorContent.value)
  emits('change', editorContent.value)
}
const emits = defineEmits(['update:value', 'change'])

</script>

<style>
</style>
