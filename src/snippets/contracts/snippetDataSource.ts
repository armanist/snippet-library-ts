import type { Snippet } from "./snippet";

export interface SnippetDataSource {
    getAll(): Promise<Snippet[]>;
    create(snippet: Snippet): Promise<void>;
    delete(id: string): Promise<void>;
}