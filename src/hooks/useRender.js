import { h, inject, resolveComponent } from 'vue'
import { EControlType } from '@/enum/index'
import { getFnValue } from '@/utils/index'

/**
 * 渲染组件
 * @returns 组件
 */
export function useRender ({ isView, value }) {
  const formData = inject('FORM_DATA', {})
  const getRenderFn = {
    [EControlType.eInput]: renderInput
  }
  // 通过字段配置生成控件
  function renderByField (field) {
    const fn = getRenderFn[field.type]
    if (fn) {
      return fn(field)
    } else if (field.type) {
      return h(resolveComponent(field.type), {
        ...field.props
      })
    } else {
      console.warn('field.type 不存在')
    }
  }
  /**
   * 渲染输入框
   * @param {Object} field 
   * @returns 
   */
  function renderInput (field) {
    if (isView) {
      return h('span', [value ?? '-'])
    }
    const controlTypeEnum = EControlType._objectOf(field.type)
    const props = Object.assign({
      type: 'text',
      placeholder: `请输入${field.label}`,
      maxlength: 50
    }, controlTypeEnum.data.defaultProps ?? {}, field.props)
    const baseProps = {
      ...props,
      value,
      placeholder: getFnValue(props.placeholder, { formData })
    }
    const baseEvents = {
      onChange: event => {
        formData[field.fieldName] = event.target.value
        if (typeof props.onChange === 'function') {
          setTimeout(() => {
            config.onChange(event.target.value, formData)
          })
        }
      }
    }
    return h(resolveComponent(field.type), {
      ...baseProps,
      ...baseEvents
    })
  }

  return {
    renderByField
  }
}