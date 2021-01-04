import {D, W, getAttribute, getState, hasAttribute, setElement, setPrev, setStates} from '@taufik-nurrohman/document';

class HTMLTagPickerElement extends HTMLElement {
    constructor() {
        // Always call `super()` first in constructor
        super();
        // Create a shadow root
        this.attachShadow({
            mode: 'open'
        });
        this.source = setElement('input');
    }
    connectedCallback() {
        let t = this,
            root = t.shadowRoot;
        setElement(t.source, {
            name: getAttribute(t, 'name'),
            placeholder: getAttribute(t, 'placeholder'),
            type: 'hidden',
            value: getAttribute(t, 'value')
        });
        setStates(t.source, {
            disabled: hasAttribute(t, 'disabled'),
            readOnly: hasAttribute(t, 'readonly')
        });
        setPrev(root.host, t.source);
        // Apply the tag picker widget
        t.picker = new TP(t.source, {
            max: getAttribute(t, 'max') ?? TP.state.max,
            min: getAttribute(t, 'min') ?? TP.state.min
        });
    }
    blur() {
        return this.picker.blur();
    }
    click() {
        return this.picker.click();
    }
    focus() {
        return this.picker.focus();
    }
    get disabled() {
        return this.source.disabled;
    }
    get readOnly() {
        return this.source.readOnly;
    }
    get value() {
        return this.source.value;
    }
    set disabled(value) {
        return (this.source.disabled = value), this.picker;
    }
    set readOnly(value) {
        return (this.source.readOnly = value), this.picker;
    }
    set value(value) {
        return this.picker.value(value);
    }
}

// Define the new element
W.customElements.define('tag-picker', HTMLTagPickerElement);
