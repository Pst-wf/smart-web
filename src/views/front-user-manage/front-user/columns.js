import { ref } from 'vue';
export const columns = ref([
    {
        title: '用户昵称',
        dataIndex: 'nickname',
        sorter: true
    },
    {
        title: '头像',
        dataIndex: 'avatar',
        sorter: true
    },
    {
        title: '联系电话',
        dataIndex: 'phone',
        sorter: true
    },
    {
        title: '性别',
        dataIndex: 'gender',
        sorter: true
    },
    {
        title: '注册时间',
        dataIndex: 'createDate',
        sorter: true
    },
    {
        title: '状态',
        dataIndex: 'userStatus',
        sorter: true
    },
    {
        title: '操作',
        dataIndex: 'operate',
        width: 200
    }
]);
