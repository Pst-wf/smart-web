/*
 * 数据权限
 */
import {getRequest, postRequest} from '/src/lib/axios';

export const scopeApi = {
    /**
     * 添加数据权限
     */
    addScope: (param) => {
        return postRequest('/system/scope/save', param);
    },

    /**
     * 更新数据权限
     */
    updateScope: (param) => {
        return postRequest('/system/scope/update', param);
    },

    /**
     * 批量删除数据权限
     */
    batchDeleteScope: (param) => {
        return postRequest('/system/scope/delete', param);
    },
    /**
     * 数据权限分页列表
     * @param params
     */
    scopePage: (params) => {
        return getRequest('/system/scope/page', params);
    },
};
