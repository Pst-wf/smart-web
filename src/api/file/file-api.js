import {getRequest, getRequestBlob, postRequest} from '/src/lib/axios';

export const fileApi = {
    /**
     * 添加文件
     */
    addFile: (param) => {
        return postRequest('/file/save', param);
    },

    /**
     * 更新文件
     */
    updateFile: (param) => {
        return postRequest('/file/update', param);
    },

    /**
     * 删除文件
     */
    deleteFile: (param) => {
        return postRequest('/file/delete', param);
    },

    /**
     * 文件分页列表
     * @param params
     */
    filePage: (params) => {
        return getRequest('/file/page', params);
    },

    /**
     * 文件列表
     * @param params
     */
    fileList: (params) => {
        return getRequest('/file/list', params);
    },

    /**
     * 下载
     */
    downloadFile: (params) => {
        return getRequestBlob('/file/download', params);
    },

    /**
     * 上传
     */
    uploadFile: (params) => {
        return postRequest('/file/upload', params);
    }
};
