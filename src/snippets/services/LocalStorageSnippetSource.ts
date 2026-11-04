import type { SnippetDataSource } from "../contracts/snippetDataSource";
import type { Snippet, SnippetDraft, SnippetUpdate } from "../contracts/snippet";

export class LocalStorageSnippetSource implements SnippetDataSource {
    private readonly storageKey = 'snippet-library:snippets';

    async getAll(): Promise<Snippet[]> {
        return this.load();
    }

    async create(draft: SnippetDraft): Promise<Snippet> {
        const snippet: Snippet = {
            ...draft,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };

        this.save([snippet, ...this.load()]);

        return snippet;
    }

    async update(id: string, changes: SnippetUpdate): Promise<Snippet> {
        const snippets = this.load();
        const index = snippets.findIndex((snippet) => snippet.id === id);

        if(index === -1) {
            throw new Error(`Snippet "${id}" was not found.`);
        }

        const updated: Snippet = {
            ...snippets[index],
            ...changes,
        };

        snippets[index] = updated;
        this.save(snippets);

        return updated;
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