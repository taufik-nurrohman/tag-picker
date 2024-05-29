import {W, getChildFirst, getNext, getParent, getPrev, getParentForm, getText, letClass, letElement, setChildLast, setClass, setElement, setNext, setPrev, setText, toggleClass} from '@taufik-nurrohman/document';
import {fromStates} from '@taufik-nurrohman/from';
import {hook} from '@taufik-nurrohman/hook';
import {isArray, isFunction, isInstance, isObject, isSet, isString} from '@taufik-nurrohman/is';
import {offEvent, offEventDefault, offEventPropagation, onEvent} from '@taufik-nurrohman/event';
import {toCaseKebab, toCount, toObjectKeys, toObjectValues} from '@taufik-nurrohman/to';
import {toPattern} from '@taufik-nurrohman/pattern';

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

TagPicker.version = '%(version)';

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
        {_shadow, state} = picker,
        c = state['class'],
        shadow = _shadow.self;
    letClass(shadow, c += '--focus');
    letClass(shadow, c += '-tag');
}

function onEventBlurTextInput() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_shadow, state} = picker,
        {text} = _shadow,
        c = state['class'],
        shadow = _shadow.self;
    letClass(text, c + '__text--focus');
    letClass(shadow, c += '--focus');
    letClass(shadow, c += '-text');
}

function onEventClickShadow(e) {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_shadow} = picker,
        {input} = _shadow;
    input.focus(), offEventDefault(e);
}

function onEventClickTag(e) {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_tags, state} = picker,
        c = state['class'] + '__tag--selected';
    for (let k in _tags) {
        if ($ === _tags[k]) {
            continue;
        }
        letClass(_tags[k], c);
    }
    toggleClass($, c);
    offEventPropagation(e);
}

function onEventClickTagX(e) {
    let $ = this,
        tag = getParent($),
        picker = tag['_' + TagPicker.name],
        {_shadow} = picker,
        {input} = _shadow;
    offEvent('click', $, onEventClickTagX);
    picker.let(tag.title);
    input.focus(), offEventDefault(e);
}

function onEventCopyTextCopy() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_shadow} = picker,
        {input} = _shadow;
    W.setTimeout(() => (letElement($), input.focus()), 1);
}

function onEventCutTextCopy() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_shadow, state} = picker,
        {input} = _shadow;
    $.value.split(state.join).forEach(tag => picker.let(tag));
    W.setTimeout(() => (letElement($), input.focus()), 1);
}

function onEventFocusTextInput() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_shadow, _tags, state} = picker,
        {copy, text} = _shadow,
        c = state['class'],
        shadow = _shadow.self;
    for (let k in _tags) {
        letClass(_tags[k], c + '__tag--selected');
    }
    letClass(shadow, c + '--focus-tags');
    letElement(copy);
    setClass(text, c + '__text--focus');
    setClass(shadow, c += '--focus');
    setClass(shadow, c += '-text');
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
        {_shadow, state} = picker,
        c = state['class'],
        shadow = _shadow.self;
    setClass(shadow, c += '--focus');
    setClass(shadow, c += '-tag');
}

function onEventKeyDownTag(e) {
    let $ = this, exit,
        key = e.key,
        keyIsCtrl = e.ctrlKey,
        keyIsShift = e.shiftKey,
        picker = $['_' + TagPicker.name],
        {_shadow, _tags, state} = picker,
        {copy, self, text} = _shadow,
        prevTag = getPrev($),
        nextTag = getNext($),
        c = state['class'];
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
        for (let k in _tags) {
            setClass(_tags[k], c + '__tag--selected');
        }
        copy.value = picker.value;
        setChildLast(self, copy);
        copy.focus(), copy.select();
        setClass(self, c += '--focus');
        letClass(self, c + '-tag');
        setClass(self, c += '-tags');
        exit = true;
    }
    exit && offEventDefault(e);
}

function onEventKeyDownTextCopy(e) {
    let $ = this,
        key = e.key,
        keyIsCtrl = e.ctrlKey,
        keyIsShift = e.shiftKey,
        picker = $['_' + TagPicker.name],
        {_shadow, state} = picker,
        {input} = _shadow;
    if (KEY_DELETE_LEFT === key || KEY_DELETE_RIGHT === key) {
        $.value.split(state.join).forEach(tag => picker.let(tag));
        input.focus();
    } else if (!keyIsCtrl && !keyIsShift) {
        input.focus();
    }
}

function onEventKeyDownTextInput(e) {
    let $ = this, exit, v,
        key = e.key,
        keyCode = e.keyCode,
        keyIsCtrl = e.ctrlKey,
        keyIsShift = e.shiftKey,
        picker = $['_' + TagPicker.name],
        {_shadow, _tags, state} = picker,
        {copy, hint, self} = _shadow,
        c = state['class'],
        lastTag;
        escape = state.escape;
    if (escape.includes(key) || escape.includes(keyCode)) {
        return picker.set(theText($)), setText($, ""), setText(hint, picker.self.placeholder), picker.focus(), offEventDefault(e);
    }
    W.setTimeout(() => {
        setText(hint, getText($) ? "" : picker.self.placeholder);
    }, 1);
    if (KEY_ARROW_LEFT === key && "" === getCharBeforeCaret($)) {
        lastTag = toObjectValues(_tags).pop();
        lastTag && lastTag.focus();
        exit = true;
    } else if (KEY_DELETE_LEFT === key && null === getText($)) {
        lastTag = toObjectValues(_tags).pop();
        lastTag && picker.let(lastTag.title);
        picker.focus();
        exit = true;
    } else if (keyIsCtrl && !keyIsShift && KEY_A === key && null === getText($) && null !== (v = picker.value)) {
        for (let k in _tags) {
            setClass(_tags[k], c + '__tag--selected');
        }
        copy.value = v;
        setChildLast(self, copy);
        copy.focus(), copy.select();
        setClass(self, c += '--focus');
        letClass(self, c + '-tag');
        setClass(self, c += '-tags');
        exit = true;
    }
    exit && offEventDefault(e);
}

function onEventPasteTextInput() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_shadow, state} = picker,
        {hint} = _shadow;
    W.setTimeout(() => {
        let value = getText($);
        if (null !== value) {
            value.split(state.join).forEach(tag => picker.set(tag));
        }
        setText($, ""), setText(hint, picker.self.placeholder);
    }, 1);
}

$$.attach = function (self, state) {
    let $ = this;
    self = self || $.self;
    state = state || $.state;
    $._active = true;
    $._tags = {};
    $._value = theValue(self);
    $.self = self;
    $.state = state;
    let c = state['class'],
        n = '_' + TagPicker.name;
    const form = getParentForm(self);
    const shadow = setElement('div', {
        'class': c,
        'tabindex': isDisabled(self) ? false : -1
    });
    const shadowTags = setElement('span', {
        'class': c + '__tags'
    });
    const text = setElement('span', {
        'class': c + '__text'
    });
    const textCopy = setElement('input', {
        'class': c + '__copy',
        'tabindex': -1,
        'type': 'text'
    });
    const textInput = setElement('span', {
        'contenteditable': isDisabled(self) ? false : 'true',
        'spellcheck': 'false',
        'style': 'white-space:pre;'
    });
    const textInputHint = setElement('span', self.placeholder + "");
    setChildLast(shadow, shadowTags);
    setChildLast(shadowTags, text);
    setChildLast(text, textInput);
    setChildLast(text, textInputHint);
    setClass(self, c + '__self');
    setNext(self, shadow);
    onEvent('blur', shadow, onEventBlurShadow);
    onEvent('blur', textInput, onEventBlurTextInput);
    onEvent('copy', textCopy, onEventCopyTextCopy);
    onEvent('cut', textCopy, onEventCutTextCopy);
    onEvent('focus', self, onEventFocusSelf);
    onEvent('focus', shadow, onEventFocusShadow);
    onEvent('focus', textInput, onEventFocusTextInput);
    onEvent('keydown', textCopy, onEventKeyDownTextCopy);
    onEvent('keydown', textInput, onEventKeyDownTextInput);
    onEvent('mousedown', shadow, onEventClickShadow);
    onEvent('paste', textInput, onEventPasteTextInput);
    onEvent('touchstart', shadow, onEventClickShadow);
    self.tabIndex = -1;
    shadow[n] = $;
    textCopy[n] = $;
    textInput[n] = $;
    let _shadow = {};
    _shadow.copy = textCopy;
    _shadow.hint = textInputHint;
    _shadow.input = textInput;
    _shadow.of = self;
    _shadow.self = shadow;
    _shadow.tags = shadowTags;
    _shadow.text = text;
    $._shadow = _shadow;
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
        {copy, input} = _shadow,
        shadow = _shadow.self;
    $._active = false;
    offEvent('blur', input, onEventBlurTextInput);
    offEvent('blur', shadow, onEventBlurShadow);
    offEvent('copy', copy, onEventCopyTextCopy);
    offEvent('cut', copy, onEventCutTextCopy);
    offEvent('focus', input, onEventFocusTextInput);
    offEvent('focus', self, onEventFocusSelf);
    offEvent('focus', shadow, onEventFocusShadow);
    offEvent('keydown', copy, onEventKeyDownTextCopy);
    offEvent('keydown', input, onEventKeyDownTextInput);
    offEvent('mousedown', shadow, onEventClickShadow);
    offEvent('paste', input, onEventPasteTextInput);
    offEvent('touchstart', shadow, onEventClickShadow);
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
    self.tabIndex = null;
    letClass(self, state['class'] + '__self');
    letElement(shadow);
    $._shadow = {
        of: self
    };
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
        {_active, _shadow, _tags, state} = $;
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
    offEvent('mousedown', tag, onEventClickTag);
    offEvent('touchstart', tag, onEventClickTag);
    letElement(tag);
    delete $._tags[v];
    return ($.self.value = toObjectKeys($._tags).join(state.join)), $;
};

$$.set = function (v) {
    let $ = this,
        {_active, _filter, _shadow, _tags, state} = $,
        {pattern} = state;
    if (!_active) {
        return $;
    }
    if (isFunction(_filter)) {
        v = _filter.call($, v);
    }
    if (isString(pattern) && toPattern(pattern) && !toPattern(pattern).test(v)) {
        return false;
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
    onEvent('mousedown', tag, onEventClickTag);
    onEvent('touchstart', tag, onEventClickTag);
    tag['_' + TagPicker.name] = $;
    setChildLast(tag, tagX);
    setPrev(_shadow.text, tag);
    $._tags[v] = tag;
    return ($.self.value = toObjectKeys($._tags).join(state.join)), $;
};

Object.defineProperty($$, 'tags', {
    get: function () {
        return toObjectKeys(this._tags);
    },
    set: function (tags) {
        let $ = this;
        $._tags = {};
        $.self.value = "";
        tags.forEach(tag => $.set(tag));
    }
});

Object.defineProperty($$, 'value', {
    get: function () {
        let value = this.self.value;
        return "" === value ? null : value;
    },
    set: function (value) {
        this.self.value = value;
    }
});

export default TagPicker;