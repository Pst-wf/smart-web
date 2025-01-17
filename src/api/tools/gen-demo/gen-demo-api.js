import {getRequest, postRequest, getRequestBlob, postRequestBlob} from '/src/lib/axios';

export const genDemoApi = {
    /**
     * 添加生成案例
     */
    addGenDemo: (param) => {
        return postRequest('/gen/genDemo/save', param);
    },

    /**
     * 更新生成案例
     */
    updateGenDemo: (param) => {
        return postRequest('/gen/genDemo/update', param);
    },

    /**
     * 删除生成案例
     */
    deleteGenDemo: (param) => {
        return postRequest('/gen/genDemo/delete', param);
    },

    /**
     * 生成案例分页列表
     */
    genDemoPage: (params) => {
        return getRequest('/gen/genDemo/page', params);
    },

    /**
     * 生成案例列表
     */
    genDemoList: (params) => {
        return getRequest('/gen/genDemo/list', params);
    },

    /**
     * 生成案例详情
     */
    getGenDemo: (params) => {
        return getRequest('/gen/genDemo/get', params);
    },

    /**
     * 导出数据
     * @param params
     */
    exportGenDemoData: (params) => {
        return postRequestBlob('/gen/genDemo/export', params);
    },

    /**
     * 下载导入模板
     */
    downloadGenDemoTemplate: () => {
        return getRequestBlob('/gen/genDemo/downloadTemplate');
    }
};
