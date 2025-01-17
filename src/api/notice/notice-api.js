import {getRequest, getRequestBlob, postRequest, postRequestBlob} from '/src/lib/axios';

export const noticeApi = {
    /**
     * 添加通知公告
     */
    addNotice: (param) => {
        return postRequest('/message/notice/save', param);
    },

    /**
     * 更新通知公告
     */
    updateNotice: (param) => {
        return postRequest('/message/notice/update', param);
    },

    /**
     * 删除通知公告
     */
    deleteNotice: (param) => {
        return postRequest('/message/notice/delete', param);
    },

    /**
     * 通知公告分页列表
     */
    noticePage: (params) => {
        return getRequest('/message/notice/page', params);
    },

    /**
     * 通知公告列表
     */
    noticeList: (params) => {
        return getRequest('/message/notice/list', params);
    },

    /**
     * 通知公告详情
     */
    getNotice: (params) => {
        return getRequest('/message/notice/get', params);
    },

    /**
     * 导出数据
     * @param params
     */
    exportNoticeData: (params) => {
        return postRequestBlob('/message/notice/export', params);
    },

    /**
     * 下载导入模板
     */
    downloadNoticeTemplate: () => {
        return getRequestBlob('/message/notice/downloadTemplate');
    },
    /** 发布通知公告 */
    publishNotice(params) {
        return postRequest('/message/noticeRecord/save', params);
    },
    /**
     * 通知公告发布记录
     */
    noticeRecordPage: (params) => {
        return getRequest('/message/noticeRecord/page', params);
    },
    /**
     * 删除通知公告发布记录
     */
    deleteNoticeRecord: (param) => {
        return postRequest('/message/noticeRecord/delete', param);
    },
    /**
     * 获取通知公告用户
     */
    noticeRefPage: (params) => {
        return getRequest('/message/noticeRef/page', params);
    },
    /**
     * 标记已读通知公告用户
     */
    readNoticeRef: (param) => {
        return postRequest('/message/noticeRef/read', param);
    },
    /**
     * 撤销通知公告用户
     */
    cancelNoticeRef: (param) => {
        return postRequest('/message/noticeRef/cancel', param);
    },
    /**
     * 删除通知公告用户
     */
    deleteNoticeRef: (param) => {
        return postRequest('/message/noticeRef/delete', param);
    },
    /**
     * 获取用户接收的通知公告
     */
    noticeRefPageForUser: (params) => {
        return getRequest('/message/noticeRef/pageForUser', params);
    },

    /**
     * 用户删除通知公告
     */
    deleteNoticeByUser: (param) => {
        return postRequest('/message/noticeRef/deleteByUser', param);
    },
};
