import {D, W, getChildFirst, getChildren, getElement, getElements, getNext, getParent, getPrev, getParentForm, getText, hasClass, letClass, letElement, setChildLast, setClass, setElement, setNext, setPrev, setText, toggleClass} from '@taufik-nurrohman/document';
import {delay} from '@taufik-nurrohman/tick';
import {fromHTML, fromStates} from '@taufik-nurrohman/from';
import {hasValue} from '@taufik-nurrohman/has';
import {hook} from '@taufik-nurrohman/hook';
import {isArray, isDefined, isFunction, isInstance, isInteger, isObject, isSet, isString} from '@taufik-nurrohman/is';
import {offEvent, offEventDefault, offEventPropagation, onEvent} from '@taufik-nurrohman/event';
import {toCount, toObjectCount, toObjectKeys, toObjectValues} from '@taufik-nurrohman/to';
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

const name = 'TagPicker';
const references = new WeakMap;

function defineProperty(of, key, state) {
    Object.defineProperty(of, key, state);
}

function focusTo(node) {
    node.focus();
}

function getCharBeforeCaret(node) {
    let range, selection = W.getSelection();
    if (selection.rangeCount) {
        range = selection.getRangeAt(0).cloneRange();
        range.collapse(true);
        range.setStart(node, 0);
        return (range + "").slice(-1);
    }
}

function getReference(key) {
    return references.get(key);
}

function getValue(self) {
    return (self.value || "").replace(/\r/g, "");
}

function isDisabled(self) {
    return self.disabled;
}

function isReadOnly(self) {
    return self.readOnly;
}

function isRequired(self) {
    return self.required;
}

function selectNone(node) {
    const selection = D.getSelection();
    if (node) {} else {
        // selection.removeAllRanges();
        if (selection.rangeCount) {
            selection.removeRange(selection.getRangeAt(0));
        }
    }
}

function selectTo(node, mode) {
    const selection = D.getSelection();
    selectNone();
    const range = D.createRange();
    range.selectNodeContents(node);
    selection.addRange(range);
    if (1 === mode) {
        selection.collapseToEnd();
    } else if (-1 === mode) {
        selection.collapseToStart();
    }
}

function setReference(key, value) {
    return references.set(key, value);
}

function setValueAtCaret(node, value) {
    let range, selection = W.getSelection();
    if (selection.rangeCount) {
        range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(D.createTextNode(value));
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

    setReference(self, hook($, TagPicker.prototype));

    let newState = fromStates({}, TagPicker.state, isString(state) ? {
        join: state
    } : (state || {}));

    // Special case for `state.escape`: Replace instead of join
    if (isObject(state) && state.escape) {
        newState.escape = state.escape;
    }

    return $.attach(self, newState);

}

TagPicker.from = function (self, state) {
    return new TagPicker(self, state);
};

TagPicker.of = getReference;

TagPicker.state = {
    'escape': [','],
    'join': ', ',
    'max': Infinity,
    'min': 0,
    'n': 'tag-picker',
    'pattern': null,
    'with': []
};

TagPicker.version = '4.1.0';

defineProperty(TagPicker, 'name', {
    value: name
});

const $$ = TagPicker.prototype;

defineProperty($$, 'text', {
    get: function () {
        return getText(this._mask.input);
    },
    set: function (text) {
        let $ = this,
            {_mask, self} = $,
            {hint, input} = _mask;
        text = text + "";
        setText(hint, "" === text ? self.placeholder : "");
        setText(input, text);
        selectTo(input);
    }
});

defineProperty($$, 'value', {
    get: function () {
        let value = getValue(this.self);
        return "" === value ? null : value;
    },
    set: function (value) {
        let $ = this,
            {_tags, state} = $;
        if ($.value) {
            $.value.split(state.join).forEach(tag => $.let(tag, 1));
        }
        value.split(state.join).forEach(tag => $.set(tag, -1, 1));
        $.fire('change');
    }
});

$$._filter = function (v) {
    let $ = this, {state} = $;
    return (v || "").replace(/[^ -~]/g, ' ').split(state.join).join("").replace(/\s+/g, ' ').trim();
};

let _keyIsCtrl = false, _keyIsShift = false;

function onBlurTag() {
    selectNone();
    let $ = this,
        picker = getReference($),
        {_mask, _tags, mask, state} = picker,
        n = state.n;
    if (!_keyIsCtrl && !_keyIsShift) {
        for (let k in _tags) {
            letClass(_tags[k], n + '__tag--selected');
        }
    }
    letClass(mask, n += '--focus');
    letClass(mask, n += '-tag');
}

function onBlurTextInput(e) {
    selectNone();
    let $ = this,
        picker = getReference($),
        {_mask, mask, state} = picker,
        {text} = _mask,
        n = state.n;
    letClass(text, n + '__text--focus');
    letClass(mask, n += '--focus');
    letClass(mask, n += '-text');
    picker.fire('blur', [e]);
}

function onClickMask(e) {
    let $ = this,
        picker = getReference($),
        on = e.target,
        {state} = picker,
        n = state.n + '__tag';
    if (!hasClass(on, n) && !getParent(on, '.' + n)) {
        picker.focus();
    }
}

function onContextMenuTag(e) {
    let $ = this,
        picker = getReference($),
        {_tags, state} = picker,
        n = state.n + '__tag--selected';
    setClass($, n);
    focusTo($), selectTo(getChildFirst($));
}

function onCopyTag(e) {
    let $ = this,
        picker = getReference($),
        {_tags, state} = picker,
        n = state.n + '__tag--selected';
    let selection = [];
    for (let k in _tags) {
        if (hasClass(_tags[k], n)) {
            selection.push(k);
        }
    }
    e.clipboardData.setData('text/plain', selection.join(state.join));
    picker.fire('copy', [e, selection]).focus();
    offEventDefault(e);
}

function onCutTag(e) {
    let $ = this,
        picker = getReference($),
        {_mask, _tags, state} = picker,
        {input} = _mask,
        n = state.n + '__tag--selected';
    let selection = [];
    for (let k in _tags) {
        if (hasClass(_tags[k], n)) {
            selection.push(k), picker.let(k, 1);
        }
    }
    e.clipboardData.setData('text/plain', selection.join(state.join));
    picker.fire('cut', [e, selection]).fire('change', [$.title]).focus();
    offEventDefault(e);
}

function onFocusTextInput(e) {
    let $ = this,
        picker = getReference($),
        {_mask, _tags, mask, self, state} = picker,
        {hint, input, text} = _mask,
        n = state.n;
    for (let k in _tags) {
        letClass(_tags[k], n + '__tag--selected');
    }
    setClass(text, n + '__text--focus');
    setClass(mask, n += '--focus');
    setClass(mask, n += '-text');
    delay(() => setText(hint, getText(input, false) ? "" : self.placeholder), 1)();
    picker.focus().fire('focus', [e]);
}

function onFocusSelf() {
    let $ = this,
        picker = getReference($);
    picker.focus();
}

function onInvalidSelf(e) {
    let $ = this,
        picker = getReference($);
    picker.fire('min.tags').focus(), offEventDefault(e); // Disable native validation tooltip for required input(s)
}

function onFocusTag(e) {
    let $ = this,
        picker = getReference($),
        {_mask, mask, state} = picker,
        n = state.n;
    setClass(mask, n += '--focus');
    setClass(mask, n += '-tag');
    picker.fire('focus.tag', [e]);
}

function onKeyDownTag(e) {
    let $ = this, exit,
        key = e.key,
        keyIsCtrl = _keyIsCtrl = e.ctrlKey,
        keyIsShift = _keyIsShift = e.shiftKey,
        picker = getReference($),
        {_mask, _tags, mask, state} = picker,
        {text} = _mask,
        prevTag = getPrev($),
        nextTag = getNext($),
        firstTag, lastTag,
        n = state.n + '__tag--selected', v;
    if (keyIsShift) {
        setClass($, n), selectTo(getChildFirst($));
        if (KEY_ARROW_LEFT === key) {
            if (prevTag) {
                if (hasClass(prevTag, n)) {
                    letClass($, n);
                } else {
                    setClass(prevTag, n);
                }
                focusTo(prevTag), selectTo(getChildFirst(prevTag));
            }
            exit = true;
        } else if (KEY_ARROW_RIGHT === key) {
            if (nextTag && text !== nextTag) {
                if (hasClass(nextTag, n)) {
                    letClass($, n);
                } else {
                    setClass(nextTag, n);
                }
                focusTo(nextTag), selectTo(getChildFirst(nextTag));
            }
            exit = true;
        }
    } else if (keyIsCtrl) {
        if (KEY_A === key) {
            for (let k in _tags) {
                focusTo(_tags[k]), selectTo(getChildFirst(_tags[k]));
                setClass(_tags[k], n);
            }
            exit = true;
        } else if (KEY_ARROW_LEFT === key) {
            prevTag && focusTo(prevTag);
            exit = true;
        } else if (KEY_ARROW_RIGHT === key) {
            nextTag && text !== nextTag ? focusTo(nextTag) : picker.focus();
            exit = true;
        } else if (KEY_ENTER === key || ' ' === key) {
            toggleClass($, n);
            if (hasClass($, n)) {
                focusTo($), selectTo(getChildFirst($));
            } else {
                selectTo(getChildFirst(toObjectValues(_tags).pop()));
            }
            exit = true;
        }
    } else {
        let selection = [];
        for (let k in _tags) {
            if (hasClass(_tags[k], n)) {
                selection.push(k);
            }
            if ($ !== _tags[k]) {
                letClass(_tags[k], n);
            }
        }
        if (KEY_BEGIN === key) {
            firstTag = toObjectValues(_tags).shift();
            firstTag && focusTo(firstTag);
            exit = true;
        } else if (KEY_END === key) {
            lastTag = toObjectValues(_tags).pop();
            lastTag && focusTo(lastTag);
            exit = true;
        } else if (KEY_ENTER === key || ' ' === key) {
            toggleClass($, n);
            if (hasClass($, n)) {
                focusTo($), selectTo(getChildFirst($));
            } else {
                selectTo(getChildFirst(toObjectValues(_tags).pop()));
            }
            exit = true;
        } else if (KEY_ARROW_LEFT === key) {
            prevTag && focusTo(prevTag);
            exit = true;
        } else if (KEY_ARROW_RIGHT === key) {
            nextTag && text !== nextTag ? focusTo(nextTag) : picker.focus();
            exit = true;
        } else if (KEY_DELETE_LEFT === key) {
            picker.let(v = $.title, 1);
            if (toCount(selection) > 1) {
                let current;
                while (current = selection.pop()) {
                    prevTag = _tags[current] && getPrev(_tags[current]);
                    picker.let(current, 1);
                }
            }
            picker.fire('change', [v]);
            prevTag ? (focusTo(prevTag), selectTo(getChildFirst(prevTag))) : picker.focus();
            exit = true;
        } else if (KEY_DELETE_RIGHT === key) {
            picker.let(v = $.title, 1);
            if (toCount(selection) > 1) {
                let current;
                while (current = selection.shift()) {
                    nextTag = _tags[current] && getNext(_tags[current]);
                    picker.let(current, 1);
                }
            }
            picker.fire('change', [v]);
            nextTag && text !== nextTag ? (focusTo(nextTag), selectTo(getChildFirst(nextTag))) : picker.focus();
            exit = true;
        } else if (KEY_ESCAPE === key || KEY_TAB === key) {
            picker.focus();
            exit = true;
        }
    }
    exit && offEventDefault(e);
}

function onKeyUpTag(e) {
    let $ = this,
        key = e.key,
        picker = getReference($),
        {_tags, state} = picker,
        n = state.n + '__tag--selected';
    if (_keyIsShift) {
        if (KEY_ARROW_LEFT === key || KEY_ARROW_RIGHT === key) {} else {
            let selection = 0;
            for (let k in _tags) {
                if (hasClass(_tags[k], n)) {
                    ++selection;
                }
            }
            if (selection < 2) {
                letClass($, n);
            }
        }
    }
    _keyIsCtrl = _keyIsShift = false;
}

// Mobile device(s) usually don’t have the `KeyboardEvent.key` property as complete as desktop device(s), so I have to
// detect the character being typed by taking it from the character just before the cursor. You will probably see an
// effect that is a bit unpleasant to look at on mobile device(s), as the character that should only be used to insert a
// tag (the `,` character by default) appears for a second. This is different on desktop device(s), where the character
// you are going to type can be identified just before it is actually entered into the text input.
function onInputTextInput(e) {
    let $ = this,
        key = getCharBeforeCaret($),
        picker = getReference($),
        {state} = picker,
        escape = state.escape;
    if (
        ('\n' === key && (hasValue('\n', escape) || hasValue(13, escape))) ||
        ('\t' === key && (hasValue('\t', escape) || hasValue(9, escape))) ||
        (hasValue(key, escape))
    ) {
        return picker.set(getText($).slice(0, -1)).focus().text = "", offEventDefault(e);
    }
}

function onKeyDownTextInput(e) {
    let $ = this, exit, v,
        key = e.key,
        keyCode = e.keyCode,
        keyIsCtrl = _keyIsCtrl = e.ctrlKey,
        keyIsShift = _keyIsShift = e.shiftKey,
        picker = getReference($),
        {_active, _mask, _tags, mask, self, state} = picker,
        {hint} = _mask,
        n = state.n + '__tag--selected',
        firstTag, lastTag;
        escape = state.escape;
    if (!_active) {
        return offEventDefault(e);
    }
    if (
        (KEY_ENTER === key && (hasValue('\n', escape) || hasValue(13, escape))) ||
        (KEY_TAB === key && (hasValue('\t', escape) || hasValue(9, escape))) ||
        (hasValue(key, escape) || hasValue(keyCode, escape))
    ) {
        return picker.set(getText($)).focus().text = "", offEventDefault(e);
    }
    delay(() => setText(hint, getText($, false) ? "" : self.placeholder), 1)();
    let caretIsToTheFirst = "" === getCharBeforeCaret($),
        textIsVoid = null === getText($, false);
    if (keyIsShift) {
        if (textIsVoid || caretIsToTheFirst) {
            if (KEY_ARROW_LEFT === key) {
                lastTag = toObjectValues(_tags).pop();
                if (lastTag) {
                    lastTag && (focusTo(lastTag), selectTo(getChildFirst(lastTag)));
                    setClass(lastTag, n);
                    exit = true;
                }
            }
        }
    } else if (keyIsCtrl) {
        if (KEY_A === key && null === getText($, false) && null !== (v = picker.value)) {
            for (let k in _tags) {
                focusTo(_tags[k]), selectTo(getChildFirst(_tags[k]));
                setClass(_tags[k], n);
            }
            exit = true;
        } else if (KEY_BEGIN === key) {
            firstTag = toObjectValues(_tags).shift();
            firstTag && focusTo(firstTag);
            exit = true;
        } else if (KEY_END === key) {
            lastTag = toObjectValues(_tags).pop();
            lastTag && focusTo(lastTag);
            exit = true;
        } else if (KEY_ARROW_LEFT === key) {
            lastTag = toObjectValues(_tags).pop();
            lastTag && focusTo(lastTag);
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
                firstTag && focusTo(firstTag);
                exit = true;
            } else if (KEY_END === key) {
                lastTag = toObjectValues(_tags).pop();
                lastTag && focusTo(lastTag);
                exit = true;
            } else if (KEY_ARROW_LEFT === key) {
                lastTag = toObjectValues(_tags).pop();
                lastTag && focusTo(lastTag);
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
                lastTag && focusTo(lastTag);
                exit = true;
            }
        }
    }
    exit && offEventDefault(e);
}

function onKeyUpTextInput() {
    _keyIsCtrl = _keyIsShift = false;
}

function onPasteTag(e) {
    let $ = this,
        picker = getReference($),
        {_tags, state} = picker,
        n = state.n + '__tag--selected';
    let isAllSelected = true,
        value = (e.clipboardData || W.clipboardData).getData('text') + "";
    for (let k in _tags) {
        if (!hasClass(_tags[k], n)) {
            isAllSelected = false;
            break;
        }
    }
    // Delete all tag(s) before paste
    if (isAllSelected && picker.value) {
        picker.value.split(state.join).forEach(tag => picker.let(tag, 1));
    }
    let values = value.split(state.join);
    values.forEach(tag => picker.set(tag, -1, 1));
    picker.fire('paste', [e, values]).focus().fire('change');
    offEventDefault(e);
}

function onPasteTextInput(e) {
    let $ = this,
        picker = getReference($),
        {_mask, self, state} = picker,
        {hint} = _mask;
    let value = (e.clipboardData || W.clipboardData).getData('text') + "";
    setValueAtCaret($, value), setText(hint, getText($) ? "" : self.placeholder);
    delay(() => {
        value = getText($);
        picker.text = "";
        if (value) {
            let values = value.split(state.join);
            values.forEach(tag => picker.set(tag, -1, 1));
            picker.fire('paste', [e, values]).fire('change');
        }
    }, 1)();
    offEventDefault(e);
}

function onPointerDownTag(e) {
    let $ = this,
        picker = getReference($),
        {_active, _mask, _tags, state} = picker,
        {text} = _mask,
        n = state.n + '__tag--selected';
    if (!_active) {
        return;
    }
    focusTo($), toggleClass($, n);
    if (_keyIsCtrl) {
        // ?
    } else if (_keyIsShift) {
        selectNone();
        let parentTag = getParent($),
            selectedTags = getElements('.' + n, parentTag),
            firstTag = selectedTags[0],
            lastTag = selectedTags[toCount(selectedTags) - 1], nextTag;
        if (firstTag !== lastTag) {
            while ((nextTag = getNext(firstTag)) && text !== nextTag) {
                if (firstTag === lastTag) {
                    break;
                }
                setClass(firstTag = nextTag, n);
            }
        }
    } else {
        selectNone();
        let asContextMenu = 2 === e.button, // Probably a “right-click”
            selection = 0;
        for (let k in _tags) {
            if (hasClass(_tags[k], n)) {
                ++selection;
            }
            if ($ !== _tags[k] && !asContextMenu) {
                letClass(_tags[k], n);
            }
        }
        // If it has selection(s) previously, use the event to cancel the other(s)
        if (selection > 0) {
            setClass($, n); // Then select the current tag
        }
    }
    if (hasClass($, n)) {
        focusTo($), selectTo(getChildFirst($));
    } else {
        selectTo(toObjectValues(_tags).pop());
    }
    picker.fire('touch.tag', [e]);
    offEventDefault(e);
    offEventPropagation(e);
}

function onPointerDownTagX(e) {
    let $ = this,
        tag = getParent($),
        picker = getReference(tag),
        {_mask} = picker,
        {input} = _mask;
    offEvent('click', $, onPointerDownTagX);
    picker.let(tag.title).focus(), offEventDefault(e);
}

function onResetForm(e) {
    let $ = this,
        picker = getReference($);
    picker.let().fire('reset', [e]);
}

function onSubmitForm(e) {
    let $ = this,
        picker = getReference($),
        {_tags, state} = picker;
    if (toObjectCount(_tags) < state.min) {
        return picker.fire('min.tags').focus(), offEventDefault(e);
    }
    return picker.fire('submit', [e]);
}

$$.attach = function (self, state) {
    let $ = this;
    self = self || $.self;
    if (state && isString(state)) {
        state = {
            join: state
        };
    }
    state = fromStates({}, $.state, state || {});
    if (hasClass(self, state.n + '__self')) {
        return $;
    }
    if (isRequired(self) && !state.min) {
        state.min = 1; // Force minimum tag(s) to insert to be `1`
    }
    $._active = !isDisabled(self) && !isReadOnly(self);
    $._tags = {};
    $._value = getValue(self) || null;
    $.self = self;
    $.state = state;
    let n = state.n;
    const form = getParentForm(self);
    const mask = setElement('div', {
        'class': n,
        'tabindex': isDisabled(self) ? false : -1
    });
    $.mask = mask;
    const maskTags = setElement('span', {
        'class': n + '__tags'
    });
    const text = setElement('span', {
        'class': n + '__text'
    });
    const textInput = setElement('span', {
        'contenteditable': isDisabled(self) ? false : "",
        'spellcheck': 'false'
    });
    const textInputHint = setElement('span', self.placeholder + "");
    setChildLast(mask, maskTags);
    setChildLast(maskTags, text);
    setChildLast(text, textInput);
    setChildLast(text, textInputHint);
    setClass(self, n + '__self');
    setNext(self, mask);
    if (form) {
        setReference(form, $);
        onEvent('reset', form, onResetForm);
        onEvent('submit', form, onSubmitForm);
    }
    onEvent('blur', textInput, onBlurTextInput);
    onEvent('click', mask, onClickMask);
    onEvent('focus', self, onFocusSelf);
    onEvent('focus', textInput, onFocusTextInput);
    onEvent('input', textInput, onInputTextInput);
    onEvent('invalid', self, onInvalidSelf);
    onEvent('keydown', textInput, onKeyDownTextInput);
    onEvent('keyup', textInput, onKeyUpTextInput);
    onEvent('paste', textInput, onPasteTextInput);
    self.tabIndex = -1;
    setReference(mask, $);
    setReference(textInput, $);
    let _mask = {};
    _mask.hint = textInputHint;
    _mask.input = textInput;
    _mask.of = self;
    _mask.self = mask;
    _mask.tags = maskTags;
    _mask.text = text;
    $._mask = _mask;
    // Attach the current tag(s)
    if ($._value) {
        $._value.split(state.join).forEach(tag => $.set(tag, -1, 1, 1));
    }
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
    selectNone();
    let $ = this,
        {_mask, _tags} = $,
        {input} = _mask;
    for (let k in _tags) {
        _tags[k].blur();
    }
    return input.blur();
};

$$.detach = function () {
    let $ = this,
        {_mask, mask, self, state} = $,
        {input} = _mask;
    if (!hasClass(self, state.n + '__self')) {
        return $;
    }
    const form = getParentForm(self);
    $._active = false;
    $._value = getValue(self) || null; // Update initial value to be the current value
    if (form) {
        offEvent('reset', form, onResetForm);
        offEvent('submit', form, onSubmitForm);
    }
    offEvent('blur', input, onBlurTextInput);
    offEvent('click', mask, onClickMask);
    offEvent('focus', input, onFocusTextInput);
    offEvent('focus', self, onFocusSelf);
    offEvent('input', input, onInputTextInput);
    offEvent('invalid', self, onInvalidSelf);
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
    letClass(self, state.n + '__self');
    letElement(mask);
    $._mask = {
        of: self
    };
    $.mask = null;
    return $;
};

$$.focus = function (mode) {
    let $ = this,
        {_mask} = $,
        {input} = _mask;
    return (input && (focusTo(input), selectTo(input, mode))), $;
};

$$.get = function (v) {
    let $ = this,
        {_active, _tags} = $;
    if (!_active) {
        return false;
    }
    $.fire('get.tag', [v]);
    if (!_tags[v]) {
        return null;
    }
    return toObjectKeys(_tags).indexOf(v);
};

$$.let = function (v, _skipHookChange) {
    let $ = this,
        {_active, _tags, _value, self, state} = $;
    if (!_active) {
        return $;
    }
    // Reset
    if (!isDefined(v)) {
        if ($.value) {
            $.value.split(state.join).forEach(tag => $.let(tag, 1));
        }
        return _value.split(state.join).forEach(tag => $.set(tag, -1, 1)), $.fire('change');
    }
    if (toObjectCount(_tags) < state.min) {
        return $.fire('min.tags', [v]);
    }
    if (!_tags[v]) {
        return $;
    }
    let tag = _tags[v],
        tagText = getChildren(tag, 0),
        tagX = getChildren(tag, 1);
    offEvent('blur', tag, onBlurTag);
    offEvent('contextmenu', tag, onContextMenuTag);
    offEvent('copy', tag, onCopyTag);
    offEvent('cut', tag, onCutTag);
    offEvent('focus', tag, onFocusTag);
    offEvent('keydown', tag, onKeyDownTag);
    offEvent('keyup', tag, onKeyUpTag);
    offEvent('mousedown', tag, onPointerDownTag);
    offEvent('mousedown', tagX, onPointerDownTagX);
    offEvent('paste', tag, onPasteTag);
    offEvent('touchstart', tag, onPointerDownTag);
    offEvent('touchstart', tagX, onPointerDownTagX);
    letElement(tag);
    delete $._tags[v];
    self.value = toObjectKeys($._tags).join(state.join);
    $.fire('let.tag', [v]);
    if (!_skipHookChange) {
        $.fire('change', [v]);
    }
    return $;
};

$$.set = function (v, at, _skipHookChange, _attach) {
    let $ = this,
        {_active, _filter, _mask, _tags, self, state} = $,
        {text} = _mask,
        {pattern} = state,
        n = state.n;
    if (!_active && !_attach) {
        return $;
    }
    if (toObjectCount(_tags) >= state.max) {
        return $.fire('max.tags', [v]);
    }
    if (isFunction(_filter)) {
        v = _filter.call($, v);
    }
    $.fire('set.tag', [v]);
    if ("" === v || (isString(pattern) && !toPattern(pattern).test(v))) {
        return $.fire('not.tag', [v]);
    }
    if (_tags[v]) {
        return $.fire('has.tag', [v]);
    }
    $.fire('is.tag', [v]);
    const tag = setElement('span', {
        'class': n + '__tag',
        'tabindex': _active ? -1 : false,
        'title': v
    });
    const tagText = setElement('span', fromHTML(v));
    const tagX = setElement('span', {
        'class': n + '__x',
        'tabindex': -1
    });
    if (_active) {
        onEvent('blur', tag, onBlurTag);
        onEvent('contextmenu', tag, onContextMenuTag);
        onEvent('copy', tag, onCopyTag);
        onEvent('cut', tag, onCutTag);
        onEvent('focus', tag, onFocusTag);
        onEvent('keydown', tag, onKeyDownTag);
        onEvent('keyup', tag, onKeyUpTag);
        onEvent('mousedown', tag, onPointerDownTag);
        onEvent('mousedown', tagX, onPointerDownTagX);
        onEvent('paste', tag, onPasteTag);
        onEvent('touchstart', tag, onPointerDownTag);
        onEvent('touchstart', tagX, onPointerDownTagX);
        setReference(tag, $);
    }
    setChildLast(tag, tagText);
    setChildLast(tag, tagX);
    if (isInteger(at) && at >= 0) {
        let tags = toObjectKeys(_tags);
        tags.splice(at, 0, v);
        $._tags = {};
        _tags[v] = tag;
        tags.forEach(k => {
            $._tags[k] = _tags[k];
            setPrev(text, _tags[k]);
        });
    } else {
        setPrev(text, tag);
        $._tags[v] = tag;
    }
    self.value = toObjectKeys($._tags).join(state.join);
    $.fire('set.tag', [v]);
    if (!_skipHookChange) {
        $.fire('change', [v]);
    }
    return $;
};

export default TagPicker;