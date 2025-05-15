"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  openVault: () => electron.ipcRenderer.invoke("open-vault"),
  listMdFiles: (folderPath) => electron.ipcRenderer.invoke("list-md-files", folderPath),
  readMdFile: (filePath) => electron.ipcRenderer.invoke("read-md-file", filePath)
  // You can expose other APTs you need here.
  // ...
});
