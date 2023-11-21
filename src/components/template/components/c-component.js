/** 根据 field 配置渲染组件 */
import { useRender } from '@/hooks/useRender.js'
export default {
  functional: true,
  props: {
    field: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const { renderByField } = useRender()
    return () => renderByField(props.field)
  }
}

