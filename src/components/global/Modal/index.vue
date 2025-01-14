<!-- 弹窗组件，分居中弹窗和侧边抽屉弹窗 -->
<template>
  <div class="modal">
    <a-modal v-if="currMode === 'modal'" :title="currTitle" v-model:open="visible" :width="currWidth" v-bind="$attrs" @cancel="close" @ok="onOkHandle">
      <slot :visible="visible" />
      <!-- a-modal 自带有确定、取消按钮，此处使用自定义 -->
      <template v-if="$attrs.footer !== null" #footer>
        <slot name="footer">
          <div class="tr">
            <a-button :loading="closeLoading" @click="close">{{ currCancelText }}</a-button>
            <a-button v-if="currShowConfirm" type="primary" :loading="confirmLoading" :disabled="confirmLoading || confirmDisabled" @click="onOkHandle">{{ currConfirmText }}</a-button>
          </div>
        </slot>
      </template>
    </a-modal>
    <a-drawer v-if="currMode === 'drawer'" :title="currTitle" v-model:open="visible" :width="currWidth" v-bind="$attrs" @close="close">
      <div class="">
        <slot :visible="visible" />
      </div>
      <!-- a-drawer 默认没有按钮 -->
      <template v-if="$attrs.footer !== null" #footer>
        <slot name="footer">
          <div class="tr">
            <a-button :loading="closeLoading" @click="close">{{ currCancelText }}</a-button>
            <a-button v-if="currShowConfirm" type="primary" :loading="confirmLoading" :disabled="confirmLoading || confirmDisabled" @click="onOkHandle">{{ currConfirmText }}</a-button>
          </div>
        </slot>
      </template>
    </a-drawer>
  </div>
</template>

<script setup>
import { loadingRequest } from '@/utils/index.js'

const props = defineProps({
  title: String,
  mode: { type: String, default: 'modal' }, // modal || drawer
  width: { type: [String, Number], default: 600 },
  showConfirm: { type: Boolean, default: true },
  confirmText: { type: String, default: '确定' },
  cancelText: { type: String, default: '关闭' },
  beforeCancel: Function, // async () => {} 取消前执行，返回 Promise.reject() 或抛出异常可阻止关闭，注!!!：如果 beforeCancel 绑定的函数又调用了此组件的 close 方法，会造成死循环
  beforeConfirm: Function, // async (close) => {}
  confirmDisabled: { type: Boolean, default: false } // 确认按钮是否禁用
})

const visible = ref(false) // 弹窗是否可见
const closeLoading = ref(false)
const confirmLoading = ref(false)
const currMode = ref(props.mode) // 弹窗模式，modal, drawer
const currTitle = ref(props.title)
const currWidth = ref(props.width)
const currConfirmText = ref(props.confirmText)
const currCancelText = ref(props.cancelText)
const currShowConfirm = ref(props.showConfirm)
let onConfirm = null
let onCancel = null

watch(
  () => props.confirmText,
  (val) => {
    currConfirmText.value = val
  }
)

function onOkHandle () {
  loadingRequest(confirmLoading, async () => {
    if (onConfirm && typeof onConfirm === 'function') {
      await onConfirm(close)
    }
    emits('confirm', close)
  })
}

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
  currConfirmText.value = options?.confirmText ?? props.confirmText
  currCancelText.value = options?.cancelText ?? props.cancelText
  currWidth.value = ((options?.width ?? props.width) + 'px').replace('pxpx', 'px')
  currShowConfirm.value = options?.showConfirm ?? props.showConfirm
  onConfirm = options?.onConfirm ?? props.beforeConfirm
  onCancel = options?.onCancel ?? props.beforeCancel
  visible.value = true
}
/** 关闭 */
async function close () {
  loadingRequest(closeLoading, async () => {
    if (onCancel && typeof onCancel === 'function' && visible.value) {
      await onCancel()
    }
    await nextTick()
    visible.value = false
    emits('close')
  })
}

const emits = defineEmits(['confirm', 'close'])

provide('modal.in', true) // 用于子组件判断是否在弹窗组件下面
provide('modal.close', close)
provide('modal.visible', visible)

defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
</style>
