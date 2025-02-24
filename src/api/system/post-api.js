import {getRequest, postRequest} from '/src/lib/axios';

export const postApi = {
    /**
     * 添加岗位
     */
    addPost: (param) => {
        return postRequest('/system/post/save', param);
    },

    /**
     * 更新岗位
     */
    updatePost: (param) => {
        return postRequest('/system/post/update', param);
    },

    /**
     * 删除岗位
     */
    deletePost: (param) => {
        return postRequest('/system/post/delete', param);
    },

    /**
     * 岗位分页列表
     * @param params
     */
    postPage: (params) => {
        return getRequest('/system/post/page', params);
    },

    /**
     * 岗位列表
     * @param params
     */
    postList: (params) => {
        return getRequest('/system/post/list', params);
    },
    /**
     * 修改状态
     * @param params
     */
    updateStatus: (params) => {
        return postRequest('/system/post/updateStatus', params);
    },
};
