import { languages } from "./snippets/contracts/snippet";
import { renderDeleteDialog } from "./snippets/snippetDelete/renderDeleteDialog";
import { renderToast } from "./shared/toast/renderToast";

function renderLanguageOptions(): string {
    return languages.map((language) => `<option value="${language}">${language.toUpperCase()}</option>`).join('');
} 

export function renderAppShell(): string {
    return `
      <main class="app">
        <header class="app-header">
          <h1>Snippet Library</h1>
          <p class="intro">
            Save small code snippets by language, tags, and title.
          </p>
        </header>

        <section class="workspace">
          <section class="panel">
            <h2>Add Snippet</h2>

            <form class="snippet-form" id="snippet-form">
              <label>
                Title
                <input id="title" name="title" type="text" placeholder="PHP foreach loop" />
              </label>

              <label>
                Language
                <select id="language" name="language">
                    ${renderLanguageOptions()}
                </select>
              </label>

              <label>
                Code
                <textarea id="code" name="code" rows="8" placeholder="Paste your code here"></textarea>
              </label>

              <label>
                Tags
                <input id="tags" name="tags" type="text" placeholder="loop, array, php" />
              </label>

              <button type="submit">Add Snippet</button>
            </form>
          </section>

          <section class="panel">
            <h2>Your Snippets</h2>
            <label class="snippet-search">
              Search
              <input
                id="snippet-search"
                type="search"
                placeholder="Search snippets..."
              />
            </label>
            <div class="snippet-list" id="snippet-list"></div>
          </section>
        </section>
      </main>

      ${renderDeleteDialog()}
      ${renderToast()}
    `;
  }