import type { SnippetStore } from "./snippetStore";
import type { Language, Snippet } from "../../types";
import { renderSnippet } from "../../views/renderSnippet";

type ToastType = 'success' | 'error';

export class SnippetController {
    private readonly store: SnippetStore;
    private readonly form: HTMLFormElement;
    private readonly snippetList: HTMLDivElement;
    private readonly searchInput: HTMLInputElement;
    private searchTerm: string;

    private readonly deleteDialog: HTMLDialogElement;
    private readonly toast: HTMLDivElement;
    private pendingDeleteId: string | null;
    private toastTimeoutId:number | undefined;

    constructor(
        store: SnippetStore,
        form: HTMLFormElement,
        snippetList: HTMLDivElement,
        searchInput: HTMLInputElement,
        deleteDialog: HTMLDialogElement,
        toast: HTMLDivElement,
    ) {
        this.store = store;
        this.form = form;
        this.snippetList = snippetList;
        this.searchInput = searchInput;
        this.searchTerm = '';

        this.deleteDialog = deleteDialog;
        this.toast = toast;
        this.pendingDeleteId = null;
        this.toastTimeoutId = undefined;

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);

        this.bindEvents();
    }

    render(): void {
        const snippetsToRender = this.store
            .getAll()
            .filter((snippet) => {
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

    private handleSubmit(event: SubmitEvent): void {
        event.preventDefault();


        const formData = new FormData(this.form);

        const title = String(formData.get('title')).trim();
        const language = String(formData.get('language')) as Language;
        const code = String(formData.get('code')).trim();
        const tags = String(formData.get('tags')).split(',').map((tag) => tag.trim()).filter(Boolean);

        if (!title || !code) {
            this.showToast('Title and code are required.', 'error');
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

        this.store.add(newSnippet);
        this.render();
        this.form.reset();
        this.showToast('Snippet added.');
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

    private handleSearch(): void {
        this.searchTerm = this.searchInput.value.trim().toLowerCase();

        this.render();
    }

    private handleDialogClose(): void {
        if(this.deleteDialog.returnValue !== 'confirm' || !this.pendingDeleteId) {
            this.pendingDeleteId = null;
            return;
        }

        this.store.remove(this.pendingDeleteId);
        this.pendingDeleteId = null;
        this.render();
        this.showToast('Snippet deleted.');
    }

    private showToast(message: string, type: ToastType = 'success'): void {
        if(this.toastTimeoutId !== undefined) {
            window.clearTimeout(this.toastTimeoutId);
        }

        this.toast.textContent = message;
        this.toast.className = `toast toast--${type} toast--visible`;

        this.toastTimeoutId = window.setTimeout(() => {
            this.toast.className = 'toast';
            this.toastTimeoutId = undefined;
        }, 3000);
    }
}