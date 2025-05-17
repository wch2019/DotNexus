<template>
  <div class="vditor-container">
    <div ref="vditorRef" :style="{ height }"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

interface Props {
  modelValue: string;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: '500px'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'ready', instance: Vditor): void;
}>();

const vditorRef = ref<HTMLDivElement | null>(null);
let vditor: Vditor | null = null;

onMounted(() => {
  vditor = new Vditor(vditorRef.value!, {
    value: props.modelValue,
    height: parseInt(props.height),
    mode: 'sv', // 可选：'ir'、'sv'、'wysiwyg'
    toolbar: ['bold', 'italic', 'strike', '|', 'preview', 'fullscreen'],
    cache: { enable: false },
    after: () => {
      emit('ready', vditor!);
    },
    input(value) {
      emit('update:modelValue', value);
    }
  });
});

onBeforeUnmount(() => {
  vditor?.destroy();
});

watch(
    () => props.modelValue,
    (newVal) => {
      if (vditor && vditor.getValue() !== newVal) {
        vditor.setValue(newVal);
      }
    }
);
</script>

<style scoped>
.vditor-container {
  width: 100%;
}
</style>
