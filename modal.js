// We define an ES6 class that extends HTMLElement
class SqulaDialog extends HTMLElement {
    constructor() {
        super();
        this._onClick = this._onClick.bind(this);
        this._onCloseClick = this._onCloseClick.bind(this);
        this._templateContent = this._templateContent.bind(this);
        this._shadowRoot = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // properties.
        const title = this.title;
        const image = this.image;
        const content = this.content;

        // set template + styling
        const template = document.createElement('template');
        template.innerHTML = this._templateContent(title, image, content);
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        // add event binding.
        this._imgLink = this._shadowRoot.querySelector('#imgLink');
        this._imgLink.addEventListener('click', this._onClick);

        this._closeLink = this._shadowRoot.querySelector('#closeLink');
        this._closeLink.addEventListener('click', this._onCloseClick);
    }
    
    disconnectedCallback() {
        this._imgLink.removeEventListener('click', this._onClick);
        this._closeLink.removeEventListener('click', this._onCloseClick);
    }

    static get observedAttributes() { return ['foo']; }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (attr === 'title' || attr === 'image' || attr === 'content') {
            this._shadowRoot.innerHTML = this._templateContent(this.title, this.image, this.content);
        }
    }

    _templateContent(title, image, content) {
        const styles = `
            :host {
                position: relative;
                color: #fff;
                padding: var(--padding-dialog, 2px);
            }

            a {
                text-decoration: none;
                color: #fff;
            }
        
            div.container {
                display: flex;
                flex-direction: column;
            }
        
            .content {
                background: var(--container-bg, #35cce7);
                text-align: center;
            }
        
            div.header {
                display: flex;
                flex-direction: row;
                background: var(--header-bg, #35cce7);
                padding-left: 1em;
                padding-right: 1em;
            }
            
            div.header i {
                margin-right: 1em;
                font-size: 2em;
            }

            div.header h2 {
                flex: 1;
                margin-top: 0.5em;
                margin-bottom: 0.5em;
                text-align: center;
            }
        `;

        return `
            <style>${styles}</style>
            <div class="container">
                <div class="header">
                    <a href="#" id="closeLink">
                        <i>X</i>
                    </a>
                    <h2>${title}</h2>
                </div>
                <div class="content">
                    <slot name="dialog-content">
                        <a href="#" id="imgLink">
                            <img src="${image}" height="100" width="100"/>
                        </a>
                        <p>${content}</p>
                    </slot>
                </div>
            </div>
        `;
    }

    get title() {
        return this.getAttribute('title') || "Default title";
    }
  
    set title(newValue) {
        this.setAttribute('title', newValue);
    }

    get image() {
        return this.getAttribute('image') || "img/trophy.png";
    }
  
    set image(newValue) {
        this.setAttribute('image', newValue);
    }

    get content() {
        return this.getAttribute('content') || "Default content";
    }
  
    set content(newValue) {
        this.setAttribute('content', newValue);
    }

    get clickLink() {
        return this.getAttribute('click-link') || 'default';
    }

    set clickLink(newValue) {
        this.setAttribute('click-link', newValue);
    }
 
    _onClick() {
        this._shadowRoot.dispatchEvent(new CustomEvent('image-clicked', {
            detail: `clicked > ${this.clickLink}`,
            composed: true
        }));
    }

    _onCloseClick() {
        this._shadowRoot.dispatchEvent(new CustomEvent('dialog-closed', {
            detail: 'close clicked',
            composed: true
        }));
    }
}
 
// This is where the actual element is defined for use in the DOM
customElements.define('squla-dialog', SqulaDialog);