/*
 *  菜单表格列
 */
import { ref } from 'vue';
export const columns = ref([
  {
    title: '岗位名称',
    dataIndex: 'postName',
    key: 'ID',
    sorter: true
  },
  {
    title: '岗位编码',
    dataIndex: 'postCode',
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
