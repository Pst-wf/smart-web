<template>
  <a-drawer
      :body-style="{ paddingBottom: '80px' }"
      :maskClosable="true"
      :title="disabled ? '查看' : form.id ? '编辑' : '新增'"
      :open="visible"
      :width="600"
      @close="onClose"
  >
    <a-form ref="formRef" :labelCol="{ span: 4 }" :labelWrap="true" :model="form" :rules="rules" :disabled="disabled">
      <a-form-item label="菜单类型" name="menuType">
        <a-radio-group v-model:value="form.menuType" button-style="solid" :disabled="form.id !== null">
          <a-radio-button v-for="item in MENU_TYPE_ENUM" :key="item.value" :value="item.value">
            {{ item.desc }}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="上级菜单">
        <a-tree-select
            v-model:value="form.parentId"
            :fieldNames="{ label: 'label', key: 'id', value: 'id' }"
            :treeData="treeData"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择菜单"
            allow-clear
            treeNodeFilterProp="label"
        />
      </a-form-item>
      <a-form-item label="菜单名称" name="menuName">
        <a-input v-model:value="form.menuName" placeholder="请输入菜单名称"/>
      </a-form-item>
      <a-form-item label="路由名称" name="routeName">
        <a-input v-model:value="form.routeName" placeholder="请输入路由名称">
          <template #suffix>
            <a-tooltip>
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
              <template v-slot:title>
                <span v-html="`路由名称需根据文件结构来命名<br/>文件结构: 一级/二级/三级<br/>路由名称: 一级_二级_三级`" ></span>
              </template>
            </a-tooltip>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="路由地址" name="routePath">
        <a-input v-model:value="form.routePath" disabled placeholder="请输入路由地址"/>
      </a-form-item>
      <a-form-item v-if="form.menuType === MENU_TYPE_ENUM.MENU.value" label="组件" name="component">
        <a-input v-model:value="component" disabled placeholder="请输入组件"/>
      </a-form-item>

      <a-form-item label="菜单图标" name="antIcon">
        <IconSelect @updateIcon="selectIcon">
          <template #iconSelect>
            <a-input v-model:value="form.antIcon" placeholder="请输入菜单图标" style="width: 90%"/>
            <component :is="$antIcons[form.antIcon]" class="smart-margin-left15" style="font-size: 20px"/>
          </template>
        </IconSelect>
      </a-form-item>
      <a-form-item label="排序" name="order">
        <a-input-number v-model:value="form.order" :min="0" placeholder="请输入排序" style="width: 100%"/>
      </a-form-item>
      <a-form-item v-if="isSuperAdmin" label="权重" name="weight">
        <a-radio-group v-model:value="form.weight" button-style="solid">
          <a-radio-button v-for="item in MENU_WEIGHT_ENUM" :key="item.value" :value="item.value">
            {{ item.desc }}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="form.menuType === MENU_TYPE_ENUM.MENU.value" label="外链地址" name="href">
        <a-input v-model:value="form.href" placeholder="请输入外链地址"/>
      </a-form-item>
      <a-form-item v-if="form.menuType === MENU_TYPE_ENUM.MENU.value" label="是否缓存" name="keepAlive">
        <a-switch v-model:checked="form.keepAlive" checked-children="是" un-checked-children="否"/>
      </a-form-item>
      <a-form-item label="隐藏菜单" name="hideInMenu">
        <a-switch v-model:checked="form.hideInMenu" checked-children="是" un-checked-children="否"/>
      </a-form-item>
      <a-form-item label="菜单状态" name="status">
        <a-switch v-model:checked="form.status" checked-value="1" un-checked-value="0" checked-children="启用"
                  un-checked-children="停用"/>
      </a-form-item>
      <a-form-item label="路由参数" v-if="form.menuType === MENU_TYPE_ENUM.MENU.value">
        <a-form-item>
          <a-button type="dashed" block @click="addQuery" style="width: 20%">
            <PlusOutlined/>
            增加
          </a-button>
        </a-form-item>
        <a-space
            v-for="(item ,index) in form.query"
            :key="index"
            style="display: flex; margin-bottom: 8px"
            align="baseline"
        >
          <a-form-item>
            <a-input v-model:value="item.key" placeholder="键"/>
          </a-form-item>
          <a-form-item>
            <a-input v-model:value="item.value" placeholder="值 "/>
          </a-form-item>
          <MinusCircleOutlined @click="removeQuery(index)"/>
        </a-space>
      </a-form-item>
      <a-form-item label="按钮" v-if="form.menuType === MENU_TYPE_ENUM.MENU.value">
        <a-form-item>
          <a-button type="dashed" block @click="addButton" style="width: 20%">
            <PlusOutlined/>
            增加
          </a-button>
        </a-form-item>
        <a-space
            v-for="(button ,index) in form.buttons"
            :key="index"
            style="display: flex; margin-bottom: 8px"
            align="baseline"
        >
          <a-form-item
              :rules="{
          required: true,
          message: '按钮code不能为空',
        }"
          >
            <a-input v-model:value="button.code" placeholder="按钮编码"/>
          </a-form-item>
          <a-form-item>
            <a-input v-model:value="button.name" placeholder="按钮描述 "/>
          </a-form-item>
          <MinusCircleOutlined @click="removeButton(index)"/>
        </a-space>
      </a-form-item>
    </a-form>
    <div class="footer">
      <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
      <a-button v-if="!disabled" style="margin-right: 8px" type="primary" @click="submit()">提交</a-button>
    </div>
  </a-drawer>
</template>
<script setup>
import {message} from 'ant-design-vue';
import _ from 'lodash';
import {computed, reactive, ref, watch} from 'vue';
import {menuApi} from '/@/api/system/menu-api';
import IconSelect from '/@/components/framework/icon-select/index.vue';
import {MENU_DEFAULT_PARENT_ID, MENU_TYPE_ENUM, MENU_WEIGHT_ENUM} from '/@/constants/system/menu-const';
import {smartSentry} from '/@/lib/smart-sentry';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {getRoutePathByRouteName} from "/@/utils/common-util.js";
import {localRead} from "/@/utils/local-util.js";
import LocalStorageKeyConst from "/@/constants/local-storage-key-const.js";
import {debounceAsync} from "/@/utils/debounce-util.js";

// ----------------------- 以下是字段定义 emits props ------------------------
// emit
const emit = defineEmits(['reloadList']);

// ----------------------- 展开、隐藏编辑窗口 ------------------------

// 是否展示抽屉
const visible = ref(false);
// 是否可编辑
const disabled = ref(false);
//展开编辑窗口
async function showDrawer(rowData, bool) {
  disabled.value = bool;
  Object.assign(form, formDefault);
  if (rowData && !_.isEmpty(rowData)) {
    Object.assign(form, rowData);
    if (form.parentId === MENU_DEFAULT_PARENT_ID) {
      form.parentId = null;
    }
    if (!form.query) {
      form.query = [];
    }
    if (!form.buttons) {
      form.buttons = [];
    }
    if (form.menuType === MENU_TYPE_ENUM.MENU.value) {
      handleUpdateRoutePathByRouteName()
    }
  }
  visible.value = true;
}

// 隐藏窗口
function onClose() {
  visible.value = false;
}

// ----------------------- form表单相关操作 ------------------------

const formRef = ref();
const formDefault = {
  id: null,
  menuType: MENU_TYPE_ENUM.CATALOG.value,
  menuName: null,
  routeName: null,
  routePath: null,
  pathParam: null,
  props: null,
  redirect: null,
  antIcon: null,
  iconType: '1',
  parentId: '0',
  status: '1',
  keepAlive: false,
  constant: false,
  order: 0,
  href: null,
  hideInMenu: false,
  activeMenu: null,
  multiTab: false,
  fixedIndexInTab: null,
  weight: MENU_WEIGHT_ENUM.NORMAL.value,
  query: [],
  buttons: []
};
let form = reactive({...formDefault});

const rules = {
  menuType: [{required: true, message: '菜单类型不能为空'}],
  menuName: [
    {required: true, message: '菜单名称不能为空'},
    {max: 20, message: '菜单名称不能大于20个字符', trigger: 'blur'},
  ],
  routeName: [
    {required: true, message: '路由名称不能为空'},
    {max: 100, message: '路由名称不能大于100个字符', trigger: 'blur'},
  ],
};

function validateForm(formRef) {
  return new Promise((resolve) => {
    formRef
        .validate()
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
    // 若无父级ID 默认设置为0
    if (!params.parentId) {
      params.parentId = '0';
    }
    if (params.query && params.query.length === 0) {
      params.query = null;
    }
    if (params.id) {
      await menuApi.updateMenu(params);
    } else {
      await menuApi.addMenu(params);
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

function selectIcon(icon) {
  form.antIcon = icon;
}

let treeData = ref([]);

async function queryMenuTree() {
  let res = await menuApi.menuTreeFormat({menuType: '1'});
  treeData.value = res.data;
}

const component = ref(null);

function handleUpdateRoutePathByRouteName() {
  if (form.routeName) {
    form.routePath = getRoutePathByRouteName(form.routeName);
    if (form.menuType === '2') {
      component.value = form.routePath + "/index.vue"
    }
  } else {
    form.routePath = '';
    component.value = null;
  }
}

const removeButton = index => {
  form.buttons.splice(index, 1);
};
const addButton = () => {
  form.buttons.push({
    code: '',
    name: '',
  });
};

const removeQuery = index => {
  form.query.splice(index, 1);
};
const addQuery = () => {
  form.query.push({
    key: '',
    value: '',
  });
};

const isSuperAdmin = computed(() => {
  const userInfo = localRead(LocalStorageKeyConst.USER_INFO);
  if (userInfo) {
    return JSON.parse(userInfo).userId === 'system'
  }
  return false;
});

watch(
    () => visible.value,
    (val) => {
      if (val) {
        queryMenuTree();
      } else {
        formDefault.query = []
        formDefault.buttons = []
        Object.assign(form, formDefault);
        formRef.value.resetFields();
        component.value = null
        treeData.value = []
      }
    },
);
watch(
    () => form.routeName,
    () => {
      handleUpdateRoutePathByRouteName();
    }
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
</style>
