<!-- 角色 列表 -->
<template>
  <a-card title="角色列表" class="role-container" style="padding: 0">
    <template #extra>
      <a-button type="primary" size="small" @click="showRoleFormModal" v-privilege="'role:add'">添加</a-button>
    </template>
    <a-menu mode="vertical" v-model:selectedKeys="selectedKeys">
      <a-menu-item v-for="item in roleList" :key="item.id">
        <a-popover placement="right">
          <template #content>
            <div style="display: flex; flex-direction: column">
              <a-button type="text" @click="showRoleFormModal(item, true)" >查看</a-button>
              <a-button type="text" @click="showRoleFormModal(item)" v-privilege="'role:update'">编辑</a-button>
              <a-button type="text" @click="deleteRole(item.id)" v-privilege="'role:delete'">删除</a-button>
            </div>
          </template>
          {{ item.roleName }}
          <a-tag style="margin-left: 10px" v-if="item.status === '0'" color="red"> 已停用</a-tag>
        </a-popover>
      </a-menu-item>
    </a-menu>
  </a-card>
  <RoleFormModal ref="roleFormModal" @refresh="queryAllRole" />
</template>
<script setup>
import { message, Modal } from 'ant-design-vue';
import _ from 'lodash';
import { computed, onMounted, ref } from 'vue';
import { roleApi } from '/src/api/system/role-api';
import { SmartLoading } from '/src/components/framework/smart-loading';
import RoleFormModal from '../role-form-modal/index.vue';
import { smartSentry } from '/src/lib/smart-sentry';

// ----------------------- 角色列表显示 ---------------------
const roleList = ref([]);

onMounted(queryAllRole);

// 查询列表
async function queryAllRole() {
  let res = await roleApi.roleList(null);
  roleList.value = res.data;
  if (!_.isEmpty(res.data) && res.data[0].id) {
    selectedKeys.value = [res.data[0].id];
  }
}

let selectedKeys = ref([]);
const selectRoleId = computed(() => {
  if (!selectedKeys.value && _.isEmpty(selectedKeys.value)) {
    return null;
  }
  return selectedKeys.value[0];
});
// ----------------------- 添加、修改、删除 ---------------------------------
const roleFormModal = ref();

// 显示表单框
function showRoleFormModal(role, bool) {
  roleFormModal.value.showModal(role, bool);
}

// 删除角色
function deleteRole(roleId) {
  if (!roleId) {
    return;
  }
  Modal.confirm({
    title: '提示',
    content: '确定要删除该角色么？',
    okText: '确定',
    okType: 'danger',
    async onOk() {
      SmartLoading.show();
      try {
        await roleApi.deleteRole({deleteIds: [roleId]});
        message.info('删除成功');
        queryAllRole();
      } catch (e) {
        smartSentry.captureError(e);
      } finally {
        SmartLoading.hide();
      }
    },
    cancelText: '取消',
    onCancel() {},
  });
}

// ----------------------- 以下是暴露的方法内容 ----------------------------
defineExpose({
  selectRoleId,
});
</script>
<style scoped lang="less">
.role-container {
  height: 100%;
  overflow-y: auto;

  :deep(.ant-card-body) {
    padding: 5px;
  }
}
.ant-menu-inline,
.ant-menu-vertical,
.ant-menu-vertical-left {
  border-right: none;
}
</style>
