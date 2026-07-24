import { ref, onScopeDispose, watch } from 'vue'
import Sortable from 'sortablejs'

/**
 * @param {Ref<HTMLElement|null>} containerRef 拖拽容器DOM ref
 * @param {Ref<Array>} list 源数据数组ref
 * @param {Object} options Sortable配置
 */
export function useSortable(containerRef, list, options = {}) {
  const instance = ref(null)
  const enabled = ref(true)

  // 默认配置
  const defaultOpts = {
    animation: 150,
    // 拖拽手柄选择器 .drag-handle
    handle: '',
    // 禁止拖拽元素选择器
    filter: '',
    // 忽略拖拽区域（输入框等）
    ignore: 'input,textarea',
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
  }

  // 合并配置
  const sortOptions = { ...defaultOpts, ...options }

  function createSortable() {
    if (!containerRef.value || instance.value) return

    instance.value = new Sortable(containerRef.value, {
      ...sortOptions,

      onEnd(evt) {
        if (!enabled.value) return
        const { oldIndex, newIndex } = evt
        if (oldIndex === newIndex) return

        // 数组重排，响应式更新
        const item = list.value[oldIndex]
        list.value.splice(oldIndex, 1)
        list.value.splice(newIndex, 0, item)

        // 向外抛出事件
        if (typeof sortOptions.onSortEnd === 'function') {
          sortOptions.onSortEnd(evt)
        }
      },

      // 透传其他常用事件
      onStart: (evt) => sortOptions.onStart?.(evt),
      onMove: (evt) => sortOptions.onMove?.(evt),
    })
  }

  function destroySortable() {
    if (instance.value) {
      instance.value.destroy()
      instance.value = null
    }
  }

  // 监听容器DOM挂载后初始化
  const stopWatch = watch(
    containerRef,
    (el) => {
      if (el) {
        createSortable()
      } else {
        destroySortable()
      }
    },
    { flush: 'post' }
  )

  // 组件scope销毁，清理资源
  onScopeDispose(() => {
    stopWatch()
    destroySortable()
  })

  // 外部控制启用/禁用拖拽
  function setEnabled(flag) {
    enabled.value = flag
    if (instance.value) {
      instance.value.option('disabled', !flag)
    }
  }

  return {
    instance,
    enabled,
    setEnabled,
    recreate: () => {
      destroySortable()
      createSortable()
    },
  }
}