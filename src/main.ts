import './style.css';
import { renderAppShell } from './renderAppShell';
import { exampleSnippets } from './snippets/services/exampleSnippets';
import { SnippetStore } from './snippets/services/snippetStore';
import { SnippetController } from './snippets/snippetController';
import { SnippetStorage } from './snippets/services/snippetStorage';
import { SnippetChanges } from './snippets/services/snippetChanges';
import { SnippetList } from './snippets/snippetList/snippetList';
import { Toast } from './shared/toast/toast';
import { SnippetDelete } from './snippets/snippetDelete/snippetDelete';

const snippetStorage = new SnippetStorage();
const snippetStore = new SnippetStore(snippetStorage, exampleSnippets);

function startApp(): void {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = renderAppShell();

  const form = document.querySelector<HTMLFormElement>('#snippet-form');

  if (!form) {
    throw Error('Snippet form element was not found.');
  }

  const snippetList = document.querySelector<HTMLDivElement>('#snippet-list');

  if (!snippetList) {
    throw Error('Snippet list element was not found.');
  }

  const searchInput = document.querySelector<HTMLInputElement>('#snippet-search');

  if (!searchInput) {
    throw Error('Search imput element was not found.');
  }

  const deleteDialog = document.querySelector<HTMLDialogElement>('#delete-dialog');

  if (!deleteDialog) {
    throw Error('Delete dialog element was not found.');
  }

  const toastElement = document.querySelector<HTMLDivElement>('#toast');

  if (!toastElement) {
    throw Error('Toast element was not found.');
  }

  const changes = new SnippetChanges();
  const toast = new Toast(toastElement);
  const list = new SnippetList(snippetStore, changes, snippetList, searchInput);
  const snippetDelete = new SnippetDelete(snippetStore, changes, toast, deleteDialog);

  snippetList.addEventListener('delete-requested', (event) => {
    snippetDelete.open((event as CustomEvent<string>).detail)
  });

  new SnippetController(
    snippetStore,
    form,
    changes,
    toast
  );

  list.render();
}

startApp();