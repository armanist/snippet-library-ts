import type { Snippet } from "../contracts/snippets";

export function renderSnippet(snippet: Snippet): string {
    return `
      <article class="snippet-card">
        <div class="snippet-card__header">
          <div>
            <h3>${snippet.title}</h3>
            <p>${snippet.language}</p>
          </div>
           <button
                type="button"
                class="delete-button"
                data-snippet-id="${snippet.id}"
            can>
      Delete
    </button>
        </div>

        <pre><code>${snippet.code}</code></pre>

        <div class="tag-list">
          ${snippet.tags.map((tag) => `<span>${tag}</span>`).join('')}
        </div>
      </article>
    `;
}