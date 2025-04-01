<template>
  <div>
    <a-form class="smart-query-form">
      <a-row class="smart-query-form-row">
        <a-form-item label="菜单名称" class="smart-query-form-item">
          <a-input style="width: 300px" v-model:value="queryForm.menuName" placeholder="请输入菜单名称" />
        </a-form-item>

        <a-form-item label="状态" class="smart-query-form-item">
          <SmartEnumSelect width="300px" enum-name="STATUS_ENUM" v-model:value="queryForm.status" placeholder="请选择状态" />
        </a-form-item>

        <a-form-item class="smart-query-form-item smart-margin-left10">
          <a-button-group>
            <a-button type="primary" @click="query">
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
        <div class="smart-table-operate-block"></div>
        <div class="smart-table-setting-block">
          <TableOperator v-model="columns" :refresh="query" />
        </div>
      </a-row>

      <a-table
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
          <template v-if="column.dataIndex === 'menuType'">
            <a-tag :color="text === '1' ? 'blue' : 'orange'">{{ $smartEnumPlugin.getDescByValue('MENU_TYPE_ENUM', text) }}</a-tag>
          </template>

          <template v-if="column.dataIndex === 'routePath'">
            <span>{{ record.href ? record.href : record.routePath }}</span>
          </template>

          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="text ? 'blue' : 'red'">{{ $smartEnumPlugin.getDescByValue('STATUS_ENUM', text) }}</a-tag>
          </template>

          <template v-if="column.dataIndex === 'hideInMenu'">
            <a-tag :color="text ? 'green' : 'blue'">{{ text ? '是' : '否' }}</a-tag>
          </template>

          <template v-if="column.dataIndex === 'antIcon'">
            <component :is="$antIcons[text]" />
          </template>

          <template v-if="column.dataIndex === 'operate'">
            <div class="smart-table-operate">
              <a-button v-if="record.menuType === '2'" type="link" size="small" @click="showDrawer(record)">权限设置</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>

    <ScopeTableDrawer ref="scopeTableDrawer" @reloadList="query" />
  </div>
</template>
<script setup>
  import { onMounted, reactive, ref } from 'vue';
  import ScopeTableDrawer from './components/scope-table-drawer.vue';
  import { columns } from './columns.js';
  import { menuApi } from '/@/api/system/menu-api';
  import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
  import { smartSentry } from '/@/lib/smart-sentry';
  import TableOperator from '/@/components/support/table-operator/index.vue';

  // ------------------------ 查询表单 ------------------------
  const queryFormState = {
    menuName: null,
    status: null,
    // 排序字段
    sortField: null,
    // 排序规则
    sortOrder: null,
  };
  const queryForm = reactive({ ...queryFormState });

  // ------------------------ table表格数据和查询方法 ------------------------

  const tableLoading = ref(false);
  const tableData = ref([]);

  function resetQuery() {
    Object.assign(queryForm, queryFormState);
    columns.value.forEach((item) => (item.sortOrder = null));
    query();
  }
  onMounted(query);

  async function query() {
    try {
      tableLoading.value = true;
      let responseModel = await menuApi.menuTree(queryForm);
      tableData.value = responseModel.data;
    } catch (e) {
      smartSentry.captureError(e);
    } finally {
      tableLoading.value = false;
    }
  }

  // -------------- 新增、修改 右侧抽屉 --------------
  const scopeTableDrawer = ref();
  function showDrawer(rowData) {
    scopeTableDrawer.value.showDrawer(rowData);
  }
</script>
