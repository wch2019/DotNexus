<template>
  <div class="h-screen">
    <n-tabs default-value="文件" justify-content="space-evenly">
      <n-tab-pane name="文件" tab="文件" display-directive="show:lazy">
        <!-- 上部：文件列表区域 -->
        <div style="height:calc(100vh - 75px)">
          <ul>
            <li
                v-for="file in files"
                :key="file"
                class="mb-2 cursor-pointer hover:underline"
                @click="loadFile(file)"
            >
              📄 {{ file }}
            </li>
          </ul>
          <div class="overflow-auto flex-1">
            <!--            <TreeView :nodes="fileTree" @select="openFile"/>-->
            <n-tree
                show-line
                :data="fileTree"
                :render-label="renderLabel"
                :render-switcher-icon="renderSwitcherIcon"
                :expand-on-click="true"
                @update:selected-keys="handleSelect"
            />
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
                <n-button quaternary size="small" style="width: 100%;"> {{ selectedFileName }}</n-button>
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
  FolderOpenOutline as FolderOpenIcon,
  Folder as FolderIcon,
  FileTrayFullOutline
} from '@vicons/ionicons5'
import { ref, h } from 'vue'
import { NTree, NIcon, NText } from 'naive-ui'
import TreeView from './TreeView.vue'
// 本地 Markdown 文件列表
const files = ref<string[]>([])
// 选中文件列表
const fileTree = ref<any[]>([])
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
const selectedFileName = ref('')
// 选中文件路径
const selectedFilePath = ref('')


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
    fileTree.value = result.tree
  } else {
    console.log('用户取消选择文件夹')
  }
}

// 点击文件时加载内容
const loadFile = async (fileName: string) => {
  try {
    const fullPath = `${folderPath}/${fileName}`
    const content = await window.ipcRenderer.readMdFile(fullPath)

    // 向全局窗口派发事件，主编辑器组件监听此事件加载 Markdown 内容
    window.dispatchEvent(new CustomEvent('load-md', {detail: content}))
  } catch (err) {
    console.error('读取 Markdown 文件失败:', err)
  }
}




// 树形数据（示例结构，实际从IPC获取）
const treeData = ref([
  {
    label: '我的笔记',
    key: '/path/to/notes',
    type: 'folder',
    isLeaf: false,
    children: [
      {
        label: '工作',
        key: '/path/to/notes/work',
        type: 'folder',
        isLeaf: false,
        children: [
          {
            label: '项目A.md',
            key: '/path/to/notes/work/projectA.md',
            type: 'file',
            isLeaf: true
          }
        ]
      },
      {
        label: '个人.md',
        key: '/path/to/notes/personal.md',
        type: 'file',
        isLeaf: true
      }
    ]
  }
])

// 处理节点选择
const handleSelect = (keys: string[]) => {
  console.log('选中节点:', keys[0])
  // 这里可以添加打开文件/文件夹的逻辑
}

// 自定义节点标签渲染
const renderLabel = ({ option }: { option: any }) => {
  return h(
      NText,
      { depth: option.type === 'folder' ? 1 : 3 },
      { default: () => option.label }
  )
}

// 自定义切换图标
const renderSwitcherIcon = ({ option, expanded }: { option: any, expanded: boolean }) => {
  if (option.type === 'file') return null // 文件不显示切换图标

  return h(NIcon, { size: 18 }, {
    default: () => h(expanded ? FolderOpenIcon : FolderIcon)
  })
}
</script>
