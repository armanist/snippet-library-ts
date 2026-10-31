# Snippet Library - TypeScript

A small snippet manager built with vanilla TypeScript and Vite, with no framework. It lets you save, search, and delete code snippets by language and tags. Snippets are stored in the browser.

## Features

- Add snippets with a title, language, code, and comma-separated tags.
- Search snippets by title, language, code, and tags.
- Confirm deletions in a dialog.
- See success and error notifications.
- Keep snippets between visits in the browser's `localStorage`. Two sample snippets appear on the first visit.
- Choose languages from a typed list.

## Tech stack

- TypeScript
- Vite
- HTML and CSS
- No framework

## Quick start

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Then open the address Vite prints (usually `http://localhost:5173`).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check with `tsc`, then build for production |
| `npm run preview` | Serve the production build locally |

## How it is organized

```text
src/
  main.ts                        Creates the units and connects them
  renderAppShell.ts              The page markup
  style.css
  shared/
    dom/                         getElement helper
    toast/                       Toast, renderToast
  snippets/
    contracts/                   Types, and the SnippetDataSource interface
    services/                    SnippetStore, SnippetStorage, SnippetChanges,
                                 sample snippets
    snippetList/                 SnippetList (search and rendering), renderSnippet
    snippetForm/                 SnippetForm (adding snippets)
    snippetDelete/               SnippetDelete (confirm dialog and deletion),
                                 renderDeleteDialog
```

## How it works

### One contract for storage

The units never use `localStorage` directly. They talk to a `SnippetDataSource` (`getAll`, `create`, `delete`), and every method returns a `Promise`. `SnippetStore` implements it on top of `SnippetStorage`, which reads and writes `localStorage`. Another storage (for example IndexedDB or a server) can be added as a new class that implements the same interface, without changing any unit.

### Each responsibility has one home

| Unit | Responsibility |
| --- | --- |
| `SnippetList` | Loads the snippets, filters them by the search text, and draws them. Announces a `delete-requested` event when a Delete button is clicked. |
| `SnippetForm` | Reads the form, validates it, and creates the snippet. |
| `SnippetDelete` | Opens the confirm dialog for a snippet and deletes it when confirmed. |
| `Toast` | Shows a success or error message and hides it after 3 seconds. |
| `SnippetChanges` | A small event that says "snippets changed". |

`main.ts` creates these units, gives them the shared `Toast` and `SnippetChanges`, and connects the one event between the list and the delete unit.

### Keeping the list up to date

After a snippet is added or deleted, the form and delete units call `SnippetChanges.notify()`. `SnippetList` subscribed to it, so it reloads and redraws itself. The form and delete units never call the list, and the list never calls them.

### Announcing a delete request

`SnippetList` does not know about the delete dialog. When the user clicks Delete, the list dispatches a `delete-requested` event on its own element, carrying the snippet id. `main.ts` listens for it and calls `SnippetDelete.open(id)`.

## Notes

- Snippets are stored under the key `snippet-library:snippets` in `localStorage`. Clearing the site data brings back the two sample snippets.
- Available languages: PHP, JavaScript, TypeScript, HTML, and CSS. The list lives in `src/snippets/contracts/snippets.ts`.

## Roadmap

- Add IndexedDB as a second storage, selected by an environment variable.
- Add editing support.
- Add automated tests.

## Learning goals

This project is practice for TypeScript concepts including interfaces, union types, type-only imports, classes, private properties, typed DOM APIs, event handling, and runtime data handling, and for splitting an application into small units with one responsibility each.
