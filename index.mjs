import {fromStates} from '@taufik-nurrohman/from';
import {getParent, getParentForm, getText, letElement, setChildLast, setClass, setElement, setNext, setPrev, setText} from '@taufik-nurrohman/document';
import {hook} from '@taufik-nurrohman/hook';
import {isArray, isFunction, isInstance, isObject, isSet, isString} from '@taufik-nurrohman/is';
import {offEvent, offEventDefault, onEvent} from '@taufik-nurrohman/event';
import {toCaseLower, toCount} from '@taufik-nurrohman/to';

const KEY_A = 'a';
const KEY_ARROW_LEFT = 'ArrowLeft';
const KEY_ARROW_RIGHT = 'ArrowRight';
const KEY_BEGIN = 'Home';
const KEY_DELETE_LEFT = 'Backspace';
const KEY_DELETE_RIGHT = 'Delete';
const KEY_END = 'End';
const KEY_ENTER = 'Enter';
const KEY_TAB = 'Tab';

function isDisabled(self) {
    return self.disabled;
}

function isReadOnly(self) {
    return self.readOnly;
}

function theText(self, join) {
    return (getText(self) || "").split(join).join("");
}

function theValue(self) {
    return self.value.replace(/\r/g, "");
}

function TagPicker(self, state) {

    const $ = this;

    if (!self) {
        return $;
    }

    // Return new instance if `TagPicker` was called without the `new` operator
    if (!isInstance($, TagPicker)) {
        return new TagPicker(self, state);
    }

    self['_' + TagPicker.name] = hook($, TagPicker.prototype);

    return $.attach(self, fromStates({}, TagPicker.state, isString(state) ? {
        join: state
    } : (state || {})));

}

TagPicker.state = {
    'class': 'tag-picker',
    'escape': [','],
    'join': ', ',
    'max': 9999,
    'min': 0,
    'pattern': null,
    'with': []
};

TagPicker.version = '4.0.0';

Object.defineProperty(TagPicker, 'name', {
    value: 'TagPicker'
});

const $$ = TagPicker.prototype;

$$._filter = function (tag) {
    return toCaseLower(tag || "").trim();
};

function onEventClickTagX(e) {
    let $ = this,
        picker = $['_' + TagPicker.name];
    offEvent('click', $, onEventClickTagX);
    letElement(getParent($));
    offEventDefault(e);
}

function onEventFocusSelf() {
    let $ = this,
        picker = $['_' + TagPicker.name];
    picker._shadow.input && picker._shadow.input.focus();
}

function onEventKeyDownTextInput(e) {
    let $ = this,
        key = e.key,
        keyCode = e.keyCode,
        picker = $['_' + TagPicker.name],
        escape = picker.state.escape;
    if (escape.includes(key) || escape.includes(keyCode)) {
        console.log(key);
        return picker.set(theText($, picker.state.join)), offEventDefault(e);
    }
    console.log(theText($));
}

$$.attach = function (self, state) {
    let $ = this, value;
    self = self || $.self;
    state = state || $.state;
    $._active = true;
    $._shadow = {};
    $._value = value = theValue(self);
    $.self = $._shadow.of = self;
    $.state = state;
    $.tags = value.split(state.join);
    let classNameB = state['class'],
        classNameE = classNameB + '__',
        classNameM = classNameB + '--';
    const form = getParentForm(self);
    const shadow = setElement('div', {
        'class': classNameB,
        'tabindex': isDisabled(self) ? false : -1
    });
    const shadowTags = setElement('span', {
        'class': classNameE + 'tags'
    });
    const text = setElement('span', {
        'class': classNameE + 'tag ' + classNameE + 'text'
    });
    const textCopy = setElement('input', {
        'class': classNameE + 'copy',
        'tabindex': -1,
        'type': 'text'
    });
    const textInput = setElement('span', {
        'contenteditable': isDisabled(self) ? false : 'true',
        'spellcheck': 'false',
        'style': 'white-space:pre;'
    });
    const textInputHint = setElement('span');
    setChildLast(shadow, shadowTags);
    setChildLast(shadowTags, text);
    setChildLast(text, textInput);
    setChildLast(text, textInputHint);
    setClass(self, classNameE + 'self');
    setNext(self, shadow);
    onEvent('focus', self, onEventFocusSelf);
    onEvent('keydown', textInput, onEventKeyDownTextInput);
    textInput['_' + TagPicker.name] = $;
    $._shadow.input = textInput;
    $._shadow.self = shadow;
    $._shadow.tags = shadowTags;
    $._shadow.text = text;
    // Attach extension(s)
    if (isSet(state) && isArray(state.with)) {
        for (let i = 0, j = toCount(state.with); i < j; ++i) {
            let value = state.with[i];
            if (isString(value)) {
                value = TagPicker[value];
            }
            // `const Extension = function (self, state = {}) {}`
            if (isFunction(value)) {
                value.call($, self, state);
                continue;
            }
            // `const Extension = {attach: function (self, state = {}) {}, detach: function (self, state = {}) {}}`
            if (isObject(value) && isFunction(value.attach)) {
                value.attach.call($, self, state);
                continue;
            }
        }
    }
    return $;
};

$$.blur = function () {
    let $ = this;
};

$$.click = function () {
    let $ = this;
};

$$.detach = function () {
    let $ = this,
        {self, state} = $;
    $._active = false;
    offEvent('focus', self, onEventFocusSelf);
    offEvent('keydown', self._shadow.input, onEventKeyDownTextInput);
    // Detach extension(s)
    if (isArray(state.with)) {
        for (let i = 0, j = toCount(state.with); i < j; ++i) {
            let value = state.with[i];
            if (isString(value)) {
                value = TagPicker[value];
            }
            if (isObject(value) && isFunction(value.detach)) {
                value.detach.call($, self, state);
                continue;
            }
        }
    }
    return $;
};

$$.focus = function () {
    let $ = this;
};

$$.get = function () {
    let $ = this;
};

$$.let = function () {
    let $ = this;
};

$$.set = function (v) {
    let $ = this;
    const tag = setElement('span', {
        'class': $.state['class'] + '__tag',
        'tabindex': -1
    });
    const tagText = setElement('span', v);
    const x = setElement('a', {
        'class': $.state['class'] + '__tag-x',
        'href': "",
        'tabindex': -1,
        'target': '_top'
    });
    onEvent('click', x, onEventClickTagX);
    setChildLast(tag, tagText);
    setChildLast(tag, x);
    setPrev($._shadow.text, tag);
    setText($._shadow.input, "");
};

Object.defineProperty($$, 'value', {
    get: function () {
        return this.self.value;
    },
    set: function (value) {
        this.self.value = value;
    }
});

export default TagPicker;