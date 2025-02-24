/*
 *  菜单表格列
 */
import { ref } from 'vue';
export const columns = ref([
  {
    title: '机构名称',
    dataIndex: 'deptName',
    key: 'ID',
    width: 500,
    sorter: true
  },
  {
    title: '机构编号',
    dataIndex: 'deptCode',
    width: 300,
    sorter: true
  },
  {
    title: '机构类型',
    dataIndex: 'deptType',
    width: 200,
    sorter: true
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 100,
    sorter: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
  },
]);
