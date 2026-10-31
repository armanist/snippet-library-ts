import type { SnippetStore } from "./services/snippetStore";
import type { Language, Snippet } from "./contracts/snippets";
import type { Toast } from "../shared/toast/toast";
import type { SnippetChanges } from "./services/snippetChanges";

export class SnippetController {
    private readonly store: SnippetStore;
    private readonly changes: SnippetChanges;
    private readonly toast: Toast;

    private readonly form: HTMLFormElement;

    constructor(
        store: SnippetStore,
        form: HTMLFormElement,
        changes: SnippetChanges,
        toast: Toast,
    ) {
        this.store = store;
        this.form = form;
        this.changes = changes;

        this.toast = toast;

        this.handleSubmit = this.handleSubmit.bind(this);

        this.bindEvents();
    }

    private bindEvents(): void {
        this.form.addEventListener('submit', this.handleSubmit);
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
}