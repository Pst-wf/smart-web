import {getRequest, postRequest} from '/src/lib/axios';

export const taskGroupApi = {
    /**
     * 添加执行器
     */
    addTaskGroup: (param) => {
        return postRequest('/job/jobGroup/save', param);
    },

    /**
     * 更新执行器
     */
    updateTaskGroup: (param) => {
        return postRequest('/job/jobGroup/update', param);
    },

    /**
     * 删除执行器
     */
    deleteTaskGroup: (param) => {
        return postRequest('/job/jobGroup/delete', param);
    },

    /**
     * 执行器分页列表
     * @param params
     */
    taskGroupPage: (params) => {
        return getRequest('/job/jobGroup/page', params);
    },

    /**
     * 执行器列表
     * @param params
     */
    taskGroupList: (params) => {
        return getRequest('/job/jobGroup/list', params);
    },

    /**
     * 执行器详情
     * @param params
     */
    getTaskGroup: (params) => {
        return getRequest('/job/jobGroup/get', params);
    },
};
