import type { Snippet } from "../../types";

export class SnippetStorage {
    
    private readonly storageKey = 'snippet-library:snippets';
    
    load(): Snippet[] | null {
        const storedSnippets = localStorage.getItem(this.storageKey);

        if(!storedSnippets) {
            return null;
        }

        try {
            return JSON.parse(storedSnippets) as Snippet[];
        } catch {
            return null;
        }
    }

    save(snippets: Snippet[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(snippets));
    }
}