<template>
  <a-modal
      :open="visible"
      :title="disabled ? '查看' : form.id ? '编辑' : '新增'"
      :mask="false"
      width="100%"
      wrap-class-name="full-modal"
      centered
      :closable="false"
      :get-container="SmartLoading.spin"
      @cancel="onClose"
  >
    <a-steps :current="current - 1" :items="steps" style="padding: 0 10%" />
    <a-form
        ref="formRef"
        :labelCol="{ span: 2 }"
        :labelWrap="true"
        layout="vertical"
        :model="form"
        :rules="rules"
        style="margin-top: 60px"
        :disabled="disabled"
    >
      <div v-if="current === 1" class="form-format" style="min-height: 400px">
        <a-form-item label="表" name="tableName">
          <a-select
              v-model:value="form.tableName"
              :disabled="form.id !== undefined && form.id !== null"
              allowClear
              :showSearch="true"
              optionFilterProp="title"
              placeholder="请选择表"
              style="margin: -5px 0; width: 100%"
              @change="tableUpdate"
          >
            <a-select-option v-for="item in tables" :key="item.tableName" :title="item.tableName">{{ item.tableName }} </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="实体名称" name="className">
          <a-input v-model:value="form.className" placeholder="请输入实体名称" :disabled="disabled || !form.tableName" allowClear />
        </a-form-item>
        <a-form-item label="实体描述" name="className">
          <a-input v-model:value="form.comments" placeholder="请输入实体描述" :disabled="disabled || !form.tableName" allowClear />
        </a-form-item>
        <a-form-item label="作者" name="functionAuthor">
          <a-input v-model:value="form.functionAuthor" placeholder="请输入作者" :disabled="disabled || !form.tableName" allowClear />
        </a-form-item>
        <a-form-item label="包名" name="packageName">
          <a-input v-model:value="form.packageName" placeholder="请输入包名" :disabled="disabled || !form.tableName" allowClear />
        </a-form-item>
        <a-form-item label="所属模块" name="moduleName">
          <a-input v-model:value="form.moduleName" placeholder="请输入所属模块" :disabled="disabled || !form.tableName" allowClear />
        </a-form-item>
        <a-form-item label="所属菜单" name="menuId">
          <a-tree-select
              v-model:value="form.menuId"
              placeholder="请选择所属菜单"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              show-search
              allow-clear
              tree-node-filter-prop="label"
              :fieldNames="{ label: 'label', value: 'id' }"
              :tree-data="menus"
              :disabled="disabled || !form.tableName"
          />
        </a-form-item>
      </div>
      <div v-if="current === 2">
        <a-table class="table-css" :columns="genColumns" :data-source="form.columns" bordered size="small" :pagination="false">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'comments'">
              <a-form-item
                  :key="`${column.dataIndex}-${index}`"
                  :name="['columns', index, column.dataIndex]"
                  :rules="{ required: true, message: '字段描述不能为空' }"
              >
                <a-input v-model:value="record[column.dataIndex]" placeholder="请输入字段描述" allowClear />
              </a-form-item>
            </template>
            <template v-if="['isNotNull', 'isList', 'isForm'].includes(column.dataIndex)">
              <a-form-item :key="`${column.dataIndex}-${index}`" :name="['columns', index, column.dataIndex]">
                <a-checkbox :checked="record[column.dataIndex] === '1'" @change="(val) => changeRow(record, column.dataIndex, val)" />
              </a-form-item>
            </template>
            <template v-if="column.dataIndex === 'queryType'">
              <a-form-item :key="`${column.dataIndex}-${index}`" :name="['columns', index, column.dataIndex]">
                <SmartEnumSelect width="100%" enum-name="QUERY_TYPE_ENUM" v-model:value="record[column.dataIndex]" placeholder="请选择查询方式" />
              </a-form-item>
            </template>
            <template v-if="column.dataIndex === 'components'">
              <a-form-item :key="`${column.dataIndex}-${index}`" :name="['columns', index, column.dataIndex]">
                <SmartEnumSelect width="100%" enum-name="COMPONENTS_ENUM" v-model:value="record[column.dataIndex]" placeholder="请选择组件" />
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
                    style="margin: -5px 0; width: 100%"
                >
                  <a-select-option v-for="item in dictData" :key="item.dictCode" :title="item.dictName">{{ item.dictName }} </a-select-option>
                </a-select>
              </a-form-item>
            </template>
          </template>
        </a-table>
      </div>
      <div v-if="current === 3" class="form-format">
        <a-row>
          <a-col :span="12">
            <a-form-item label="代码类型" :labelCol="{ span: 4 }">
              <a-radio-group v-model:value="form.options.genType" button-style="solid">
                <a-radio-button value="1">全部</a-radio-button>
                <a-radio-button value="2">Api</a-radio-button>
                <a-radio-button value="3">接口</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="列表类型" :labelCol="{ span: 4 }">
              <a-radio-group v-model:value="form.options.tableType" button-style="solid">
                <a-radio-button value="page">分页</a-radio-button>
                <a-radio-button value="list">不分页</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="表单类型" :labelCol="{ span: 4 }">
              <a-radio-group v-model:value="form.options.formType" button-style="solid">
                <a-radio-button value="modal">弹窗</a-radio-button>
                <a-radio-button value="drawer">抽屉</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="操作" :labelCol="{ span: 4 }">
              <a-checkbox v-model:checked="form.options.addStatus">新增</a-checkbox>
              <a-checkbox v-model:checked="form.options.updateStatus">修改</a-checkbox>
              <a-checkbox v-model:checked="form.options.deleteStatus">删除</a-checkbox>
              <a-checkbox v-model:checked="form.options.importStatus">导入</a-checkbox>
              <a-checkbox v-model:checked="form.options.exportStatus">导出</a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="后端路径" :validate-status="validationBack" :labelCol="{ span: 4 }" style="padding-right: 48px">
              <a-input v-model:value="form.options.javaPath" />
              <template v-if="validationBack === 'error' || validationBack === 'warning'" #help>
                <span v-if="validationBack === 'error'">后端路径不能为空</span>
                <span v-if="validationBack === 'warning'">当前路径与项目不匹配，请确认是否正确</span>
              </template>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="后端路径预览" :labelCol="{ span: 4 }">
              <div v-for="(item, index) in javaFilePath" :key="index" class="item-class">
                {{ item }}
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="前端路径" :validate-status="validationFront" :labelCol="{ span: 4 }" style="padding-right: 48px">
              <a-input v-model:value="form.options.vuePath" />
              <template v-if="validationFront === 'error' || validationFront === 'warning'" #help>
                <span v-if="validationFront === 'error'">前端路径不能为空</span>
                <span v-if="validationFront === 'warning'">当前路径与项目不匹配，请确认是否正确</span>
              </template>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="前端路径预览" :labelCol="{ span: 4 }">
              <div v-for="(item, index) in vueFilePath" :key="index" class="item-class">
                {{ item }}
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <template v-slot:footer>
      <div style="display: flex; justify-content: space-between">
        <div>
          <a-button v-if="current !== 1" style="margin-right: 8px" @click="() => current--">上一步</a-button>
        </div>
        <div>
          <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
          <a-button v-if="current === 3 && !disabled" style="margin-right: 8px" @click="generateCode()">生成代码 </a-button>
          <a-button v-if="current === 3 && !disabled" style="margin-right: 8px" type="primary" @click="submit()">保存 </a-button>
          <a-button v-if="current !== 3" style="margin-right: 8px" type="primary" @click="changeSteps(current)">下一步 </a-button>
        </div>
      </div>
    </template>
  </a-modal>
</template>
<script setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import _ from 'lodash';
import { computed, createVNode, nextTick, reactive, ref, watch } from 'vue';
import { smartSentry } from '/@/lib/smart-sentry';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { genTableApi } from '/@/api/tools/gen-api.js';
import Sortable from 'sortablejs';
import { menuApi } from '/@/api/system/menu-api.js';
import { genColumns } from '../columns.js';
import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
import { dictApi } from '/@/api/system/dict-api.js';
import { debounceAsync } from '/@/utils/debounce-util.js';
import { flatArray } from '/@/utils/common-util.js';
// ----------------------- 以下是字段定义 emits props ------------------------
const emit = defineEmits(['reloadList']);

// ----------------------- 展开、隐藏编辑窗口 ------------------------
const visible = ref(false);
// 是否可编辑
const disabled = ref(false);

async function showForm(rowData, bool) {
  disabled.value = bool;
  Object.assign(form, formDefault);
  if (rowData && !_.isEmpty(rowData)) {
    Object.assign(form, rowData);
    if (!rowData.options) {
      form.options = {
        genType: '1',
        tableType: 'page',
        formType: 'modal',
        addStatus: true,
        updateStatus: true,
        deleteStatus: true,
        importStatus: true,
        exportStatus: true,
        javaPath: null,
        vuePath: import.meta.env.PROJECT_PATH,
      };
    }
  }
  visible.value = true;
}

function onClose() {
  formRef.value.resetFields();
  visible.value = false;
}

// ----------------------- form表单相关操作 ------------------------
/** 后端路径校验 */
const validationBack = computed(() => {
  if (form.options.javaPath) {
    if (form.options.javaPath !== javaPath.value) {
      return 'warning';
    }
  } else {
    return 'error';
  }
  return undefined;
});

/** 前端路径校验 */
const validationFront = computed(() => {
  if (form.options.vuePath) {
    if (form.options.vuePath !== import.meta.env.PROJECT_PATH) {
      return 'warning';
    }
  } else {
    return 'error';
  }
  return undefined;
});

const steps = [
  {
    title: '表单信息',
  },
  {
    title: '字段属性',
  },
  {
    title: '选项设置',
  },
];
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
  options: {
    genType: '1',
    tableType: 'page',
    formType: 'modal',
    addStatus: true,
    updateStatus: true,
    deleteStatus: true,
    importStatus: true,
    exportStatus: true,
    javaPath: null,
    vuePath: import.meta.env.PROJECT_PATH,
  },
  menuId: null,
  columns: [],
};
let form = reactive({ ...formDefault });
const rules = {
  tableName: [
    { required: true, message: '表不能为空' },
    { max: 255, message: '长度不能超过255个字符', trigger: 'blur' },
  ],
  className: [
    { required: true, message: '实体名称不能为空' },
    { max: 255, message: '长度不能超过255个字符', trigger: 'blur' },
  ],
  comments: [
    { required: true, message: '实体描述不能为空' },
    { max: 500, message: '长度不能超过500个字符', trigger: 'blur' },
  ],
  functionAuthor: [
    { required: true, message: '作者不能为空' },
    { max: 255, message: '长度不能超过255个字符', trigger: 'blur' },
  ],
  packageName: [
    { required: true, message: '包名不能为空' },
    { max: 500, message: '长度不能超过500个字符', trigger: 'blur' },
  ],
  moduleName: [
    { required: true, message: '所属模块不能为空' },
    { max: 255, message: '长度不能超过255个字符', trigger: 'blur' },
  ],
};

function validateForm(formRef, fields) {
  return new Promise((resolve) => {
    formRef
        .validateFields(fields)
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
const submit = debounceAsync(() => onSubmit(), 200, true);
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
// 防抖
const generateCode = debounceAsync(() => confirmGenInFile(), 200, true);

/**
 * 确认是否生成代码
 */
function confirmGenInFile() {
  Modal.confirm({
    title: '若文件已存在则会覆盖，是否执行?',
    icon: createVNode(ExclamationCircleOutlined),
    okText: '确认',
    okType: 'danger',
    onOk() {
      handleGenerateCode();
    },
    cancelText: '取消',
    onCancel() {},
  });
  const handleGenerateCode = async () => {
    let validateFormRes = await validateForm(formRef.value);
    if (!validateFormRes) {
      message.error('参数验证错误，请仔细填写表单数据!');
      return;
    }
    SmartLoading.show();
    try {
      let params = _.cloneDeep(form);
      if (params.id) {
        await genTableApi.updateGenTable({ ...params, ...{ generateStatus: true, frontType: 'ant_design' } });
      } else {
        await genTableApi.addGenTable({ ...params, ...{ generateStatus: true, frontType: 'ant_design' } });
      }
      message.success('生成代码成功');
      SmartLoading.hide();
      onClose();
      emit('reloadList');
    } catch (error) {
      smartSentry.captureError(error);
    } finally {
      SmartLoading.hide();
    }
  };
}

const current = ref(1);
const tables = ref([]);
const menus = ref([]);
const dictData = ref([]);
const javaPath = ref(null);

async function changeSteps(step) {
  if (step === 1) {
    let validateFormRes = await validateForm(formRef.value, ['tableName', 'className', 'comments', 'functionAuthor', 'packageName', 'moduleName']);
    if (!validateFormRes) {
      return;
    }
    SmartLoading.show();
    if (!form.id) {
      const res = await genTableApi.findColumns({ tableName: form.tableName });
      form.columns = res.data;
    } else {
      const res = await genTableApi.getGenTableColumn({ tableId: form.id });
      form.columns = res.data;
    }
    await setSort();
    SmartLoading.hide();
  }
  if (step === 2) {
    const res = await genTableApi.getWorkSpace();
    javaPath.value = res.data;
    if (!form.id) {
      form.options.javaPath = res.data;
    }
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
        },
      });
    }
  }
};

/** 获取表名选项 */
async function getTableOptions() {
  const res = await genTableApi.findTables();
  tables.value = res.data;
}

/** 获取菜单选项 */
async function getMenuOptions() {
  const res = await menuApi.menuTreeFormat({ menuType: '1' });
  menus.value = res.data;
}

/** 获取关联字典 */
async function getDictOptions() {
  const res = await dictApi.dictList({ parentId: '0' });
  dictData.value = res.data;
}

// 级联选择器过滤
const filter = (inputValue, path) => {
  return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
};

function tableUpdate(value) {
  const table = tables.value.filter((item) => item.tableName === value);
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

const javaFilePath = computed(() => {
  let packagePath = 'src\\main\\java\\';
  if (form.packageName) {
    packagePath += `${form.packageName.replace('.', '\\')}\\`;
  }
  const resourcesPath = `smart-${form.moduleName}\\src\\main\\resources\\`;
  const businessPath = `smart-${form.moduleName}\\${packagePath}${form.moduleName}\\`;
  const entityPath = `smart-entity\\${packagePath}`;
  const servicePath = `smart-service\\${packagePath}`;
  return [
    `${form.options.javaPath}\\${businessPath}dao\\${form.className}Dao.java`,
    `${form.options.javaPath}\\${resourcesPath}mapper\\${form.className}Dao.xml`,
    `${form.options.javaPath}\\${businessPath}service\\${form.className}ServiceImpl.java`,
    `${form.options.javaPath}\\${businessPath}controller\\${form.className}Controller.java`,
    `${form.options.javaPath}\\${entityPath}entity\\${form.moduleName}\\${form.className}Entity.java`,
    `${form.options.javaPath}\\${servicePath}service\\${form.moduleName}\\${form.className}Service.java`,
  ];
});
const vueFilePath = computed(() => {
  const menuList = flatArray(menus.value);
  const arr = menuList.filter((menu) => menu.id === form.menuId);
  const underlineCase = camelToSnake(form.className);
  const res = underlineCase.replace('_', '-');
  let dir = res;
  if (arr.length > 0) {
    dir = `${arr[0].routeName}\\${dir}`;
  }
  const ant3Path = `${form.options.vuePath}\\src`;

  return [
    `${ant3Path}\\api\\${dir}\\${res}-api.js`,
    `${ant3Path}\\views\\${dir}\\columns.js`,
    `${ant3Path}\\views\\${dir}\\index.vue`,
    `${ant3Path}\\views\\${dir}\\components\\operate-${form.options.formType}.vue`,
  ];
});

/**
 * 驼峰转下划线
 *
 * @param str
 */
function camelToSnake(str) {
  if (str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2') // 在小写字母和大写字母之间插入下划线
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2') // 处理连续的大写字母与后续小写字母之间的分隔
        .toLowerCase(); // 转换为小写
  }
  return '';
}

watch(
    () => visible.value,
    (val) => {
      if (!val) {
        current.value = 1;
        tables.value = [];
        menus.value = [];
        formRef.value.resetFields();
      } else {
        getTableOptions();
        getMenuOptions();
        getDictOptions();
      }
    }
);

// ----------------------- 以下是暴露的方法内容 ------------------------
defineExpose({
  showForm,
});
watch(
    () => form.tableName,
    (val) => {
      if (!val) {
        form.className = null;
        form.comments = null;
        form.functionAuthor = null;
        form.packageName = null;
        form.moduleName = null;
        form.menuId = null;
        form.columns = [];
        form.options = {
          genType: '1',
          tableType: 'page',
          formType: 'modal',
          addStatus: true,
          updateStatus: true,
          deleteStatus: true,
          importStatus: true,
          exportStatus: true,
          javaPath: null,
          vuePath: import.meta.env.PROJECT_PATH,
        };
      }
    }
);
</script>
<style lang="less" scoped>
.tip-class {
  margin-top: 5px;
  color: red;
  font-weight: bold;
}

.item-class {
  display: ruby-text;
  font-size: 16px;
}

.form-format {
  padding: 0 20%;
  margin-top: 50px;
}

.table-css .ant-form-item {
  margin-bottom: 0;
}
</style>
