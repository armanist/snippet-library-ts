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
    ) {
        this.dataSource = dataSource;
        this.changes = changes;
        this.toast = toast;
        this.dialog = dialog;
        this.pendingId = null;

        this.hadleClose = this.hadleClose.bind(this);
        this.dialog.addEventListener('close', this.hadleClose);
    }

    open(id: string): void {
        this.pendingId = id;
        this.dialog.returnValue = '';
        this.dialog.showModal();
    }

    private async hadleClose(): Promise<void> {
        const id = this.pendingId;
        this.pendingId = null;

        if(this.dialog.returnValue !== 'confirm' || !id) {
            return;
        }

        await this.dataSource.delete(id);

        this.changes.notify();
        this.toast.showSuccess('Snippet deleted.');
    }
}