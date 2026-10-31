type ToastType = 'success' | 'error';

export class Toast {
    private readonly element: HTMLDivElement;
    private timeoutId: number | undefined;

    constructor(element: HTMLDivElement) {
        this.element = element;
        this.timeoutId = undefined;
    }

    showSuccess(message: string): void {
        this.show(message, 'success');
    }

    showError(message: string): void {
        this.show(message, 'error');
    }

    private show(message: string, type: ToastType): void {
        if (this.timeoutId !== undefined) {
            window.clearTimeout(this.timeoutId);
        }

        this.element.textContent = message;
        this.element.className = `toast toast--${type} toast--visible`;

        this.timeoutId = window.setTimeout(() => {
            this.element.className = 'toast';
            this.timeoutId = undefined;
        }, 3000);
    }
}