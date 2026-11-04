import type { SnippetDataSource } from "../contracts/snippetDataSource";
import type { Snippet } from "../contracts/snippet";

export class IndexedDbSnippetSource implements SnippetDataSource {
    private readonly databaseName = 'snippet-library';
    private readonly storeName = 'snippets';
    private readonly database: Promise<IDBDatabase>;

    constructor() {
        this.database = this.open();
    }

    async getAll(): Promise<Snippet[]> {
        const database = await this.database;
        const store = database.transaction(this.storeName, 'readonly').objectStore(this.storeName);
        const snippets: Snippet[] = await this.requestToPromise(store.getAll());    

        return snippets.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    async create(snippet: Snippet): Promise<void> {
        const database = await this.database;
        const transaction = database.transaction(this.storeName, 'readwrite');

        transaction.objectStore(this.storeName).add(snippet);

        await this.transactionToPromise(transaction);
    }

    async delete(id: string): Promise<void> {
        const database = await this.database;
        const transaction = database.transaction(this.storeName, 'readwrite');

        transaction.objectStore(this.storeName).delete(id);

        await this.transactionToPromise(transaction);
    }

    private open(): Promise<IDBDatabase> {
        const request = indexedDB.open(this.databaseName, 1);

        request.onupgradeneeded = () => {
            request.result.createObjectStore(this.storeName, { keyPath: 'id' });
        }

        return this.requestToPromise(request);
    }

    private requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    private transactionToPromise(transaction: IDBTransaction): Promise<void> {
        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
            transaction.onabort = () => reject(transaction.error);
        });
    }
}