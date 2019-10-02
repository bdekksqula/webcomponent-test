// We define an ES6 class that extends HTMLElement
class SqulaPage extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // set template + styling
        const template = document.createElement('template');
        template.innerHTML = this._templateContent(this.title);
        this._shadowRoot.appendChild(template.content.cloneNode(true));
    }
    
    disconnectedCallback() {
    }

    _templateContent(items) {
        const styles = `
            :host {
                display:flex;
            }
        `;

        return `
            <style>${styles}</style>
            <div class="container">
                <slot name="content">Default Content</slot>
            </div>
        `;
    }

    get title() {
        return this.getAttribute('title') || "Default title";
    }
  
    set title(newValue) {
        this.setAttribute('title', newValue);
    }
 
    _onItemClick(item) {
        let data = item.data;
        this._shadowRoot.dispatchEvent(new CustomEvent('page-navigate', {
            detail: data,
            composed: true
        }));
    }
}
 
// This is where the actual element is defined for use in the DOM
customElements.define('squla-page', SqulaPage);