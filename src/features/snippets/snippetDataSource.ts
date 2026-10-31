import type { Snippet } from "../../types";

export interface SnippetDataSource {
    getAll(): Promise<Snippet[]>;
    create(snippet: Snippet): Promise<void>;
    delete(id: string): Promise<void>;
}