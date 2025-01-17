import {getRequest, postRequest} from '/src/lib/axios';

export const errorLogApi = {
    /**
     * 删除异常日志
     */
    deleteErrorLog: (param) => {
        return postRequest('/system/errorLog/delete', param);
    },

    /**
     * 异常日志分页列表
     * @param params
     */
    errorLogPage: (params) => {
        return getRequest('/system/errorLog/page', params);
    },
};
