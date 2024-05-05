package com.admin.system.domain.bo;

import lombok.Data;
import lombok.EqualsAndHashCode;
import javax.validation.constraints.*;
import com.admin.common.core.domain.*;
import com.admin.common.core.validate.*;



/**
 * 岗位信息业务对象 sys_post
 *
 * @author admin
 * @date 2024-05-05
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class SysPostBo extends BaseEntity {

    /**
     * 岗位ID
     */
    @NotNull(message = "岗位ID不能为空", groups = { EditGroup.class })
    private Long postId;

    /**
     * 岗位编码
     */
    @NotBlank(message = "岗位编码不能为空", groups = { AddGroup.class, EditGroup.class })
    private String postCode;

    /**
     * 岗位名称
     */
    @NotBlank(message = "岗位名称不能为空", groups = { AddGroup.class, EditGroup.class })
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
