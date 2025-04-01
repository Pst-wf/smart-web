<template>
  <a-modal
    :open="visible"
    :maskClosable="true"
    :width="600"
    :closable="false"
    :get-container="SmartLoading.spin"
    @cancel="onClose"
    :body-style="{ padding: '0 24px' }"
    class="modal-class"
  >
    <a-input v-model:value="inputValue" placeholder="请输入" style="margin-top: 15px" @input="search">
      <template #prefix>
        <search-outlined style="color: #dddada; font-size: 16px" />
      </template>
    </a-input>
    <a-card style="margin-top: 30px; box-shadow: none" :bordered="false" :body-style="{ padding: 0 }" class="card-class">
      <a-list :data-source="result" :split="false" class="list-class">
        <template #renderItem="{ item }">
          <a-list-item class="list-item-class" :style="itemStyle" @click="jump(item)">
            <a-flex gap="middle" justify-content="space-between" style="width: 100%">
              <div>
                <component v-if="item.meta.icon" :is="$antIcons[item.meta.icon]" style="font-size: 14px" class="icon-tab-class" />
                {{ item.meta.title }}
              </div>
              <div>
                <EnterOutlined />
              </div>
            </a-flex>
          </a-list-item>
        </template>
      </a-list>
      <!--      <a-empty v-else/>-->
    </a-card>
    <template #footer> </template>
  </a-modal>
</template>
<script setup>
  // ----------------------- 展开、隐藏编辑窗口 ------------------------
  import { computed, ref, watch } from 'vue';
  import { debounceAsync } from '/@/utils/debounce-util.js';
  import { useRoute, useRouter } from 'vue-router';
  import { theme } from 'ant-design-vue';
  import { useAppConfigStore } from '/@/store/modules/system/app-config.js';
  import { SmartLoading } from '/@/components/framework/smart-loading/index.js';

  const router = useRouter();

  const route = useRoute();

  const inputValue = ref('');
  const result = ref([]);

  const search = debounceAsync(() => onSearch(), 200, false);
  const onSearch = () => {
    if (inputValue.value && inputValue.value !== '') {
      result.value = router.getRoutes().filter((r) => r?.meta?.title?.toLowerCase().includes(inputValue.value.toLowerCase()) && r?.meta?.isLeaf);
    } else {
      result.value = [];
    }
  };

  const visible = ref(false);

  async function showModal() {
    visible.value = true;
  }

  function onClose() {
    visible.value = false;
  }

  watch(
    () => visible.value,
    (val) => {
      if (!val) {
        inputValue.value = '';
        result.value = [];
      }
    }
  );

  function jump(item) {
    router.push({ path: item.path });
    onClose();
  }

  defineExpose({
    showModal,
  });

  const { useToken } = theme;
  const { token } = useToken();
  const color = computed(() => token.value.colorPrimary);
  // 圆角
  const borderRadius = computed(() => {
    return useAppConfigStore().borderRadius + 'px';
  });

  const itemStyle = ref({
    '--bg-color': color,
    '--border-radius': borderRadius,
  });
</script>

<style scoped lang="less">
  .list-item-class {
    border: 1px solid #dddada;
    margin-bottom: 10px;
    cursor: pointer;
    background-color: #e5e7eb;
    border-radius: var(--border-radius);

    &:hover {
      background-color: var(--bg-color);
      color: #ffffff;
    }
  }

  .icon-tab-class {
    margin-right: 4px !important;
  }
</style>
