import {getRequest, getRequestBlob, postRequest, postRequestBlob} from '/src/lib/axios';

export const userApi = {
    /**
     * 添加人员
     */
    addUser: (param) => {
        return postRequest('/system/user/save', param);
    },

    /**
     * 更新人员
     */
    updateUser: (param) => {
        return postRequest('/system/user/update', param);
    },

    /**
     * 删除人员
     */
    deleteUser: (param) => {
        return postRequest('/system/user/delete', param);
    },

    /**
     * 人员分页列表
     * @param params
     */
    userPage: (params) => {
        return getRequest('/system/user/page', params);
    },

    /**
     * 人员列表
     * @param params
     */
    userList: (params) => {
        return getRequest('/system/user/list', params);
    },

    /**
     * 人员详情
     * @param params
     */
    getUser: (params) => {
        return getRequest('/system/user/get', params);
    },

    /**
     * 修改状态
     */
    updateUserStatus: (param) => {
        return postRequest('/system/user/updateUserStatus', param);
    },

    /**
     * 导出数据
     * @param params
     */
    exportUserData: (params) => {
        return postRequestBlob('/system/user/export', params);
    },

    /**
     * 下载导入模板
     */
    downloadUserTemplate: () => {
        return getRequestBlob('/system/user/downloadTemplate');
    },
    /**
     * 更新个人信息
     */
    updateInfo: (param) => {
        return postRequest('/system/user/updateInfo', param);
    },
    /**
     * 修改密码
     */
    updatePassword: (param) => {
        return postRequest('/system/user/updatePassword', param);
    },
};
