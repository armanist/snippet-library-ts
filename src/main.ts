import './style.css';
import { renderAppShell } from './renderAppShell';
import { exampleSnippets } from './snippets/services/exampleSnippets';
import { SnippetStore } from './snippets/services/snippetStore';
import { SnippetForm } from './snippets/snippetForm/snippetForm';
import { SnippetStorage } from './snippets/services/snippetStorage';
import { SnippetChanges } from './snippets/services/snippetChanges';
import { SnippetList } from './snippets/snippetList/snippetList';
import { Toast } from './shared/toast/toast';
import { SnippetDelete } from './snippets/snippetDelete/snippetDelete';
import { getElement } from './shared/dom/getElement';

const snippetStorage = new SnippetStorage();
const snippetStore = new SnippetStore(snippetStorage, exampleSnippets);

function startApp(): void {
  getElement<HTMLDivElement>('#app').innerHTML = renderAppShell();
  
  const form = getElement<HTMLFormElement>('#snippet-form');
  const snippetList = getElement<HTMLDivElement>('#snippet-list');
  const searchInput = getElement<HTMLInputElement>('#snippet-search');
  const deleteDialog = getElement<HTMLDialogElement>('#delete-dialog');
  const toastElement = getElement<HTMLDivElement>('#toast');

  const changes = new SnippetChanges();
  const toast = new Toast(toastElement);
  const list = new SnippetList(snippetStore, changes, snippetList, searchInput);
  new SnippetDelete(snippetStore, changes, toast, deleteDialog, snippetList);

  new SnippetForm(snippetStore, changes, toast, form);

  list.render();
}

startApp();