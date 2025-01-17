<template>
  <div>
    <a-radio-group
        v-model:value="radioSelected"
        @click="e => clickValue(e,props.radioOption)"
    >
      <div class="point">
        <div class="point-label">
          <a-radio
              v-for="scope in props.radioOption"
              :key="scope.id"
              class="radio-style"
              :value="scope.id"
          >{{ scope.label }}
          </a-radio>
        </div>
      </div>
    </a-radio-group>
  </div>
</template>
<script setup>
import {ref, watch} from "vue";

const props = defineProps({
  radioOption: {
    type: Array,
    default: () => [],
  },
  selected: {
    type: Array,
    default: () => [],
  },
  index: {
    type: Number,
    default: 0,
  },
});
let emits = defineEmits(['selectRadio']);
const radioSelected = ref(null)

function getValue(e) {
  const allIds = props.radioOption.map(x => x.id)
  radioSelected.value = allIds.filter(item => e.includes(item)).shift()
}

// function changeValue(e) {
//   console.log(e.target.value)
//   const ids = props.radioOption.map(x => x.id)
//   emits('selectRadio', e.target.value, ids)
// }
function clickValue(e) {
  if(e.target.value){
    const ids = props.radioOption.map(x => x.id)
    emits('selectRadio', e.target.value, ids)
  }
}

watch(
    () => props.selected,
    (e) => {
      getValue(e)
    }, {
      immediate: true,
      deep: true
    }
)


</script>
<style scoped lang="less">
:deep(.button-checkbox-css) {
  .ant-checkbox {
    display: none;
  }
}
</style>
