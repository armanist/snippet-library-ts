import type { SnippetStore } from "./services/snippetStore";
import type { Language, Snippet } from "./contracts/snippets";
import type { Toast } from "../shared/toast/toast";
import { renderSnippet } from "./snippetList/renderSnippet";



export class SnippetController {
    private readonly store: SnippetStore;
    private readonly form: HTMLFormElement;
    private readonly snippetList: HTMLDivElement;
    private readonly searchInput: HTMLInputElement;
    private searchTerm: string;

    private readonly deleteDialog: HTMLDialogElement;
    private readonly toast: Toast;
    private pendingDeleteId: string | null;

    constructor(
        store: SnippetStore,
        form: HTMLFormElement,
        snippetList: HTMLDivElement,
        searchInput: HTMLInputElement,
        deleteDialog: HTMLDialogElement,
        toast: Toast,
    ) {
        this.store = store;
        this.form = form;
        this.snippetList = snippetList;
        this.searchInput = searchInput;
        this.searchTerm = '';

        this.deleteDialog = deleteDialog;
        this.toast = toast;
        this.pendingDeleteId = null;

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);

        this.bindEvents();
    }

    async render(): Promise<void> {
        const snippets = await this.store.getAll();

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
            this.snippetList.innerHTML = `<p class="empty-state">No snippets found.</p>`;

            return;
        }

        this.snippetList.innerHTML = snippetsToRender
            .map((snippet) => renderSnippet(snippet))
            .join('');
    }

    private bindEvents(): void {
        this.form.addEventListener('submit', this.handleSubmit);
        this.snippetList.addEventListener('click', this.handleDelete);
        this.searchInput.addEventListener('input', this.handleSearch);
        this.deleteDialog.addEventListener('close', this.handleDialogClose);
    }

    private async handleSubmit(event: SubmitEvent): Promise<void> {
        event.preventDefault();


        const formData = new FormData(this.form);

        const title = String(formData.get('title')).trim();
        const language = String(formData.get('language')) as Language;
        const code = String(formData.get('code')).trim();
        const tags = String(formData.get('tags')).split(',').map((tag) => tag.trim()).filter(Boolean);

        if (!title || !code) {
            this.toast.showError('Title and code are required.');
            return;
        }

        const newSnippet: Snippet = {
            id: crypto.randomUUID(),
            title,
            language,
            code,
            tags,
            createdAt: new Date().toISOString(),
        };

        await this.store.create(newSnippet);
        await this.render();
        
        this.form.reset();
        this.toast.showSuccess('Snippet added.');
    }

    private handleDelete(event: MouseEvent): void {
        const target = event.target;

        if (!(target instanceof HTMLElement)) {
            return;
        }

        const deleteButton = target.closest<HTMLButtonElement>('[data-snippet-id]');

        if (!deleteButton) {
            return;
        }

        const snippetId = deleteButton.dataset.snippetId;

        if (!snippetId) {
            return;
        }

        this.pendingDeleteId = snippetId;
        this.deleteDialog.showModal();
    }

    private async handleSearch(): Promise<void> {
        this.searchTerm = this.searchInput.value.trim().toLowerCase();

        await this.render();
    }

    private async handleDialogClose(): Promise<void> {
        if (this.deleteDialog.returnValue !== 'confirm' || !this.pendingDeleteId) {
            this.pendingDeleteId = null;
            return;
        }

        await this.store.delete(this.pendingDeleteId);
        
        this.pendingDeleteId = null;
        this.render();
        this.toast.showSuccess('Snippet deleted.');
    }
}