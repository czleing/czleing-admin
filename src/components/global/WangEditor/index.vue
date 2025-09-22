<!-- WangEditor 富文本编辑器 -->
<!-- https://www.wangeditor.com/v5/getting-started.html -->
<!-- 需要安装依赖： @wangeditor/editor, @wangeditor/editor-for-vue@next -->
<template>
  <div class="editor-container">
    <Toolbar
      class="editor-container__toolbar"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      :disabled="disabled"
    />
    <Editor
      class="editor-container__editor"
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
  disabled: Boolean,
  // 高度，'500px' 或 '50vh'
  height: { type: String, default: '500px' }
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
      server: import.meta.env.VUE_APP_BASE_API + '/oss/upload',
      headers: {
        Authorization: "Bearer " + token,
      },
      fieldName: 'file',
      // 由于后端返回的结构与默认的不一致，需要自定义插入图片
      customInsert (res, insertFn) {
        insertFn(import.meta.env.VUE_APP_RESOURCE_API + res.data.path, '图片')
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

<style scoped lang="less">
.editor-container {
  border: 1px solid var(--ant-colorBorder);
  border-radius: var(--ant-borderRadius);
  z-index: 1;
  overflow: hidden;
  &__toolbar {
    border-bottom: 1px solid var(--ant-colorBorder);
  }
  &__editor {
    height: v-bind(height) !important;
    overflow-y: hidden;
  }
}
</style>
<style>
body[theme='dark'] {
  --w-e-toolbar-color: #e0e0e0;
  --w-e-toolbar-bg-color: #1f1f1f;
  --w-e-textarea-bg-color: #141414;
  --w-e-textarea-color: #e0e0e0;
  --w-e-textarea-border-color: #434343;
  --w-e-textarea-slight-border-color: #434343;
  --w-e-textarea-slight-color: #595959;
  --w-e-textarea-slight-bg-color: #262626;
  --w-e-textarea-selected-border-color: #177ddc;
  --w-e-textarea-handler-bg-color: #177ddc;
  --w-e-toolbar-active-bg-color: #111b26;
  --w-e-toolbar-active-color: #177ddc;
}
</style>
