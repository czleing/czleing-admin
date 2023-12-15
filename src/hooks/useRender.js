import { h, inject, resolveComponent } from 'vue'
import { EControlType } from '@/enum/index'
import { getFnValue } from '@/utils/index'
import dayjs from 'dayjs'

/**
 * 渲染组件
 * @returns 组件
 */
export function useRender ({ isView, value, dataSource }) {
  const formData = inject('FORM_DATA', {})
  // 自定义渲染函数
  const getRenderFn = {
    [EControlType.eInput]: renderInput,
    [EControlType.eTextarea]: renderTextarea,
    [EControlType.eNumber]: renderInputNumber,
    [EControlType.eRadio]: renderRadio,
    [EControlType.eSelect]: renderSelect,
    [EControlType.eDate]: renderDate,
  }
  // 通过字段配置生成控件
  function renderByField (field) {
    const fn = getRenderFn[field.type]
    if (fn) {
      // 1.有自定义渲染函数的，用自定义渲染函数渲染
      return fn(field)
    } else if (field.type) {
      // 2.没有自定义的，尝试当全局组件渲染，当然上面所有的 ant-design 组件都可以走这里
      return h(resolveComponent(field.type), {
        ...field.props,
        value,
        disabled: field.props.disabled ?? isView,
        onChange (val) {
          formData[field.fieldName] = val
          if (typeof field.props.onChange === 'function') {
            setTimeout(() => {
              field.props.onChange(val, formData)
            })
          }
        }
      })
    } else {
      console.warn('field.type 不存在')
    }
  }
  /**
   * 渲染输入框
   * @param {Object} field 字段配置信息
   * @returns 组件VNode
   */
  function renderInput (field) {
    // 查看模式，直接渲染文本
    if (isView) {
      return h('span', [value ?? '-'])
    }
    const controlTypeEnum = EControlType._objectOf(field.type)
    const props = Object.assign(
      {
        type: 'text',
        placeholder: `请输入${field.label}`,
        maxlength: 50
      },
      controlTypeEnum.data.defaultProps ?? {},
      field.props
    )
    const controlProps = {
      ...props,
      value,
      placeholder: getFnValue(props.placeholder, formData),
      onChange: event => {
        formData[field.fieldName] = event.target.value
        if (typeof props.onChange === 'function') {
          setTimeout(() => {
            props.onChange(event.target.value, formData)
          })
        }
      }
    }
    let type = field.type
    if (type === 'password') {
      type = 'a-input-password'
    }
    return h(resolveComponent(type), controlProps)
  }

  /**
   * 渲染数字组件
   * @param {Object} field 字段配置信息
   * @returns 组件VNode
   */
  function renderInputNumber (field) {
    // 查看模式，直接渲染文本
    if (isView) {
      return h('span', [value ?? '-'])
    }
    const controlTypeEnum = EControlType._objectOf(field.type)
    const props = Object.assign(
      {
        placeholder: `请输入${field.label}`
      },
      controlTypeEnum.data.defaultProps ?? {},
      field.props
    )
    const controlProps = {
      ...props,
      value,
      placeholder: getFnValue(props.placeholder, formData),
      onChange: val => {
        formData[field.fieldName] = val
        if (typeof props.onChange === 'function') {
          setTimeout(() => {
            props.onChange(val, formData)
          })
        }
      }
    }
    return h(resolveComponent(field.type), controlProps)
  }

  /**
   * 渲染文本域组件
   * @param {Object} field 字段配置信息
   * @returns 组件VNode
   */
  function renderTextarea (field) {
    // 查看模式，直接渲染文本
    if (isView) {
      return h('span', [value ?? '-'])
    }
    const controlTypeEnum = EControlType._objectOf(field.type)
    const props = Object.assign(
      {
        placeholder: `请输入${field.label}`
      },
      controlTypeEnum.data.defaultProps ?? {},
      field.props
    )
    const controlProps = {
      ...props,
      value,
      placeholder: getFnValue(props.placeholder, formData),
      onChange: event => {
        formData[field.fieldName] = event.target.value
        if (typeof props.onChange === 'function') {
          setTimeout(() => {
            props.onChange(event.target.value, formData)
          })
        }
      }
    }
    return h(resolveComponent(field.type), controlProps)
  }

  /**
   * 渲染单选按钮组件
   * @param {Object} field 字段配置信息
   * @returns 组件VNode
   */
  function renderRadio (field) {
    const controlTypeEnum = EControlType._objectOf(field.type)
    const props = Object.assign({}, controlTypeEnum.data.defaultProps ?? {}, field.props)
    const options = transformOptions(props.options)
    // 查看模式，直接渲染文本
    if (isView) {
      return h('span', [options.find(item => item.value === value)?.label ?? '-'])
    }
    const controlProps = {
      ...props,
      options,
      value,
      onChange: event => {
        formData[field.fieldName] = event.target.value
        if (typeof props.onChange === 'function') {
          setTimeout(() => {
            props.onChange(event.target.value, formData)
          })
        }
      }
    }
    return h(resolveComponent(field.type), controlProps)
  }

  /**
   * 渲染下拉组件
   * @param {Object} field 字段配置信息
   * @returns 组件VNode
   */
  function renderSelect (field) {
    const controlTypeEnum = EControlType._objectOf(field.type)
    const props = Object.assign(
      {
        placeholder: `请选择${field.label}`
      },
      controlTypeEnum.data.defaultProps ?? {},
      field.props
    )
    const options = transformOptions(props.options ?? dataSource, props.useAll)
    // 查看模式，直接渲染文本
    if (isView) {
      return h('span', [options?.find(item => item.value === value)?.label ?? value ?? '-'])
    }
    const controlProps = {
      ...props,
      value,
      options,
      onChange: (val, option) => {
        if (import.meta.env.VITE_APP_DEBUG_MODE) {
          console.log('selected', val, option)
        }
        formData[field.fieldName] = val
        if (typeof props.onChange === 'function') {
          setTimeout(() => {
            props.onChange(val, option, formData)
          })
        }
      }
    }
    return h(resolveComponent(field.type), controlProps)
  }

  /**
   * 渲染日期组件
   * @param {Object} field 字段配置信息
   * @returns 组件VNode
   */
  function renderDate (field) {
    // 查看模式，直接渲染文本
    if (isView) {
      let val = value
      if (val && typeof val === 'number' || /\d{13}/.test(String(val))) {
        val = dayjs(Number(val))
      }
      if (val && typeof val === 'object' && val.$isDayjsObject) {
        if (field.props?.showTime) {
          val = val.format('YYYY-MM-DD HH:mm:ss')
        } else {
          val = val.format('YYYY-MM-DD')
        }
      }
      return h('span', [val ?? '-'])
    }
    const controlTypeEnum = EControlType._objectOf(field.type)
    const props = Object.assign(
      {
        placeholder: `请选择${field.label}`
      },
      controlTypeEnum.data.defaultProps ?? {},
      field.props
    )
    const controlProps = {
      ...props,
      value: value ? dayjs(value) : value,
      placeholder: getFnValue(props.placeholder, formData),
      onChange: val => {
        formData[field.fieldName] = val
        if (typeof props.onChange === 'function') {
          setTimeout(() => {
            props.onChange(val, formData)
          })
        }
      }
    }
    return h(resolveComponent(field.type), controlProps)
  }

  /** 将本系统风格的 options 转成 ant-design 风格的 options，适用于 a-radio, a-select, a-checkbox */
  function transformOptions (options, useAll = false) {
    const result = options?.map(item => ({ ...item, value: item.id, label: item.name }))
    if (useAll) {
      result.unshift({ value: null, label: '全部' })
    }
    return result
  }

  return {
    renderByField
  }
}