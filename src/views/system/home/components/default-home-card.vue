<template>
  <div class="card-container">
    <a-card size="small">
      <template #title>
        <div class="title">
          <component :is="$antIcons[props.icon]" v-if="props.icon" :style="{ fontSize: '18px', color: token.colorPrimary }" />
          <slot name="title"></slot>
          <span v-if="!$slots.title" class="smart-margin-left10">{{ props.title }} </span>
        </div>
      </template>
      <template v-if="props.extra" #extra>
        <slot name="extra"></slot>
        <a v-if="!$slots.extra" @click="extraClick">{{ props.extra }}</a>
      </template>
      <slot></slot>
    </a-card>
  </div>
</template>
<script setup>
  import { theme } from 'ant-design-vue';
  import { computed } from 'vue';

  let props = defineProps({
    icon: String,
    title: String,
    extra: String,
  });
  let emits = defineEmits(['extraClick']);

  function extraClick() {
    emits('extraClick');
  }

  const { useToken } = theme;
  const { token } = useToken();
  const color = computed(() => {
    return token.colorPrimary;
  });
</script>
<style lang="less" scoped>
  .card-container {
    background-color: #fff;
    height: 100%;

    .title {
      display: flex;
      align-items: center;
      &::before {
        content: '';
        position: absolute;
        top: 3px;
        left: 0;
        width: 3px;
        height: 30px;
        //background-color: v-bind('token.colorPrimary');
      }
    }
  }
</style>
