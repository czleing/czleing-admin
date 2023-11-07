/**
 * ant-design-vue 4.x 图标组件 a-icon 实现
 * <a-icon type="PlusOutlined" />
 */
import * as Icons from '@ant-design/icons-vue'
import { createVNode } from 'vue'

const AIcon = function ({ type }) {
  return createVNode(Icons[type])
}

export { AIcon }
