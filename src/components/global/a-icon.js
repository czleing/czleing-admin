/**
 * ant-design-vue 4.x 图标组件 a-icon 实现
 * <a-icon type="PlusOutlined" />
 */
import { createVNode } from 'vue'
import * as Icons from '@ant-design/icons-vue'

const AIcon = function ({ type }) {
  return (type && createVNode(Icons[type])) ?? ''
}

export { AIcon }
