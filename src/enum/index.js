import { Enum, init } from '@/utils/enum.util'

/**
 * 控件类型
 * 
 */
export const EControlType = {
  eInput: Enum('a-input', '文本框', { defaultProps: { maxlength: 50 } }),
  eTextarea: Enum('a-textarea', '文本域', { defaultProps: { maxlength: 200, showCount: true, rows: 4 } }),
  eNumber: Enum('a-input-number', '数字框', { defaultProps: { style: 'width: 100%;' } }),
  eRadio: Enum('a-radio-group', '单选框'),
  eSelect: Enum('a-select', '下拉选择'),
  eDate: Enum('a-date-picker', '日期'),
  eDateRange: Enum('a-range-picker', '日期范围'),
  eSwitch: Enum('a-switch', '开关'),
  eFileUpload: Enum('FileUpload', '文件上传'),
  eImageUpload: Enum('ImageUpload', '图片上传'),
  eCheckbox: Enum('a-checkbox', '多选框'),
  eTable: Enum('a-table', '动态表格'),
  eCustom: Enum('Custom', '自定义')
}
init(EControlType)
