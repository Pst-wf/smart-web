<template>
  <a-drawer
      :body-style="{ paddingBottom: '80px' }"
      :maskClosable="true"
      title="日志详情"
      :open="visible"
      :width="960"
      @close="onClose"
  >
    <a-descriptions :column="6" layout="vertical" bordered :labelStyle="{fontWeight:'bold'}">
      <a-descriptions-item label="模块">{{ rowData.logModule }}</a-descriptions-item>
      <a-descriptions-item label="操作类型">{{ $smartEnumPlugin.getDescByValue('OPERATE_LOG_TYPE_ENUM', rowData.logType) }}</a-descriptions-item>
      <a-descriptions-item label="操作人">{{ rowData.userNickname }}</a-descriptions-item>
      <a-descriptions-item label="操作人账号">{{ rowData.username }}</a-descriptions-item>
      <a-descriptions-item label="IP地址">{{ rowData.ip }}</a-descriptions-item>
      <a-descriptions-item label="操作时间">{{ rowData.createDate }}</a-descriptions-item>
      <a-descriptions-item label="方法名" :span="3">
        {{ rowData.logMethod }}
      </a-descriptions-item>
      <a-descriptions-item label="描述" :span="3">
        {{ rowData.logDesc }}
      </a-descriptions-item>
      <a-descriptions-item label="参数" :span="3">
        <JsonViewer
            boxed
            copyable
            expanded
            :expand-depth="99"
            theme="my-awesome-json-theme"
            :value="rowData?.logParams ? JSON.parse(rowData?.logParams) : {}"
        />
      </a-descriptions-item>
      <a-descriptions-item label="结果" :span="3">
        <JsonViewer
            boxed
            copyable
            expanded
            :expand-depth="99"
            theme="my-awesome-json-theme"
            :value="rowData?.logResult ? JSON.parse(rowData?.logResult) : {}"
        />
      </a-descriptions-item>
    </a-descriptions>
    <div class="footer">
      <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
    </div>
  </a-drawer>
</template>
<script setup>
import { ref, watch} from 'vue';
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';

// ----------------------- 以下是字段定义 emits props ------------------------
const emit = defineEmits(['reloadList']);

// ----------------------- 展开、隐藏编辑窗口 ------------------------
const visible = ref(false);
const rowData = ref({});

async function showDrawer(val) {
  rowData.value = val
  visible.value = true;
}

function onClose() {
  visible.value = false;
}

watch(
    () => visible.value,
    (val) => {
      if (!val) {
        rowData.value = {}
        emit('reloadList');
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
</style>
<style>
.jv-my-awesome-json-theme {
  margin-top: 20px;
  background: #99989830;
  white-space: nowrap;
  color: #525252;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;

  .jv-ellipsis {
    color: #999;
    background-color: #eee;
    display: inline-block;
    line-height: 0.9;
    font-size: 0.9em;
    padding: 0 4px 2px 4px;
    border-radius: 3px;
    vertical-align: 2px;
    cursor: pointer;
    user-select: none;
  }
  .jv-button {
    color: #49b3ff;
  }
  .jv-key {
    color: #111111;
  }
  .jv-item {
    &.jv-array {
      color: #111111;
    }
    &.jv-boolean {
      color: #f70808ed;
    }
    &.jv-function {
      color: #067bca;
    }
    &.jv-number {
      color: #f70808ed;
    }
    &.jv-number-float {
      color: #f70808ed;
    }
    &.jv-number-integer {
      color: #f70808ed;
    }
    &.jv-object {
      color: #111111;
    }
    &.jv-undefined {
      color: #e08331;
    }
    &.jv-string {
      color: #30be4f;
      word-break: break-word;
      white-space: normal;
    }
  }
  .jv-code {
    .jv-toggle {
      &:before {
        padding: 0 2px;
        border-radius: 2px;
      }
      &:hover {
        &:before {
          background: #eee;
        }
      }
    }
  }
}
</style>

