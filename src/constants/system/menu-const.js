export const MENU_TYPE_ENUM = {
  CATALOG: {
    value: '1',
    desc: '目录',
  },
  MENU: {
    value: '2',
    desc: '菜单',
  }
};

export const MENU_WEIGHT_ENUM = {
  SUPER: {
    value: '1',
    desc: '超级管理员可见',
  },
  NORMAL: {
    value: '2',
    desc: '普通菜单',
  }
};

/**
 * 权限类型
 */
export const MENU_PERMS_TYPE_ENUM = {
  SA_TOKEN: {
    value: 1,
    desc: 'Sa-Token模式',
  }
};

/**
 * 默认的顶级菜单id为0
 */
export const MENU_DEFAULT_PARENT_ID = '0';

export default {
  MENU_TYPE_ENUM,
  MENU_PERMS_TYPE_ENUM
};
