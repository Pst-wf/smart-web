<script setup>
import {computed, onMounted, ref} from "vue";
import {configApi} from "/@/api/system/config-api.js";
import {debounceAsync} from "/@/utils/debounce-util.js";
import {message} from "ant-design-vue";

const map = ref({});
const emailConfig = ref({});
const defaultEmailConfig = ref({});
const tokenMap = ref({});
const REG_EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
const lockCycle = ref(null);
const lockTimes = ref(null);
const lockDuration = ref(null);
/** 发件箱校验 */
const validationFrom = computed(() => {
  return REG_EMAIL.test(emailConfig?.value?.from) ? undefined : 'error';
});

async function getConfig() {
  const res = await configApi.systemConfigMap();
  map.value = res.data;
  if (res.data.sys_email_config) {
    emailConfig.value = JSON.parse(res.data.sys_email_config);
    defaultEmailConfig.value = JSON.parse(res.data.sys_email_config);
  }
  if (res.data.sys_login_fail_check_cycle) {
    lockCycle.value = Number(res.data.sys_login_fail_check_cycle);
  }
  if (res.data.sys_login_fail_times) {
    lockTimes.value = Number(res.data.sys_login_fail_times);
  }
  if (res.data.sys_login_fail_lock_duration) {
    lockDuration.value = Number(res.data.sys_login_fail_lock_duration);
  }
}

async function update(configKey, configValue) {
  map.value[configKey] = configValue;
  await configApi.updateByKey({configKey: configKey, configValue: configValue});
  message.success('保存成功');
}

const updateAsync = debounceAsync((configKey, configValue) => update(configKey, configValue), 200, true);
const updateEmailAsync = debounceAsync((emailConfigKey) => {
  if (emailConfigKey === 'from' && validationFrom.value === 'error') {
    message.error('填写的数据不正确，保存失败!');
    return;
  }
  const params = {};
  params[emailConfigKey] = emailConfig.value[emailConfigKey];
  Object.assign(defaultEmailConfig.value, params);
  update('sys_email_config', JSON.stringify(defaultEmailConfig.value))
}, 200, true);

async function getTokenValue() {
  const res = await configApi.getTokenExpiration();
  tokenMap.value = res.data;
}

async function updateToken(key, value) {
  tokenMap.value[key] = value;
  await configApi.updateTokenByKey({key: key, value: value});
  message.success('保存成功');
}

const updateTokenAsync = debounceAsync((key, value) => updateToken(key, value), 200, true);

async function init() {
  await getConfig();
  await getTokenValue();
}

onMounted(init);
</script>

<template>
  <a-form :labelCol="{ span: 4 }" :labelWrap="true" :model="map">
    <a-card title="框架设置" class="card-class" size="small" :bordered="false" :hoverable="false"
            :headStyle="{borderBottom: 0}">
      <a-row>
        <a-col :span="24">
          <a-form-item v-if="map.has_dept_post !== undefined" label="是否开启组织机构" name="has_dept_post">
            <a-switch @change="(val) => updateAsync('has_dept_post',val)" v-model:checked="map.has_dept_post"
                      checked-value="1" un-checked-value="0"
                      checked-children="开" un-checked-children="关"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <a-card title="认证设置" class="card-class" size="small" :bordered="false" :hoverable="false"
            :headStyle="{borderBottom: 0}">
      <a-row>
        <a-col :span="24">
          <a-form-item v-if="map.captcha_auth !== undefined" label="PC端是否开启验证码" name="captcha_auth">
            <a-switch @change="(val) => updateAsync('captcha_auth',val)" v-model:checked="map.captcha_auth"
                      checked-value="1" un-checked-value="0"
                      checked-children="开" un-checked-children="关"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item v-if="map.auto_sign_up !== undefined" label="开启会员注册" name="auto_sign_up">
            <a-switch @change="(val) => updateAsync('auto_sign_up',val)" v-model:checked="map.auto_sign_up"
                      checked-value="1" un-checked-value="0"
                      checked-children="开" un-checked-children="关"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row v-if="tokenMap.access_token_validity !== undefined">
        <a-col :span="12">
          <a-form-item label="AccessToken有效期" name="access_token_validity" :label-col="{span: 8}">
            <a-input-number v-model:value="tokenMap.access_token_validity" placeholder="请输入AccessToken有效期" allowClear
                            style="width: 100%" :formatter="(value) => `${value}`" :precision="0"
                            :parser="(value) => value.replace('.', '')" addon-after="毫秒" :min="0"/>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="margin-left: 20px">
          <a-button type="primary" @click="updateTokenAsync('access_token_validity',tokenMap.access_token_validity )">
            保存
          </a-button>
        </a-col>
      </a-row>
      <a-row v-if="tokenMap.refresh_token_validity !== undefined">
        <a-col :span="12">
          <a-form-item label="RefreshToken有效期" name="refresh_token_validity" :label-col="{span: 8}">
            <a-input-number v-model:value="tokenMap.refresh_token_validity" placeholder="请输入RefreshToken有效期" allowClear
                            style="width: 100%" :formatter="(value) => `${value}`" :precision="0"
                            :parser="(value) => value.replace('.', '')" addon-after="毫秒" :min="0"/>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="margin-left: 20px">
          <a-button type="primary" @click="updateTokenAsync('refresh_token_validity',tokenMap.refresh_token_validity )">
            保存
          </a-button>
        </a-col>
      </a-row>
    </a-card>
    <a-card title="登陆失败锁定设置" class="card-class" size="small" :bordered="false" :hoverable="false"
            :headStyle="{borderBottom: 0}">
      <a-row>
        <a-col :span="24">
          <a-form-item v-if="map.sys_login_fail_lock_status !== undefined" label="开启状态" name="sys_login_fail_lock_status">
            <a-switch @change="(val) => updateAsync('sys_login_fail_lock_status',val)" v-model:checked="map.sys_login_fail_lock_status"
                      checked-value="1" un-checked-value="0"
                      checked-children="开" un-checked-children="关"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row v-if="map.sys_login_fail_lock_status === '1'">
        <a-col :span="12">
          <a-form-item label="检查周期" name="lockCycle" :label-col="{span: 8}">
            <a-input-number v-model:value="lockCycle" placeholder="请输入检查周期" allowClear
                            style="width: 100%" :formatter="(value) => `${value}`" :precision="0"
                            :parser="(value) => value.replace('.', '')" addon-after="分钟" :min="0"/>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="margin-left: 20px">
          <a-button type="primary" @click="updateAsync('sys_login_fail_check_cycle',lockCycle )">
            保存
          </a-button>
        </a-col>
      </a-row>
      <a-row v-if="map.sys_login_fail_lock_status === '1'">
        <a-col :span="12">
          <a-form-item label="尝试次数" name="lockTimes" :label-col="{span: 8}">
            <a-input-number v-model:value="lockTimes" placeholder="请输入尝试次数" allowClear
                            style="width: 100%" :formatter="(value) => `${value}`" :precision="0"
                            :parser="(value) => value.replace('.', '')" addon-after="次" :min="0"/>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="margin-left: 20px">
          <a-button type="primary" @click="updateAsync('sys_login_fail_times',lockTimes )">
            保存
          </a-button>
        </a-col>
      </a-row>
      <a-row v-if="map.sys_login_fail_lock_status === '1'">
        <a-col :span="12">
          <a-form-item label="锁定时长" name="lockDuration" :label-col="{span: 8}">
            <a-input-number v-model:value="lockDuration" placeholder="请输入锁定时长" allowClear
                            style="width: 100%" :formatter="(value) => `${value}`" :precision="0"
                            :parser="(value) => value.replace('.', '')" addon-after="分钟" :min="0"/>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="margin-left: 20px">
          <a-button type="primary" @click="updateAsync('sys_login_fail_lock_duration',lockDuration )">
            保存
          </a-button>
        </a-col>
      </a-row>
    </a-card>
    <a-card title="文档设置" class="card-class" size="small" :bordered="false" :hoverable="false"
            :headStyle="{borderBottom: 0}">
      <a-row v-if="map.file_document_url !== undefined">
        <a-col :span="12">
          <a-form-item label="文件服务地址" name="file_document_url" :label-col="{span: 8}">
            <a-input v-model:value="map.file_document_url" placeholder="请输入文件服务地址" allowClear/>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="margin-left: 20px">
          <a-button type="primary" @click="updateAsync('file_document_url',map.file_document_url )">保存</a-button>
        </a-col>
      </a-row>
      <a-row v-if="map.file_document_callback_url !== undefined">
        <a-col :span="12">
          <a-form-item label="在线编辑回调地址" name="file_document_callback_url" :label-col="{span: 8}">
            <a-input v-model:value="map.file_document_callback_url" placeholder="请输入在线编辑回调地址" allowClear/>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="margin-left: 20px">
          <a-button type="primary" @click="updateAsync('file_document_callback_url',map.file_document_callback_url )">
            保存
          </a-button>
        </a-col>
      </a-row>
      <a-row v-if="map.file_document_local_url !== undefined">
        <a-col :span="12">
          <a-form-item label="本地文件访问路径" name="file_document_local_url" :label-col="{span: 8}">
            <a-input v-model:value="map.file_document_local_url" placeholder="请输入本地文件访问路径"/>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="margin-left: 20px">
          <a-button type="primary" @click="updateAsync('file_document_local_url',map.file_document_local_url )">
            保存
          </a-button>
        </a-col>
      </a-row>
    </a-card>
    <a-card title="微信设置" class="card-class" size="small" :bordered="false" :hoverable="false"
            :headStyle="{borderBottom: 0}">
      <a-row v-if="map.wechat_app_id !== undefined">
        <a-col :span="12">
          <a-form-item label="微信小程序APP_ID" name="wechat_app_id" :label-col="{span: 8}">
            <a-input v-model:value="map.wechat_app_id" placeholder="请输入微信小程序APP_ID"/>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="margin-left: 20px">
          <a-button type="primary" @click="updateAsync('wechat_app_id',map.wechat_app_id )">保存</a-button>
        </a-col>
      </a-row>
      <a-row v-if="map.wechat_secret !== undefined">
        <a-col :span="12">
          <a-form-item label="微信小程序APP_SECRET" name="wechat_secret" :label-col="{span: 8}">
            <a-input v-model:value="map.wechat_secret" placeholder="请输入微信小程序APP_SECRET"/>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="margin-left: 20px">
          <a-button type="primary" @click="updateAsync('wechat_secret',map.wechat_secret )">保存</a-button>
        </a-col>
      </a-row>
    </a-card>
    <a-card v-if="map.sys_email_config !== undefined" title="邮箱设置" class="card-class" size="small" :bordered="false"
            :hoverable="false"
            :headStyle="{borderBottom: 0}">
      <a-row v-if="emailConfig.host !== undefined">
        <a-col :span="12">
          <a-form-item label="地址" name="host" :label-col="{span: 8}">
            <a-input v-model:value="emailConfig.host" placeholder="请输入地址"/>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="margin-left: 20px">
          <a-button type="primary" @click="updateEmailAsync('host' )">保存</a-button>
        </a-col>
      </a-row>
      <a-row v-if="emailConfig.port !== undefined">
        <a-col :span="12">
          <a-form-item label="端口" name="port" :label-col="{span: 8}">
            <a-input-number v-model:value="emailConfig.port" :min="0" style="width: 100%" placeholder="请输入端口"/>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="margin-left: 20px">
          <a-button type="primary" @click="updateEmailAsync('port' )">保存</a-button>
        </a-col>
      </a-row>
      <a-row v-if="emailConfig.from !== undefined">
        <a-col :span="12">
          <a-form-item label="发件箱" name="from" :label-col="{span: 8}" :validate-status="validationFrom">
            <a-input v-model:value="emailConfig.from" placeholder="请输入发件箱"/>
            <template v-if="validationFrom === 'error'" #help>邮箱格式不正确</template>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="margin-left: 20px">
          <a-button type="primary" @click="updateEmailAsync('from' )">保存</a-button>
        </a-col>
      </a-row>
      <a-row v-if="emailConfig.username !== undefined">
        <a-col :span="12">
          <a-form-item label="账号" name="username" :label-col="{span: 8}">
            <a-input v-model:value="emailConfig.username" placeholder="请输入账号"/>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="margin-left: 20px">
          <a-button type="primary" @click="updateEmailAsync('username' )">保存</a-button>
        </a-col>
      </a-row>
      <a-row v-if="emailConfig.password !== undefined">
        <a-col :span="12">
          <a-form-item label="密码" name="password" :label-col="{span: 8}">
            <a-input-password v-model:value="emailConfig.password" placeholder="请输入密码"/>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="margin-left: 20px">
          <a-button type="primary" @click="updateEmailAsync('password' )">保存</a-button>
        </a-col>
      </a-row>
    </a-card>
  </a-form>
</template>

<style scoped lang="less">
.card-class {
  margin-bottom: 24px;
}
</style>
