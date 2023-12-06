import { Modal, message as Message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { createVNode } from 'vue'
/**
 * 工具类
 */
/**
 * 是否为空
 * 适用参数：对象、数组、字符串
 * @param {string|object|array} value
 * @returns {Boolean}
 */
export function isEmpty (value) {
  if (!value && value !== 0) return true
  if (typeof value === 'string') {
    return value.trim().length === 0
  } else if (Array.isArray(value)) {
    return value.length === 0
  } else if (typeof value === 'object') {
    return Object.keys(value).length === 0
  } else {
    return false
  }
}

/**
 * 是否不为空
 * 字符串，对象，数组
 * @param {string|object|array} value
 * @returns {Boolean}
 */
export function isNotEmpty (value) {
  return !isEmpty(value)
}

/**
 * 检测对象是否所有属性都为空
 * @param {Object} obj 对象
 * @param [String, Object] excludeFields 排除字段，字符串或字符串数组
 * @returns {Boolean} true:对象为空或者对象所有属性为空，false：至少有一个属性不为空
 */
export function isAllFieldEmpty (obj, excludeFields = []) {
  if (!obj) {
    return true
  }
  if (typeof obj !== 'object') {
    return false
  }
  const keys = Object.keys(obj)
  if (typeof excludeFields === 'string') {
    excludeFields = [excludeFields]
  }
  const existValue = keys.some(key => {
    if (excludeFields.includes(key)) {
      return false
    }
    return obj[key] === 0 || obj[key]
  })
  return !existValue
}

/**
 * 字符串脱敏
 * stringStar('13800138000', 3, 4) -> 138****8000
 */
export function stringStar (value, startLen, endLen, mark = '*') {
  if (typeof value === 'number') value = value.toString()
  if (typeof value !== 'string') return value
  const markLen = Math.max(value.length - startLen - endLen, 0)
  var star = new Array(markLen).fill(mark).join('')
  var startStr = value.slice(0, startLen)
  var endStr = value.slice(-Math.abs(endLen))
  return startStr + star + endStr
}

/**
 * 字节格式化，字节数转为常用单位
 * @param byte
 * @returns
 */
export function byteFormat (byte) {
  if (!byte) return 0
  if (byte > 1024 << 20) {
    return (byte / (1024 << 20)).toFixed(2) + 'GB'
  } else if (byte > 1024 << 10) {
    return (byte / (1024 << 10)).toFixed(2) + 'MB'
  } else if (byte > 1024) {
    return (byte / 1024).toFixed(2) + 'KB'
  } else {
    return byte + 'B'
  }
}

/**
 * 使用 loading 执行异步函数
 */
export async function loadingRequest (loading, func, message) {
  function setLoading (bol) {
    if (typeof loading === 'function') {
      loading(bol)
    } else {
      loading.value = bol
    }
  }
  try {
    setLoading(true)
    await func()
    if (message) {
      Message.success(message)
    }
  } finally {
    setLoading(false)
  }
}

/**
 * 对话框提示确认后执行异步函数
 * option:
 * showConfirmButton
 * showCancelButton
 * confirmButtonText
 * cancelButtonText
 */
export function confirmRequest (content, title, loading, func, message, option = {}) {
  return Modal.confirm({
    title,
    content,
    icon: createVNode(ExclamationCircleOutlined),
    ...option,
    async onOk () {
      return await loadingRequest(loading, func, message)
    }
  })
}

/**
 * 把秒 转为 xx时xx分xx秒
 * @param {number} seconds 秒
 * @param {boolean} needSecond 是否精确到秒
 */
export function toDuration (seconds = 0, needSecond = true) {
  let hour = 0
  let minute = 0
  let second = 0
  const h = 3600
  const m = 60
  hour = parseInt(seconds / h)
  minute = parseInt(seconds % h / m)
  if (needSecond) {
    second = seconds % m
  }
  return {
    hour,
    minute,
    second
  }
}

/**
 * 将xxxx转为xx万或xx亿
 * @param {Number} num 数值
 * @param {Number} digit 小数位数
 * @param {Boolean} isForceTransform 是否强制转成万/亿，false则大于9999才会转
 * @returns xx.xx万 或 xx.xx亿
 */
export function transformNum (num, digit = 2, isForceTransform = true) {
  num = Number(num)
  let unit = ''
  if ((isForceTransform && num > 0) || (!isForceTransform && num > 9999)) {
    num = num / 10000
    unit = '万'
    if (num > 9999) {
      num = num / 10000
      unit = '亿'
    }
  }
  return {
    value: Number(num.toFixed(digit)),
    unit
  }
}

/**
 * 通过分子/分母，计算商
 * @param {Number|String} numerator 分子
 * @param {Number|String} denominator 分母
 * @returns
 */
export function divide (numerator, denominator, digit = 2) {
  numerator = Number(numerator)
  denominator = Number(denominator)
  return denominator === 0 ? 0 : Number((numerator / denominator).toFixed(digit))
}

/**
 * 通过分子*100/分母，计算百分比
 * @param {Number|String} numerator 分子
 * @param {Number|String} denominator 分母
 * @returns 3 / 10 => 33.33
 */
export function calcPercent (numerator, denominator, digit = 2) {
  return Number((divide(numerator, denominator, digit + 2) * 100).toFixed(digit))
}

/** 获得一个值，可能来源于一个函数的结果 */
export function getFnValue (value, args) {
  if (typeof value === 'function') {
    return value(args)
  } else {
    return value
  }
}
