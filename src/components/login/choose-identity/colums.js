import {ref} from 'vue';

export const columns = ref([
    {
        title: '公司',
        dataIndex: 'organizationName',
        key: 'ID',
    },
    {
        title: '部门',
        dataIndex: 'deptName',
    },
    {
        title: '岗位',
        dataIndex: 'postName',
    },
    {
        title: '角色',
        dataIndex: 'roleName',
    }
]);
