import {getRequest, postRequest} from '/src/lib/axios';

export const taskLogApi = {
    /**
     * 添加任务日志
     */
    addTaskLog: (param) => {
        return postRequest('/job/jobLog/save', param);
    },

    /**
     * 更新任务日志
     */
    updateTaskLog: (param) => {
        return postRequest('/job/jobLog/update', param);
    },

    /**
     * 删除任务日志
     */
    deleteTaskLog: (param) => {
        return postRequest('/job/jobLog/delete', param);
    },

    /**
     * 任务日志分页列表
     * @param params
     */
    taskLogPage: (params) => {
        return getRequest('/job/jobLog/page', params);
    },

    /**
     * 任务日志列表
     * @param params
     */
    taskLogList: (params) => {
        return getRequest('/job/jobLog/list', params);
    },

};
