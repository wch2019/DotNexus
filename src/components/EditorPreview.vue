<template>
  <div class="h-screen">
    <!-- 上部：编辑区域-->
    <div style="height:calc(100vh - 30px)">
      <VditorEditor v-model="content" height="calc(100vh - 30px)" @ready="onEditorReady" />
    </div>

    <!-- 底部：按钮区域 -->
    <div class="flex">
      <n-divider style="margin: auto"/>
    </div>
  </div>
</template>

<script setup  lang="ts">
import { ref, computed, onMounted } from 'vue'
import VditorEditor from '@/components/Vditor/VditorEditor.vue';

const content = ref('# Hello DotNexus!');
const onEditorReady = (editor: any) => {
  console.log('Vditor is ready:', editor);
};

import { marked } from 'marked'

const markdown = ref('# Welcome')

onMounted(() => {
  window.addEventListener('load-md', (e) => {
    markdown.value = e.detail
    content.value= e.detail
  })
})

const rendered = computed(() => marked.parse(markdown.value))
</script>

<style>
/* 加入 Tailwind Typography 插件支持：prose 样式 */
</style>
