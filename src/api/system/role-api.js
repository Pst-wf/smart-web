/*
 * 角色
 */
import {getRequest, postRequest} from '/src/lib/axios';

export const roleApi = {
    /**
     * @description: 获取所有角色
     */
    roleList: (params) => {
        return getRequest('/system/role/list', params);
    },
    /**
     * @description:添加角色
     */
    addRole: (data) => {
        return postRequest('/system/role/save', data);
    },
    /**
     * @description:更新角色
     */
    updateRole: (data) => {
        return postRequest('/system/role/update', data);
    },
    /**
     * @description: 删除角色
     */
    deleteRole: (data) => {
        return postRequest('/system/role/delete', data);
    }
};
