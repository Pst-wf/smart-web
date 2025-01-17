export const OPERATE_TYPE_COLOR_ENUM = {
    approve: {
        value: 'approve',
        color: '#2080f0',
        label: '同意',
    },
    reject: {
        value: 'reject',
        color: '#f5222d',
        label: '驳回',
    },
    rejectFirst: {
        value: 'rejectFirst',
        color: '#faad14',
        label: '退回',
    },
    stop: {
        value: 'stop',
        color: '#bc72ab',
        label: '终止',
    },
    addAssignee: {
        value: 'addAssignee',
        color: '#52c41a',
        label: '加签',
    },
    removeAssignee: {
        value: 'removeAssignee',
        color: '#b93232',
        label: '减签',
    },
    transfer: {
        value: 'transfer',
        color: '#13d7b1',
        label: '转办',
    },
    delegate: {
        value: 'delegate',
        color: '#802bb1',
        label: '委托',
    },
    resolve: {
        value: 'resolve',
        color: '#1a8a81',
        label: '解决',
    },
    getBack: {
        value: 'delegate',
        color: '#c0bb20',
        label: '拿回',
    }
};

export const DELEGATION_STATE_ENUM = {
    PENDING: {
        value: 'PENDING',
        color: 'red',
        label: '委托中',
    },
    RESOLVED: {
        value: 'RESOLVED',
        color: 'green',
        label: '已解决',
    },
};
export default {
    OPERATE_TYPE_COLOR_ENUM,
    DELEGATION_STATE_ENUM
};
