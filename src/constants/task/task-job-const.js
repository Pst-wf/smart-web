export const SCHEDULE_TYPE_ENUM = {
    NONE: {
        value: 'NONE',
        desc: '无',
    },
    CRON: {
        value: 'CRON',
        desc: 'Cron',
    },
    FIX_RATE: {
        value: 'FIX_RATE',
        desc: '固定速度',
    }
};

export const SCHEDULE_CONF_ENUM = {
    PLACEHOLDER1: {
        value: 'NONE',
        desc: '',
    },
    PLACEHOLDER2: {
        value: 'CRON',
        desc: '请输入cron表达式',
    },
    PLACEHOLDER3: {
        value: 'FIX_RATE',
        desc: '请输入（秒）',
    }
};

export const TRIGGER_STATUS_ENUM = {
    STOP: {
        value: 0,
        desc: '停止',
    },
    RUN: {
        value: 1,
        desc: '启动',
    }
};

export const GLUE_TYPE_ENUM = {
    BEAN: {
        value: 'BEAN',
        desc: 'BEAN'
    }
};
export const EXECUTOR_ROUTE_STRATEGY_ENUM = {
    FIRST: {
        value: 'FIRST',
        desc: '第一个',
    },
    LAST: {
        value: 'LAST',
        desc: '最后一个',
    },
    ROUND: {
        value: 'ROUND',
        desc: '轮询',
    },
    RANDOM: {
        value: 'RANDOM',
        desc: '随机',
    },
    CONSISTENT_HASH: {
        value: 'CONSISTENT_HASH',
        desc: '一致性HASH',
    },
    LEAST_FREQUENTLY_USED: {
        value: 'LEAST_FREQUENTLY_USED',
        desc: '最不经常使用',
    },
    LEAST_RECENTLY_USED: {
        value: 'LEAST_RECENTLY_USED',
        desc: '最近最久未使用',
    },
    FAILOVER: {
        value: 'FAILOVER',
        desc: '故障转移',
    },
    BUSYOVER: {
        value: 'BUSYOVER',
        desc: '忙碌转移',
    },
    SHARDING_BROADCAST: {
        value: 'SHARDING_BROADCAST',
        desc: '分片广播',
    },
};

export const MISFIRE_STRATEGY_ENUM = {
    DO_NOTHING: {
        value: 'DO_NOTHING',
        desc: '忽略'
    },
    FIRE_ONCE_NOW: {
        value: 'FIRE_ONCE_NOW',
        desc: '立即执行一次'
    }
};

export const EXECUTOR_BLOCK_STRATEGY_ENUM = {
    SERIAL_EXECUTION: {
        value: 'SERIAL_EXECUTION',
        desc: '单机串行'
    },
    DISCARD_LATER: {
        value: 'DISCARD_LATER',
        desc: '丢弃后续调度'
    },
    COVER_EARLY: {
        value: 'COVER_EARLY',
        desc: '覆盖之前调度'
    }
};

export default {
    SCHEDULE_TYPE_ENUM,
    SCHEDULE_CONF_ENUM,
    TRIGGER_STATUS_ENUM,
    GLUE_TYPE_ENUM,
    EXECUTOR_ROUTE_STRATEGY_ENUM,
    MISFIRE_STRATEGY_ENUM,
    EXECUTOR_BLOCK_STRATEGY_ENUM,
};
