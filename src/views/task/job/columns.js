/*
 *  菜单表格列
 */
import { ref } from 'vue';
export const columns = ref([
  {
    title: '任务描述',
    dataIndex: 'jobDesc',
    key: 'ID',
    sorter: true
  },
  {
    title: '执行器',
    dataIndex: 'groupName',
    sorter: true
  },
  {
    title: '任务处理器',
    dataIndex: 'executorHandler',
    sorter: true
  },
  {
    title: '调度类型',
    dataIndex: 'scheduleType',
    sorter: true
  },
  {
    title: '调度配置',
    dataIndex: 'scheduleConf',
    sorter: true
  },
  {
    title: '调度状态',
    dataIndex: 'triggerStatus',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
  },
]);
