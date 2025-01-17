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
    title: '路由名称',
    dataIndex: 'routeName',
    ellipsis: true,
    sorter: true
  },
  {
    title: '路由地址',
    dataIndex: 'routePath',
    ellipsis: true,
  },
  {
    title: '菜单状态',
    dataIndex: 'status',
    width: 100,
    sorter: true
  },
  {
    title: '隐藏菜单',
    dataIndex: 'hideInMenu',
    width: 100,
    sorter: true
  },
  {
    title: '顺序',
    dataIndex: 'order',
    width: 80,
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
  },
]);
