import type { Snippet } from "../../types";
import type { SnippetStorage } from "./snippetStorage";

export class SnippetStore {

    private snippets: Snippet[];
    private readonly storage: SnippetStorage;

    constructor(storage: SnippetStorage, initialSnippets: Snippet[]) {
        this.storage = storage;

        const storedSnippets = this.storage.load();

        this.snippets = storedSnippets ?? [...initialSnippets];
    }

    getAll(): Snippet[] {
        return [...this.snippets];
    }

    add(snippet: Snippet): void {
        this.snippets = [snippet, ...this.snippets];
        this.storage.save(this.snippets);
    }

    remove(id: string): void {
        this.snippets = this.snippets.filter((snippet) => snippet.id !== id);
        this.storage.save(this.snippets);
    }
}
