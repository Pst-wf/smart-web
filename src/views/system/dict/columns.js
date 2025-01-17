import { ref } from 'vue';
export const columns = ref([
  {
    title: '字典名称',
    dataIndex: 'dictName',
    key: 'ID',
    sorter: true
  },
  {
    title: '字典编码',
    dataIndex: 'dictCode',
    sorter: true
  },
  {
    title: '排序',
    dataIndex: 'sort',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
  },
]);
