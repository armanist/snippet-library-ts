import type { SnippetDataSource } from "../contracts/snippetDataSource";
import type { Snippet } from "../contracts/snippet";

export class LocalStorageSnippetSource implements SnippetDataSource {
    private readonly storageKey = 'snippet-library:snippets';

    async getAll(): Promise<Snippet[]> {
        return this.load();
    }

    async create(snippet: Snippet): Promise<void> {
        this.save([snippet, ...this.load()]);
    }

    async delete(id: string): Promise<void> {
        this.save(this.load().filter((snippet) => snippet.id !== id));
    }

    private load(): Snippet[] {
        const storedSnippets = localStorage.getItem(this.storageKey);

        if (!storedSnippets) {
            return [];
        }

        try {
            return JSON.parse(storedSnippets) as Snippet[];
        } catch {
            return [];
        }
    }

    private save(snippets: Snippet[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(snippets));
    }
}