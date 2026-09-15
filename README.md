# Snippet Library

A small snippet manager built with vanilla TypeScript and Vite. It lets you save, browse, and delete code snippets by language and tags.

## Features

- Add snippets with a title, language, code, and tags
- Delete snippets
- Persist snippets in browser `localStorage`
- Render language options from a typed language list
- Use event delegation for snippet actions

## Tech Stack

- TypeScript
- Vite
- HTML and CSS
- No framework

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the project for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  features/snippets/
    snippetController.ts
    snippetStorage.ts
    snippetStore.ts
  views/
    renderAppShell.ts
    renderSnippet.ts
  main.ts
  snippets.ts
  types.ts
  style.css
```

`main.ts` starts the application and wires the main objects together.

`SnippetController` handles form and list events and updates the UI.

`SnippetStore` owns the snippet state and delegates persistence to `SnippetStorage`.

`SnippetStorage` reads and writes snippets using `localStorage`.

The view modules generate the HTML for the application shell and individual snippet cards.

## Current Languages

- PHP
- JavaScript
- TypeScript
- HTML
- CSS

## Roadmap

- Add snippet search and filtering
- Add editing support
- Improve validation and empty states
- Add automated tests

## Learning Goals

This project is practice for TypeScript concepts including interfaces, union types, type-only imports, classes, private properties, typed DOM APIs, event handling, and runtime data handling.
