<template>
  <span>
    <a-tooltip title="全屏" v-if="showFullScreen && !fullScreenFlag">
      <a-button type="text" @click="fullScreen" size="small">
        <template #icon><fullscreen-outlined /></template>
      </a-button>
    </a-tooltip>
    <a-tooltip title="取消全屏" v-if="showFullScreen && fullScreenFlag">
      <a-button type="text" @click="fullScreen" size="small">
        <template #icon><fullscreen-exit-outlined /></template>
      </a-button>
    </a-tooltip>
    <a-tooltip title="刷新">
      <a-button type="text" @click="props.refresh" size="small">
        <template #icon><redo-outlined /></template>
      </a-button>
    </a-tooltip>
    <a-tooltip title="列设置">
      <a-button type="text" @click="showModal" size="small">
        <template #icon><setting-outlined /></template>
      </a-button>
    </a-tooltip>
    <SmartTableColumnModal ref="smartTableColumnModal" @change="updateColumn" />
  </span>
</template>

<script setup>
import _ from 'lodash';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import SmartTableColumnModal from './smart-table-column-modal.vue';
import { message } from 'ant-design-vue';
import { mergeColumn } from './smart-table-column-merge';
import { localRead, localSave } from '/@/utils/local-util.js';
import { useRoute } from 'vue-router';
const props = defineProps({
  // 表格列数组
  modelValue: {
    type: Array,
    default: new Array(),
  },
  // 刷新表格函数
  refresh: {
    type: Function,
    required: true,
  },
  // 表格id
  tableId: {
    type: [String, Number],
    default: null,
  },
  // 是否显示全屏
  showFullScreen: {
    type: Boolean,
    default: true,
  },
});
const tableMark = computed(() => (props.tableId ? props.tableId : useRoute().fullPath));
const emit = defineEmits(['update:modelValue']);

// 原始表格列数据（复制一份最原始的columns集合，以供后续各个地方使用）
let originalColumn = _.cloneDeep(props.modelValue);

// ----------------- 全屏 -------------------
const fullScreenFlag = ref(false);
function fullScreen() {
  if (fullScreenFlag.value) {
    //取消全屏
    exitFullscreen(document.querySelector('#smartAdminLayoutContent'));
    fullScreenFlag.value = false;
  } else {
    //全屏
    launchFullScreen(document.querySelector('#smartAdminLayoutContent'));
    fullScreenFlag.value = true;
  }
}

//判断各种浏览器 -全屏
function launchFullScreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else {
    message.error('当前浏览器不支持部分全屏！');
  }
}
//判断各种浏览器 -退出全屏
function exitFullscreen(element) {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

// ----------------- 弹窗 修改表格列 -------------------

const smartTableColumnModal = ref();
function showModal() {
  smartTableColumnModal.value.show(originalColumn, tableMark.value);
}

// 将弹窗修改的列数据，赋值给原表格 列数组
function updateColumn(changeColumnArray) {
  //合并列
  const newColumns = mergeColumn(_.cloneDeep(originalColumn), changeColumnArray);
  localSave(tableMark.value + '__columns_setting', JSON.stringify(changeColumnArray));
  emit(
      'update:modelValue',
      newColumns.filter((e) => e.showFlag)
  );
}
// 将弹窗修改的列数据，赋值给原表格 列数组
function getColumn() {
  return new Promise((resolve, reject) => {
    const columnsSetting = localRead(tableMark.value + '__columns_setting');
    if (columnsSetting) {
      const setting = JSON.parse(columnsSetting);
      //合并列
      const newColumns = mergeColumn(_.cloneDeep(originalColumn), setting);
      console.log(
          'columnsSetting',
          newColumns.filter((e) => e.showFlag)
      );
      emit(
          'update:modelValue',
          newColumns.filter((e) => e.showFlag)
      );
      resolve();
    }
  });
}
onMounted(async () => {
  await getColumn();
});
// ========= 定义 watch 监听 ===============
watch(
    () => tableMark.value,
    async (e) => {
      if (e) {
        originalColumn = _.cloneDeep(props.modelValue);
        await getColumn();
      }
    },
    { immediate: true }
);
</script>
