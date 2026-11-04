import type { SnippetDataSource } from "../contracts/snippetDataSource";
import { IndexedDbSnippetSource } from "./IndexedDbSnippetSource";
import { LocalStorageSnippetSource } from "./LocalStorageSnippetSource";

export function createDataSource(): SnippetDataSource {
    if (import.meta.env.VITE_SNIPPET_STORAGE === 'indexeddb') {
        return new IndexedDbSnippetSource();
    }

    return new LocalStorageSnippetSource();
}