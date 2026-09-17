import './style.css';
import { renderAppShell } from './views/renderAppShell';
import { exampleSnippets } from './snippets';
import { SnippetStore } from './features/snippets/snippetStore';
import { SnippetController } from './features/snippets/snippetController';
import { SnippetStorage } from './features/snippets/snippetStorage';

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

  if(!searchInput) {
    throw Error('Search imput element was not found.');
  }

  const deleteDialog = document.querySelector<HTMLDialogElement>('#delete-dialog');

  if(!deleteDialog) {
    throw Error('Delete dialog element was not found.');
  }

  const toast = document.querySelector<HTMLDivElement>('#toast');

  if(!toast) {
    throw Error('Toast element was not found.');
  }

  const snippetController = new SnippetController(
    snippetStore, 
    form, 
    snippetList,
    searchInput,
    deleteDialog,
    toast,
  );

  snippetController.render();
}

startApp();