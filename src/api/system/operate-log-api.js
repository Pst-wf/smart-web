import {getRequest, postRequest} from '/src/lib/axios';

export const operateLogApi = {
    /**
     * 删除操作日志
     */
    deleteOperateLog: (param) => {
        return postRequest('/system/log/delete', param);
    },

    /**
     * 操作日志分页列表
     * @param params
     */
    operateLogPage: (params) => {
        return getRequest('/system/log/page', params);
    },
    /**
     * 用户操作日志
     * @param params
     */
    userLogs: (params) => {
        return getRequest('/system/log/userLogs', params);
    },
};
