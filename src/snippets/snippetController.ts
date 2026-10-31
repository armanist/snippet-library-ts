import type { SnippetStore } from "./services/snippetStore";
import type { Language, Snippet } from "./contracts/snippets";
import type { Toast } from "../shared/toast/toast";
import type { SnippetChanges } from "./services/snippetChanges";

export class SnippetController {
    private readonly store: SnippetStore;
    private readonly changes: SnippetChanges;
    private readonly toast: Toast;

    private readonly form: HTMLFormElement;
    private readonly deleteDialog: HTMLDialogElement;
    private readonly snippetList: HTMLDivElement;

    private pendingDeleteId: string | null;

    constructor(
        store: SnippetStore,
        form: HTMLFormElement,
        snippetList: HTMLDivElement,
        changes: SnippetChanges,
        deleteDialog: HTMLDialogElement,
        toast: Toast,
    ) {
        this.store = store;
        this.form = form;
        this.snippetList = snippetList;
        this.changes = changes;

        this.deleteDialog = deleteDialog;
        this.toast = toast;
        this.pendingDeleteId = null;

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);

        this.bindEvents();
    }

    private bindEvents(): void {
        this.form.addEventListener('submit', this.handleSubmit);
        this.snippetList.addEventListener('click', this.handleDelete);
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
        await this.changes.notify();
        
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

    private async handleDialogClose(): Promise<void> {
        if (this.deleteDialog.returnValue !== 'confirm' || !this.pendingDeleteId) {
            this.pendingDeleteId = null;
            return;
        }

        await this.store.delete(this.pendingDeleteId);
        
        this.pendingDeleteId = null;
        await this.changes.notify();
        this.toast.showSuccess('Snippet deleted.');
    }
}