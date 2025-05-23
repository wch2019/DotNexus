<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { Milkdown, useEditor } from "@milkdown/vue";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
// 接收 v-model
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])

const markdown = `# Milkdown Vue Crepe

> You're scared of a world where you're needed.

This is a demo for using Crepe with **Vue**.`;

useEditor((root) => {
  const crepe = new Crepe({
    root,
    defaultValue: markdown,
  });
  return crepe;
})


// 每当编辑器内容变更时，提取 markdown 并发射事件
onMounted(() => {
  const interval = setInterval(async () => {
    if (editorInstance?.action) {
      const markdown = await editorInstance.action(getMarkdown())
      emit('update:modelValue', markdown)
    }
  }, 500) // 500ms 同步一次

  // 清理定时器
  window.addEventListener('beforeunload', () => clearInterval(interval))
})
</script>

<template>
  <Milkdown />
</template>

<style scoped>
</style>
