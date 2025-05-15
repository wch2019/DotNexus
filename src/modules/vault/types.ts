export interface VaultFile {
    name: string;
    path: string;
    type: 'file' | 'folder';
    children?: VaultFile[];
}
