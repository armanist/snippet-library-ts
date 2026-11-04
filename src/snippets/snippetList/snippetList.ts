import type { SnippetDataSource } from "../contracts/snippetDataSource";
import type { SnippetChanges } from "../services/snippetChanges";
import type { Toast } from "../../shared/toast/toast";
import { renderSnippet } from "./renderSnippet";
import { getElement } from "../../shared/dom/getElement";
import type { Snippet } from "../contracts/snippet";

export class SnippetList {
    private readonly dataSource: SnippetDataSource;
    private readonly toast: Toast;
    private readonly listElement: HTMLDivElement;
    private readonly searchInput: HTMLInputElement;

    private searchTerm: string;

    constructor(
        dataSource: SnippetDataSource,
        changes: SnippetChanges,
        toast: Toast,
    ) {
        this.dataSource = dataSource;
        this.listElement = getElement<HTMLDivElement>('#snippet-list');
        this.searchInput = getElement<HTMLInputElement>('#snippet-search');
        this.searchTerm = '';

        this.handleSearch = this.handleSearch.bind(this);
        this.searchInput.addEventListener('input', this.handleSearch);
        this.toast = toast;

        changes.subscribe(() => this.render());
        
        this.render();
    }

    async render(): Promise<void> {
        let snippets: Snippet[];

        try {
            snippets = await this.dataSource.getAll();
        } catch {
            this.toast.showError('Could not load snippets.');
            return;
        }

        const snippetsToRender = snippets.filter((snippet) => {
            const searchableText = [
                snippet.title,
                snippet.language,
                snippet.code,
                ...snippet.tags
            ]
                .join(' ')
                .toLowerCase()

            return searchableText.includes(this.searchTerm);
        });

        if (snippetsToRender.length === 0) {
            this.listElement.innerHTML = `<p class="empty-state">No snippets found.</p>`;

            return;
        }

        this.listElement.innerHTML = snippetsToRender
            .map((snippet) => renderSnippet(snippet))
            .join('');
    }

    private async handleSearch(): Promise<void> {
        this.searchTerm = this.searchInput.value.trim().toLowerCase();

        await this.render();
    }
}