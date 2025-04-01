<template>
  <a-drawer
    :body-style="{ paddingBottom: '80px' }"
    :maskClosable="true"
    :title="disabled ? '查看' : form.id ? '编辑' : '新增'"
    :open="visible"
    :width="1200"
    :get-container="SmartLoading.spin"
    @close="onClose"
  >
    <a-form ref="formRef" :labelCol="{ span: 6 }" :labelWrap="true" :model="form" :rules="rules" :disabled="disabled">
      <a-divider orientation="left" v-if="operateType !== 'trigger'">基础配置</a-divider>
      <a-row v-if="operateType !== 'trigger'">
        <a-col :span="12">
          <a-form-item label="执行器" name="jobGroup">
            <a-select
              v-model:value="form.jobGroup"
              allowClear
              :options="groupOptions"
              :field-names="{ label: 'appName', value: 'id' }"
              :showSearch="true"
              optionFilterProp="appName"
              placeholder="请选择执行器"
              style="margin: -5px 0; width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="任务描述" name="jobDesc">
            <a-input v-model:value="form.jobDesc" placeholder="请输入任务描述" allowClear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row v-if="operateType !== 'trigger'">
        <a-col :span="12">
          <a-form-item label="报警邮箱" name="alarmEmail">
            <a-input v-model:value="form.alarmEmail" placeholder="请输入报警邮箱" allowClear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider orientation="left" v-if="operateType !== 'trigger'">调度配置</a-divider>
      <a-row v-if="operateType !== 'trigger'">
        <a-col :span="12">
          <a-form-item label="调度类型" name="scheduleType">
            <SmartEnumSelect enum-name="SCHEDULE_TYPE_ENUM" v-model:value="form.scheduleType" placeholder="请选择调度配置" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="调度配置" name="scheduleConf" v-if="form.scheduleType !== 'NONE'">
            <a-input
              v-model:value="form.scheduleConf"
              :placeholder="$smartEnumPlugin.getDescByValue('SCHEDULE_CONF_ENUM', form.scheduleType)"
              allowClear
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider orientation="left" v-if="operateType !== 'trigger'">任务配置</a-divider>
      <a-row v-if="operateType !== 'trigger'">
        <a-col :span="12">
          <a-form-item label="运行模式" name="glueType">
            <SmartEnumSelect enum-name="GLUE_TYPE_ENUM" v-model:value="form.glueType" placeholder="请选择运行模式" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="任务处理器" name="executorHandler">
            <a-input v-model:value="form.executorHandler" placeholder="请输入任务处理器" allowClear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="任务参数" name="executorParam" :labelCol="{ span: 3 }">
            <a-textarea :auto-size="{ minRows: 4 }" v-model:value="form.executorParam" placeholder="请输入任务参数" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row v-if="operateType === 'trigger'">
        <a-col :span="24">
          <a-form-item label="执行器地址" name="addressList" :labelCol="{ span: 3 }">
            <a-textarea :auto-size="{ minRows: 4 }" v-model:value="form.addressList" placeholder="请输入执行器地址" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider orientation="left" v-if="operateType !== 'trigger'">高级配置</a-divider>
      <a-row v-if="operateType !== 'trigger'">
        <a-col :span="12">
          <a-form-item label="路由策略" name="executorRouteStrategy">
            <SmartEnumSelect enum-name="EXECUTOR_ROUTE_STRATEGY_ENUM" v-model:value="form.executorRouteStrategy" placeholder="请选择路由策略" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="子任务ID" name="childJobId">
            <a-input v-model:value="form.childJobId" placeholder="请输入子任务的任务ID，如存在多个则逗号分隔" allowClear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row v-if="operateType !== 'trigger'">
        <a-col :span="12">
          <a-form-item label="调度过期策略" name="misfireStrategy">
            <SmartEnumSelect enum-name="MISFIRE_STRATEGY_ENUM" v-model:value="form.misfireStrategy" placeholder="请选择调度过期策略" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="阻塞处理策略" name="executorBlockStrategy">
            <SmartEnumSelect enum-name="EXECUTOR_BLOCK_STRATEGY_ENUM" v-model:value="form.executorBlockStrategy" placeholder="请选择阻塞处理策略" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row v-if="operateType !== 'trigger'">
        <a-col :span="12">
          <a-form-item label="超时时间" name="executorTimeout">
            <a-input-number style="width: 100%" v-model:value="form.executorTimeout" :min="0" placeholder="请输入超时时间" allowClear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="失败重试次数" name="executorFailRetryCount">
            <a-input-number style="width: 100%" v-model:value="form.executorFailRetryCount" :min="0" placeholder="请输入失败重试次数" allowClear />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="footer">
      <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
      <a-button v-if="!disabled" style="margin-right: 8px" type="primary" @click="submit()">提交</a-button>
    </div>
  </a-drawer>
</template>
<script setup>
  import { message } from 'ant-design-vue';
  import _ from 'lodash';
  import { reactive, ref, watch } from 'vue';
  import { taskJobApi } from '/@/api/task/task-job-api.js';
  import { smartSentry } from '/@/lib/smart-sentry';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { taskGroupApi } from '/@/api/task/task-group-api.js';
  import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
  import { debounceAsync } from '/@/utils/debounce-util.js';

  // ----------------------- 以下是字段定义 emits props ------------------------
  const emit = defineEmits(['reloadList']);

  // ----------------------- 展开、隐藏编辑窗口 ------------------------
  const visible = ref(false);
  const operateType = ref(null);
  // 是否可编辑
  const disabled = ref(false);
  async function showDrawer(rowData, bool) {
    disabled.value = bool;
    Object.assign(form, formDefault);
    if (operateType.value === 'trigger' && rowData && !_.isEmpty(rowData)) {
      form = {};
      form.id = rowData.id;
    }
    if (operateType.value === 'copy' && rowData && !_.isEmpty(rowData)) {
      Object.assign(form, rowData);
      form.id = null;
    }
    if (operateType.value === 'edit' && rowData && !_.isEmpty(rowData)) {
      Object.assign(form, rowData);
    }
    visible.value = true;
  }

  function onClose() {
    Object.assign(form, formDefault);
    formRef.value.resetFields();
    visible.value = false;
  }

  // ----------------------- form表单相关操作 ------------------------

  const formRef = ref();
  const formDefault = {
    id: null,
    jobGroup: null,
    jobDesc: null,
    alarmEmail: null,
    scheduleType: 'CRON',
    scheduleConf: null,
    misfireStrategy: 'DO_NOTHING',
    executorRouteStrategy: 'FIRST',
    executorHandler: null,
    executorParam: null,
    executorBlockStrategy: 'SERIAL_EXECUTION',
    executorTimeout: 0,
    executorFailRetryCount: 0,
    glueType: 'BEAN',
    childJobId: null,
    addressList: null,
  };
  let form = reactive({ ...formDefault });
  const rules = {
    jobGroup: [{ required: true, message: '执行器不能为空' }],
    jobDesc: [{ required: true, message: '任务描述不能为空' }],
    scheduleType: [{ required: true, message: '调度类型不能为空' }],
    scheduleConf: [{ required: true, message: '调度配置不能为空' }],
    misfireStrategy: [{ required: true, message: '调度过期策略不能为空' }],
    executorRouteStrategy: [{ required: true, message: '路由策略不能为空' }],
    executorHandler: [{ required: true, message: '任务处理器不能为空' }],
    executorBlockStrategy: [{ required: true, message: '阻塞处理策略不能为空' }],
    executorTimeout: [{ required: true, message: '超时时间不能为空' }],
    executorFailRetryCount: [{ required: true, message: '失败重试次数不能为空' }],
    glueType: [{ required: true, message: '运行模式不能为空' }],
  };
  const groupOptions = ref([]);

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

  async function getGroupOptions() {
    const res = await taskGroupApi.taskGroupList();
    groupOptions.value = res.data;
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
      if (operateType.value === 'trigger') {
        await taskJobApi.triggerTaskJob(params);
      } else {
        if (params.id) {
          await taskJobApi.updateTaskJob(params);
        } else {
          await taskJobApi.addTaskJob(params);
        }
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
  watch(
    () => visible.value,
    (val) => {
      if (!val) {
        formRef.value.resetFields();
        groupOptions.value = [];
        operateType.value = null;
      } else {
        if (operateType.value !== 'trigger') {
          getGroupOptions();
        }
      }
    }
  );

  // ----------------------- 以下是暴露的方法内容 ------------------------
  defineExpose({
    operateType,
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
