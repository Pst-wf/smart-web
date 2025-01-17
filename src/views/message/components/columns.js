import {ref} from 'vue';

export const columns = ref([
    {
        title: '标题',
        dataIndex: 'message',
        width: '800px',
        ellipsis: true,
        sorter: true,
        sortIndex: 'message_id'
    },
    {
        title: '状态',
        dataIndex: 'isRead',
        sorter: true
    },
    {
        title: '发件人',
        dataIndex: 'sendUserName',
        sorter: true
    },
    {
        title: '发送时间',
        dataIndex: 'sendTime',
        sorter: true
    }
]);

export const outColumns = ref([
    {
        title: '标题',
        dataIndex: 'messageTitle',
        width: '800px',
        ellipsis: true,
        sorter: true
    },
    {
        title: '收件人',
        dataIndex: 'receiveUserNames'
    },
    {
        title: '是否同步发送网络邮箱',
        dataIndex: 'isToMail',
        sorter: true
    },
    {
        title: '发送时间',
        dataIndex: 'sendTime',
        sorter: true
    }
]);
export const draftColumns = ref([
    {
        title: '标题',
        dataIndex: 'messageTitle',
        width: '800px',
        ellipsis: true,
        sorter: true
    },
    {
        title: '收件人',
        dataIndex: 'receiveUserNames'
    },
    {
        title: '创建时间',
        dataIndex: 'createDate',
        sorter: true
    },
    {
        title: '操作',
        dataIndex: 'operate',
        width: 100
    }
]);

export const inCollectionColumns = ref([
    {
        title: '标题',
        dataIndex: 'message',
        width: '800px',
        ellipsis: true,
        sorter: true,
        sortIndex: 'message_id'
    },
    {
        title: '状态',
        dataIndex: 'isRead',
        sorter: true
    },
    {
        title: '发件人',
        dataIndex: 'sendUserName',
        sorter: true
    },
    {
        title: '发送时间',
        dataIndex: 'sendTime',
        sorter: true
    }
]);
export const outCollectionColumns = ref([
    {
        title: '标题',
        dataIndex: 'messageTitle',
        width: '800px',
        ellipsis: true,
        sorter: true
    },
    {
        title: '收件人',
        dataIndex: 'receiveUserNames'
    },
    {
        title: '是否同步发送网络邮箱',
        dataIndex: 'isToMail',
        sorter: true
    },
    {
        title: '发送时间',
        dataIndex: 'sendTime',
        sorter: true
    }
]);
