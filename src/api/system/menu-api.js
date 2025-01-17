/*
 * 菜单
 */
import {getRequest, postRequest} from '/src/lib/axios';

export const menuApi = {
    /**
     * 添加菜单
     */
    addMenu: (param) => {
        return postRequest('/system/menu/save', param);
    },

    /**
     * 更新菜单
     */
    updateMenu: (param) => {
        return postRequest('/system/menu/update', param);
    },

    /**
     * 批量删除菜单
     */
    batchDeleteMenu: (param) => {
        return postRequest('/system/menu/delete', param);
    },
    /**
     * 树列表
     * @param params
     */
    menuTree: (params) => {
        return getRequest('/system/menu/tree', params);
    },
    /**
     * 树选择
     * @param params
     */
    menuTreeFormat: (params) => {
        return getRequest('/system/menu/treeFormat', params);
    },

    /**
     * 数据权限树选择
     * @param params
     */
    scopeTreeFormat: (params) => {
        return getRequest('/system/menu/scopeTreeFormat', params);
    },
    /**
     * 生成菜单
     * @param params
     */
    genMenu: (params) => {
        return postRequest('/system/menu/saveMenu', params);
    }
};
