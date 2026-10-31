import type { Toast } from "../../shared/toast/toast";
import type { SnippetDataSource } from "../contracts/snippetDataSource";
import type { SnippetChanges } from "../services/snippetChanges";

export class SnippetDelete {
    private readonly dataSource: SnippetDataSource;
    private readonly changes: SnippetChanges;
    private readonly toast: Toast;
    private readonly dialog: HTMLDialogElement;
    private pendingId: string | null;

    constructor(
        dataSource: SnippetDataSource,
        changes: SnippetChanges,
        toast: Toast,
        dialog: HTMLDialogElement,
        listElement: HTMLDivElement,
    ) {
        this.dataSource = dataSource;
        this.changes = changes;
        this.toast = toast;
        this.dialog = dialog;
        this.pendingId = null;

        this.handleClose = this.handleClose.bind(this);
        this.dialog.addEventListener('close', this.handleClose);

        this.handleListClick = this.handleListClick.bind(this);
        listElement.addEventListener('click', this.handleListClick);
    }

    private open(id: string): void {
        this.pendingId = id;
        this.dialog.returnValue = '';
        this.dialog.showModal();
    }

    private async handleClose(): Promise<void> {
        const id = this.pendingId;
        this.pendingId = null;

        if (this.dialog.returnValue !== 'confirm' || !id) {
            return;
        }

        await this.dataSource.delete(id);

        this.changes.notify();
        this.toast.showSuccess('Snippet deleted.');
    }

    private handleListClick(event: MouseEvent): void {
        const target = event.target;

        if (!(target instanceof HTMLElement)) {
            return;
        }

        const id = target.closest<HTMLButtonElement>('[data-snippet-id]')?.dataset.snippetId;

        if (!id) {
            return;
        }

        this.open(id);
    }
}