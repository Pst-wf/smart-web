import {getRequest, postRequest} from '/src/lib/axios';

export const loginLogApi = {
    /**
     * 删除登录日志
     */
    deleteLoginLog: (param) => {
        return postRequest('/system/loginLog/delete', param);
    },

    /**
     * 登录日志分页列表
     * @param params
     */
    loginLogPage: (params) => {
        return getRequest('/system/loginLog/page', params);
    },
    /**
     * 用户登录日志
     * @param params
     */
    userLogs: (params) => {
        return getRequest('/system/loginLog/userLogs', params);
    },
};
