import {getRequest, postRequest} from '/src/lib/axios';

export const messageApi = {
    /**
     * 获取消息分页
     */
    messagePage: (param) => {
        return getRequest('/message/messageUser/page', param);
    },
    /**
     * 获取发件箱分页
     */
    sendPage: (param) => {
        return getRequest('/message/message/page', param);
    },
    /**
     * 获取回收站-发件箱分页
     */
    collectionPage: (param) => {
        return getRequest('/message/message/collectionPage', param);
    },
    /**
     * 获取消息详情
     */
    getMessage: (param) => {
        return getRequest('/message/message/get', param);
    },
    /**
     * 查看消息
     */
    viewMessage: (param) => {
        return getRequest('/message/message/view', param);
    },
    /**
     * 未读消息数量
     */
    messageCount: (param) => {
        return getRequest('/message/messageUser/messageCount', param);
    },
    /**
     * 删除消息
     */
    updateMessageDeletedStatus: (param) => {
        return postRequest('/message/messageUser/updateMessageDeletedStatus', param);
    },
    /**
     * 彻底删除消息
     */
    deleteMessage: (param) => {
        return postRequest('/message/messageUser/delete', param);
    },
    /**
     * 标记已读
     */
    setRead: (param) => {
        return postRequest('/message/messageUser/setRead', param);
    },
    /**
     * 保存
     */
    saveMessage: (param) => {
        return postRequest('/message/message/save', param);
    },
    /**
     * 修改
     */
    updateMessage: (param) => {
        return postRequest('/message/message/update', param);
    },
    /**
     * 发送
     */
    sendMessage: (param) => {
        return postRequest('/message/message/sendMessage', param);
    },
    /**
     * 删除消息
     */
    updateDeletedValue: (param) => {
        return postRequest('/message/message/updateDeletedValue', param);
    },
    /**
     * 彻底删除消息
     */
    realDeleteSendMessage: (param) => {
        return postRequest('/message/message/delete', param);
    },
};
