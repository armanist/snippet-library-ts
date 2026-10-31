  export function renderToast(): string {
    return `
      <div
        class="toast"
        id="toast"
        role="status"
        aria-live="polite"
      ></div>
    `;
  }