import { Enum, init } from '@/utils/enum.util'

/**
 * 用户类型
 */
export const EUserType = {
  eSys: Enum('sys_user', '系统用户'),
  eOther: Enum('other', '其他用户')
}
init(EUserType)

/**
 * 控件类型
 * htmlType 用于代码生成时获取枚举key
 */
export const EControlType = {
  eInput: Enum('a-input', '文本框', { htmlType: 'eInput', defaultProps: { maxlength: 50 } }),
  eNumber: Enum('a-input-number', '数字框', { htmlType: 'eNumber', defaultProps: { style: 'width: 100%;' } }),
  eTextarea: Enum('a-textarea', '文本域', { htmlType: 'eTextarea', defaultProps: { maxlength: 200, showCount: true, rows: 4 } }),
  eRadio: Enum('a-radio-group', '单选框', { htmlType: 'eRadio' }),
  eCheckbox: Enum('a-checkbox-group', '多选框', { htmlType: 'eCheckbox' }),
  eSelect: Enum('a-select', '下拉选择', { htmlType: 'eSelect' }),
  eDate: Enum('a-date-picker', '日期', { htmlType: 'eDate' }),
  eDateRange: Enum('a-range-picker', '日期范围', { htmlType: 'eDateRange' }),
  eSwitch: Enum('a-switch', '开关', { htmlType: 'eSwitch' }),
  eFileUpload: Enum('FileUpload', '文件上传', { htmlType: 'eFileUpload' }),
  eImageUpload: Enum('ImageUpload', '图片上传', { htmlType: 'eImageUpload' }),
  eEditor: Enum('Editor', '富文本', { htmlType: 'eEditor' }),
  eTreeSelect: Enum('a-tree-select', '树形选择', { htmlType: 'eTreeSelect', defaultProps: { treeDefaultExpandAll: true } }),
  eProvinceCityAreaSelector: Enum('ProvinceCityAreaSelector', '省市区选择', { htmlType: 'eProvinceCityAreaSelector' }),
  eUserSelect: Enum('UserSelect', '用户选择', { htmlType: 'eUserSelect' }),
  eTable: Enum('DynamicTable', '动态表格', { htmlType: 'eTable', defaultProps: { bordered: true, size: 'small' } }),
  eCustom: Enum('Custom', '自定义', { htmlType: 'eCustom' })
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
