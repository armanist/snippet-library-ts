import './style.css';
import { renderAppShell } from './renderAppShell';
import { exampleSnippets } from './snippets/services/exampleSnippets';
import { LocalStorageSnippetSource } from './snippets/services/LocalStorageSnippetSource';
import { SnippetForm } from './snippets/snippetForm/snippetForm';
import { SnippetChanges } from './snippets/services/snippetChanges';
import { SnippetList } from './snippets/snippetList/snippetList';
import { Toast } from './shared/toast/toast';
import { SnippetDelete } from './snippets/snippetDelete/snippetDelete';
import { getElement } from './shared/dom/getElement';

const dataSource = new LocalStorageSnippetSource(exampleSnippets);

function startApp(): void {
  getElement<HTMLDivElement>('#app').innerHTML = renderAppShell();
  
  const changes = new SnippetChanges();

  const toast = new Toast();

  new SnippetList(dataSource, changes);

  new SnippetDelete(dataSource, changes, toast);

  new SnippetForm(dataSource, changes, toast);

}

startApp();