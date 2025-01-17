/*
 *  菜单表格列
 */
import { ref } from 'vue';
export const columns = ref([
  {
    title: '键',
    dataIndex: 'name',
    width: 500,
    ellipsis: true,
    align: 'left'
  },
  {
    title: '数据类型',
    dataIndex: 'dataType',
    width: 100,
    align: 'left'
  },
  {
    title: '有效期',
    dataIndex: 'expire',
    width: 200,
    align: 'left'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
    align: 'left'
  },
]);
