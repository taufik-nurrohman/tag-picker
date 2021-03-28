/*!
 *
 * The MIT License (MIT)
 *
 * Copyright © 2021 Taufik Nurrohman
 *
 * <https://github.com/taufik-nurrohman/tag-picker>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import {
    D,
    W,
    getAttribute,
    getState,
    hasAttribute,
    setElement,
    setPrev,
    setStates
} from '@taufik-nurrohman/document';

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