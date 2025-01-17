import {getRequest, postRequest} from '/src/lib/axios';

export const dictApi = {
    /**
     * 添加字典
     */
    addDict: (param) => {
        return postRequest('/system/dict/save', param);
    },

    /**
     * 更新字典
     */
    updateDict: (param) => {
        return postRequest('/system/dict/update', param);
    },

    /**
     * 删除字典
     */
    deleteDict: (param) => {
        return postRequest('/system/dict/delete', param);
    },

    /**
     * 字典分页列表
     * @param params
     */
    dictPage: (params) => {
        return getRequest('/system/dict/page', params);
    },

    /**
     * 字典列表
     * @param params
     */
    dictList: (params) => {
        return getRequest('/system/dict/list', params);
    },
    /**
     * 字典值
     * @param params
     */
    dictValues: (params) => {
        return getRequest('/system/dict/values', params);
    },
    /**
     * 获取字典
     * @param params
     */
    getDictByCodes: (params) => {
        if (params && params.length > 0) {
            return getRequest('/system/dict/getDictByCodes', {codes: params.join(",")});
        }
    },

};
