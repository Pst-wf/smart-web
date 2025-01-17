import {getRequest, postRequest, getRequestBlob, postRequestBlob} from '/src/lib/axios';

export const frontUserApi = {
    /**
     * 添加前台用户
     */
    addFrontUser: (param) => {
        return postRequest('/system/frontUser/save', param);
    },

    /**
     * 更新前台用户
     */
    updateFrontUser: (param) => {
        return postRequest('/system/frontUser/update', param);
    },

    /**
     * 删除前台用户
     */
    deleteFrontUser: (param) => {
        return postRequest('/system/frontUser/delete', param);
    },

    /**
     * 前台用户分页列表
     */
    frontUserPage: (params) => {
        return getRequest('/system/frontUser/page', params);
    },

    /**
     * 前台用户列表
     */
    frontUserList: (params) => {
        return getRequest('/system/frontUser/list', params);
    },

    /**
     * 前台用户详情
     */
    getFrontUser: (params) => {
        return getRequest('/system/frontUser/get', params);
    },

    /**
     * 导出数据
     * @param params
     */
    exportFrontUserData: (params) => {
        return postRequestBlob('/system/frontUser/export', params);
    },

    /**
     * 下载导入模板
     */
    downloadFrontUserTemplate: () => {
        return getRequestBlob('/system/frontUser/downloadTemplate');
    },

    /**
     * 更新状态
     */
    updateStatus: (params) => {
        return postRequest('/system/frontUser/updateUserStatus', params);
    },

};
