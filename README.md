# Snippet Library - TypeScript

A small snippet manager built with vanilla TypeScript and Vite, with no framework. It lets you save, search, edit, and delete code snippets by language and tags. Snippets are stored in the browser, in either `localStorage` or IndexedDB, selected with one setting.

## Features

- Add snippets with a title, language, code, and comma-separated tags.
- Edit a snippet: the Edit button fills the form, and Save Changes updates it. Cancel leaves edit mode.
- Search snippets by title, language, code, and tags.
- Confirm deletions in a dialog.
- See success and error notifications.
- Keep snippets between visits in the browser, in `localStorage` or in IndexedDB.
- Switch between the two storages without changing any other code.
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

## Switching the storage

The app can keep its snippets in `localStorage` or in IndexedDB. The choice is one variable in a Vite env file, in the project root:

| File | Used by |
| --- | --- |
| `.env.development` | `npm run dev` |
| `.env.production` | `npm run build` |

To use IndexedDB:

```sh
VITE_SNIPPET_STORAGE=indexeddb
```

To use `localStorage`:

```sh
VITE_SNIPPET_STORAGE=local
```

Then restart `npm run dev`, because Vite reads env files only at startup. For a production build, edit `.env.production` and run `npm run build` again.

To check which storage is active, open the browser's DevTools and go to the Application tab:

- IndexedDB: the database `snippet-library`, the store `snippets`.
- localStorage: the key `snippet-library:snippets`.

The two storages are separate. Switching from one to the other starts with that storage's own snippets (none, the first time).

The variable name starts with `VITE_` because Vite only exposes variables with that prefix to the browser code. Do not put secrets in these files.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check with `tsc`, then build for production |
| `npm run preview` | Serve the last production build (run `npm run build` first) |

## How it is organized

```text
src/
  main.ts                        Creates the units
  env.d.ts                       Types for the env variable
  renderAppShell.ts              The page markup
  style.css
  shared/
    dom/                         getElement helper
    toast/                       Toast, renderToast
  snippets/
    contracts/                   Types, and the SnippetDataSource interface
    services/                    LocalStorageSnippetSource, IndexedDbSnippetSource,
                                 createDataSource, SnippetChanges
    snippetList/                 SnippetList (search and rendering), renderSnippet
    snippetForm/                 SnippetForm (adding and editing snippets)
    snippetDelete/               SnippetDelete (confirm dialog and deletion),
                                 renderDeleteDialog
```

## How it works

### One contract, two storages

The units never touch a storage directly. They talk to a `SnippetDataSource` (`getAll`, `create`, `update`, `delete`), and every method returns a `Promise`. `create` takes a `SnippetDraft` (title, language, code, tags) and `update` takes an id and the changes, the same shape as in the Vue and Angular versions. The storage creates the `id` and `createdAt`. Two classes implement it: `LocalStorageSnippetSource` and `IndexedDbSnippetSource`. `createDataSource()` is the single place that reads `VITE_SNIPPET_STORAGE` and picks one. Nothing else knows which storage is active, so adding another (for example a server) means adding one class and one line in `createDataSource()`.

### Each responsibility has one home

| Unit | Responsibility |
| --- | --- |
| `SnippetList` | Loads the snippets, filters them by the search text, and draws them. Reloads when the snippets change. |
| `SnippetForm` | Reads the form, validates it, and creates or updates the snippet. Handles the Edit buttons, fills the form in edit mode, and leaves edit mode when the snippet is saved, cancelled, or deleted. |
| `SnippetDelete` | Opens the confirm dialog when a Delete button is clicked, and deletes the snippet when confirmed. |
| `Toast` | Shows a success or error message and hides it after 3 seconds. |
| `SnippetChanges` | A small event that says "snippets changed". |

Each unit finds its own elements in the page. `main.ts` only creates the data source, the shared `Toast` and `SnippetChanges`, and the units.

### Keeping the list up to date

After a snippet is added, updated, or deleted, the form and delete units call `SnippetChanges.notify()`. `SnippetList` subscribed to it, so it reloads and redraws itself. `SnippetForm` subscribed too: if the snippet being edited was deleted, it leaves edit mode. No unit calls another unit directly.

## Notes

- `localStorage` keeps the snippets under the key `snippet-library:snippets`. IndexedDB keeps them in the database `snippet-library`, in the store `snippets`.
- The app starts empty. Add a snippet to see it in the list.
- Available languages: PHP, JavaScript, TypeScript, HTML, and CSS. The list lives in `src/snippets/contracts/snippets.ts`.

## Roadmap

- Add automated tests.
- Add a storage that talks to a server.
