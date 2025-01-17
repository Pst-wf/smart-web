import {getRequest, postRequest, postRequestBlob} from '/src/lib/axios';

export const genTableApi = {
    /**
     * 添加代码生成
     */
    addGenTable: (param) => {
        return postRequest('/gen/genTable/save', param);
    },

    /**
     * 更新代码生成
     */
    updateGenTable: (param) => {
        return postRequest('/gen/genTable/update', param);
    },

    /**
     * 删除代码生成
     */
    deleteGenTable: (param) => {
        return postRequest('/gen/genTable/delete', param);
    },

    /**
     * 代码生成分页列表
     * @param params
     */
    genTablePage: (params) => {
        return getRequest('/gen/genTable/page', params);
    },

    /**
     * 代码生成列表
     * @param params
     */
    genTableList: (params) => {
        return getRequest('/gen/genTable/list', params);
    },

    /**
     * 代码生成详情
     * @param params
     */
    getGenTable: (params) => {
        return getRequest('/gen/genTable/get', params);
    },

    /**
     * 获取表信息
     */
    findTables: () => {
        return getRequest('/gen/genTable/findTables');
    },

    /**
     * 获取字段列表页
     */
    getGenTableColumn: (params) => {
        return getRequest('/gen/genTableColumn/list', params);
    },

    /**
     * 获取数据库字段
     */
    findColumns: (params) => {
        return getRequest('/gen/genTableColumn/findColumns', params);
    },

    /**
     * 预览
     */
    preview: (params) => {
        return getRequest('/gen/genTable/previewCode', params);
    },

    /**
     * 生成代码
     */
    generateCode: (params) => {
        return postRequestBlob('/gen/genTable/code', params);
    }
};
