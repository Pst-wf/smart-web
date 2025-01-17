<template>
  <div class="clearfix">
    <div style="display: flex; justify-content: center;flex-direction: column">
      <a-upload
          :show-upload-list="{ showDownloadIcon: showDownload, showRemoveIcon: showRemove }"
          v-model:file-list="dataSource"
          :multiple="multiple"
          name="files"
          accept="image/*"
          :max-count="limit"
          :headers="headers"
          :action="actionUrl"
          list-type="picture-card"
          @preview="handlePreview"
          :beforeUpload="beforeUpload"
          :disabled="disabled"
          @change="changeFile"
          @download="downloadFile"
      >
        <div v-if="dataSource.length < limit">
          <plus-outlined/>
          <div v-if="placeholder" style="margin-top: 8px">{{ placeholder }}</div>
        </div>
      </a-upload>
      <div v-if="tips.content" :style="{color: tips.color ? tips.color : 'red',fontSize: tips.size ? tips.size +'px' : '14px'}">
        {{ tips.content }}
      </div>
    </div>
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
  </div>
</template>
<script setup>
import {onMounted, ref, watch} from 'vue';
import {localRead} from '/@/utils/local-util.js';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';
import {message} from 'ant-design-vue';
import {getFileNameSuffix} from '/@/utils/common-util.js';
import {fileUtil} from "/@/utils/file-util.js";

let props = defineProps({
  fileList: {
    type: [String, null],
    required: true,
  },
  limit: {
    type: Number,
    default: 1,
  },
  accept: {
    type: Array,
    default: () => ['png', 'jpg', 'jpeg'],
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '点击上传',
  },
  max: {
    type: Number,
    default: 5,
  },
  size: {
    type: String,
    default: '102px',
  },
  showDownload: {
    type: Boolean,
    default: true,
  },
  showRemove: {
    type: Boolean,
    default: true,
  },
  tips: {
    type: Object,
    default: () => {
      return {
        content: null,
        color: 'red',
        size: 12
      };
    }
  }
});
const dataSource = ref(
    props.fileList === null || props.fileList === ''
        ? []
        : props.fileList.split(',').map((item, index) => ({
          uid: index.toString(),
          status: 'done',
          url: fileUtil.fileUrlFormat(item),
        }))
);
const TOKEN_HEADER = 'Authorization';
const DEFAULT_TOKEN = 'Basic c2FiZXI6c2FiZXJfc2VjcmV0';
const actionUrl = import.meta.env.VITE_APP_API_URL + '/file/upload';
const headers = ref({
  'Tenant-Id': '000000',
});

function setHeaders() {
  const token = localRead(LocalStorageKeyConst.USER_TOKEN);
  headers.value[TOKEN_HEADER] = token ? `Bearer ${token}` : DEFAULT_TOKEN;
  const identityId = localRead(LocalStorageKeyConst.IDENTITY_ID);
  if (identityId) {
    headers.value['Identity-Id'] = identityId;
  }
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const beforeUpload = (info) => {
  if (info) {
    const name = info.name;
    const suffix = getFileNameSuffix(name);
    if (props.accept && props.accept.indexOf(suffix) === -1) {
      message.error(`请上传${props.accept.join(',')}格式的文件`);
      return false;
    }
    if (props.max) {
      const format = props.max * 1024 * 1024;
      if (format < info.size) {
        message.error(`上传的文件大小不能大于${props.max} MB`);
        return false;
      }
    }
  }
  return true;
};
const changeFile = (info) => {
  if (!info.file.status) {
    // 移除
    dataSource.value = dataSource.value.filter((x) => x.uid !== info.file.uid);
  }
  if (info.file.status === 'removed') {
    const filePathList = dataSource.value.map((x) => x.url);
    emit('update:fileList', filePathList.join(','));
  }
  if (info.file.status === 'done') {
    if (info.file.response) {
      if (info.file.response.code === 200) {
        message.success(`${info.file.name} 上传成功`);
        const filePathList = dataSource.value.map((x) => {
          if (x.response) {
            const result = x.response.data[0];
            if (result.uploadType === '0') {
              return result.fileKey;
            } else {
              return result.filePath;
            }
          }
          return x.url;
        });
        emit('update:fileList', filePathList.join(','));
      } else {
        message.error(info.file.response.msg);
        dataSource.value = dataSource.value.filter((x) => x.uid !== info.file.uid);
      }
    } else {
      const filePathList = dataSource.value.map((x) => (x.response ? x.response.data[0].filePath : x.url));
      emit('update:fileList', filePathList.join(','));
    }
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 上传失败`);
  }
};
const downloadFile = (file) => {
  const url = file.url
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', file.uid)
  document.body.appendChild(link)
  link.click()
};
const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};
const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
onMounted(setHeaders);

const emit = defineEmits(['update:fileList']);
watch(
    () => props.fileList,
    (val) => {
      dataSource.value =
          val === null || val === ''
              ? []
              : val.split(',').map((item, index) => ({
                uid: index.toString(),
                status: 'done',
                url: fileUtil.fileUrlFormat(item),
              }));
    }
);
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.clearfix .ant-upload-list-item-container {
  width: v-bind('props.size') !important;
  height: v-bind('props.size') !important;
}

.clearfix .ant-upload-select-picture-card {
  width: v-bind('props.size') !important;
  height: v-bind('props.size') !important;
}

/*.clearfix .ant-upload-disabled {
  cursor: auto !important;
}*/
</style>
