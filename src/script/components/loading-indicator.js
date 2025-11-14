class LoadingIndicator extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _animation = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        margin-block: 1rem;

        font-size: 1.5rem;
        font-weight: lighter;
        color: rgba(0, 0, 0, 0.5);
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this.render();
    this._startAnimation();
  }
  disconnectedCallback() {
        if (this._animation) {
            this._animation.pause();
            this._animation = null;
        }
    }

  render() {
        this._emptyContent();
        this._updateStyle();

        this._shadowRoot.appendChild(this._style);
        this._shadowRoot.innerHTML += `
            <span class="loading-text">Loading...</span>
        `;
    }

    _startAnimation() {
        if (typeof anime === 'undefined') {
            console.warn('anime.js not found. Loading animation skipped.');
            return;
        }
        
        const loadingText = this._shadowRoot.querySelector('.loading-text');

        if (loadingText) {

            this._animation = anime({
                targets: loadingText,
                opacity: [
                    { value: 0.5, duration: 500 },
                    { value: 1.0, duration: 500 }
                ],
                scale: [
                    { value: 1.05, duration: 500, easing: 'easeInOutQuad' },
                    { value: 1.0, duration: 500, easing: 'easeInOutQuad' }
                ],
                easing: 'linear',
                loop: true, 
                direction: 'alternate',
            });
        }
    }
}

customElements.define("loading-indicator", LoadingIndicator);
