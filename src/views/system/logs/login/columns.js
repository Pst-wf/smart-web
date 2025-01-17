/*
 *  菜单表格列2
 */
import { ref } from 'vue';
export const columns = ref([
  {
    title: '登陆人',
    dataIndex: 'userNickname',
    key: 'ID',
    sorter: true
  },
  {
    title: '登陆人账号',
    dataIndex: 'username',
    sorter: true
  },
  {
    title: '登陆方式',
    dataIndex: 'grantType',
    sorter: true
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    sorter: true
  },
  {
    title: '登录时间',
    dataIndex: 'createDate',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200
  },
]);
