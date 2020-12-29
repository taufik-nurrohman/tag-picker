import {D, W, getAttribute, setElement, setPrev} from '@taufik-nurrohman/document';

class HTMLTagPickerElement extends HTMLElement {

    constructor() {
        // Always call `super()` first in constructor
        super();
        // Create a shadow root
        this.attachShadow({
            mode: 'open'
        });
    }

    connectedCallback() {
        let t = this,
            root = t.shadowRoot,
            source = setElement('input', {
                name: getAttribute(t, 'name'),
                placeholder: getAttribute(t, 'placeholder'),
                type: 'hidden',
                value: getAttribute(t, 'value')
            });
        setPrev(root.host, source);
        // Apply the tag picker widget
        const picker = new TP(source);
    }

}

// Define the new element
W.customElements.define('tag-picker', HTMLTagPickerElement);
