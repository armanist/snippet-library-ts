import type { Snippet } from "../contracts/snippets";
import type { SnippetStorage } from "./snippetStorage";
import type { SnippetDataSource } from "../contracts/snippetDataSource";

export class SnippetStore implements SnippetDataSource {

    private snippets: Snippet[];
    private readonly storage: SnippetStorage;

    constructor(storage: SnippetStorage, initialSnippets: Snippet[]) {
        this.storage = storage;

        const storedSnippets = this.storage.load();

        this.snippets = storedSnippets ?? [...initialSnippets];
    }

    async getAll(): Promise<Snippet[]> {
        return [...this.snippets];
    }

    async create(snippet: Snippet): Promise<void> {
        this.snippets = [snippet, ...this.snippets];
        this.storage.save(this.snippets);
    }

    async delete(id: string): Promise<void> {
        this.snippets = this.snippets.filter((snippet) => snippet.id !== id);
        this.storage.save(this.snippets);
    }
}
