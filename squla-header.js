// We define an ES6 class that extends HTMLElement
class SqulaHeader extends HTMLElement {
    constructor() {
        super();
        this._onItemClick = this._onItemClick.bind(this);
        this._shadowRoot = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // properties.
        const navItems = [{
            name: 'Page 1',
            href: '/page1'
        },{
            name: 'Page 2',
            href: '/page2'
        }]

        // set template + styling
        const template = document.createElement('template');
        template.innerHTML = this._templateContent(navItems);
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this._items = this._shadowRoot.querySelectorAll('.item');
        this._items.forEach((i) => i.addEventListener('click', this._onItemClick));
    }
    
    disconnectedCallback() {
    }

    _templateContent(items) {
        const styles = `
            :host {
                display:flex;
                flex-direction:row;
                color: #fff;
                background: #eee;
            }
            div.item {
                display: inline-block;
                padding: 2px;
            }
        `;

        return `
            <style>${styles}</style>
            <div class="container">
                ${items.map((item, i) => `
                    <div class="item" data-href="${item.href}" data-name="${item.name}">
                        <span>${item.name}</span>
                    </div>
                `)}
            </div>
        `;
    }

    _onItemClick(item) {
        let data = item.target.parentElement.dataset;
        this._shadowRoot.dispatchEvent(new CustomEvent('page-navigate', {
            detail: data,
            composed: true
        }));
    }
}
 
// This is where the actual element is defined for use in the DOM
customElements.define('squla-header', SqulaHeader);