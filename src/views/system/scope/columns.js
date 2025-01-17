/*
 *  菜单表格列
 */
import { ref } from 'vue';
export const columns = ref([
  {
    title: '名称',
    dataIndex: 'menuName',
    key: 'ID',
    width: 300,
    sorter: true
  },
  {
    title: '类型',
    dataIndex: 'menuType',
    width: 80,
    sorter: true
  },
  {
    title: '图标',
    dataIndex: 'antIcon',
    width: 80,
    sorter: true
  },
  {
    title: '菜单状态',
    dataIndex: 'status',
    width: 80,
    sorter: true
  },
  {
    title: '隐藏菜单',
    dataIndex: 'hideInMenu',
    width: 80,
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
  },
]);

export const scopeColumns = ref([
  {
    title: '数据权限名称',
    dataIndex: 'scopeName',
    key: 'ID',
  },
  {
    title: '数据权限字段',
    dataIndex: 'scopeField',
  },
  {
    title: '数据权限类名',
    dataIndex: 'scopeClass',
  },
  {
    title: '数据权限类型',
    dataIndex: 'scopeType',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
  },
]);
