<template>
  <div>
    <div class="tree-header"></div>
    <p>设置角色对应的功能操作、后台管理权限</p>
    <div class="btn-group">
      <a-button class="button-style" type="primary" @click="updateDataScope"
                v-privilege="'role:update'"> 保存
      </a-button>
      <a-button class="button-style" @click="getDataScope"> 刷新</a-button>
    </div>
    <div style="overflow: auto">
      <div class="custom-css">
        <div class="radio">
          <ul>
            <RoleTreeMenu :tree="dataScopeList" :selected="selectedDataScopeList" :index="0" @changeSelected="changeSelected"/>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {message} from 'ant-design-vue';
import _ from 'lodash';
import {inject, onMounted, ref, watch} from 'vue';
import {roleApi} from '/src/api/system/role-api';
import {smartSentry} from '/src/lib/smart-sentry';
import {menuApi} from "/@/api/system/menu-api.js";
import RoleTreeMenu from './role-tree-menu.vue';
import {roleMenuApi} from "/@/api/system/role-menu-api.js";

const props = defineProps({
  value: Number,
});

// ----------------------- 显示 ---------------------------------

let selectRoleId = inject('selectRoleId');
let dataScopeList = ref([]);
let selectedDataScopeList = ref([]);

watch(
  () => selectRoleId.value,
  () => getRoleDataScope()
);

onMounted(getDataScope);

// 获取系统支持的所有种类的数据范围
async function getDataScope() {
  let result = await menuApi.scopeTreeFormat();
  dataScopeList.value = result.data;
  await getRoleDataScope();
}

// 获取数据范围根据角色id，并赋予选中状态
async function getRoleDataScope() {
  let result = await roleMenuApi.getRoleScopes(selectRoleId.value);
  selectedDataScopeList.value = result.data;
}

function changeSelected(val, arr){
  let format = selectedDataScopeList.value
  if(format.indexOf(val) === -1) {
    if(arr){
      format = format.filter(x=> !arr.includes(x))
    }
    format.push(val)
  } else {
    format.splice(format.indexOf(val), 1);
  }
  selectedDataScopeList.value = format
}
// ----------------------- 数据范围更新 ---------------------------------
// 更新
async function updateDataScope() {
  try {
    let data = {
      id: selectRoleId.value,
      scopeIds: selectedDataScopeList.value
    };
    await roleMenuApi.setRoleScopes(data);
    message.success('保存成功');
    await getDataScope();
  } catch (e) {
    smartSentry.captureError(e);
  }
}
</script>
<style scoped lang="less">
.btn-group {
  text-align: right;
}

.button-style {
  margin: 0 10px;
}
.custom-css{
  width: 100%;
  white-space:nowrap;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  display: inline-flex;
  flex-wrap: wrap;
  column-gap: 8px;
}
.radio {
  padding: 0 15px;

  :deep(ul li::marker) {
    content: '';
  }

  :deep(ul) {
    padding: 0;
    margin: 0;

    li {
      list-style: none;
      padding: 0;
      margin: 10px 0;

      .menu {
        border-bottom: 1px solid rgb(240, 240, 240);
        display: flex;
        align-items: center;
        line-height: 25px;
      }

      .point {
        display: flex;
        align-items: center;

        .point-label {
          flex: 1;
          padding-left: 40px;
          border-left: 1px rgb(240, 240, 240) solid;
        }
      }

      .label-class {
        min-width: 150px;
      }
    }
  }
}
.tree-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
}
</style>
