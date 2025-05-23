<template>
  <div class="h-screen">
    <n-tabs default-value="文件" justify-content="space-evenly">
      <n-tab-pane name="文件" tab="文件" display-directive="show:lazy">
        <!-- 上部：文件列表区域 -->
        <div style="height:calc(100vh - 75px)">
          <div class="overflow-auto flex-1">
            <n-tree
                v-if="fileTree.length > 0"
                show-line
                :data="fileTree"
                :render-label="renderLabel"
                :node-props="nodeProps"
                :expand-on-click="true"
                @update:selected-keys="handleSelect"
            />
            <n-empty
                v-else
                size="large"
                description="没有打开的文件夹"
                @click="chooseVault"
                class="empty-tip"
            >
            </n-empty>
          </div>
        </div>

        <!-- 底部：按钮区域 -->
        <div>
          <n-divider style="margin: auto"/>
          <div class="flex ">
            <div class="w-4/5">
              <n-dropdown
                  :options="menuOptions"
                  placement="bottom-start"
                  trigger="click"
                  @select="handleMenuSelect"
              >
                <n-button quaternary size="small" style="width: 100%;"> {{selectedFileName }}</n-button>
              </n-dropdown>
            </div>
            <div class="w-1/5">
              <n-button quaternary size="small" style="width: 100%">
                <template #icon>
                  <n-icon>
                    <Settings/>
                  </n-icon>
                </template>
              </n-button>
            </div>
          </div>
        </div>


      </n-tab-pane>
      <n-tab-pane name="大纲" tab="大纲">
        <!-- 大纲区域：你可以监听当前 Markdown 内容，解析生成标题索引 -->
        <div class="text-sm">尚未实现大纲功能。</div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import {
  Settings,
  FolderOutline,
  DocumentOutline,
  FileTrayFullOutline
} from '@vicons/ionicons5'
import { ref, h } from 'vue'
import { NTree, NIcon, NText,NEllipsis } from 'naive-ui'
import TreeView from './TreeView.vue'
// 本地 Markdown 文件列表
const files = ref<string[]>([])
// 选中文件列表
let fileTree = ref<any[]>([])
const fileContent = ref<string>('')
// 菜单选项
const menuOptions = ref([
  {
    label: '新建文件',
    key: 'new-file'
  },
  {
    label: '搜索',
    key: 'search'
  },
  {
    label: '在资源管理器中显示',
    key: 'show-in-explorer'
  },
  {
    type: 'divider'
  },
  {
    label: '打开文件夹...',
    key: 'open-folder'
  },
  {
    label: '刷新',
    key: 'refresh'
  },
  {
    type: 'divider'
  },
  {
    label: '排序',
    key: 'sort',
    children: [
      {
        label: '按名称排序',
        key: 'sort-by-name'
      },
      {
        label: '按日期排序',
        key: 'sort-by-date'
      }
    ]
  },
  {
    type: 'divider'
  },
  {
    label: '最近使用的目录',
    key: 'recent-dirs',
    children: [
      {
        label: 'Obsidian',
        key: 'obsidian-dir'
      },
      {
        label: '工作文档',
        key: 'work-docs'
      },
      {
        label: '个人笔记',
        key: 'personal-notes'
      }
    ]
  }
]);
// 选中文件名称
let selectedFileName = ref('打开文件夹...')
// 选中文件路径
let selectedFilePath = ref('')


async function openFile(file: any) {
  if (file.type === 'file') {
    const content = await window.ipcRenderer.readMdFile(file.fullPath)
    fileContent.value = content
  }
}

const handleMenuSelect = (key) => {
  console.log('选择了:', key);
  // 根据不同的 key 执行不同的操作
  switch (key) {
    case 'new-file':
      // 新建文件逻辑
      break;
    case 'open-folder':
      chooseVault()
      break;
      // 其他 case...
  }
};


// 选择 vault
async function chooseVault() {
  const result = await window.ipcRenderer.openVault()
  if (result) {
    selectedFileName.value = result.folderName
    selectedFilePath.value = result.folderPath
    fileTree.value = transformToTreeData(result.tree)
    console.log(transformToTreeData(result.tree))
  } else {
    console.log('用户取消选择文件夹')
  }
}

const transformToTreeData: (nodes: any[]) => any[] = (nodes: any[]) => {
  return nodes
      // 1. 过滤掉以 . 开头的文件夹
      .filter(node => !(node.type === 'folder' && node.label.startsWith('.')))
      .map(node => ({
        ...node,
        children: node.children ? transformToTreeData(node.children) : undefined
      }))
}

// 点击文件时加载内容
const loadFile = async (fullPath: string) => {
  try {
    const content = await window.ipcRenderer.readMdFile(fullPath)

    // 向全局窗口派发事件，主编辑器组件监听此事件加载 Markdown 内容
    window.dispatchEvent(new CustomEvent('load-md', {detail: content}))
  } catch (err) {
    console.error('读取 Markdown 文件失败:', err)
  }
}


// 处理节点选择
const handleSelect = (keys: string[]) => {
  console.log('选中节点:', keys[0])
  // 这里可以添加打开文件/文件夹的逻辑
  loadFile(keys[0])
}

// 自定义标签渲染（带图标）
const renderLabel = ({ option }: { option: any }) => {
  return h(
      'div',
      { style: 'display: flex; align-items: center; gap: 6px' },
      [
        // 根据类型显示不同图标
        h(NIcon, {
          size: 16,
          color: option.type === 'folder' ? '#ffb93c' : '#999'
        }, {
          default: () => h(option.type === 'folder' ? FolderOutline : DocumentOutline)
        }),
        h(
            NEllipsis,
            {
              tooltip: { placement: 'right' },
              style: 'flex: 1; min-width: 0;' // 确保文本区域可收缩
            },
            {
              default: () =>
                  h(NText, { depth: 3 }, {
                    default: () => option.label // ✅ 关键修改：函数形式传入 slot
                  })
            }
        )
      ]
  )
}
// 节点属性（阻止默认换行）
const nodeProps = () => {
  return {
    style: {
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    }
  }
}
</script>

<style scoped>

</style>
