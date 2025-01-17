<template>
  <a-modal
      :open="visible"
      title="选择身份"
      :maskClosable="true"
      :width="960"
      centered
      @cancel="closeModal"
      @ok="submitModal"
  >
    <a-table
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type:'radio' }"
        size="small"
        :dataSource="data"
        bordered
        :columns="columns"
        rowKey="id"
        :pagination="false"
    />
  </a-modal>
</template>
<script setup>
import {computed, ref} from "vue";
import {columns} from "./colums.js";
import {message} from "ant-design-vue";
import {localRead} from "/@/utils/local-util.js";
import LocalStorageKeyConst from "/@/constants/local-storage-key-const.js";

const emit = defineEmits(['choose']);
const props = defineProps({
  data:{
    type: Array,
    required: true
  }
});
// -------------- 单选操作 --------------
const selectedRowKeys = ref([]);
let selectedRows = [];
const hasSelected = computed(() => selectedRowKeys.value.length > 0);
// 选中触发
function onSelectChange(keyArray, selectRows) {
  selectedRowKeys.value = keyArray;
  selectedRows = selectRows;
}
const visible = ref(false)

function submitModal() {
  if(hasSelected.value){
    emit('choose', selectedRows[0].id)
    visible.value = false;
  } else {
    message.warning('至少选择一个身份登录')
  }

}

function openModal() {
  const identityId = localRead(LocalStorageKeyConst.IDENTITY_ID);
  if(identityId){
    selectedRowKeys.value = [identityId]
  }
  visible.value = true;
}
function closeModal() {
  visible.value = false;
}
defineExpose({
  openModal
})
</script>

<style scoped lang="less">

</style>
