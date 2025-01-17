import {getRequest, postRequest} from '/src/lib/axios';

export const deptApi = {
    /**
     * 添加组织机构
     */
    addDept: (param) => {
        return postRequest('/system/dept/save', param);
    },

    /**
     * 更新组织机构
     */
    updateDept: (param) => {
        return postRequest('/system/dept/update', param);
    },

    /**
     * 删除组织机构
     */
    deleteDept: (param) => {
        return postRequest('/system/dept/delete', param);
    },

    /**
     * 组织机构分页列表
     * @param params
     */
    deptPage(params) {
        return getRequest('/system/dept/page', params);
    },

    /**
     * 组织机构列表
     * @param params
     */
    deptList(params) {
        return getRequest('/system/dept/list', params);
    },

    /**
     * 组织机构树
     * @param params
     */
    deptTree(params) {
        return getRequest('/system/dept/tree', params);
    },

    /**
     * 组织机构树选择
     * @param params
     */
    deptTreeFormat(params) {
        return getRequest('/system/dept/treeFormat', params);
    },
};
