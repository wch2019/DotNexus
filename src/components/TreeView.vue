<template>
  <ul class="space-y-1">
    <li v-for="node in nodes" :key="node.fullPath">
      <div
          @click="() => $emit('select', node)"
          class="cursor-pointer hover:text-blue-600"
      >
        <span v-if="node.type === 'folder'">📂 {{ node.name }}</span>
        <span v-else>📄 {{ node.name }}</span>
      </div>

      <!-- 递归展示子文件夹 -->
      <div v-if="node.children" class="ml-4">
        <TreeView :nodes="node.children" @select="$emit('select', $event)" />
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{
  nodes: any[]
}>()
</script>
