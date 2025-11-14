class InputBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  _onFormSubmit = (event) => {
    this.dispatchEvent(new CustomEvent("submit"));
    event.preventDefault();
  };

  _onInputBarSubmit = () => {
    const title = this._shadowRoot.querySelector("input#title").value.trim(); // Use trim() to clean up whitespace
    const body = this._shadowRoot.querySelector("textarea#body").value.trim(); // Use trim() to clean up whitespace

    if (!title || !body) {
      alert("Both the note's title and description must be filled out.");
      return;
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
        alert("The input values must be strings.");
        return; 
    }
    const textOnlyRegex = /^[\p{L}\s]+$/u;
    if (!textOnlyRegex.test(title)) {
        alert("The title must only contain letters and spaces.");
        return;
    }
    if (!textOnlyRegex.test(body)) {
        alert("The description must only contain letters and spaces.");
        return;
    }

    this.dispatchEvent(
      new CustomEvent("input-bar", {
        detail: { title, body },
        bubbles: true,
        composed: true,
      }),
    );

    this._shadowRoot.querySelector("form").reset();
  };

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
    this.render();
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this._shadowRoot
      .querySelector("form")
      .addEventListener("submit", this._onFormSubmit);
    this.addEventListener("submit", this._onInputBarSubmit);
  }

  disconnectedCallback() {
    this._shadowRoot
      .querySelector("form")
      .removeEventListener("submit", this._onFormSubmit);
    this.removeEventListener("submit", this._onInputBarSubmit);
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
      }

      .floating-form {
        background-color: #f0f8ff; /* White-ish background */
        padding: 20px;
        border-radius: 12px;
        position: sticky;
        top: 20px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }

      .input-form {
        display: flex;
        flex-direction: column; /* Stacks children vertically */
        gap: 24px;
      }

      .input-form .form-group {
        position: relative;
      }

      .input-form .form-group input,
      .input-form .form-group textarea {
        display: block;
        width: 97%;
        padding: 14px 10px 10px 10px;
        border: none;
        border-bottom: 2px solid #b0c4de; /* Lighter cornflowerblue border */
        background-color: #ffffff; /* Pure white input background */
        color: #000000; /* Black text */
        font-size: 1rem;
        font-family: inherit;
        transition: border-bottom-color 0.3s ease-in-out;
      }

      .input-form .form-group textarea {
        resize: vertical;
        min-height: 60px;
      }

      .input-form .form-group input:focus-visible,
      .input-form .form-group textarea:focus-visible {
        outline: none;
        border-bottom-color: #6495ed; /* Cornflowerblue accent on focus */
      }

      .input-form .form-group label {
        line-height: 30px;
        font-size: 1em;
        font-weight: 500;
        text-transform: uppercase;
        color: #888888; /* Muted gray label color */
        white-space: nowrap;
        position: absolute;
        top: 0;
        left: 20px;
        user-select: none;
        pointer-events: none;
        transition: all 0.3s ease-in-out;
      }

      .input-form .form-group input:focus-visible ~ label,
      .input-form .form-group input:valid ~ label,
      .input-form .form-group textarea:focus-visible ~ label,
      .input-form .form-group textarea:valid ~ label {
        left: 10px;
        top: -20px;
        font-size: 0.7em;
        color: #4682b4; /* Steelblue label color when active */
      }

      .input-form button {
        border: 0;
        padding-inline: 30px;
        background-color: #6495ed; /* Cornflowerblue button background */
        text-transform: uppercase;
        font-size: 1rem;
        font-weight: bold;
        color: #ffffff; /* White text on button */
        cursor: pointer;
        border-radius: 8px;
        height: 60px; /* Consistent height with inputs */
        transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
      }

      .input-form button:hover {
        background-color: #5a85e6; /* Slightly darker cornflowerblue on hover */
        transform: translateY(-2px);
      }

      .input-form button:active {
        background-color: #4a75cc; /* Even darker cornflowerblue on click */
        transform: translateY(0);
      }
    `;
  }

  render() {
    this._emptyContent();
    this._updateStyle();
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="floating-form">
        <form id="inputForm" class="input-form">
          <div class="form-group">
            <input id="title" name="title" type="text"  required />
            <label for="title">Note's title</label>
          </div>
          <div class="form-group">
            <textarea id="body" name="body" rows="3" required></textarea>
            <label for="body">Note's description</label>
          </div>
          <button>Input</button>
        </form>
      </div>
    `;
  }
}

customElements.define("input-bar", InputBar);