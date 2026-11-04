interface ImportMetaEnv {
    readonly VITE_SNIPPET_STORAGE: 'local' | 'indexeddb';
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}