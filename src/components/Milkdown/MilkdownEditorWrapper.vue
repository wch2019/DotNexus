<!-- src/components/MilkdownEditorWrapper.vue -->
<template>
  <MilkdownProvider>
    <Milkdown  v-model="modelValue" />
  </MilkdownProvider>
</template>

<script setup>
import { MilkdownProvider } from '@milkdown/vue'
import Milkdown from './MilkdownEditor.vue'

// v-model 双向绑定
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>
