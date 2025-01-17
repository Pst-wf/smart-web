import {getRequest, postRequest} from '/src/lib/axios';

export const configApi = {
    /**
     * 添加参数配置
     */
    addConfig: (param) => {
        return postRequest('/system/config/save', param);
    },

    /**
     * 更新参数配置
     */
    updateConfig: (param) => {
        return postRequest('/system/config/update', param);
    },

    /**
     * 删除参数配置
     */
    deleteConfig: (param) => {
        return postRequest('/system/config/delete', param);
    },

    /**
     * 参数配置分页列表
     * @param params
     */
    configPage: (params) => {
        return getRequest('/system/config/page', params);
    },

    /**
     * 参数配置列表
     * @param params
     */
    configList: (params) => {
        return getRequest('/system/config/list', params);
    },
    /**
     * 获取配置
     * @param params
     */
    getConfigByKeys: (params) => {
        return getRequest('/system/config/getConfigByKeys', params);
    },

    /** 获取系统参数Map */
    systemConfigMap() {
        return getRequest('/system/config/getSystemConfigMap',);
    },
    /**
     * 通过key修改
     */
    updateByKey: (param) => {
        return postRequest('/system/config/updateByKey', param);
    },
    /** 获取Token有效期 */
    getTokenExpiration() {
        return getRequest('/system/config/getTokenExpiration',);
    },
    /**
     * 通过key修改Token有效期
     */
    updateTokenByKey: (param) => {
        return postRequest('/system/config/updateTokenByKey', param);
    },
};
