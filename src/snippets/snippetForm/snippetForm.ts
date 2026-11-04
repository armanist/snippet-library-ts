import type { SnippetDataSource } from "../contracts/snippetDataSource";
import type { Language, Snippet, SnippetDraft } from "../contracts/snippet";
import type { Toast } from "../../shared/toast/toast";
import type { SnippetChanges } from "../services/snippetChanges";
import { getElement } from "../../shared/dom/getElement";

export class SnippetForm {
    private readonly dataSource: SnippetDataSource;
    private readonly changes: SnippetChanges;
    private readonly toast: Toast;
    private readonly form: HTMLFormElement;
    private readonly listElement: HTMLDivElement;
    private readonly titleElement: HTMLHeadingElement;
    private readonly submitButton: HTMLButtonElement;
    private readonly cancelButton: HTMLButtonElement;
    private editingSnippet: Snippet | null;

    constructor(
        dataSource: SnippetDataSource,
        changes: SnippetChanges,
        toast: Toast,
    ) {
        this.dataSource = dataSource;

        this.form = getElement<HTMLFormElement>('#snippet-form');

        this.changes = changes;

        this.toast = toast;

        this.listElement = getElement<HTMLDivElement>('#snippet-list');
        this.titleElement = getElement<HTMLHeadingElement>('#form-title');
        this.submitButton = getElement<HTMLButtonElement>('#form-submit');
        this.cancelButton = getElement<HTMLButtonElement>('#form-cancel');
        this.editingSnippet = null;

        this.handleListClick = this.handleListClick.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.bindEvents();
    }

    private bindEvents(): void {
        this.form.addEventListener('submit', this.handleSubmit);
        this.listElement.addEventListener('click', this.handleListClick);
        this.cancelButton.addEventListener('click', this.cancelEdit);
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

        const draft: SnippetDraft = {
            title,
            language,
            code,
            tags,
        };

        const editing = this.editingSnippet;

        try {
            if(editing) {
                await this.dataSource.update(editing.id, draft);
            } else {
                await this.dataSource.create(draft);
            }
        } catch {
            this.toast.showError(editing ? 'Could not update snippet.' : 'Could not add snippet.');
            return;
        }
        
        this.changes.notify();
        
        this.cancelEdit();

        this.toast.showSuccess(editing ? 'Snippet updated.' : 'Snippet added.');
    }

    private async handleListClick(event: MouseEvent): Promise<void> {
        const target = event.target;

        if(!(target instanceof HTMLElement)) {
            return;
        }

        const id = target.closest<HTMLButtonElement>('[data-edit-id]')?.dataset.editId;

        if(!id) {
            return;
        }

        try {
            const snippets = await this.dataSource.getAll();
            const snippet = snippets.find((item) => item.id === id);

            if(snippet) {
                this.startEdit(snippet);
            }
        } catch {
            this.toast.showError('Could not laod snippet.');
        }
    }

    private startEdit(snippet: Snippet): void {
        this.editingSnippet = snippet;

        getElement<HTMLInputElement>('#title').value = snippet.title;
        getElement<HTMLSelectElement>('#language').value = snippet.language;
        getElement<HTMLTextAreaElement>('#code').value = snippet.code;
        getElement<HTMLInputElement>('#tags').value = snippet.tags.join(', ');

        this.renderMode();
    }

    private cancelEdit(): void {
        this.editingSnippet = null;
        this.form.reset();

        this.renderMode();
    }

    private renderMode(): void {
        const editing = this.editingSnippet !== null;

        this.titleElement.textContent = editing ? 'Edit Snippet' : 'Add Snippet';
        this.submitButton.textContent = editing ? 'Save Changes' : 'Add Snippet';
        this.cancelButton.hidden = !editing;
    }
}