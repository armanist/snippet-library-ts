type ChangeListener = () => void;

export class SnippetChanges {
    private readonly listeners: ChangeListener[] = [];

    subscribe(listener: ChangeListener): void {
        this.listeners.push(listener);
    }

    notify(): void {
        this.listeners.forEach((listener) => listener());
    }
}