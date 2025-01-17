/*
 *  通知公告表格列
 */
import { ref } from 'vue';
export const columns = ref([
    {
        title: '标题',
        dataIndex: 'noticeTitle',
        sorter: true,
        sortIndex: 'notice_title'
    },
    {
        title: '类型',
        dataIndex: 'noticeType',
        sorter: true,
        sortIndex: 'notice_type'
    },
    {
        title: '类别',
        dataIndex: 'noticeCategory',
        sorter: true,
        sortIndex: 'notice_category'
    },
    {
        title: '状态',
        dataIndex: 'isRead',
        sorter: true
    },
    {
        title: '发送人',
        dataIndex: 'sendUsername',
        sorter: true,
        sortIndex: 'send_username'
    },
    {
        title: '发送时间',
        dataIndex: 'sendTime',
        sorter: true
    },
    {
        title: '操作',
        dataIndex: 'operate',
        width: 100
    }
]);
