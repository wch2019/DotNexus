<template>
  <div class="h-screen">
    <!-- 上部：编辑区域-->
    <div style="height:calc(100vh - 30px)">
      <MilkdownEditorWrapper v-if="EmptyUtils.isNotEmptyString(markdown)" v-model="markdown"/>
<!--      <VditorEditor v-if="EmptyUtils.isNotEmptyString(content)" v-model="content" height="calc(100vh - 30px)"-->
<!--                    @ready="onEditorReady"/>-->
      <n-empty
          v-else
          class="empty-tip"
          size="large"
          description="没有打开的文件"
      >
        <template #icon>
          <n-icon>
            <DocumentOutline/>
          </n-icon>
        </template>
        <template #extra>
          <n-button size="small" text>
            打开文件
          </n-button>
        </template>
      </n-empty>
    </div>

    <!-- 底部：按钮区域 -->
    <div class="flex">
      <n-divider style="margin: auto"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import VditorEditor from '@/components/Vditor/VditorEditor.vue';
import {DocumentOutline} from '@vicons/ionicons5'
import MilkdownEditorWrapper from '@/components/Milkdown/MilkdownEditorWrapper.vue'

const content = ref('');
const onEditorReady = (editor: any) => {
  console.log('Vditor is ready:', editor);
};

import {EmptyUtils} from "@/utils/isNotEmpty.ts";

const markdown = ref('')

onMounted(() => {
  window.addEventListener('load-md', (e) => {
    markdown.value = e.detail
  })
})
</script>

<style>
/* 加入 Tailwind Typography 插件支持：prose 样式 */
</style>
