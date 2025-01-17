/*
 *  菜单表格列
 */
import { ref } from 'vue';
export const columns = ref([
  {
    title: '文件名称',
    dataIndex: 'fileName',
    key: 'ID',
    sorter: true,
  },
  {
    title: '文件地址',
    dataIndex: 'filePath',
    sorter: true,
  },
  {
    title: '文件大小',
    dataIndex: 'fileSize',
    sorter: true,
  },
  {
    title: '上传方式',
    dataIndex: 'uploadType',
    sorter: true,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
  },
]);
