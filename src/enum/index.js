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
  eCheckbox: Enum('a-checkbox-group', '多选框'),
  eTable: Enum('DynamicTable', '动态表格', { defaultProps: { bordered: true, size: 'small' } }),
  eTreeSelect: Enum('a-tree-select', '树形选择', { defaultProps: { treeDefaultExpandAll: true } }),
  eCustom: Enum('Custom', '自定义')
}
init(EControlType)

/**
 * 是否启用
 */
export const EIsEnabled = {
  eEnabled: Enum(1, '启用', 'text-success'),
  eDisabled: Enum(0, '禁用', 'text-danger')
}
init(EIsEnabled)


/**
 * 是否
 */
export const EYesNo = {
  eYes: Enum(1, '是', 'text-success'),
  eNo: Enum(0, '否', 'text-danger')
}
init(EYesNo)

/**
 * 菜单类型
 */
export const EMenuType = {
  eDir: Enum('M', '目录'),
  eMenu: Enum('C', '菜单'),
  eBtn: Enum('F', '按钮')
}
init(EMenuType)
