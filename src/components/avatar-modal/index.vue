<script setup>
  import { computed, ref, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import 'vue-cropper/dist/index.css';
  import { VueCropper } from 'vue-cropper';
  import { fileUtil } from '/@/utils/file-util.js';
  import { fileApi } from '/@/api/file/file-api.js';
  import { FILE_FOLDER_TYPE_ENUM } from '/@/constants/support/file-const.js';
  import { smartSentry } from '/@/lib/smart-sentry.js';

  const emit = defineEmits(['update:fileUrls']);
  const props = defineProps({
    fileUrls: {
      type: [String, null],
      default: null,
    },
  });

  const url = ref('');
  const previews = ref({});
  // 是否展示
  const visible = ref(false);
  // 打开表单弹窗
  async function showModal() {
    const res = fileUtil.fileUrlFormat(props.fileUrls);
    // 调整图像宽高
    const newWidth = 300; // 新宽度
    const newHeight = 300; // 新高度
    const resizedBlob = await resizeImage(res, newWidth, newHeight);
    const result = URL.createObjectURL(resizedBlob);
    url.value = result;
    previews.value.url = result;
    visible.value = true;
  }
  /** 关闭弹窗 */
  function onClose() {
    visible.value = false;
  }

  function realTime(data) {
    previews.value = data;
  }
  const accept = ref('.jpg,.jpeg,.png,.gif');
  const maxSize = ref(10);
  function beforeUpload(file) {
    const suffixIndex = file.name.lastIndexOf('.');
    const fileSuffix = file.name.substring(suffixIndex <= -1 ? 0 : suffixIndex);
    if (accept.value.indexOf(fileSuffix) === -1) {
      message.error(`只支持上传 ${accept.value.replaceAll(',', ' ')} 格式的文件`);
      return false;
    }

    const isLimitSize = file.size / 1024 / 1024 < maxSize.value;
    if (!isLimitSize) {
      message.error(`单个文件大小必须小于 ${maxSize.value} Mb`);
      return false;
    }
    const reader = new FileReader();
    // 把Array Buffer转化为blob 如果是base64不需要
    // 转化为base64
    reader.readAsDataURL(file);
    reader.onload = () => {
      url.value = reader.result;
      previews.value.url = reader.result;
    };
    return false;
  }

  const cropper = ref();

  // vue-cropper的基本配置
  const option = computed(() => {
    return {
      img: url.value, // 裁剪图片的地址
      outputSize: 1, // 裁剪生成图片的质量(可选0.1 - 1)
      outputType: 'jpeg', // 裁剪生成图片的格式（jpeg || png || webp）
      info: true, // 图片大小信息
      canScale: true, // 图片是否允许滚轮缩放
      autoCrop: true, // 是否默认生成截图框
      autoCropWidth: 200, // 默认生成截图框宽度
      autoCropHeight: 200, // 默认生成截图框高度
      fixed: true, // 是否开启截图框宽高固定比例
      fixedNumber: [1, 1], // 截图框的宽高比例
      full: false, // false按原比例裁切图片，不失真
      fixedBox: true, // 固定截图框大小，不允许改变
      canMove: false, // 上传图片是否可以移动
      canMoveBox: true, // 截图框能否拖动
      original: false, // 上传图片按照原始比例渲染
      centerBox: false, // 截图框是否被限制在图片里面
      height: true, // 是否按照设备的dpr 输出等比例图片
      infoTrue: false, // true为展示真实输出图片宽高，false展示看到的截图框宽高
      maxImgSize: 3000, // 限制图片最大宽度和高度
      enlarge: 1, // 图片根据截图框输出比例倍数
      // mode: '' // 图片默认渲染方式
      mode: '300px 300px', // 图片默认渲染方式
    };
  });

  function changeScale(num) {
    cropper.value.changeScale(num);
  }

  function rotateLeft() {
    cropper.value.rotateLeft();
  }

  function rotateRight() {
    cropper.value.rotateRight();
  }

  //上传
  async function customRequest(file) {
    try {
      const formData = new FormData();
      formData.append('files', file);
      let res = await fileApi.uploadFile(formData, FILE_FOLDER_TYPE_ENUM.COMMON.value);
      message.success('操作成功');
      let result = res.data[0];
      let resUrl;
      if (result.uploadType === '0') {
        resUrl = res.data[0].fileKey;
      } else {
        resUrl = res.data[0].filePath;
      }
      emit('update:fileUrls', resUrl);
      onClose();
    } catch (error) {
      smartSentry.captureError(error);
    }
  }

  function save() {
    cropper.value.getCropBlob(async (data) => {
      const imgUrl = window.URL.createObjectURL(data);
      const img = new Image();
      img.crossOrigin = 'anonymous'; // 解决跨域问题（如果需要）
      img.src = imgUrl;
      // 等待图像加载完成
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      // 将 Image 对象转换为 File 对象
      const file = await imageToFile(img, 'avatar.png', 'image/png');
      await new Promise(() => {
        customRequest(file);
      });
    });
  }

  /**
   * blob转image
   *
   * @param imgUrl
   */
  async function blobToImage(imgUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imgUrl;
    });
  }

  /**
   * 修改图片
   *
   * @param imgUrl
   * @param newWidth
   * @param newHeight
   */
  async function resizeImage(imgUrl, newWidth, newHeight) {
    const img = await blobToImage(imgUrl);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // 设置 canvas 尺寸为新的宽高
    canvas.width = newWidth;
    canvas.height = newHeight;

    // 绘制图像到 canvas 并调整尺寸
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    // 将 canvas 转换回 Blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, 'image/png'); // 你可以根据需要更改格式
    });
  }

  /**
   * 图片转file
   *
   * @param image
   * @param fileName
   * @param fileType
   */
  async function imageToFile(image, fileName, fileType = 'image/png') {
    // 创建一个 Canvas 元素
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // 设置 Canvas 尺寸与图像相同
    canvas.width = image.width;
    canvas.height = image.height;

    // 将图像绘制到 Canvas 上
    ctx.drawImage(image, 0, 0);

    // 将 Canvas 转换为 Blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          // 将 Blob 转换为 File 对象
          const file = new File([blob], fileName, { type: fileType });
          resolve(file);
        }
      }, fileType);
    });
  }

  defineExpose({
    showModal,
  });
</script>

<template>
  <a-modal :open="visible" title="修改头像" :maskClosable="true" :width="900" centered @cancel="onClose">
    <a-row>
      <a-col :span="12">
        <a-flex vertical align="center" :gap="18">
          <!-- 必须给vueCropper组件设置固定宽高 -->
          <div style="height: 350px; width: 350px">
            <VueCropper
              ref="cropper"
              v-model:img="option.img"
              :output-size="option.outputSize"
              :output-type="option.outputType"
              :info="option.info"
              :can-scale="option.canScale"
              :auto-crop="option.autoCrop"
              :auto-crop-width="option.autoCropWidth"
              :auto-crop-height="option.autoCropHeight"
              :fixed="option.fixed"
              :fixed-number="option.fixedNumber"
              :full="option.full"
              :fixed-box="option.fixedBox"
              :can-move="option.canMove"
              :can-move-box="option.canMoveBox"
              :original="option.original"
              :center-box="option.centerBox"
              :height="option.height"
              :info-true="option.infoTrue"
              :max-img-size="option.maxImgSize"
              :enlarge="option.enlarge"
              :mode="option.mode"
              @real-time="realTime"
            />
          </div>
          <a-flex align="center" justify="space-around" :gap="18">
            <a-upload name="file" :beforeUpload="beforeUpload" :showUploadList="false">
              <a-button>
                <template #icon>
                  <UploadOutlined />
                </template>
                选择图片
              </a-button>
            </a-upload>
            <a-button @click="changeScale(1)">
              <template #icon>
                <PlusOutlined />
              </template>
            </a-button>
            <a-button @click="changeScale(-1)">
              <template #icon>
                <MinusOutlined />
              </template>
            </a-button>
            <a-button @click="rotateLeft()">
              <template #icon>
                <UndoOutlined />
              </template>
            </a-button>
            <a-button @click="rotateRight()">
              <template #icon>
                <RedoOutlined />
              </template>
            </a-button>
          </a-flex>
        </a-flex>
      </a-col>
      <a-col :span="12">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img" alt="img" />
        </div>
      </a-col>
    </a-row>
    <template #footer>
      <a-flex justify="end" :gap="16">
        <a-button type="primary" @click="save">保存</a-button>
        <a-button @click="onClose">关闭</a-button>
      </a-flex>
    </template>
  </a-modal>
</template>

<style scoped>
  .avatar-upload-preview {
    position: absolute;
    top: 50%;
    transform: translate(50%, -50%);
    width: 200px;
    height: 200px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
      max-width: none;
      width: 100%;
      height: 100%;
    }
  }
</style>
