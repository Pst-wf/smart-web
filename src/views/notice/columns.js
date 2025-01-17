import { ref } from 'vue';
export const columns = ref([
    {
        title: '标题',
        dataIndex: 'noticeTitle',
        sorter: true
    },
    {
        title: '类型',
        dataIndex: 'noticeType',
        sorter: true
    },
    {
        title: '类别',
        dataIndex: 'noticeCategory',
        sorter: true
    },
    {
        title: '创建人',
        dataIndex: 'createUserName',
        sorter: true,
        sortIndex: 'createUser'
    },
    {
        title: '创建时间',
        dataIndex: 'createDate',
        sorter: true
    },
    {
        title: '操作',
        dataIndex: 'operate',
        width: 200
    }
]);

export const recordColumns = ref([
    {
        title: '发布类型',
        dataIndex: 'releaseType',
        sorter: true
    },
    {
        title: '发布时间',
        dataIndex: 'releaseTime',
        sorter: true
    },
    {
        title: '操作',
        dataIndex: 'operate',
        width: 100
    }
]);
export const refColumns = ref([
    {
        title: '姓名',
        dataIndex: 'nickname',
        sorter: true
    },
    {
        title: '发送时间',
        dataIndex: 'sendTime',
        sorter: true
    },
    {
        title: '是否已读',
        dataIndex: 'isRead',
        sorter: true
    },
    {
        title: '阅读时间',
        dataIndex: 'readTime',
        sorter: true
    },
    {
        title: '是否撤销',
        dataIndex: 'isCancel',
        sorter: true
    },
    {
        title: '撤销时间',
        dataIndex: 'cancelTime',
        sorter: true
    },
    {
        title: '操作',
        dataIndex: 'operate',
        width: 100
    }
]);
