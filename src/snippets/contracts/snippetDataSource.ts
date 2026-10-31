import type { Snippet } from "./snippets";

export interface SnippetDataSource {
    getAll(): Promise<Snippet[]>;
    create(snippet: Snippet): Promise<void>;
    delete(id: string): Promise<void>;
}