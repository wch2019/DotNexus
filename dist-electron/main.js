import { app, BrowserWindow, ipcMain, dialog } from "electron";
import fs, { readdirSync, readFileSync } from "fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  ipcMain.handle("list-md-files", (event, folderPath) => {
    return readdirSync(folderPath).filter((f) => f.endsWith(".md"));
  });
  ipcMain.handle("read-md-file", (event, filePath) => {
    return readFileSync(filePath, "utf-8");
  });
  ipcMain.handle("open-vault", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"]
      // 只允许选择目录
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    const folderPath = result.filePaths[0];
    const folderName = path.basename(folderPath);
    const tree = getMarkdownTree(folderPath);
    return {
      folderPath,
      // 返回根文件夹路径
      folderName,
      // 获取文件夹名称
      tree
      // 返回树形结构数据
    };
  });
}
function getMarkdownTree(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  return items.map((item) => {
    const key = path.join(dir, item.name);
    if (item.isDirectory()) {
      return {
        type: "folder",
        label: item.name,
        key,
        children: getMarkdownTree(key)
        // 递归处理子文件夹
      };
    } else if (item.isFile() && item.name.endsWith(".md")) {
      return {
        type: "file",
        label: item.name,
        key
      };
    }
    return null;
  }).filter(Boolean);
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
