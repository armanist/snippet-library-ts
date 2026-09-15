import type { SnippetStore } from "./snippetStore";
import type { Language, Snippet } from "../../types";
import { renderSnippet } from "../../views/renderSnippet";

export class SnippetController {

    private readonly store: SnippetStore;
    private readonly form: HTMLFormElement;
    private readonly snippetList: HTMLDivElement;

    constructor(
        store: SnippetStore,
        form: HTMLFormElement,
        snippetList: HTMLDivElement,
    ) {
        this.store = store;
        this.form = form;
        this.snippetList = snippetList;

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.bindEvents();
    }

    render(): void {
        this.snippetList.innerHTML = this.store
            .getAll()
            .map((snippet) => renderSnippet(snippet))
            .join('');
    }

    private bindEvents(): void {
        this.form.addEventListener('submit', this.handleSubmit);
        this.snippetList.addEventListener('click', this.handleDelete);
    }

    private handleSubmit(event: SubmitEvent): void {
        event.preventDefault();


        const formData = new FormData(this.form);

        const title = String(formData.get('title')).trim();
        const language = String(formData.get('language')) as Language;
        const code = String(formData.get('code')).trim();
        const tags = String(formData.get('tags')).split(',').map((tag) => tag.trim()).filter(Boolean);

        if (!title || !code) {
            alert('Title and code are required');
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

        this.store.remove(snippetId);
        this.render();
    }
}