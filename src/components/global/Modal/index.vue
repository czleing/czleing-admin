<!-- 弹窗组件，分居中弹窗和侧边抽屉弹窗 -->
<template>
  <div class="modal">
    <a-modal v-if="currMode === 'modal'" :title="currTitle" v-model:open="visible" :width="currWidth" v-bind="$attrs">
      <slot />
      <template v-if="$slots.footer" #footer>
        <slot name="footer" />
      </template>
    </a-modal>
    <a-drawer v-if="currMode === 'drawer'" :title="currTitle" v-model:open="visible" :width="currWidth" v-bind="$attrs">
      <div class="">
        <slot />
      </div>
      <template v-if="$slots.footer" #footer>
        <slot name="footer" />
      </template>
    </a-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  title: String,
  mode: { type: String, default: 'modal' },
  width: { type: [String, Number], default: 600 }
})
// 弹窗是否可见
const visible = ref(false)
// 弹窗模式，modal, drawer
const currMode = ref('modal')
const currTitle = ref('')
const currWidth = ref('600px')
/**
 * 弹出
 * options.mode 弹窗模式 modal, drawer
 * options.title 弹窗标题
 * options.width 弹窗宽度
 * @param {Object} options
 */
function open (options) {
  currMode.value = options?.mode ?? props.mode
  currTitle.value = options?.title ?? props.title
  currWidth.value = ((options?.width ?? props.width) + 'px').replace('pxpx', 'px')
  visible.value = true
}
/** 关闭 */
function close () {
  visible.value = false
}
defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
</style>
