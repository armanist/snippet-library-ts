import type { Snippet } from "../contracts/snippet";
import { escapeHtml } from "../../shared/dom/escapeHtml";

export function renderSnippet(snippet: Snippet): string {
  return `
      <article class="snippet-card">
        <div class="snippet-card__header">
          <div>
            <h3>${escapeHtml(snippet.title)}</h3>
            <p>${escapeHtml(snippet.language)}</p>
          </div>
            <div class="snippet-card__actions">
               <button 
                type="button" 
                class="edit-button" 
                data-edit-id="${snippet.id}">Edit
              </button>
              <button
                type="button"
                class="delete-button"
                data-snippet-id="${snippet.id}">Delete
              </button>
            </div>
        </div>

        <pre><code>${escapeHtml(snippet.code)}</code></pre>

        <div class="tag-list">
          ${snippet.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}
        </div>
      </article>
    `;
}