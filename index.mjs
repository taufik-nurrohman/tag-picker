import {fromStates} from '@taufik-nurrohman/from';
import {W, getChildFirst, getNext, getParent, getPrev, getParentForm, getText, letClass, letElement, setChildLast, setClass, setElement, setNext, setPrev, setText} from '@taufik-nurrohman/document';
import {hook} from '@taufik-nurrohman/hook';
import {isArray, isFunction, isInstance, isObject, isSet, isString} from '@taufik-nurrohman/is';
import {offEvent, offEventDefault, onEvent} from '@taufik-nurrohman/event';
import {toCaseKebab, toCount, toObjectKeys, toObjectValues} from '@taufik-nurrohman/to';

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

function theText(self) {
    return getText(self);
}

function theValue(self) {
    return self.value.replace(/\r/g, "");
}

function getCharBeforeCaret(container) {
    let range, selection = W.getSelection();
    if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0).cloneRange();
        range.collapse(true);
        range.setStart(container, 0);
        return (range + "").slice(-1);
    }
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

$$._filter = function (v) {
    let $ = this,
        {state} = $;
    v = (v || "").split(state.join).join("").trim();
    return toCaseKebab(v).replace(/^-+|-+$/g, "");
};

function onEventBlurShadow() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {state} = picker;
    letClass($, state['class'] + '--focus');
}

function onEventBlurTag() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_shadow, state} = picker;
    letClass(_shadow.self, state['class'] + '--focus');
    letClass(_shadow.self, state['class'] + '--focus-tag');
}

function onEventBlurTextInput() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_shadow, state} = picker;
    letClass(_shadow.self, state['class'] + '--focus');
    letClass(_shadow.self, state['class'] + '--focus-text');
}

function onEventClickShadow() {
    let $ = this,
        picker = $['_' + TagPicker.name];
}

function onEventClickTagX(e) {
    let $ = this,
        tag = getParent($),
        picker = tag['_' + TagPicker.name];
    offEvent('click', $, onEventClickTagX);
    picker.let(tag.title);
    offEventDefault(e);
}

function onEventFocusTextInput() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_shadow, state} = picker;
    setClass(_shadow.self, state['class'] + '--focus');
    setClass(_shadow.self, state['class'] + '--focus-text');
}

function onEventFocusSelf() {
    let $ = this,
        picker = $['_' + TagPicker.name];
    picker.focus();
}

function onEventFocusShadow() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {state} = picker;
    setClass($, state['class'] + '--focus');
}

function onEventFocusTag() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_shadow, state} = picker;
    setClass(_shadow.self, state['class'] + '--focus');
    setClass(_shadow.self, state['class'] + '--focus-tag');
}

function onEventKeyDownTag(e) {
    let $ = this, exit,
        key = e.key,
        keyIsCtrl = e.ctrlKey,
        keyIsShift = e.shiftKey,
        picker = $['_' + TagPicker.name],
        prevTag = getPrev($),
        nextTag = getNext($),
        {text} = picker._shadow;
    if (KEY_ARROW_LEFT === key) {
        prevTag && prevTag.focus();
        exit = true;
    } else if (KEY_ARROW_RIGHT === key) {
        nextTag && text !== nextTag ? nextTag.focus() : picker.focus();
        exit = true;
    } else if (KEY_DELETE_LEFT === key) {
        picker.let($.title);
        prevTag ? prevTag.focus() : picker.focus();
        exit = true;
    } else if (KEY_DELETE_RIGHT === key) {
        picker.let($.title);
        nextTag && text !== nextTag ? nextTag.focus() : picker.focus();
        exit = true;
    } else if (keyIsCtrl && !keyIsShift && KEY_A === key) {
        console.log('select all tags');
        exit = true;
    }
    exit && offEventDefault(e);
}

function onEventKeyDownTextInput(e) {
    let $ = this,
        key = e.key,
        keyCode = e.keyCode,
        keyIsCtrl = e.ctrlKey,
        keyIsShift = e.shiftKey,
        picker = $['_' + TagPicker.name],
        {_tags, state} = picker, lastTag;
        escape = state.escape;
    if (escape.includes(key) || escape.includes(keyCode)) {
        return picker.set(theText($)), picker.focus(), offEventDefault(e);
    }
    if (KEY_ARROW_LEFT === key && "" === getCharBeforeCaret($)) {
        lastTag = toObjectValues(_tags).pop();
        lastTag && lastTag.focus();
        offEventDefault(e);
    } else if (KEY_DELETE_LEFT === key && null === getText($)) {
        lastTag = toObjectValues(_tags).pop();
        lastTag && picker.let(lastTag.title);
        picker.focus(), offEventDefault(e);
    } else if (keyIsCtrl && !keyIsShift && KEY_A === key) {
        console.log('select all tags');
    }
}

$$.attach = function (self, state) {
    let $ = this;
    self = self || $.self;
    state = state || $.state;
    $._active = true;
    $._shadow = {};
    $._tags = {};
    $._value = theValue(self);
    $.self = $._shadow.of = self;
    $.state = state;
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
    onEvent('blur', shadow, onEventBlurShadow);
    onEvent('blur', textInput, onEventBlurTextInput);
    onEvent('click', shadow, onEventClickShadow);
    onEvent('focus', self, onEventFocusSelf);
    onEvent('focus', shadow, onEventFocusShadow);
    onEvent('focus', textInput, onEventFocusTextInput);
    onEvent('keydown', textInput, onEventKeyDownTextInput);
    shadow['_' + TagPicker.name] = $;
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
        {_shadow, self, state} = $,
        {input} = _shadow,
        shadow = _shadow.self;
    $._active = false;
    offEvent('blur', input, onEventBlurTextInput);
    offEvent('blur', shadow, onEventBlurShadow);
    offEvent('click', shadow, onEventClickShadow);
    offEvent('focus', input, onEventFocusTextInput);
    offEvent('focus', self, onEventFocusSelf);
    offEvent('focus', shadow, onEventFocusShadow);
    offEvent('keydown', input, onEventKeyDownTextInput);
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
    $._shadow = {
        of: self
    };
    letClass(self, state['class'] + '__self');
    letElement(shadow);
    return $;
};

$$.focus = function () {
    let $ = this,
        {_shadow} = $;
    _shadow.input && _shadow.input.focus();
    return $;
};

$$.get = function (v) {
    let $ = this,
        {_active, _shadow, _tags} = $;
    if (!_active) {
        return false;
    }
    if (!_tags[v]) {
        return null;
    }
    return v;
};

$$.let = function (v) {
    let $ = this,
        {_active, _shadow, _tags} = $;
    if (!_active) {
        return $;
    }
    if (!_tags[v]) {
        return false;
    }
    let tag = _tags[v],
        tagX = getChildFirst(tag);
    offEvent('blur', tag, onEventBlurTag);
    offEvent('click', tagX, onEventClickTagX);
    offEvent('focus', tag, onEventFocusTag);
    offEvent('keydown', tag, onEventKeyDownTag);
    letElement(tag);
    delete _tags[v];
    return $;
};

$$.set = function (v) {
    let $ = this,
        {_active, _filter, _shadow, _tags} = $;
    if (!_active) {
        return $;
    }
    if (isFunction(_filter)) {
        v = _filter.call($, v);
    }
    if ("" === v || _tags[v]) {
        return false;
    }
    const tag = setElement('span', {
        'class': $.state['class'] + '__tag',
        'tabindex': -1,
        'title': v
    });
    const tagX = setElement('a', {
        'class': $.state['class'] + '__tag-x',
        'href': "",
        'tabindex': -1,
        'target': '_top'
    });
    onEvent('blur', tag, onEventBlurTag);
    onEvent('click', tagX, onEventClickTagX);
    onEvent('focus', tag, onEventFocusTag);
    onEvent('keydown', tag, onEventKeyDownTag);
    tag['_' + TagPicker.name] = $;
    setChildLast(tag, tagX);
    setPrev(_shadow.text, tag);
    setText(_shadow.input, "");
    $._tags[v] = tag;
    return $;
};

Object.defineProperty($$, 'tags', {
    get: function () {
        return toObjectKeys(this._tags);
    },
    set: function (tags) {
        tags.forEach(tag => {
            this.set(tag);
        });
    }
});

Object.defineProperty($$, 'value', {
    get: function () {
        return this.self.value;
    },
    set: function (value) {
        this.self.value = value;
    }
});

export default TagPicker;