package com.admin.system.domain.vo;

import com.alibaba.excel.annotation.ExcelIgnoreUnannotated;
import com.alibaba.excel.annotation.ExcelProperty;
import com.admin.common.annotation.ExcelDictFormat;
import com.admin.common.convert.ExcelDictConvert;
import lombok.Data;


/**
 * 岗位信息视图对象 sys_post
 *
 * @author admin
 * @date 2024-05-05
 */
@Data
@ExcelIgnoreUnannotated
public class SysPostVo {

    private static final long serialVersionUID = 1L;

    /**
     * 岗位编码
     */
    @ExcelProperty(value = "岗位编码")
    private String postCode;

    /**
     * 岗位名称
     */
    @ExcelProperty(value = "岗位名称")
    private String postName;

    /**
     * 显示顺序
     */
    @ExcelProperty(value = "显示顺序")
    private Long postSort;

    /**
     * 是否启用
     */
    @ExcelProperty(value = "是否启用")
    private Boolean isEnabled;

    /**
     * 更新时间
     */
    @ExcelProperty(value = "更新时间")
    private Date updateTime;

    /**
     * 备注
     */
    @ExcelProperty(value = "备注")
    private String remark;


}
