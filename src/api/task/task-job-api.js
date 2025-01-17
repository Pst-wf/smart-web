import {getRequest, postRequest} from '/src/lib/axios';

export const taskJobApi = {
    /**
     * 添加任务
     */
    addTaskJob: (param) => {
        return postRequest('/job/job/save', param);
    },

    /**
     * 更新任务
     */
    updateTaskJob: (param) => {
        return postRequest('/job/job/update', param);
    },

    /**
     * 删除任务
     */
    deleteTaskJob: (param) => {
        return postRequest('/job/job/delete', param);
    },

    /**
     * 任务分页列表
     * @param params
     */
    taskJobPage: (params) => {
        return getRequest('/job/job/page', params);
    },

    /**
     * 任务列表
     * @param params
     */
    taskJobList: (params) => {
        return getRequest('/job/job/list', params);
    },

    /**
     * 执行一次
     */
    triggerTaskJob: (param) => {
        return postRequest('/job/job/trigger', param);
    },


    /**
     * 启动
     */
    startTaskJob: (param) => {
        return postRequest('/job/job/start', param);
    },


    /**
     * 停止
     */
    stopTaskJob: (param) => {
        return postRequest('/job/job/stop', param);
    },

};
