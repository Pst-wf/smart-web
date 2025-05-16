import {ref} from 'vue';

export const columns = ref([
  {
    title: '表名',
    dataIndex: 'tableName',
    key: 'ID',
    sorter: true,
  },
  {
    title: '实体名称',
    dataIndex: 'className',
    sorter: true,
  },
  {
    title: '实体描述',
    dataIndex: 'comments',
    sorter: true,
  },
  {
    title: '作者',
    dataIndex: 'functionAuthor',
    sorter: true,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
  },
]);

export const genColumns = ref([
  {
    title: '字段名称',
    dataIndex: 'columnName',
    width: 200,
  },
  {
    title: '字段描述',
    dataIndex: 'comments',
    width: 200,
  },
  {
    title: '属性名',
    dataIndex: 'attrName',
    width: 200,
  },
  {
    title: '是否必填',
    dataIndex: 'isNotNull',
    width: 100,
  },
  {
    title: '是否列表',
    dataIndex: 'isList',
    width: 100,
  },
  {
    title: '是否编辑',
    dataIndex: 'isForm',
    width: 100,
  },
  {
    title: '查询方式',
    dataIndex: 'queryType',
    width: 200,
  },
  {
    title: '组件',
    dataIndex: 'components',
    width: 200,
  },
  {
    title: '关联字典',
    dataIndex: 'dictCode',
    width: 200,
  },
  {
    title: '校验',
    dataIndex: 'validation',
    width: 200,
  },
]);
