import { ref } from 'vue';
export const columns = ref([
  {
    title: '键',
    dataIndex: 'configKey',
    key: 'ID',
    sorter: true
  },
  {
    title: '值',
    dataIndex: 'configValue',
    sorter: true
  },
  {
    title: '描述',
    dataIndex: 'configDesc',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
  },
]);
