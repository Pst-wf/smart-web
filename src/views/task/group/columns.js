/*
 *  菜单表格列
 */
import { ref } from 'vue';
export const columns = ref([
  {
    title: '执行器',
    dataIndex: 'appName',
    key: 'ID',
    sorter: true
  },
  {
    title: '执行器名称',
    dataIndex: 'title',
    sorter: true
  },
  {
    title: '执行器类型',
    dataIndex: 'addressType',
    sorter: true
  },
  {
    title: '执行器地址列表',
    dataIndex: 'addressList',
    sorter: true
  },
  {
    title: '执行器状态',
    dataIndex: 'onlineStatus',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
  },
]);
