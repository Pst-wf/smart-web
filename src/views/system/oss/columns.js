import { ref } from 'vue';
export const columns = ref([
  {
    title: '存储类型',
    dataIndex: 'ossType',
    key: 'ID',
    sorter: true
  },
  {
    title: '地址',
    dataIndex: 'ossHost',
    sorter: true
  },
  {
    title: '桶名/访问相对路径',
    dataIndex: 'bucket',
    sorter: true
  },
  {
    title: '目录',
    dataIndex: 'ossDir',
    sorter: true
  },
  {
    title: '地区',
    dataIndex: 'region',
    sorter: true
  },
  {
    title: '状态',
    dataIndex: 'ossStatus',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
  },
]);
