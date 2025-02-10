<template>
  <div>
    <a-form class="smart-query-form">
      <a-row class="smart-query-form-row">
        <a-form-item label="键" class="smart-query-form-item">
          <a-input style="width: 300px" v-model:value="queryForm.key" placeholder="请输入键"/>
        </a-form-item>

        <a-form-item label="查询类型" class="smart-query-form-item">
          <SmartEnumSelect width="300px" enum-name="REDIS_TYPE_ENUM" v-model:value="queryForm.type"
                           placeholder="请选择查询类型" :allowClear="false"/>
        </a-form-item>


        <a-form-item class="smart-query-form-item smart-margin-left10">
          <a-button-group>
            <a-button type="primary" @click="query">
              <template #icon>
                <SearchOutlined/>
              </template>
              查询
            </a-button>

            <a-button @click="resetQuery">
              <template #icon>
                <ReloadOutlined/>
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
          <a-button v-privilege="'redis:add'" type="primary" @click="showDrawer">
            <template #icon>
              <PlusOutlined/>
            </template>
            新增
          </a-button>

          <a-button v-privilege="'redis:delete'" type="primary" danger @click="batchDelete" :disabled="!hasSelected">
            <template #icon>
              <DeleteOutlined/>
            </template>
            批量删除
          </a-button>
          <a-button v-if="showType === '1'"
                    :style="{marginRight:'8px', color: '#225CEDED', border:`1px solid #225CEDED` , backgroundColor: '#fff'}"

                    @click="changeShowType('2')">
            <template #icon>
              <UnorderedListOutlined/>
            </template>
            列表
          </a-button>
          <a-button v-if="showType === '2'"
                    :style="{marginRight:'8px', color: '#ED8E22ED', border:`1px solid #ED8E22ED` , backgroundColor: '#fff'}"
                    @click="changeShowType('1')">
            <template #icon>
              <ApartmentOutlined/>
            </template>
            树形
          </a-button>
        </div>
        <div class="smart-table-setting-block">
          <TableOperator v-model="columns" :refresh="query"/>
        </div>
      </a-row>

      <a-table
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :expanded-row-keys="expandedRowKeys"
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
        <template #expandIcon="{ record }">
          <template v-if="(record.children && record.children.length === 0) || !record.children">
            <span style="margin-right: 24px"></span>
          </template>
          <template v-else>
            <FolderOutlined v-if="expandedRowKeys.indexOf(record.id) === -1" class="icon-class"
                            @click="expandRow(record.id)"/>
            <FolderOpenOutlined v-else class="icon-class" @click="expandRow(record.id)"/>
          </template>
        </template>
        <template #headerCell="{ column }">
          <template v-if="column.dataIndex === 'name'">
            <span>{{ column.title }}</span><span class="number-class">（ {{ length }} ）</span>
          </template>
        </template>
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.dataIndex === 'className'">
            <a-tag v-if="text" color="blue">{{ text }}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'expire'">
            {{ formatDuration(text)}}
          </template>
          <template v-if="column.dataIndex === 'operate' && record.expire !== null">
            <div class="smart-table-operate">
              <a-button type="link" size="small" @click="showDrawer(record, true)">查看</a-button>
              <a-button v-privilege="'redis:update'" type="link" size="small" @click="showDrawer(record)">编辑
              </a-button>
              <a-button v-privilege="'redis:delete'" danger type="link" @click="singleDelete(record)">删除</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>

    <OperateModal ref="operateModal" @reloadList="query"/>
  </div>
</template>
<script setup>
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {message, Modal, theme} from 'ant-design-vue';
import {computed, createVNode, onMounted, reactive, ref} from 'vue';
import OperateModal from './components/operate-modal.vue';
import {columns} from './columns.js';
import {redisApi} from '/@/api/system/redis-api.js';
import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {smartSentry} from '/@/lib/smart-sentry';
import TableOperator from '/@/components/support/table-operator/index.vue';
import {flatArray} from "/@/utils/common-util.js";

// ------------------------ 查询表单 ------------------------
const queryFormState = {
  // 查询类型
  type: '2',
  // 查询Key
  key: null
};
const queryForm = reactive({...queryFormState});

// ------------------------ table表格数据和查询方法 ------------------------
/** 展示类型 */
const showType = ref('1');
const length = ref(0);
const tableLoading = ref(false);
const tableData = ref([]);
const expandedRowKeys = ref([]);

function resetQuery() {
  Object.assign(queryForm, queryFormState);
  query();
}

onMounted(query);

async function query() {
  try {
    tableLoading.value = true;
    const params = {...queryForm, ...{showType: showType.value}}
    let res = await redisApi.redisQuery(params);
    tableData.value = res.data;
    const arr = flatArray(tableData.value)
    length.value = arr.filter(row => row.expire !== null).length;
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    tableLoading.value = false;
  }
}

/** 修改展示形式 */
function changeShowType(val) {
  showType.value = val;
  query();
  expandedRowKeys.value = []
}

/** 展开/折叠 */
const expandRow = (id) => {
  if (expandedRowKeys.value.indexOf(id) === -1) {
    expandedRowKeys.value.push(id);
  } else {
    const closedIndex = expandedRowKeys.value.indexOf(id);
    expandedRowKeys.value.splice(closedIndex, 1);
  }
};

// -------------- 多选操作 --------------
const selectedRowKeys = ref([]);
let selectedRows = [];
const hasSelected = computed(() => selectedRowKeys.value.length > 0);

function onSelectChange(keyArray, selectRows) {
  selectedRowKeys.value = keyArray;
  selectedRows = selectRows;
}

function singleDelete(record) {
  confirmBatchDelete([record]);
}

function batchDelete() {
  confirmBatchDelete(selectedRows);
}

function confirmBatchDelete(array) {
  Modal.confirm({
    title: '删除机构同时删除子机构，请确认是否删除?',
    icon: createVNode(ExclamationCircleOutlined),
    okText: '删除',
    okType: 'danger',
    onOk() {
      const deleteIds = array.map((e) => e.id);
      requestBatchDelete({deleteIds: deleteIds});
      selectedRows = [];
    },
    cancelText: '取消',
    onCancel() {
    },
  });

  async function requestBatchDelete(params) {
    SmartLoading.show();
    const format = flatArray(tableData.value)
    const targetKeys = format.filter(row => params.deleteIds.includes(row.id)).map(row => row.key);
    try {
      await redisApi.deleteRedis({deleteKeys: targetKeys});
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

async function showDrawer(rowData, bool) {
  if(rowData){
    const res = await redisApi.getRedis({key: rowData.key})
    const data  =  { ...res.data, ...{ valueType: typeof rowData.value } };
    operateModal.value.showDrawer(data, bool);
  } else {
    operateModal.value.showDrawer(rowData, bool);
  }
}

/**
 * 秒数 转化成 天-分-秒
 *
 * @param totalSeconds
 */
function formatDuration(totalSeconds) {
  if (totalSeconds < 0) {
    return '永久'
  }
  const { days, hours, minutes, seconds } = convertSeconds(totalSeconds);

  // 构建格式化字符串
  let formattedString = '';
  if (days > 0) {
    formattedString += `${days} 天`;
  }
  if (hours > 0) {
    formattedString += `${hours}小时`;
  }
  if (minutes > 0) {
    formattedString += `${minutes}分钟`;
  }
  if (seconds > 0) {
    formattedString += `${seconds}秒`;
  }
  return formattedString.trim();
}
/** 时间格式化 */
function convertSeconds(totalSeconds){
  if (totalSeconds < 0) {
    throw new Error('Total seconds cannot be negative.');
  }

  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));

  return { days, hours, minutes, seconds };
}


const { useToken } = theme;
const { token } = useToken();
</script>
<style lang="less" scoped>
:deep(.ant-table-cell) {
  text-align: left !important;
}
.number-class {
  color: v-bind('token.colorPrimary');
}
.icon-class {
  margin-right: 5px;
  color: v-bind('token.colorPrimary');
}
</style>
