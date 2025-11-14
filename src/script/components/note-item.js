class NoteItem extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _note = {
    id: null,
    title: null,
    body: null,
    createdAt: null,
    archived: false,
  };

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  set note(value) {
    this._note = value;

    // Render ulang
    this.render();
  }

  get note() {
    return this._note;
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
          display: flex;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin-bottom: 20px;
      }

      .card {
          display: flex;
          flex-direction: column; 
          width: 100%;
          justify-content: space-between; 
          min-height: 180px; 
      }

      .note-info {
          padding: 16px 24px;
          flex-grow: 1; 
          display: flex;
          flex-direction: column;
      }

      .note-info__title {
          flex-shrink: 0; 
      }

      .note-info__title h2 {
          font-weight: 400; 
          margin: 0; 
          font-size: 1.5em; 
      }

      .note-info__description {
          flex-grow: 1; 
      }

      .note-info__description p {
          display: -webkit-box;
          margin-top: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 8; 
          line-height: 1.4; 
      }

      .note-info_created-at {
          margin-top: auto; 
          
          color: #6c757d; 
          font-size: 0.85em;
          padding-top: 10px; 
      }

      .note-actions {
          display: flex;
          justify-content: space-between;
          gap: 10px; 
          padding: 10px 24px;
          background-color: #f8f9fa; 
          border-top: 1px solid #dee2e6; 
          flex-shrink: 0; 
      }

      .note-actions button {
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          font-weight: 600; 
          cursor: pointer;
          transition: background-color 0.2s, opacity 0.2s; 
          text-transform: uppercase;
          font-size: 0.9em;
      }

      .archive-button, .unarchive-button {
          background-color: #ffc107;
          color: #343a40;
      }

      .archive-button:hover, .unarchive-button:hover {
          background-color: #e0a800;
      }

      .delete-button {
          background-color: #dc3545;
          color: white;
      }

      .delete-button:hover {
          background-color: #c82333;
      }
    `;
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    const primaryActionButton = this._note.archived
      ? `<button class="unarchive-button" data-action="unarchive">Unarchive</button>`
      : `<button class="archive-button" data-action="archive">Archive</button>`;
      this._shadowRoot.appendChild(this._style);
      this._shadowRoot.innerHTML += `
      <div class="card">
        <div class="note-info">
          <div class="note-info__title">
            <h2>${this._note.title}</h2>
          </div>
            <div class="note-info__description">
              <p>${this._note.body}</p>
            </div>
              <div class="note-info__created-at">
                <small>${new Date(this._note.createdAt).toLocaleDateString(
                  "id-ID",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </small>
              </div>
            </div>
              <div class="note-actions">
                ${primaryActionButton} <button class="delete-button" data-action="delete">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    this._attachEventListeners();
  }
  _attachEventListeners() {
    const primaryButton = this._shadowRoot.querySelector(
      ".archive-button, .unarchive-button",
    );
    if (primaryButton) {
      primaryButton.addEventListener("click", (event) => {
        const action = event.target.dataset.action;
        this.dispatchEvent(
          new CustomEvent(`${action}-note`, {
            detail: { id: this._note.id },
            bubbles: true,
            composed: true,
          }),
        );
      });
    } 

    const deleteButton = this._shadowRoot.querySelector(".delete-button");
    if (deleteButton) {
      deleteButton.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("delete-note", {
            detail: { id: this._note.id },
            bubbles: true,
            composed: true,
          }),
        );
      });
    }
  }
}

customElements.define("note-item", NoteItem);
