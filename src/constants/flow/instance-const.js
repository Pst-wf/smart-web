export const INSTANCE_STATE_ENUM = {
    ACTIVE: {
        value: 'ACTIVE',
        color: 'blue',
        label: '运行中',
    },
    SUSPENDED: {
        value: 'SUSPENDED',
        color: 'red',
        label: '已挂起',
    },
    COMPLETED: {
        value: 'COMPLETED',
        color: 'green',
        label: '已完成',
    },
    EXTERNALLY_TERMINATED: {
        value: 'EXTERNALLY_TERMINATED',
        color: 'orange',
        label: '外部终止',
    },
    INTERNALLY_TERMINATED: {
        value: 'INTERNALLY_TERMINATED',
        color: 'orange',
        label: '内部终止',
    }
};

export const SUSPENSION_STATE_ENUM = {
    "1": {
        value: '1',
        color: 'green',
        label: '激活',
    },
    "2": {
        value: '2',
        color: 'red',
        label: '挂起',
    },
};
export default {
    INSTANCE_STATE_ENUM,
    SUSPENSION_STATE_ENUM
};
