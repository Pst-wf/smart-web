<template>
  <div>
    <a-form class="smart-query-form">
      <a-row class="smart-query-form-row">
        <a-form-item label="执行器" class="smart-query-form-item">
          <a-input style="width: 300px" v-model:value="queryForm.groupName" placeholder="请输入执行器" allowClear />
        </a-form-item>
        <a-form-item label="任务描述" class="smart-query-form-item">
          <a-input style="width: 300px" v-model:value="queryForm.jobDesc" placeholder="请输入任务描述" allowClear />
        </a-form-item>
        <a-form-item class="smart-query-form-item smart-margin-left10">
          <a-button-group>
            <a-button type="primary" @click="toFirstPage">
              <template #icon>
                <SearchOutlined />
              </template>
              查询
            </a-button>
            <a-button @click="resetQuery">
              <template #icon>
                <ReloadOutlined />
              </template>
              重置
            </a-button>
          </a-button-group>
        </a-form-item>
      </a-row>
    </a-form>
    <a-card size="small" :bordered="false" :hoverable="true">
      <a-row class="smart-table-btn-block">
        <div class="smart-table-operate-block">
          <a-button v-privilege="'job:add'" type="primary" @click="showDrawer">
            <template #icon>
              <PlusOutlined />
            </template>
            新增
          </a-button>
          <a-button v-privilege="'job:delete'" type="primary" danger @click="batchDelete" :disabled="!hasSelected">
            <template #icon>
              <DeleteOutlined />
            </template>
            批量删除
          </a-button>
        </div>
        <div class="smart-table-setting-block">
          <TableOperator v-model="columns" :refresh="query" />
        </div>
      </a-row>
      <a-table
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        size="small"
        :defaultExpandAllRows="true"
        :dataSource="tableData"
        bordered
        :columns="columns"
        :loading="tableLoading"
        rowKey="id"
        :pagination="false"
        @change="(pagination, filters, sorter) => $sorterChange(() => query(), sorter, queryForm, columns)"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.dataIndex === 'scheduleType'">
            <a-tag :color="text === 'CRON' ? 'blue' : text === 'FIX_RATE' ? 'green' : 'red'">
              {{ $smartEnumPlugin.getDescByValue('SCHEDULE_TYPE_ENUM', text) }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'triggerStatus'">
            <a-tag :color="text === 1 ? 'blue' : 'red'">{{ $smartEnumPlugin.getDescByValue('TRIGGER_STATUS_ENUM', text) }} </a-tag>
          </template>
          <template v-if="column.dataIndex === 'operate'">
            <div class="smart-table-operate">
              <a-button type="link" size="small" @click="showDrawer(record, 'edit', true)">查看</a-button>
              <a-button v-privilege="'job:update'" type="link" size="small" @click="showDrawer(record, 'edit')">编辑 </a-button>
              <a-button v-privilege="'job:delete'" danger type="link" @click="singleDelete(record)">删除</a-button>
              <a-dropdown placement="bottomLeft">
                <a-button style="color: #4ab844" type="link">更多</a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a-button v-privilege="'job:trigger'" type="link" style="color: #1e1e1e" size="small" @click="showDrawer(record, 'trigger')">
                        执行一次
                      </a-button>
                    </a-menu-item>
                    <a-menu-item>
                      <a-button type="link" style="color: #1e1e1e" size="small" @click="viewLogs(record)">查看日志 </a-button>
                    </a-menu-item>
                    <a-menu-item>
                      <a-button type="link" style="color: #1e1e1e" size="small" @click="showModal(record)">注册节点 </a-button>
                    </a-menu-item>
                    <a-menu-item>
                      <a-button v-privilege="'job:start'" type="link" style="color: #1e1e1e" size="small" @click="start(record)">启动 </a-button>
                    </a-menu-item>
                    <a-menu-item>
                      <a-button v-privilege="'job:stop'" type="link" style="color: #1e1e1e" size="small" @click="stop(record)">停止 </a-button>
                    </a-menu-item>
                    <a-menu-item>
                      <a-button v-privilege="'job:add'" type="link" style="color: #1e1e1e" size="small" @click="showDrawer(record, 'copy')">
                        复制
                      </a-button>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </template>
        </template>
      </a-table>
      <div class="smart-query-table-page">
        <a-pagination
          showSizeChanger
          showQuickJumper
          show-less-items
          :pageSizeOptions="PAGE_SIZE_OPTIONS"
          :defaultPageSize="queryForm.size"
          v-model:current="queryForm.current"
          v-model:pageSize="queryForm.size"
          :total="total"
          @change="query"
          @showSizeChange="query"
          :show-total="() => `共${total}条`"
        />
      </div>
    </a-card>
    <OperateModal ref="operateModal" @reloadList="query" />
    <a-modal v-model:open="open" title="注册节点" :get-container="SmartLoading.spin">
      <a-list size="small" :bordered="false" :data-source="registryList">
        <template #renderItem="{ item }">
          <a-list-item>{{ item }}</a-list-item>
        </template>
      </a-list>
      <template v-slot:footer>
        <a-button @click="closeModal">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script setup>
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { message, Modal } from 'ant-design-vue';
  import { computed, createVNode, onMounted, reactive, ref } from 'vue';
  import OperateModal from './components/operate-modal.vue';
  import { columns } from './columns.js';
  import { taskJobApi } from '/@/api/task/task-job-api.js';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { smartSentry } from '/@/lib/smart-sentry';
  import TableOperator from '/@/components/support/table-operator/index.vue';
  import { PAGE_SIZE_OPTIONS } from '/@/constants/common-const.js';
  import { useRouter } from 'vue-router';
  import { taskGroupApi } from '/@/api/task/task-group-api.js';

  // ------------------------ 查询表单 ------------------------
  const queryFormState = {
    groupName: null,
    jobDesc: null,
    current: 1,
    size: 10,
    // 排序字段
    sortField: null,
    // 排序规则
    sortOrder: null,
  };
  const queryForm = reactive({ ...queryFormState });

  // ------------------------ table表格数据和查询方法 ------------------------
  const tableLoading = ref(false);
  const tableData = ref([]);
  const total = ref(0);

  // 重置
  function resetQuery() {
    Object.assign(queryForm, queryFormState);
    columns.value.forEach((item) => (item.sortOrder = null));
    query();
  }
  // 回到第一页
  function toFirstPage() {
    Object.assign(queryForm, { current: 1 });
    query();
  }
  // 查询
  async function query() {
    try {
      tableLoading.value = true;
      let res = await taskJobApi.taskJobPage(queryForm);
      tableData.value = res.data.records;
      total.value = res.data.total;
    } catch (e) {
      smartSentry.captureError(e);
    } finally {
      tableLoading.value = false;
    }
  }

  // Mounted方法
  onMounted(query);
  // -------------- 多选操作 --------------
  const selectedRowKeys = ref([]);
  let selectedRows = [];
  const hasSelected = computed(() => selectedRowKeys.value.length > 0);

  // 选中触发
  function onSelectChange(keyArray, selectRows) {
    selectedRowKeys.value = keyArray;
    selectedRows = selectRows;
  }

  // -------------- 删除操作 --------------
  function singleDelete(record) {
    confirmBatchDelete([record]);
  }

  function batchDelete() {
    confirmBatchDelete(selectedRows);
  }

  function confirmBatchDelete(array) {
    Modal.confirm({
      title: '请确认是否删除?',
      icon: createVNode(ExclamationCircleOutlined),
      okText: '删除',
      okType: 'danger',
      onOk() {
        const deleteIds = array.map((e) => e.id);
        requestBatchDelete({ deleteIds: deleteIds });
      },
      cancelText: '取消',
      onCancel() {},
    });

    async function requestBatchDelete(params) {
      SmartLoading.show();
      try {
        await taskJobApi.deleteTaskJob(params);
        // 清除选中
        selectedRowKeys.value = selectedRowKeys.value.filter((x) => params.deleteIds.indexOf(x) === -1);
        selectedRows = [];
        message.success('删除成功!');
        await query();
      } catch (e) {
        smartSentry.captureError(e);
      } finally {
        SmartLoading.hide();
      }
    }
  }

  // -------------- 新增、修改 右侧抽屉 --------------
  const operateModal = ref();

  function showDrawer(rowData, type, bool) {
    operateModal.value.operateType = type;
    operateModal.value.showDrawer(rowData, bool);
  }

  const router = useRouter();

  function viewLogs(rowData) {
    router.push({ name: 'task_log', query: { jobId: rowData.id } });
  }

  const open = ref(false);
  const registryList = ref([]);

  async function showModal(rowData) {
    tableLoading.value = true;
    const res = await taskGroupApi.getTaskGroup({ id: rowData.jobGroup });
    registryList.value = res.data.registryList;
    open.value = true;
    tableLoading.value = false;
  }

  function closeModal() {
    registryList.value = [];
    open.value = false;
  }

  async function start(rowData) {
    tableLoading.value = true;
    await taskJobApi.startTaskJob(rowData);
    message.success('操作成功');
    await query();
    tableLoading.value = false;
  }

  async function stop(rowData) {
    tableLoading.value = true;
    await taskJobApi.stopTaskJob(rowData);
    message.success('操作成功');
    await query();
    tableLoading.value = false;
  }
</script>
