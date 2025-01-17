/*
 *  菜单表格列
 */
import { ref } from 'vue';
export const columns = ref([
  {
    title: '异常编码',
    dataIndex: 'errorId',
    key: 'ID',
    sorter: true
  },
  {
    title: '异常类型',
    dataIndex: 'exceptionClass',
    sorter: true
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    sorter: true
  },
  {
    title: '操作人名称',
    dataIndex: 'userNickname',
    sorter: true
  },
  {
    title: '操作人账号',
    dataIndex: 'username',
    sorter: true
  },
  {
    title: '操作时间',
    dataIndex: 'createDate',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200
  },
]);
