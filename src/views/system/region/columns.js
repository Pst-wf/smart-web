import { ref } from 'vue';
export const columns = ref([
  {
    title: '名称',
    dataIndex: 'name',
    width: 500
  },
  {
    title: '级别',
    dataIndex: 'level',
    width: 100
  },
  {
    title: '行政编号',
    dataIndex: 'areaCode',
    width: 200
  },
  {
    title: '经度',
    dataIndex: 'lng',
    width: 200
  },
  {
    title: '纬度',
    dataIndex: 'lat',
    width: 200
  },
  {
    title: '启用状态',
    dataIndex: 'status',
    width: 200
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 150,
  },
]);
