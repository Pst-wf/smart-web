/*
 *  菜单表格列
 */
import { ref } from 'vue';
export const columns = ref([
  {
    title: '机构名称',
    dataIndex: 'deptName',
    key: 'ID',
    sorter: true
  },
  {
    title: '机构编号',
    dataIndex: 'deptCode',
    sorter: true
  },
  {
    title: '机构类型',
    dataIndex: 'deptType',
    sorter: true
  },
  {
    title: '排序',
    dataIndex: 'sort',
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
