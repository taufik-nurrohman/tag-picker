(function(win, doc) {

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
            let root = this.shadowRoot,
                input = doc.createElement('input'),
                inputName = this.getAttribute('name'),
                inputPlaceholder = this.getAttribute('placeholder'),
                inputValue = this.getAttribute('value');
            input.type = 'hidden';
            if (inputName) {
                input.name = inputName;
            }
            if (inputPlaceholder) {
                input.placeholder = inputPlaceholder;
            }
            if (inputValue) {
                input.value = inputValue;
            }
            root.host.parentNode.insertBefore(input, root.host);
            // Apply the tag picker widget
            const picker = new TP(input);
        }

    }

    // Define the new element
    win.customElements.define('tag-picker', HTMLTagPickerElement);

})(this, this.document);
