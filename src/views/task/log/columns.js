/*
 *  菜单表格列
 */
import { ref } from 'vue';
export const columns = ref([
  {
    title: '执行器',
    dataIndex: 'groupName',
    key: 'ID',
    sorter: true
  },
  {
    title: '任务',
    dataIndex: 'jobName',
    sorter: true
  },
  {
    title: '本次执行的地址',
    dataIndex: 'executorAddress',
    sorter: true
  },
  {
    title: '调度时间',
    dataIndex: 'triggerTime',
    sorter: true
  },
  {
    title: '调度结果',
    dataIndex: 'triggerCode',
    sorter: true
  },
  {
    title: '调度日志',
    dataIndex: 'triggerMsg',
    sorter: true
  },
  {
    title: '执行时间',
    dataIndex: 'handleTime',
    sorter: true
  },
  {
    title: '执行状态',
    dataIndex: 'handleCode',
    sorter: true
  },
  {
    title: '执行日志',
    dataIndex: 'handleMsg',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
  },
]);
