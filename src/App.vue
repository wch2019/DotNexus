<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import EditorPreview from './components/EditorPreview.vue'
import { darkTheme, useOsTheme } from 'naive-ui'
import { computed } from 'vue'

// 监听系统主题
const osTheme = useOsTheme()

// 根据系统主题动态切换 Naive UI 主题
const theme = computed(() => (osTheme.value === 'dark' ? darkTheme : null))
</script>
<template>
  <n-config-provider :theme="theme">
  <n-layout has-sider class="flex flex-col h-screen" >
    <!-- 侧边栏 -->
    <n-layout-sider
        collapse-mode="transform"
        :collapsed-width="0"
        :width="240"
        :native-scrollbar="false"
        show-trigger="bar"
        bordered
    >
      <!-- Sidebar -->
      <Sidebar class="border-r" />
    </n-layout-sider>
    <!-- 主内容区域 -->
    <n-layout-content  class="w-full" :native-scrollbar="false">
      <EditorPreview class="flex-1 overflow-auto" />
    </n-layout-content>
  </n-layout>
  </n-config-provider>
</template>

<style scoped>

</style>
