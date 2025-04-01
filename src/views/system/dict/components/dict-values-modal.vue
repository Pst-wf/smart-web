<template>
  <a-modal :open="visible" title="字典设置" :maskClosable="true" :width="1200" :get-container="SmartLoading.spin" @cancel="onClose">
    <template v-slot:footer>
      <a-button @click="onClose">关闭</a-button>
    </template>
    <div style="margin-top: 20px">
      <a-row class="smart-table-btn-block">
        <div class="smart-table-operate-block">
          <a-button v-if="!disabled" v-privilege="'dict:add'" type="primary" @click="addRow(dictId, dataSource.length + 1)">
            <template #icon>
              <PlusOutlined />
            </template>
            新增
          </a-button>
        </div>
      </a-row>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="tableLoading"
        bordered
        :pagination="false"
        rowKey="id"
        :expanded-row-keys="expandedRowKeys"
      >
        <template #expandIcon="{ record }">
          <template v-if="(record.children && record.children.length === 0) || !record.children">
            <span style="margin-right: 24px"></span>
          </template>
          <template v-else>
            <button
              :class="[
                'ant-table-row-expand-icon',
                expandedRowKeys.indexOf(record.id) === -1
                  ? 'ant-table-row-expand-icon-collapsed' //使用组件库原展开按钮的样式
                  : 'ant-table-row-expand-icon-expanded',
              ]"
              @click="expandRow(record.id)"
            ></button>
          </template>
        </template>
        <template #bodyCell="{ column, text, record }">
          <template v-if="['dictName', 'dictValue', 'sort'].includes(column.dataIndex)">
            <div style="display: inline-block; min-height: 30px">
              <a-input v-if="editableData[record.id]" v-model:value="editableData[record.id][column.dataIndex]" style="margin: -5px 0" allowClear />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <div v-if="!disabled" class="editable-row-operations" style="min-height: 30px">
              <span v-if="editableData[record.id]">
                <a-button v-privilege="'dict:update'" type="link" @click="save(record.id)" size="small">保存</a-button>
                <a-button v-privilege="'dict:update'" danger type="link" @click="cancel(record.id)" size="small">关闭</a-button>
              </span>
              <span v-else>
                <a-button
                  v-privilege="'dict:add'"
                  type="link"
                  style="color: #4ab844"
                  size="small"
                  @click="addRow(record.id, record.children ? record.children.length + 1 : 1)"
                  >新增</a-button
                >
                <a-button v-privilege="'dict:update'" type="link" size="small" @click="edit(record.id)">编辑</a-button>
                <a-popconfirm title="请确认是否删除?" @confirm="remove(record.id)">
                  <a-button v-privilege="'dict:delete'" danger type="link" size="small">删除</a-button>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </a-modal>
</template>
<script setup>
  import { cloneDeep } from 'lodash-es';
  import { reactive, ref } from 'vue';
  import { dictApi } from '/@/api/system/dict-api.js';
  import { flatArray } from '/@/utils/common-util.js';
  import { message } from 'ant-design-vue';
  import { SmartLoading } from '/@/components/framework/smart-loading/index.js';

  const visible = ref(false);
  const columns = [
    {
      title: '字典名称',
      dataIndex: 'dictName',
      width: '40%',
    },
    {
      title: '值',
      dataIndex: 'dictValue',
      width: '20%',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: '20%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
    },
  ];
  // 是否可编辑
  const disabled = ref(false);
  const dataSource = ref([]);
  const dictId = ref(null);
  const tableLoading = ref(false);
  const editableData = reactive({});
  const expandedRowKeys = ref([]);
  const edit = (key) => {
    const arr = flatArray(dataSource.value);
    editableData[key] = cloneDeep(arr.filter((item) => key === item.id)[0]);
  };
  const save = async (id) => {
    const obj = editableData[id];
    if (obj) {
      if (obj.dictName === null) {
        message.error(`描述不能为空`);
        return;
      }
      if (obj.dictValue === null) {
        message.error(`值不能为空`);
        return;
      }
      if (obj.sort === null) {
        message.error(`排序不能为空`);
        return;
      }
    }
    tableLoading.value = true;
    if (id.includes('IsNew')) {
      obj.id = null;
      await dictApi.addDict(obj);
    } else {
      await dictApi.updateDict(obj);
    }
    message.success('操作成功');
    delete editableData[id];
    await initTable(dictId.value);
    tableLoading.value = false;
  };
  const cancel = (id) => {
    delete editableData[id];
  };
  const remove = async (id) => {
    tableLoading.value = true;
    if (id) {
      if (id.includes('IsNew')) {
        dataSource.value = deleteChildrenInTree(id, dataSource.value);
        expandedRowKeys.value = expandedRowKeys.value.filter((x) => x !== id);
      } else {
        await dictApi.deleteDict({ deleteIds: [id] });
        await initTable(dictId.value);
      }
      delete editableData[id];
    }
    tableLoading.value = false;
  };

  function deleteChildrenInTree(id, arr) {
    return arr.flatMap((item) => {
      if (item.id !== id) {
        if (Array.isArray(item.children)) {
          item.children = deleteChildrenInTree(id, item.children);
          return item;
        }
        return item;
      }
      return [];
    });
  }

  const addRow = (parentId, sort) => {
    const newRows = getIsNewRow(dataSource.value);
    if (newRows.length > 0) {
      message.warning('只能同时新增一条数据');
      return;
    }
    if (parentId) {
      if (parentId === dictId.value) {
        const obj = {
          id: `IsNew-${parentId}-${dataSource.value.length + 1}`,
          parentId,
          dictName: null,
          dictValue: null,
          sort,
          children: [],
        };
        dataSource.value.push(obj);
        editableData[obj.id] = obj;
      } else {
        setChildrenInTree(
          parentId,
          {
            id: null,
            parentId,
            dictName: null,
            dictValue: null,
            sort,
            children: [],
            editAble: true,
          },
          dataSource.value
        );
        expandedRowKeys.value = [parentId, ...expandedRowKeys.value];
      }
    }
  };

  function getIsNewRow(arr) {
    return arr.flatMap((item) => {
      if (item.id && !item.id.includes('IsNew')) {
        if (Array.isArray(item.children)) {
          return getIsNewRow(item.children);
        }
        return [];
      }
      return item;
    });
  }

  function setChildrenInTree(id, obj, arr) {
    arr.forEach((item) => {
      if (item.id === id) {
        if (!item.children) {
          item.children = [];
        }
        obj.id = `IsNew-${id}-${item.children.length + 1}`;
        item.children?.push(obj);
        editableData[obj.id] = obj;
      } else if (Array.isArray(item.children)) {
        setChildrenInTree(id, obj, item.children);
      }
    });
  }

  const expandRow = (id) => {
    if (expandedRowKeys.value.indexOf(id) === -1) {
      expandedRowKeys.value.push(id);
    } else {
      const closedIndex = expandedRowKeys.value.indexOf(id);
      expandedRowKeys.value.splice(closedIndex, 1);
    }
  };

  //展开窗口
  async function showModal(id, bool) {
    disabled.value = bool;
    dictId.value = id;
    await initTable(dictId.value);
    visible.value = true;
  }

  async function initTable(id) {
    tableLoading.value = true;
    if (id) {
      const res = await dictApi.dictValues({ id: id });
      dataSource.value = res.data;
      resetEditableData();
      expandedRowKeys.value = [];
    }
    tableLoading.value = false;
  }

  // 隐藏窗口
  function onClose() {
    dictId.value = null;
    dataSource.value = [];
    resetEditableData();
    expandedRowKeys.value = [];
    visible.value = false;
  }

  function resetEditableData() {
    for (const key in editableData) {
      delete editableData[key];
    }
  }

  defineExpose({
    showModal,
  });
</script>
<style scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>
