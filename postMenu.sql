-- 菜单 SQL
insert into sys_menu (menu_id, menu_name, parent_id, sort, path, component, is_frame, is_cache, menu_type, is_hidden, is_enabled, permission, icon, create_by, create_time, update_by, update_time, remark)
values (1787046068222218242, '岗位信息', 1, 1, 'post', 'system/post/index', 1, 0, 'C', 0, 1, 'system:post:list', '#', 'admin', sysdate(), '', null, '岗位信息菜单');

-- 按钮 SQL
insert into sys_menu (menu_id, menu_name, parent_id, sort, path, component, is_frame, is_cache, menu_type, is_hidden, is_enabled, permission, icon, create_by, create_time, update_by, update_time, remark)
values(1787046068222218243, '新增', 1787046068222218242, 1,  '#', '', 1, 0, 'F', 0, 1, 'system:post:add',          '#', 'admin', sysdate(), '', null, '');

insert into sys_menu (menu_id, menu_name, parent_id, sort, path, component, is_frame, is_cache, menu_type, is_hidden, is_enabled, permission, icon, create_by, create_time, update_by, update_time, remark)
values (1787046068222218244, '删除', 1787046068222218242, 2,  '#', '', 1, 0, 'F', 0, 1, 'system:post:delete',       '#', 'admin', sysdate(), '', null, '');

insert into sys_menu (menu_id, menu_name, parent_id, sort, path, component, is_frame, is_cache, menu_type, is_hidden, is_enabled, permission, icon, create_by, create_time, update_by, update_time, remark)
values (1787046068222218245, '修改', 1787046068222218242, 3,  '#', '', 1, 0, 'F', 0, 1, 'system:post:update',         '#', 'admin', sysdate(), '', null, '');

insert into sys_menu (menu_id, menu_name, parent_id, sort, path, component, is_frame, is_cache, menu_type, is_hidden, is_enabled, permission, icon, create_by, create_time, update_by, update_time, remark)
values (1787046068222218246, '查询', 1787046068222218242, 4,  '#', '', 1, 0, 'F', 0, 1, 'system:post:detail',        '#', 'admin', sysdate(), '', null, '');

insert into sys_menu (menu_id, menu_name, parent_id, sort, path, component, is_frame, is_cache, menu_type, is_hidden, is_enabled, permission, icon, create_by, create_time, update_by, update_time, remark)
values (1787046068222218247, '导出', 1787046068222218242, 5,  '#', '', 1, 0, 'F', 0, 1, 'system:post:export',       '#', 'admin', sysdate(), '', null, '');
