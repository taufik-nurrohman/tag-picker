import {D, W, getChildFirst, getElement, getNext, getParent, getPrev, getParentForm, getText, hasClass, letClass, letElement, setChildLast, setClass, setElement, setNext, setPrev, setText, toggleClass} from '@taufik-nurrohman/document';
import {delay} from '@taufik-nurrohman/tick';
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

// <https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#focusvisible>
const focusOptions = {
    focusVisible: true
};

const name = 'TagPicker';

function defineProperty(of, key, state) {
    Object.defineProperty(of, key, state);
}

function blurFrom(node) {
    const selection = D.getSelection();
    if (node) {} else {
        selection.removeAllRanges();
    }
}

function focusTo(node) {
    node.focus();
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

function isDisabled(self) {
    return self.disabled;
}

function isReadOnly(self) {
    return self.readOnly;
}

function selectTo(node) {
    const selection = D.getSelection();
    blurFrom();
    const range = D.createRange();
    range.selectNodeContents(node);
    selection.addRange(range);
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

    self['_' + name] = hook($, TagPicker.prototype);

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

defineProperty(TagPicker, 'name', {
    value: name
});

const $$ = TagPicker.prototype;

defineProperty($$, 'text', {
    get: function () {
        return getText(this._mask.input);
    },
    set: function (text) {
        setText(this._mask.input, text);
    }
});

defineProperty($$, 'value', {
    get: function () {
        let value = this.self.value;
        return "" === value ? null : value;
    },
    set: function (value) {
        let $ = this,
            {state} = $;
        value.split(state.join).forEach(tag => $.set(tag));
    }
});

$$._filter = function (v) {
    let $ = this,
        {state} = $;
    v = (v || "").split(state.join).join("").trim();
    return toCaseKebab(v).replace(/^-+|-+$/g, "");
};

let _keyIsCtrl = false,
    _keyIsShift = false,
    _firstTagSelected = null;

function onBlurTag() {
    let $ = this,
        picker = $['_' + name],
        {_mask, mask, state} = picker,
        c = state['class'];
    letClass(mask, c += '--focus');
    letClass(mask, c += '-tag');
    blurFrom();
}

function onBlurTextInput() {
    let $ = this,
        picker = $['_' + name],
        {_mask, mask, state} = picker,
        {text} = _mask,
        c = state['class'];
    letClass(text, c + '__text--focus');
    letClass(mask, c += '--focus');
    letClass(mask, c += '-text');
    blurFrom();
}

function onContextMenuTag(e) {
    let $ = this,
        picker = $['_' + name],
        {_tags, state} = picker,
        c = state['class'] + '__tag--focus';
    setClass($, c);
    focusTo($), selectTo(getChildFirst($));
}

function onCopyTag(e) {
    let $ = this,
        picker = $['_' + name],
        {_tags, state} = picker,
        c = state['class'] + '__tag--focus';
    let selection = [];
    for (let k in _tags) {
        if (hasClass(_tags[k], c)) {
            selection.push(k);
        }
    }
    e.clipboardData.setData('text/plain', selection.join(state.join));
    offEventDefault(e);
    console.log(selection);
}

function onCutTag(e) {
    let $ = this,
        picker = $['_' + name],
        {_mask, _tags, state} = picker,
        {input} = _mask,
        c = state['class'] + '__tag--focus';
    let selection = [];
    for (let k in _tags) {
        if (hasClass(_tags[k], c)) {
            selection.push(k);
            letElement(_tags[k]);
            delete _tags[k];
        }
    }
    e.clipboardData.setData('text/plain', selection.join(state.join));
    focusTo(input), selectTo(input);
    offEventDefault(e);
    console.log(selection);
}

function onFocusTextInput() {
    _firstTagSelected = false;
    let $ = this,
        picker = $['_' + name],
        {_mask, _tags, mask, self, state} = picker,
        {hint, input, text} = _mask,
        c = state['class'];
    for (let k in _tags) {
        letClass(_tags[k], c + '__tag--focus');
    }
    setClass(text, c + '__text--focus');
    setClass(mask, c += '--focus');
    setClass(mask, c += '-text');
    focusTo(input), selectTo(input);
    delay(() => setText(hint, getText(input, false) ? "" : self.placeholder), 1)();
}

function onFocusSelf() {
    let $ = this,
        picker = $['_' + name];
    picker.focus();
}

function onFocusTag() {
    let $ = this,
        picker = $['_' + name],
        {_mask, mask, state} = picker,
        c = state['class'];
    setClass(mask, c += '--focus');
    setClass(mask, c += '-tag');
}

function onKeyDownTag(e) {
    let $ = this, exit,
        key = e.key,
        keyIsCtrl = _keyIsCtrl = e.ctrlKey,
        keyIsShift = _keyIsShift = e.shiftKey,
        picker = $['_' + name],
        {_mask, _tags, mask, state} = picker,
        {text} = _mask,
        prevTag = getPrev($),
        nextTag = getNext($),
        firstTag, lastTag,
        c = state['class'] + '__tag--focus';
    if (keyIsShift) {
        setClass(_firstTagSelected = $, c);
    } else if (keyIsCtrl) {
        if (KEY_A === key) {
            for (let k in _tags) {
                focusTo(_tags[k]), selectTo(getChildFirst(_tags[k]));
                setClass(_tags[k], c);
            }
            exit = true;
        }
    } else {
        letClass($, c);
        if (KEY_BEGIN === key) {
            firstTag = toObjectValues(_tags).shift();
            firstTag && firstTag.focus(focusOptions);
            exit = true;
        } else if (KEY_END === key) {
            lastTag = toObjectValues(_tags).pop();
            lastTag && lastTag.focus(focusOptions);
            exit = true;
        } else if (KEY_ENTER === key || ' ' === key) {
            toggleClass($, c);
            if (hasClass($, c)) {
                _firstTagSelected = $;
            }
            exit = true;
        } else if (KEY_ARROW_LEFT === key) {
            prevTag && prevTag.focus(focusOptions);
            exit = true;
        } else if (KEY_ARROW_RIGHT === key) {
            nextTag && text !== nextTag ? nextTag.focus(focusOptions) : picker.focus();
            exit = true;
        } else if (KEY_DELETE_LEFT === key) {
            picker.let($.title);
            prevTag ? prevTag.focus(focusOptions) : picker.focus();
            exit = true;
        } else if (KEY_DELETE_RIGHT === key) {
            picker.let($.title);
            nextTag && text !== nextTag ? nextTag.focus(focusOptions) : picker.focus();
            exit = true;
        }
    }
    exit && offEventDefault(e);
}

function onKeyUpTag() {
    _keyIsCtrl = _keyIsShift = false;
}

function onKeyDownTextInput(e) {
    let $ = this, exit, v,
        key = e.key,
        keyCode = e.keyCode,
        keyIsCtrl = _keyIsCtrl = e.ctrlKey,
        keyIsShift = _keyIsShift = e.shiftKey,
        picker = $['_' + name],
        {_mask, _tags, mask, self, state} = picker,
        {hint} = _mask,
        c = state['class'] + '__tag--focus',
        firstTag, lastTag;
        escape = state.escape;
    if (escape.includes(key) || escape.includes(keyCode)) {
        return picker.set(getText($)), setText($, ""), setText(hint, self.placeholder), picker.focus(), offEventDefault(e);
    }
    delay(() => setText(hint, getText($, false) ? "" : self.placeholder), 1)();
    let caretIsToTheFirst = "" === getCharBeforeCaret($),
        textIsVoid = null === getText($, false);
    if (keyIsShift) {
        if (textIsVoid || caretIsToTheFirst) {
            if (KEY_ARROW_LEFT === key) {
                lastTag = toObjectValues(_tags).pop();
                if (lastTag) {
                    lastTag && lastTag.focus(focusOptions);
                    setClass(lastTag, c);
                    setClass(mask, state['class'] + '--select');
                    exit = true;
                }
            }
        }
    } else if (keyIsCtrl) {
        if (KEY_A === key && null === getText($, false) && null !== (v = picker.value)) {
            for (let k in _tags) {
                focusTo(_tags[k]), selectTo(getChildFirst(_tags[k]));
                setClass(_tags[k], c);
            }
            exit = true;
        } else if (KEY_BEGIN === key) {
            firstTag = toObjectValues(_tags).shift();
            firstTag && firstTag.focus(focusOptions);
            exit = true;
        } else if (KEY_END === key) {
            lastTag = toObjectValues(_tags).pop();
            lastTag && lastTag.focus(focusOptions);
            exit = true;
        } else if (KEY_ARROW_LEFT === key) {
            lastTag = toObjectValues(_tags).pop();
            lastTag && lastTag.focus(focusOptions);
            exit = true;
        } else if (KEY_DELETE_LEFT === key) {
            lastTag = toObjectValues(_tags).pop();
            lastTag && picker.let(lastTag.title);
            picker.focus();
            exit = true;
        }
    } else {
        if (KEY_ENTER === key) {
            let form = getParentForm(self);
            if (form && isFunction(form.requestSubmit)) {
                // <https://developer.mozilla.org/en-US/docs/Glossary/Submit_button>
                let submit = getElement('button:not([type]),button[type=submit],input[type=image],input[type=submit]', form);
                submit ? form.requestSubmit(submit) : form.requestSubmit();
            }
            exit = true;
        } else if (textIsVoid) {
            if (KEY_BEGIN === key) {
                firstTag = toObjectValues(_tags).shift();
                firstTag && firstTag.focus(focusOptions);
                exit = true;
            } else if (KEY_END === key) {
                lastTag = toObjectValues(_tags).pop();
                lastTag && lastTag.focus(focusOptions);
                exit = true;
            } else if (KEY_ARROW_LEFT === key) {
                lastTag = toObjectValues(_tags).pop();
                lastTag && lastTag.focus(focusOptions);
                exit = true;
            } else if (KEY_DELETE_LEFT === key) {
                lastTag = toObjectValues(_tags).pop();
                lastTag && picker.let(lastTag.title);
                picker.focus();
                exit = true;
            }
        } else if (caretIsToTheFirst) {
            if (KEY_ARROW_LEFT === key) {
                lastTag = toObjectValues(_tags).pop();
                lastTag && lastTag.focus(focusOptions);
                exit = true;
            }
        }
    }
    exit && offEventDefault(e);
}

function onKeyUpTextInput() {
    _keyIsCtrl = _keyIsShift = false;
}

function onPasteTextInput() {
    let $ = this,
        picker = $['_' + name],
        {_mask, state} = picker,
        {hint} = _mask;
    delay(() => {
        let value = getText($);
        if (null !== value) {
            value.split(state.join).forEach(tag => picker.set(tag));
        }
        setText($, ""), setText(hint, picker.self.placeholder);
    }, 1)();
}

function onPointerDownTag(e) {
    let $ = this,
        picker = $['_' + name],
        {_tags, state} = picker,
        c = state['class'] + '__tag--focus';
    toggleClass($, c);
    if (_keyIsCtrl) {

    } else {
        blurFrom();
        let asContextMenu = 2 === e.button, // Probably a “right-click”
            selection = 0;
        for (let k in _tags) {
            if (hasClass(_tags[k], c)) {
                ++selection;
            }
            if ($ !== _tags[k] && !asContextMenu) {
                letClass(_tags[k], c);
            }
        }
        if (selection > 0) {
            setClass($, c);
        }
    }
    if (hasClass($, c)) {
        focusTo($), selectTo(getChildFirst($));
    } else {
        blurFrom();
    }
    offEventDefault(e);
    offEventPropagation(e);
}

function onPointerDownTagX(e) {
    let $ = this,
        tag = getParent($),
        picker = tag['_' + name],
        {_mask} = picker,
        {input} = _mask;
    offEvent('click', $, onPointerDownTagX);
    picker.let(tag.title);
    picker.focus(), offEventDefault(e);
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
        n = '_' + name;
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
    onEvent('blur', textInput, onBlurTextInput);
    onEvent('focus', self, onFocusSelf);
    onEvent('focus', textInput, onFocusTextInput);
    onEvent('keydown', textInput, onKeyDownTextInput);
    onEvent('keyup', textInput, onKeyUpTextInput);
    onEvent('paste', textInput, onPasteTextInput);
    self.tabIndex = -1;
    mask[n] = $;
    textInput[n] = $;
    let _mask = {};
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
        {input} = _mask;
    $._active = false;
    offEvent('blur', input, onBlurTextInput);
    offEvent('focus', input, onFocusTextInput);
    offEvent('focus', self, onFocusSelf);
    offEvent('keydown', input, onKeyDownTextInput);
    offEvent('keyup', input, onKeyUpTextInput);
    offEvent('paste', input, onPasteTextInput);
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
    return (input && (focusTo(input), selectTo(input))), $;
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
    offEvent('contextmenu', tag, onContextMenuTag);
    offEvent('copy', tag, onCopyTag);
    offEvent('cut', tag, onCutTag);
    offEvent('focus', tag, onFocusTag);
    offEvent('keydown', tag, onKeyDownTag);
    offEvent('keyup', tag, onKeyUpTag);
    offEvent('mousedown', tag, onPointerDownTag);
    offEvent('mousedown', tagX, onPointerDownTagX);
    offEvent('touchstart', tag, onPointerDownTag);
    offEvent('touchstart', tagX, onPointerDownTagX);
    letElement(tag);
    delete $._tags[v];
    return (self.value = toObjectKeys($._tags).join(state.join)), $;
};

$$.set = function (v) {
    let $ = this,
        {_active, _filter, _mask, _tags, self, state} = $,
        {text} = _mask,
        {pattern} = state,
        c = state['class'];
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
        'class': c += '__tag',
        'tabindex': -1,
        'title': v
    });
    const tagText = setElement('span', v);
    const tagX = setElement('span', {
        'class': c += '-x',
        'tabindex': -1
    });
    onEvent('blur', tag, onBlurTag);
    onEvent('contextmenu', tag, onContextMenuTag);
    onEvent('copy', tag, onCopyTag);
    onEvent('cut', tag, onCutTag);
    onEvent('focus', tag, onFocusTag);
    onEvent('keydown', tag, onKeyDownTag);
    onEvent('keyup', tag, onKeyUpTag);
    onEvent('mousedown', tag, onPointerDownTag);
    onEvent('mousedown', tagX, onPointerDownTagX);
    onEvent('touchstart', tag, onPointerDownTag);
    onEvent('touchstart', tagX, onPointerDownTagX);
    tag['_' + name] = $;
    setChildLast(tag, tagText);
    setChildLast(tag, tagX);
    setPrev(text, tag);
    $._tags[v] = tag;
    return (self.value = toObjectKeys($._tags).join(state.join)), $;
};

export default TagPicker;