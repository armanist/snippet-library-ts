import type { SnippetDataSource } from "../contracts/snippetDataSource";
import type { SnippetChanges } from "../services/snippetChanges";
import { renderSnippet } from "./renderSnippet";

export class SnippetList {
    private readonly dataSource: SnippetDataSource;
    private readonly listElement: HTMLDivElement;
    private readonly searchInput: HTMLInputElement;
    private searchTerm: string;

    constructor(
        dataSource: SnippetDataSource,
        changes: SnippetChanges,
        listElement: HTMLDivElement,
        searchInput: HTMLInputElement,
    ) {
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.searchInput = searchInput;
        this.searchTerm = '';

        this.handleSearch = this.handleSearch.bind(this);

        this.searchInput.addEventListener('input', this.handleSearch);
        changes.subscribe(() => this.render());
    }

    async render(): Promise<void> {
        const snippets = await this.dataSource.getAll();

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