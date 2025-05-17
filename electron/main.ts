import {app, BrowserWindow, ipcMain, dialog} from 'electron'
import {readFileSync, readdirSync} from 'fs'
import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import fs from 'fs'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
    win = new BrowserWindow({
        icon: path.join(process.env.VITE_PUBLIC, 'vite.svg'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
        },
    })

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    }

    // 🟦 监听读取文件夹中文件列表
    ipcMain.handle('list-md-files', (event, folderPath) => {
        return readdirSync(folderPath).filter((f) => f.endsWith('.md'))
    })

    // 🟨 监听读取 .md 文件内容
    ipcMain.handle('read-md-file', (event, filePath) => {
        return readFileSync(filePath, 'utf-8')
    })

    // 🟩 监听打开 vault 的 IPC 事件
    ipcMain.handle('open-vault', async () => {
        // 显示文件夹选择对话框
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory'], // 只允许选择目录
        })

        // 如果用户取消选择或未选择任何路径，返回 null
        if (result.canceled || result.filePaths.length === 0) return null
        const folderPath = result.filePaths[0] // 获取用户选择的文件夹路径
        const folderName = path.basename(folderPath) // 获取文件夹名称
        const tree = getMarkdownTree(folderPath) // 生成该文件夹的树形结构

        return {
            folderPath, // 返回根文件夹路径
            folderName, // 获取文件夹名称
            tree,       // 返回树形结构数据
        }
    })
}

/**
 * 递归获取指定目录下的Markdown文件和文件夹的树形结构
 * @param dir 要扫描的目录路径
 * @returns 包含文件和文件夹信息的数组
 */
function getMarkdownTree(dir: string): Array<{
    type: 'folder' | 'file';
    name: string;
    key: string;
    children?: any[]; // 只有文件夹才有 children 属性
}> {
    // 读取目录内容，包含文件类型信息
    const items = fs.readdirSync(dir, {withFileTypes: true})

    return items
        .map((item) => {
            const key = path.join(dir, item.name) // 获取完整路径

            if (item.isDirectory()) {
                // 如果是文件夹，递归获取子内容
                return {
                    type: 'folder',
                    label: item.name,
                    key,
                    children: getMarkdownTree(key), // 递归处理子文件夹
                }
            } else if (item.isFile() && item.name.endsWith('.md')) {
                // 如果是Markdown文件，返回文件信息
                return {
                    type: 'file',
                    label: item.name,
                    key,
                }
            }
            // 忽略非Markdown文件
            return null
        })
        .filter(Boolean) // 过滤掉 null 值（非Markdown文件）
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        win = null
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.whenReady().then(createWindow)
