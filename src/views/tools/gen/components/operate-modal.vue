<template>
  <a-modal
      :open="visible"
      :title="disabled ? '查看' : form.id ? '编辑' : '新增'"
      :maskClosable="true"
      width="80%"
      @cancel="onClose"
  >
    <a-form ref="formRef" :labelCol="{ span: 2 }" :labelWrap="true" :model="form" :rules="rules"
            style="margin-top: 60px" :disabled="disabled">
      <div v-if="current === 1" style="min-height: 400px">
        <a-form-item label="表" name="tableName">
          <a-select
              v-model:value="form.tableName"
              :disabled="form.id !== undefined && form.id !== null"
              allowClear
              :showSearch="true"
              optionFilterProp="title"
              placeholder="请选择表"
              style="margin: -5px 0;width: 100%"
              @change="tableUpdate"
          >
            <a-select-option v-for="item in tables" :key="item.tableName" :title="item.tableName">{{ item.tableName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div v-if="current === 2" style="min-height: 400px">
        <a-form-item label="实体名称" name="className">
          <a-input v-model:value="form.className" placeholder="请输入实体名称"/>
        </a-form-item>
        <a-form-item label="实体描述" name="className">
          <a-input v-model:value="form.comments" placeholder="请输入实体描述"/>
        </a-form-item>
        <a-form-item label="作者" name="functionAuthor">
          <a-input v-model:value="form.functionAuthor" placeholder="请输入作者"/>
        </a-form-item>
        <a-form-item label="包名" name="packageName">
          <a-input v-model:value="form.packageName" placeholder="请输入包名"/>
        </a-form-item>
        <a-form-item label="所属模块" name="moduleName">
          <a-input v-model:value="form.moduleName" placeholder="请输入所属模块"/>
        </a-form-item>
        <a-form-item label="所属菜单" name="menuId">
          <a-tree-select
              v-model:value="form.menuId"
              placeholder="请选择所属菜单"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              show-search
              allow-clear
              tree-node-filter-prop="label"
              :fieldNames="{label:'label', value:'id'}"
              :tree-data="menus"
          />
        </a-form-item>
        <a-form-item label="选项" name="options">
          <a-radio-group v-model:value="form.options" button-style="solid">
            <a-radio-button value="1">全部</a-radio-button>
            <a-radio-button value="2">Api</a-radio-button>
            <a-radio-button value="3">接口</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </div>
      <div v-if="current === 3">
        <a-table class="table-css" :columns="genColumns" :data-source="form.columns" bordered size="small"
                 :pagination="false">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'comments'">
              <a-form-item :key="`${column.dataIndex}-${index}`" :name="['columns', index, column.dataIndex]"
                           :rules="{ required: true,  message: '字段描述不能为空' }">
                <a-input v-model:value="record[column.dataIndex]" placeholder="请输入字段描述"/>
              </a-form-item>
            </template>
            <template v-if="['isNotNull','isList', 'isForm'].includes(column.dataIndex)">
              <a-form-item :key="`${column.dataIndex}-${index}`" :name="['columns', index, column.dataIndex]">
                <a-checkbox :checked="record[column.dataIndex] === '1'"
                            @change="(val)=>changeRow(record,column.dataIndex,val)"/>
              </a-form-item>
            </template>
            <template v-if="column.dataIndex === 'queryType'">
              <a-form-item :key="`${column.dataIndex}-${index}`" :name="['columns', index, column.dataIndex]">
                <SmartEnumSelect width="100%" enum-name="QUERY_TYPE_ENUM" v-model:value="record[column.dataIndex]"
                                 placeholder="请选择查询方式"
                />
              </a-form-item>
            </template>
            <template v-if="column.dataIndex === 'components'">
              <a-form-item :key="`${column.dataIndex}-${index}`" :name="['columns', index, column.dataIndex]">
                <SmartEnumSelect width="100%" enum-name="COMPONENTS_ENUM" v-model:value="record[column.dataIndex]"
                                 placeholder="请选择组件"
                />
              </a-form-item>
            </template>
            <template v-if="column.dataIndex === 'dictCode'">
              <a-form-item :key="`${column.dataIndex}-${index}`" :name="['columns', index, column.dataIndex]">
                <a-select
                    v-model:value="record[column.dataIndex]"
                    allowClear
                    :showSearch="true"
                    optionFilterProp="title"
                    placeholder="请选择关联字典"
                    style="margin: -5px 0;width: 100%"
                >
                  <a-select-option v-for="item in dictData" :key="item.dictCode" :title="item.dictName">{{
                      item.dictName
                    }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </template>
          </template>
        </a-table>
      </div>
    </a-form>
    <template v-slot:footer>
      <div style="display: flex;justify-content: space-between">
        <div>
          <a-button v-if="current !== 1" style="margin-right: 8px" @click="()=> current--">上一步</a-button>
        </div>
        <div>
          <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
          <a-button v-if="current === 3 && !disabled" style="margin-right: 8px" type="primary" @click="submit()">提交</a-button>
          <a-button v-if="current !== 3" style="margin-right: 8px" type="primary" @click="changeSteps(current)">下一步</a-button>
        </div>
      </div>
    </template>
  </a-modal>
</template>
<script setup>
import {message} from 'ant-design-vue';
import _ from 'lodash';
import {nextTick, reactive, ref, watch} from 'vue';
import {smartSentry} from '/@/lib/smart-sentry';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {genTableApi} from "/@/api/tools/gen-api.js";
import Sortable from 'sortablejs';
import {menuApi} from "/@/api/system/menu-api.js";
import {genColumns} from "../columns.js";
import SmartEnumSelect from "/@/components/framework/smart-enum-select/index.vue";
import {dictApi} from "/@/api/system/dict-api.js";
import {debounceAsync} from "/@/utils/debounce-util.js";
// ----------------------- 以下是字段定义 emits props ------------------------
const emit = defineEmits(['reloadList']);

// ----------------------- 展开、隐藏编辑窗口 ------------------------
const visible = ref(false);
// 是否可编辑
const disabled = ref(false);
async function showDrawer(rowData, bool) {
  disabled.value = bool;
  Object.assign(form, formDefault);
  if (rowData && !_.isEmpty(rowData)) {
    Object.assign(form, rowData);
  }
  visible.value = true;
}

function onClose() {
  formRef.value.resetFields();
  visible.value = false;
}

// ----------------------- form表单相关操作 ------------------------
const formRef = ref();
const tableRef = ref();
const formDefault = {
  id: null,
  tableName: null,
  className: null,
  comments: null,
  functionAuthor: null,
  packageName: null,
  moduleName: null,
  options: '1',
  menuId: null,
  columns: []
};
let form = reactive({...formDefault});
const rules = {
  tableName: [{required: true, message: '表不能为空'}],
  className: [{required: true, message: '实体名称不能为空'}],
  comments: [{required: true, message: '实体描述不能为空'}],
  functionAuthor: [{required: true, message: '作者不能为空'}],
  packageName: [{required: true, message: '包名不能为空'}],
  moduleName: [{required: true, message: '所属模块不能为空'}],
  options: [{required: true, message: '选项不能为空'}]
};

function validateForm(formRef, fields) {
  return new Promise((resolve) => {
    formRef.validateFields(fields)
        // formRef
        //     .validate()
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
  });
}
// 防抖
const submit = debounceAsync(() =>onSubmit(), 200, true);
const onSubmit = async () => {
  let validateFormRes = await validateForm(formRef.value);
  if (!validateFormRes) {
    message.error('参数验证错误，请仔细填写表单数据!');
    return;
  }
  SmartLoading.show();
  try {
    let params = _.cloneDeep(form);
    if (params.id) {
      await genTableApi.updateGenTable(params);
    } else {
      await genTableApi.addGenTable(params);
    }
    message.success(`${params.id ? '修改' : '新增'}成功`);
    SmartLoading.hide();
    onClose();
    emit('reloadList');
  } catch (error) {
    smartSentry.captureError(error);
  } finally {
    SmartLoading.hide();
  }
};

const current = ref(1);
const tables = ref([]);
const menus = ref([]);
const dictData = ref([]);

async function changeSteps(step) {
  if (step === 1) {
    let validateFormRes = await validateForm(formRef.value, ['tableName']);
    if (!validateFormRes) {
      return;
    }
  }
  if (step === 2) {
    let validateFormRes = await validateForm(formRef.value, ['className', 'comments', 'functionAuthor', 'packageName', 'moduleName', 'options']);
    if (!validateFormRes) {
      return;
    }
    SmartLoading.show();
    if (!form.id) {
      const res = await genTableApi.findColumns({tableName: form.tableName});
      form.columns = res.data;
    } else {
      const res = await genTableApi.getGenTableColumn({tableId: form.id});
      form.columns = res.data;
    }
    await setSort();
    SmartLoading.hide();
  }
  if (step && current.value) {
    current.value = step + 1;
  }
}

const setSort = async () => {
  await nextTick();
  if (tableRef.value) {
    const a = tableRef.value;
    const el = a.$el.querySelector('.n-data-table-tbody');
    if (el) {
      Sortable.create(el, {
        onEnd: (evt) => {
          const targetRow = form.columns.splice(evt.oldIndex, 1)[0];
          form.columns.splice(evt.newIndex, 0, targetRow);
        }
      });
    }
  }
};

/** 获取表名选项 */
async function getTableOptions() {
  const res = await genTableApi.findTables();
  tables.value = res.data
}

/** 获取菜单选项 */
async function getMenuOptions() {
  const res = await menuApi.menuTreeFormat({menuType: '1'});
  menus.value = res.data;
}

/** 获取关联字典 */
async function getDictOptions() {
  const res = await dictApi.dictList({parentId: '0'});
  dictData.value = res.data;
}

// 级联选择器过滤
const filter = (inputValue, path) => {
  return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
};

function tableUpdate(value) {
  const table = tables.value.filter(item => item.tableName === value);
  if (table.length > 0) {
    form.className = table[0].className;
    form.comments = table[0].comments;
    form.functionAuthor = table[0].functionAuthor;
    form.packageName = table[0].packageName;
    form.moduleName = table[0].moduleName;
  }
}

function changeRow(record, dataIndex, val) {
  if (val.target.checked) {
    record[dataIndex] = '1';
  } else {
    record[dataIndex] = '0';
  }
}

watch(
    () => visible.value,
    (val) => {
      if (!val) {
        current.value = 1
        tables.value = [];
        menus.value = [];
        formRef.value.resetFields();
      } else {
        getTableOptions();
        getMenuOptions();
        getDictOptions();
      }
    },
);

// ----------------------- 以下是暴露的方法内容 ------------------------
defineExpose({
  showDrawer,
});
</script>
<style lang="less" scoped>
.footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: left;
  z-index: 1;
}

.table-css .ant-form-item {
  margin-bottom: 0;
}
</style>

