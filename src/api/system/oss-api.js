import {getRequest, postRequest} from '/src/lib/axios';

export const ossApi = {
    /**
     * 添加存储配置
     */
    addOss: (param) => {
        return postRequest('/system/oss/save', param);
    },

    /**
     * 更新存储配置
     */
    updateOss: (param) => {
        return postRequest('/system/oss/update', param);
    },

    /**
     * 删除存储配置
     */
    deleteOss: (param) => {
        return postRequest('/system/oss/delete', param);
    },

    /**
     * 存储配置分页列表
     * @param params
     */
    ossPage: (params) => {
        return getRequest('/system/oss/page', params);
    },

    /**
     * 存储配置列表
     * @param params
     */
    ossList: (params) => {
        return getRequest('/system/oss/list', params);
    },

    /**
     * 修改状态
     */
    updateOssStatus: (param) => {
        return postRequest('/system/oss/updateOssStatus', param);
    },
};
