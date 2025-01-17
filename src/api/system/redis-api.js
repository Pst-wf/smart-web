import {getRequest, postRequest} from '/src/lib/axios';

export const redisApi = {

    /**
     * 缓存列表
     * @param params
     */
    redisQuery(params) {
        return getRequest('/system/redis/query', params);
    },
    /**
     * 查询缓存
     * @param params
     */
    getRedis(params) {
        return getRequest('/system/redis/get', params);
    },

    /**
     * 新增/修改缓存
     */
    saveOrUpdateRedis: (param) => {
        return postRequest('/system/redis/saveOrUpdate', param);
    },

    /**
     * 删除缓存
     */
    deleteRedis: (param) => {
        return postRequest('/system/redis/delete', param);
    }
};
