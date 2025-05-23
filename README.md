# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

```
DotNexus/
├── electron/                   # Electron 主进程文件
│   ├── main.ts                 # 主进程入口
│   ├── preload.ts              # 向渲染进程暴露API
│   └── electron-env.d.ts
│
├── src/                        # 前端 Vue 应用主目录
│   ├── assets/                 # 静态资源（图标、图像等）
│   ├── components/             # 通用组件（按钮、面板等）
│   ├── views/                  # 页面视图（主页、设置、编辑页等）
│   ├── modules/                # 核心功能模块（编辑器、vault 等）
│   │   ├── vault/              # Vault 文件系统管理
│   │   ├── editor/             # Markdown 编辑器逻辑
│   │   ├── plugins/            # 插件机制封装（注册、调用等）
│   │   └── sync/               # WebDAV、云备份等扩展
│   ├── stores/                 # 状态管理（Pinia）
│   ├── router/ (可选)          # 如果页面较多可使用 Vue Router
│   ├── App.vue
│   ├── main.ts                 # Vue 应用入口
│   └── style.css
│
├── public/                     # 公共资源目录（默认不处理，直接拷贝）
├── vaults/                     # 用户数据存储位置（建议启动时由用户选择）
├── plugins/                    # 自定义插件本地目录（支持开发者安装）
├── config.json                 # 应用配置文件（持久化用户设置）
│
├── README.md
├── package.json
├── tsconfig.json
├── electron-builder.json5
└── vite.config.ts

```

# DotNexus

**DotNexus** 是一款基于 [Electron](https://www.electronjs.org/) 开发的跨平台笔记软件，专为提升个人知识管理效率而设计。它结合了现代简洁的界面与强大的笔记功能，适用于开发者、创作者以及所有希望有条理记录想法的人。

## ✨ 特性

- 📝 支持 Markdown 编辑
- 🔍 快速搜索与标签分类
- 🧠 本地知识图谱构建（支持双链笔记）
- ☁️ 数据本地保存，隐私安全
- 🌙 支持深色模式
- 🔌 插件支持（开发中）

## 🛠 技术栈

- **主框架**：Electron
- **前端**：Vue + TailwindCSS
- **数据库**：SQLite（可扩展为云同步）
- **其他**：TypeScript、Node.js

## 🚀 快速开始

```bash
git clone https://github.com/你的用户名/DotNexus.git
cd DotNexus
npm install
npm run dev
```

## 📦 打包构建

```bash
npm run build
```

## 📄 许可协议

本项目基于 MIT License 开源。

---

欢迎贡献、提建议或 Star ⭐️ 支持这个项目！