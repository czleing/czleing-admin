/** 根据 field 配置渲染组件 */
import { useRender } from '@/hooks/useRender.js'
export default {
  functional: true,
  props: {
    field: {
      type: Object,
      required: true
    },
    isView: Boolean,
    value: [Object, String, Number, Boolean, Array]
  },
  render () {
    const { renderByField } = useRender({ isView: this.isView, value: this.value })
    return renderByField(this.field)
  }
}

