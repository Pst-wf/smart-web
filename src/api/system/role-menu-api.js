import { getRequest, postRequest } from '/src/lib/axios';
export const roleMenuApi = {
  /**
   * @description: 获取角色关联菜单权限
   */
  getRoleMenus: (roleId) => {
    return getRequest(`/system/role/roleMenus?roleId=${roleId}`);
  },

  /**
   * @description: 获取角色关联按钮权限
   */
  getRoleButtons: (roleId) => {
    return getRequest(`/system/role/roleButtons?roleId=${roleId}`);
  },

  /**
   * @description: 更新角色菜单权限
   */
  setRoleMenus: (data) => {
    return postRequest('/system/role/setRoleMenus', data);
  },

  /**
   * @description: 更新角色按钮权限
   */
  setRoleButtons: (data) => {
    return postRequest('/system/role/setRoleButtons', data);
  },

  /**
   * @description: 获取角色关联数据权限
   */
  getRoleScopes: (roleId) => {
    return getRequest(`/system/role/roleScopes?roleId=${roleId}`);
  },

  /**
   * @description: 更新角色数据权限
   */
  setRoleScopes: (data) => {
    return postRequest('/system/role/setRoleScopes', data);
  },
};
