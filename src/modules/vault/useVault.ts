import { ref } from 'vue';
import type { VaultFile } from './types';
// import { ipcRenderer } from 'electron';

const vaultPath = ref<string>('');
const fileTree = ref<VaultFile[]>([]);

async function openVault() {
    // const selectedPath: string = await ipcRenderer.invoke('vault:select-folder');
    // if (!selectedPath) return;
    //
    // vaultPath.value = selectedPath;
    // const result: VaultFile[] = await ipcRenderer.invoke('vault:read-tree', selectedPath);
    // fileTree.value = result;
}

export function useVault() {
    return {
        vaultPath,
        fileTree,
        openVault
    };
}
