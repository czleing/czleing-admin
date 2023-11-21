import { h, inject, resolveComponent } from 'vue'
import { EControlType } from '@/enum/index'
import { getFnValue } from '@/utils/index'

/**
 * 渲染组件
 * @returns 组件
 */
export function useRender () {
  const formData = inject('FORM_DATA', {})
  const getRenderFn = {
    [EControlType.eInput]: renderInput
  }
  function renderByField (field) {
    return getRenderFn[field.type](field)
  }
  /**
   * 渲染输入框
   * @param {Object} field 
   * @returns 
   */
  function renderInput (field) {
    const controlType = EControlType._objectOf(field.type)
    const props = Object.assign({
      type: 'text',
      placeholder: `请输入${field.label}`,
      maxlength: 50
    }, controlType.data.defaultProps ?? {}, field.props)
    const baseProps = {
      ...props,
      placeholder: getFnValue(props.placeholder, { formData }),
      extra: getFnValue(props.extra, { formData })
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