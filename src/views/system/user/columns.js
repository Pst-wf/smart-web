/*
 *  菜单表格列
 */
import { ref } from 'vue';
export const columns = ref([
  {
    title: '姓名',
    dataIndex: 'nickname',
    key: 'ID',
    sorter: true
  },
  {
    title: '账号',
    dataIndex: 'username',
    sorter: true
  },
  {
    title: '电话',
    dataIndex: 'phone',
    sorter: true
  },
  {
    title: '身份信息',
    dataIndex: 'identityInfo',
    sorter: true
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
    width: 80,
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
    sorter: true
  },
]);

export const identityColumns = ref([
  {
    title: '组织机构',
    dataIndex: 'deptAncestors',
  },
  {
    title: '岗位',
    dataIndex: 'postId',
  },
  {
    title: '角色',
    dataIndex: 'roleId',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
  },
]);
