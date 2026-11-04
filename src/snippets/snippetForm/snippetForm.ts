import type { SnippetDataSource } from "../contracts/snippetDataSource";
import type { Language, Snippet } from "../contracts/snippets";
import type { Toast } from "../../shared/toast/toast";
import type { SnippetChanges } from "../services/snippetChanges";
import { getElement } from "../../shared/dom/getElement";

export class SnippetForm {
    private readonly dataSource: SnippetDataSource;
    private readonly changes: SnippetChanges;
    private readonly toast: Toast;
    private readonly form: HTMLFormElement;

    constructor(
        dataSource: SnippetDataSource,
        changes: SnippetChanges,
        toast: Toast,
    ) {
        this.dataSource = dataSource;

        this.form = getElement<HTMLFormElement>('#snippet-form');

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

        await this.dataSource.create(newSnippet);
        
        this.changes.notify();
        
        this.form.reset();
        this.toast.showSuccess('Snippet added.');
    }
}