export const OPERATE_LOG_TYPE_ENUM = {
    ADD: {
        value: 'add',
        desc: '新增',
    },
    UPDATE: {
        value: 'update',
        desc: '修改',
    },
    DELETE: {
        value: 'delete',
        desc: '删除',
    }
};

export const LOGIN_LOG_GRANT_TYPE_ENUM = {
    PASSWORD: {
        value: 'password',
        desc: '密码登录',
    },
    WECHAT_CODE: {
        value: 'wechat_code',
        desc: '微信登陆',
    },
    CODE: {
        value: 'code',
        desc: 'code登录',
    },
};

export default {
    OPERATE_LOG_TYPE_ENUM,
    LOGIN_LOG_GRANT_TYPE_ENUM
};
