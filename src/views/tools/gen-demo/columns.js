import { ref } from 'vue';

export const columns = ref([
  {
    title: '输入框',
    dataIndex: 'tableColumn1',
    sorter: true,
  },
  {
    title: '多行文本',
    dataIndex: 'tableColumn3',
    sorter: true,
  },
  {
    title: '选择框',
    dataIndex: 'tableColumn4',
    sorter: true,
  },
  {
    title: '级联选择',
    dataIndex: 'tableColumn5',
    sorter: true,
  },
  {
    title: '树形选择',
    dataIndex: 'tableColumn6',
    sorter: true,
  },
  {
    title: '复选框',
    dataIndex: 'tableColumn7',
    sorter: true,
  },
  {
    title: '单选框',
    dataIndex: 'tableColumn8',
    sorter: true,
  },
  {
    title: '日期选择',
    dataIndex: 'tableColumn9',
    sorter: true,
  },
  {
    title: '时间选择',
    dataIndex: 'tableColumn10',
    sorter: true,
  },
  {
    title: '开关',
    dataIndex: 'tableColumn11',
    sorter: true,
  },
  {
    title: '图片上传',
    dataIndex: 'tableColumn13',
    sorter: true,
  },
  {
    title: '数字框',
    dataIndex: 'tableColumn14',
    sorter: true,
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
    sorter: true,
    sortIndex: 'createUser',
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    sorter: true,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 150,
  },
]);
