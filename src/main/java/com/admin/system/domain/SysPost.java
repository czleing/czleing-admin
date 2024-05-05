package com.admin.system.domain;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;


/**
 * 岗位信息对象 sys_post
 *
 * @author admin
 * @date 2024-05-05
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_post")
public class SysPost extends BaseEntity {

    private static final long serialVersionUID=1L;

    /**
     * 岗位ID
     */
    @TableId(value = "post_id")
    private Long postId;
    /**
     * 岗位编码
     */
    private String postCode;
    /**
     * 岗位名称
     */
    private String postName;
    /**
     * 显示顺序
     */
    private Long postSort;
    /**
     * 是否启用
     */
    private Boolean isEnabled;
    /**
     * 备注
     */
    private String remark;

}
