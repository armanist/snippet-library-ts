  export function renderDeleteDialog(): string {
    return `
      <dialog class="delete-dialog" id="delete-dialog">
        <form method="dialog">
          <h2>Delete snippet?</h2>
          <p>This action cannot be undone.</p>

          <div class="delete-dialog__actions">
            <button value="cancel">Cancel</button>
            <button value="confirm" class="delete-dialog__confirm">
              Delete
            </button>
          </div>
        </form>
      </dialog>
    `;
  }