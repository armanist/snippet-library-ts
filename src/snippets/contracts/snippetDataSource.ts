import type { Snippet, SnippetDraft, SnippetUpdate } from "./snippet";

export interface SnippetDataSource {
    getAll(): Promise<Snippet[]>;
    create(snippet: SnippetDraft): Promise<Snippet>;
    update(id: string, changes: SnippetUpdate): Promise<Snippet>
    delete(id: string): Promise<void>;
}