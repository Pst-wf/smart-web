/*
 *  菜单表格列
 */
import { ref } from 'vue';
export const columns = ref([
  {
    title: '名称',
    dataIndex: 'fileName',
    key: 'ID',
  },
  {
    title: '大小',
    dataIndex: 'fileSize',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
  },
]);
