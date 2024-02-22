import { h, inject, resolveComponent, nextTick } from 'vue'
import { EControlType } from '@/enum/index'
import { getFnValue, isNotEmpty, isEmpty } from '@/utils/index'
import dayjs from 'dayjs'

/**
 * 渲染组件
 * @returns 组件
 */
export function useRender ({ ctx, isView, value, dataSource }) {
  const formData = inject('FORM_DATA', {})
  const emitChange = async val => {
    ctx.$emit('update:value', val)
    await nextTick()
    ctx.$emit('change', val)
  }
  // 自定义渲染函数
  const getRenderFn = {
    [EControlType.eInput]: renderInput,
    [EControlType.eTextarea]: renderTextarea,
    [EControlType.eNumber]: renderInputNumber,
    [EControlType.eRadio]: renderRadio,
    [EControlType.eSelect]: renderSelect,
    [EControlType.eDate]: renderDate,
    [EControlType.eDateRange]: renderDateRange,
    [EControlType.eSwitch]: renderSwitch,
    [EControlType.eCheckbox]: renderCheckbox,
    [EControlType.eTable]: renderTable,
    [EControlType.eTreeSelect]: renderTreeSelect,
    [EControlType.eCustom]: renderCustom
  }
  // 通过字段配置生成控件
  function renderByField (field) {
    const fn = getRenderFn[field.type]
    if (fn) {
      // 1.有自定义渲染函数的，用自定义渲染函数渲染
      return fn(field)
    } else if (field.type) {
      const controlTypeEnum = EControlType._objectOf(field.type)
      // 2.没有自定义的，尝试当全局组件渲染，当然上面所有的 ant-design 组件都可以走这里
      return h(resolveComponent(field.type), {
        ...controlTypeEnum?.data?.defaultProps ?? {},
        ...field.props,
        value,
        disabled: field.props.disabled ?? isView,
        onChange (val) {
          emitChange(val)
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
        placeholder: `请输入${getFnValue(field.label, formData)}`,
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
        emitChange(event.target.value)
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
        emitChange(val)
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
        emitChange(event.target.value)
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
    const options = transformOptions(props.options ?? dataSource)
    // 查看模式，直接渲染文本
    if (isView) {
      return h('span', [options?.find(item => item.value === value)?.label ?? '-'])
    }
    const controlProps = {
      ...props,
      options,
      value,
      onChange: event => {
        emitChange(event.target.value)
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
   * 渲染多选按钮组件
   * @param {Object} field 字段配置信息
   * @returns 组件VNode
   */
  function renderCheckbox (field) {
    const controlTypeEnum = EControlType._objectOf(field.type)
    const props = Object.assign({}, controlTypeEnum.data.defaultProps ?? {}, field.props)
    const options = transformOptions(props.options ?? dataSource)
    // 查看模式，直接渲染文本
    if (isView) {
      const newVal = typeof value === 'string' ? value.split(',') : value
      const selectedValues = Array.isArray(newVal) ? newVal : [newVal]
      return h('span', [options.filter(item => selectedValues.includes(item.value))?.map(item => item.name)?.join(',') ?? value ?? '-'])
    }
    const controlProps = {
      ...props,
      options,
      value,
      onChange: val => {
        emitChange(val)
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
      const newVal = typeof value === 'string' ? value.split(',') : value
      const selectedValues = Array.isArray(newVal) ? newVal : [newVal]
      return h('span', [options?.filter(item => selectedValues.includes(item.value))?.map(item => item.label)?.join(',') ?? value ?? '-'])
    }
    const controlProps = {
      ...props,
      value,
      options,
      onChange: (val, option) => {
        if (import.meta.env.VITE_APP_DEBUG_MODE) {
          console.log('selected', val, option)
        }
        emitChange(val)
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
      let val = formatToDateStr(value, field.props?.showTime)
      return h('span', [val])
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
        emitChange(val)
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
   * 渲染日期范围组件
   * @param {Object} field 字段配置信息
   * @returns 组件VNode
   */
  function renderDateRange (field) {
    const fieldNames = field.props.fieldNames
    let start = formData[fieldNames[0]]
    let end = formData[fieldNames[1]]
    // 查看模式，直接渲染文本
    if (isView) {
      start = formatToDateStr(start, field.props?.showTime)
      end = formatToDateStr(end)
      return h('span', [start + ' ~ ' + end])
    }
    if (!value) {
      start = start ? dayjs(start) : undefined
      end = end ? dayjs(end) : undefined
      if (start) {
        setTimeout(() => emitChange([start, end]))
      }
    }
    const controlTypeEnum = EControlType._objectOf(field.type)
    const props = Object.assign(
      {
        placeholder: [`请选择${field.label}起`, `请选择${field.label}止`]
      },
      controlTypeEnum.data.defaultProps ?? {},
      field.props
    )
    const controlProps = {
      ...props,
      value,
      placeholder: getFnValue(props.placeholder, formData),
      onChange: val => {
        emitChange(val)
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
   * 渲染开关组件
   * @param {Object} field 字段配置信息
   * @returns 组件VNode
   */
  function renderSwitch (field) {
    // 查看模式，直接渲染文本
    if (isView) {
      return h('span', [!!value ? '是' : '否'])
    }
    const controlTypeEnum = EControlType._objectOf(field.type)
    const props = Object.assign(
      {},
      controlTypeEnum.data.defaultProps ?? {},
      field.props
    )
    const controlProps = {
      ...props,
      checked: value,
      onChange: val => {
        emitChange(val)
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
   * 渲染动态表格组件
   * @param {Object} field 字段配置信息
   * @returns 组件VNode
   */
  function renderTable (field) {
    const controlTypeEnum = EControlType._objectOf(field.type)
    const props = Object.assign(
      {},
      controlTypeEnum.data.defaultProps ?? {},
      field.props
    )
    const controlProps = {
      ...props,
      value,
      disabled: props.disabled ?? isView,
      onChange: val => {
        emitChange(val)
        if (typeof props.onChange === 'function') {
          setTimeout(() => {
            props.onChange(val, formData)
          })
        }
      }
    }
    return h(resolveComponent(field.type), controlProps)
  }

  function renderTreeSelect (field) {
    const treeData = field.props?.treeData ?? dataSource
    // 查看模式，直接渲染文本
    if (isView) {
      const valueField = field.props?.fieldNames?.value ?? 'id'
      const labelField = field.props?.fieldNames?.title ?? 'name'
      const childrenField = field.props?.fieldNames?.children ?? 'children'
      const values = typeof value === 'string' ? value.split(',') : value
      const selectedValueArr = Array.isArray(values) ? values : (values ? [values] : [])
      let text = []
      if (isNotEmpty(selectedValueArr) && isNotEmpty(treeData)) {
        const findText = (list) => {
          list.forEach(item => {
            if (selectedValueArr.includes(item[valueField])) {
              text.push(item[labelField])
            }
            if (isNotEmpty(item[childrenField])) {
              findText(item[childrenField])
            }
          })
        }
        findText(treeData)
      }
      return h('span', text.join(','))
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
      value,
      disabled: props.disabled ?? isView,
      treeData,
      onChange: val => {
        emitChange(val)
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
   * 渲染自定义组件
   * @param {Object} field 字段配置信息
   * @returns 组件VNode
   */
  function renderCustom (field) {
    const props = field.props
    const onChange = val => {
      emitChange(val)
      if (typeof props.onChange === 'function') {
        setTimeout(() => {
          props.onChange(val, formData)
        })
      }
    }
    const controlProps = {
      ...props,
      value,
      onChange,
      disabled: props.disabled ?? isView,
      component: undefined
    }
    // 自定义 model props，实现数据双向绑定(默认通过 value 驱动，但个别特殊组件没有 value，需要自定义)
    if (props.modelProps) {
      controlProps[props.modelProps] = value
    }
    // 自定义 model 事件，实现数据双向绑定(默认通过 onChange 驱动，但个别特殊组件没有 onChange，需要自定义)
    if (props.modelEvent) {
      controlProps[props.modelEvent] = onChange
    }
    // 自定义数据源字段
    if (props.modelData) {
      controlProps[props.modelData] = dataSource
    }
    // 需要有数据源才渲染，解决 ant-design-vue 4 异步数据源导致部分属性失效问题
    if (props.renderNeedDataSource) {
      if (isEmpty(dataSource)) {
        return
      }
    }
    let component = props.component
    if (typeof component === 'function') {
      component = component(formData)
    }
    return h(component, controlProps)
  }

  /** 将本系统风格的 options 转成 ant-design 风格的 options，适用于 a-radio, a-select, a-checkbox 等 */
  function transformOptions (options, useAll = false) {
    const result = options?.map(item => ({ ...item, value: item.id, label: item.name }))
    if (useAll && result) {
      result.unshift({ value: null, label: '全部' })
    }
    return result
  }

  /** 格式化日期 */
  function formatToDateStr (val, showTime = false) {
    let result = val
    const format = showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
    if (/\d{13}/.test(String(val))) { // 时间戳 转 年月日
      result = dayjs(Number(val)).format(format)
    } else if (val && typeof val === 'object' && val.$isDayjsObject) { // dayjs 转 年月日
      result = val.format(format)
    }
    return result ?? '-'
  }

  return {
    renderByField
  }
}