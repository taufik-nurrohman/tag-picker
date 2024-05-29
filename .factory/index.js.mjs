import {W, getChildFirst, getNext, getParent, getPrev, getParentForm, getText, hasClass, letClass, letElement, setChildLast, setClass, setElement, setNext, setPrev, setText, toggleClass} from '@taufik-nurrohman/document';
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
const KEY_ESCAPE = 'Escape';
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

function onBlurMask() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {state} = picker;
    letClass($, state['class'] + '--focus');
}

function onBlurTag() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_mask, mask, state} = picker,
        c = state['class'];
    letClass(mask, c += '--focus');
    letClass(mask, c += '-tag');
}

function onBlurTextInput() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_mask, mask, state} = picker,
        {text} = _mask,
        c = state['class'];
    letClass(text, c + '__text--focus');
    letClass(mask, c += '--focus');
    letClass(mask, c += '-text');
}

function onClickMask(e) {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_mask, mask} = picker,
        {copy, input} = _mask;
    mask === getParent(copy) ? (copy.focus(), copy.select()) : input.focus();
    offEventDefault(e);
}

function onClickTag(e) {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_mask, _tags, mask, state} = picker,
        {copy} = _mask,
        c = state['class'] + '__tag--selected',
        copyWasVisible = mask === getParent(copy),
        selection = 0;
    if (!_keyIsCtrl) {
        for (let k in _tags) {
            if (hasClass(_tags[k], c)) {
                ++selection;
            }
            if ($ === _tags[k]) {
                continue;
            }
            letClass(_tags[k], c);
        }
        letElement(copy);
    }
    if (copyWasVisible && selection > 1) {
        setClass($, c);
    } else {
        toggleClass($, c);
    }
    offEventPropagation(e);
}

function onClickTagX(e) {
    let $ = this,
        tag = getParent($),
        picker = tag['_' + TagPicker.name],
        {_mask} = picker,
        {input} = _mask;
    offEvent('click', $, onClickTagX);
    picker.let(tag.title);
    input.focus(), offEventDefault(e);
}

function onCopyTextCopy() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_mask} = picker,
        {input} = _mask;
    W.setTimeout(() => (letElement($), input.focus()), 1);
}

function onCutTextCopy() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_mask, state} = picker,
        {input} = _mask;
    $.value.split(state.join).forEach(tag => picker.let(tag));
    W.setTimeout(() => (letElement($), input.focus()), 1);
}

function onFocusTextInput() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_mask, _tags, mask, state} = picker,
        {copy, text} = _mask,
        c = state['class'];
    for (let k in _tags) {
        letClass(_tags[k], c + '__tag--selected');
    }
    letClass(mask, c + '--focus-tags');
    letElement(copy);
    setClass(text, c + '__text--focus');
    setClass(mask, c += '--focus');
    setClass(mask, c += '-text');
}

function onFocusSelf() {
    let $ = this,
        picker = $['_' + TagPicker.name];
    picker.focus();
}

function onFocusMask() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {state} = picker;
    setClass($, state['class'] + '--focus');
}

function onFocusTag() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_mask, mask, state} = picker,
        c = state['class'];
    setClass(mask, c += '--focus');
    setClass(mask, c += '-tag');
}

let _keyIsCtrl = false, _keyIsShift = false;

function onKeyDownMask(e) {
    _keyIsCtrl = e.ctrlKey;
    _keyIsShift = e.shiftKey;
}

function onKeyDownTag(e) {
    let $ = this, exit,
        key = e.key,
        keyIsCtrl = e.ctrlKey,
        keyIsShift = e.shiftKey,
        picker = $['_' + TagPicker.name],
        {_mask, _tags, mask, state} = picker,
        {copy, text} = _mask,
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
        setChildLast(mask, copy);
        copy.focus(), copy.select();
        setClass(mask, c += '--focus');
        letClass(mask, c + '-tag');
        setClass(mask, c += '-tags');
        exit = true;
    }
    exit && offEventDefault(e);
}

function onKeyDownTextCopy(e) {
    let $ = this,
        key = e.key,
        keyIsCtrl = e.ctrlKey,
        keyIsShift = e.shiftKey,
        picker = $['_' + TagPicker.name],
        {_mask, state} = picker,
        {input} = _mask;
    if (KEY_DELETE_LEFT === key || KEY_DELETE_RIGHT === key) {
        $.value.split(state.join).forEach(tag => picker.let(tag));
        input.focus();
    } else if (KEY_ESCAPE === key || (!keyIsCtrl && !keyIsShift)) {
        input.focus();
    }
}

function onKeyDownTextInput(e) {
    let $ = this, exit, v,
        key = e.key,
        keyCode = e.keyCode,
        keyIsCtrl = e.ctrlKey,
        keyIsShift = e.shiftKey,
        picker = $['_' + TagPicker.name],
        {_mask, _tags, mask, self, state} = picker,
        {copy, hint} = _mask,
        c = state['class'],
        lastTag;
        escape = state.escape;
    if (escape.includes(key) || escape.includes(keyCode)) {
        return picker.set(theText($)), setText($, ""), setText(hint, self.placeholder), picker.focus(), offEventDefault(e);
    }
    W.setTimeout(() => {
        setText(hint, getText($) ? "" : self.placeholder);
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
        setChildLast(mask, copy);
        copy.focus(), copy.select();
        setClass(mask, c += '--focus');
        letClass(mask, c + '-tag');
        setClass(mask, c += '-tags');
        exit = true;
    }
    exit && offEventDefault(e);
}

function onKeyUpMask() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_mask, _tags, mask, state} = picker,
        {copy} = _mask,
        c = state['class'] + '__tag--selected';
    _keyIsCtrl = _keyIsShift = false;
    let selection = [];
    for (let k in _tags) {
        if (hasClass(_tags[k], c)) {
            selection.push(k);
        }
    }
    if (toCount(selection)) {
        copy.value = selection.join(state.join);
        setChildLast(mask, copy);
        copy.focus(), copy.select();
    }
}

function onPasteTextInput() {
    let $ = this,
        picker = $['_' + TagPicker.name],
        {_mask, state} = picker,
        {hint} = _mask;
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
    const mask = setElement('div', {
        'class': c,
        'tabindex': isDisabled(self) ? false : -1
    });
    $.mask = mask;
    const maskTags = setElement('span', {
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
    setChildLast(mask, maskTags);
    setChildLast(maskTags, text);
    setChildLast(text, textInput);
    setChildLast(text, textInputHint);
    setClass(self, c + '__self');
    setNext(self, mask);
    onEvent('blur', mask, onBlurMask);
    onEvent('blur', textInput, onBlurTextInput);
    onEvent('copy', textCopy, onCopyTextCopy);
    onEvent('cut', textCopy, onCutTextCopy);
    onEvent('focus', mask, onFocusMask);
    onEvent('focus', self, onFocusSelf);
    onEvent('focus', textInput, onFocusTextInput);
    onEvent('keydown', mask, onKeyDownMask);
    onEvent('keydown', textCopy, onKeyDownTextCopy);
    onEvent('keydown', textInput, onKeyDownTextInput);
    onEvent('keyup', mask, onKeyUpMask);
    onEvent('mousedown', mask, onClickMask);
    onEvent('paste', textInput, onPasteTextInput);
    onEvent('touchstart', mask, onClickMask);
    self.tabIndex = -1;
    mask[n] = $;
    textCopy[n] = $;
    textInput[n] = $;
    let _mask = {};
    _mask.copy = textCopy;
    _mask.hint = textInputHint;
    _mask.input = textInput;
    _mask.of = self;
    _mask.self = mask;
    _mask.tags = maskTags;
    _mask.text = text;
    $._mask = _mask;
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
        {_mask, mask, self, state} = $,
        {copy, input} = _mask;
    $._active = false;
    offEvent('blur', input, onBlurTextInput);
    offEvent('blur', mask, onBlurMask);
    offEvent('copy', copy, onCopyTextCopy);
    offEvent('cut', copy, onCutTextCopy);
    offEvent('focus', input, onFocusTextInput);
    offEvent('focus', mask, onFocusMask);
    offEvent('focus', self, onFocusSelf);
    offEvent('keydown', copy, onKeyDownTextCopy);
    offEvent('keydown', input, onKeyDownTextInput);
    offEvent('keydown', mask, onKeyDownMask);
    offEvent('keydown', mask, onKeyUpMask);
    offEvent('mousedown', mask, onClickMask);
    offEvent('paste', input, onPasteTextInput);
    offEvent('touchstart', mask, onClickMask);
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
    letElement(mask);
    $._mask = {
        of: self
    };
    $.mask = null;
    return $;
};

$$.focus = function () {
    let $ = this,
        {_mask} = $,
        {input} = _mask;
    return (input && input.focus()), $;
};

$$.get = function (v) {
    let $ = this,
        {_active, _tags} = $;
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
        {_active, _tags, self, state} = $;
    if (!_active) {
        return $;
    }
    if (!_tags[v]) {
        return false;
    }
    let tag = _tags[v],
        tagX = getChildFirst(tag);
    offEvent('blur', tag, onBlurTag);
    offEvent('click', tagX, onClickTagX);
    offEvent('focus', tag, onFocusTag);
    offEvent('keydown', tag, onKeyDownTag);
    offEvent('mousedown', tag, onClickTag);
    offEvent('touchstart', tag, onClickTag);
    letElement(tag);
    delete $._tags[v];
    return (self.value = toObjectKeys($._tags).join(state.join)), $;
};

$$.set = function (v) {
    let $ = this,
        {_active, _filter, _mask, _tags, state} = $,
        {text} = _mask,
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
    onEvent('blur', tag, onBlurTag);
    onEvent('click', tagX, onClickTagX);
    onEvent('focus', tag, onFocusTag);
    onEvent('keydown', tag, onKeyDownTag);
    onEvent('mousedown', tag, onClickTag);
    onEvent('touchstart', tag, onClickTag);
    tag['_' + TagPicker.name] = $;
    setChildLast(tag, tagX);
    setPrev(text, tag);
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