<template>
  <div class="h-screen">
    <!-- 上部：编辑区域-->
    <div style="height:calc(100vh - 30px)">
          <!-- Markdown 编辑器 -->
          <textarea
              v-model="markdown"
              class="w-1/2  p-4 bg-white dark:bg-[#1e1e1e] resize-none outline-none font-serif"
              placeholder="在此编写 Markdown..."
          />

          <!-- Markdown 实时预览 -->
          <div
              class="w-1/2  p-4 prose prose-lg dark:prose-invert overflow-auto"
              v-html="rendered"
          ></div>
    </div>

    <!-- 底部：按钮区域 -->
    <div class="flex">
      <n-divider style="margin: auto"/>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'

const markdown = ref('# Welcome')

onMounted(() => {
  window.addEventListener('load-md', (e) => {
    markdown.value = e.detail
  })
})

const rendered = computed(() => marked.parse(markdown.value))
</script>

<style>
/* 加入 Tailwind Typography 插件支持：prose 样式 */
</style>
