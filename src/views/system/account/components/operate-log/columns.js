/*
 *  菜单表格列
 */
import { ref } from 'vue';
export const columns = ref([
  {
    title: '模块',
    dataIndex: 'logModule',
    key: 'ID',
    sorter: true
  },
  {
    title: '类型',
    dataIndex: 'logType',
    sorter: true
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
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
    width: 200,
  },
]);
