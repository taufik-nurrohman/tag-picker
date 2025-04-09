import {D, W, getChildFirst, getChild, getDatum, getElement, getElements, getNext, getParent, getPrev, getParentForm, getText, getValue, hasClass, isDisabled, isReadOnly, isRequired, letClass, letElement, setChildLast, setClass, setElement, setNext, setPrev, setText, setValue, toggleClass} from '@taufik-nurrohman/document';
import {delay} from '@taufik-nurrohman/tick';
import {forEachArray, forEachMap, getReference, getValueInMap, hasKeyInMap, letReference, letValueInMap, setReference, setValueInMap, toKeysFromMap, toValueFirstFromMap, toValueLastFromMap} from '@taufik-nurrohman/f';
import {fromHTML, fromStates} from '@taufik-nurrohman/from';
import {hasValue} from '@taufik-nurrohman/has';
import {hook} from '@taufik-nurrohman/hook';
import {isArray, isDefined, isFunction, isInstance, isInteger, isObject, isSet, isString} from '@taufik-nurrohman/is';
import {offEvent, offEventDefault, offEventPropagation, onEvent} from '@taufik-nurrohman/event';
import {insertAtSelection, selectTo, selectToNone} from '@taufik-nurrohman/selection';
import {toCount} from '@taufik-nurrohman/to';
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

function getTagValue(tag) {
    return getDatum(tag, 'value', false);
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

    setReference(self, hook($, TagPicker._));

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

const $$ = TagPicker._ = TagPicker.prototype;

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
            {_event, state} = $;
        if ($.value) {
            forEachArray($.value.split(state.join), tag => $.let(tag, 1));
        }
        forEachArray(value.split(state.join), tag => $.set(tag, -1, 1));
        $.fire('change', [_event]);
    }
});

$$._let = false;

$$._set = false;

$$._valid = function (v) {
    let $ = this, {state} = $;
    return (v || "").replace(/[^ -~]/g, ' ').split(state.join).join("").replace(/\s+/g, ' ').trim();
};

let _keyIsCtrl = false, _keyIsShift = false;

function onBlurTag(e) {
    selectToNone();
    let $ = this,
        picker = getReference($),
        {_mask, _tags, mask, state} = picker,
        {n} = state;
    picker._event = e;
    if (!_keyIsCtrl && !_keyIsShift) {
        forEachMap(_tags, v => letClass(v, n + '__tag--selected'));
    }
    letClass(mask, n += '--focus');
    letClass(mask, n += '-tag');
}

function onBlurTextInput(e) {
    selectToNone();
    let $ = this,
        picker = getReference($),
        {_mask, mask, state} = picker,
        {text} = _mask,
        {n} = state;
    picker._event = e;
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
    picker._event = e;
    if (!hasClass(on, n) && !getParent(on, '.' + n)) {
        picker.focus();
    }
}

function onContextMenuTag(e) {
    let $ = this,
        picker = getReference($),
        {state} = picker,
        n = state.n + '__tag--selected';
    picker._event = e;
    setClass($, n);
    focusTo($), selectTo(getChildFirst($));
}

function onCopyTag(e) {
    let $ = this,
        picker = getReference($),
        {_tags, state} = picker,
        n = state.n + '__tag--selected';
    let selection = [];
    picker._event = e;
    forEachMap(_tags, (v, k) => {
        if (hasClass(v, n)) {
            selection.push(k);
        }
    });
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
    picker._event = e;
    forEachMap(_tags, (v, k) => {
        if (hasClass(v, n)) {
            selection.push(k), picker.let(k, 1);
        }
    });
    e.clipboardData.setData('text/plain', selection.join(state.join));
    picker.fire('cut', [e, selection]).fire('change', [e, getTagValue($)]).focus();
    offEventDefault(e);
}

function onFocusTextInput(e) {
    let $ = this,
        picker = getReference($),
        {_mask, _tags, mask, self, state} = picker,
        {hint, input, text} = _mask,
        {n} = state;
    picker._event = e;
    forEachMap(_tags, v => letClass(v, n + '__tag--selected'));
    setClass(text, n + '__text--focus');
    setClass(mask, n += '--focus');
    setClass(mask, n += '-text');
    delay(() => setText(hint, getText(input, false) ? "" : self.placeholder), 1)();
    picker.focus().fire('focus', [e]);
}

function onFocusSelf(e) {
    let $ = this,
        picker = getReference($);
    picker._event = e;
    picker.focus();
}

function onInvalidSelf(e) {
    let $ = this,
        picker = getReference($);
    picker._event = e;
    picker.fire('min.tags', [e]).focus(), offEventDefault(e); // Disable native validation tooltip for required input(s)
}

function onFocusTag(e) {
    let $ = this,
        picker = getReference($),
        {_mask, mask, state} = picker,
        {n} = state;
    picker._event = e;
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
    picker._event = e;
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
            forEachMap(_tags, v => {
                focusTo(v), selectTo(getChildFirst(v));
                setClass(v, n);
            });
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
                selectTo(getChildFirst(toValueLastFromMap(_tags)));
            }
            exit = true;
        }
    } else {
        let selection = [];
        forEachMap(_tags, (v, k) => {
            if (hasClass(v, n)) {
                selection.push(k);
            }
            if ($ !== v) {
                letClass(v, n);
            }
        });
        if (KEY_BEGIN === key) {
            firstTag = toValueFirstFromMap(_tags);
            firstTag && focusTo(firstTag);
            exit = true;
        } else if (KEY_END === key) {
            lastTag = toValueLastFromMap(_tags);
            lastTag && focusTo(lastTag);
            exit = true;
        } else if (KEY_ENTER === key || ' ' === key) {
            toggleClass($, n);
            if (hasClass($, n)) {
                focusTo($), selectTo(getChildFirst($));
            } else {
                selectTo(getChildFirst(toValueLastFromMap(_tags)));
            }
            exit = true;
        } else if (KEY_ARROW_LEFT === key) {
            prevTag && focusTo(prevTag);
            exit = true;
        } else if (KEY_ARROW_RIGHT === key) {
            nextTag && text !== nextTag ? focusTo(nextTag) : picker.focus();
            exit = true;
        } else if (KEY_DELETE_LEFT === key) {
            picker.let(v = getTagValue($), 1);
            if (toCount(selection) > 1) {
                let c, current;
                while (current = selection.pop()) {
                    prevTag = (c = getValueInMap(current, _tags)) && getPrev(c);
                    picker.let(current, 1);
                }
            }
            picker.fire('change', [e, v]);
            prevTag ? (focusTo(prevTag), selectTo(getChildFirst(prevTag))) : picker.focus();
            exit = true;
        } else if (KEY_DELETE_RIGHT === key) {
            picker.let(v = getTagValue($), 1);
            if (toCount(selection) > 1) {
                let c, current;
                while (current = selection.shift()) {
                    nextTag = (c = getValueInMap(current, _tags)) && getNext(current);
                    picker.let(current, 1);
                }
            }
            picker.fire('change', [e, v]);
            nextTag && text !== nextTag ? (focusTo(nextTag), selectTo(getChildFirst(nextTag))) : picker.focus();
            exit = true;
        } else if (KEY_ESCAPE === key || KEY_TAB === key) {
            picker.focus();
            exit = true;
        } else {
            picker.focus();
            exit = false;
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
    picker._event = e;
    if (_keyIsShift) {
        if (KEY_ARROW_LEFT === key || KEY_ARROW_RIGHT === key) {} else {
            let selection = 0;
            forEachMap(_tags, v => {
                if (hasClass(v, n)) {
                    ++selection;
                }
            });
            if (selection < 2) {
                letClass($, n);
            }
        }
    }
    _keyIsCtrl = _keyIsShift = false;
}

function onBeforeInputTextInput(e) {
    let $ = this,
        data = e.data,
        picker = getReference($),
        {state} = picker,
        escape = state.escape;
    let key = isString(data) && 1 === toCount(data) ? data : 0;
    picker._event = e;
    if (
        ('\n' === key && (hasValue('\n', escape) || hasValue(13, escape))) ||
        ('\t' === key && (hasValue('\t', escape) || hasValue(9, escape))) ||
        (hasValue(key, escape))
    ) {
        return picker.set(getText($)).focus().text = "", offEventDefault(e);
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
    picker._event = e;
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
                lastTag = toValueLastFromMap(_tags);
                if (lastTag) {
                    lastTag && (focusTo(lastTag), selectTo(getChildFirst(lastTag)));
                    setClass(lastTag, n);
                    exit = true;
                }
            }
        }
    } else if (keyIsCtrl) {
        if (KEY_A === key && null === getText($, false) && null !== (v = picker.value)) {
            forEachMap(_tags, v => {
                focusTo(v), selectTo(getChildFirst(v));
                setClass(v, n);
            });
            exit = true;
        } else if (KEY_BEGIN === key) {
            firstTag = toValueFirstFromMap(_tags);
            firstTag && focusTo(firstTag);
            exit = true;
        } else if (KEY_END === key) {
            lastTag = toValueLastFromMap(_tags);
            lastTag && focusTo(lastTag);
            exit = true;
        } else if (KEY_ARROW_LEFT === key) {
            lastTag = toValueLastFromMap(_tags);
            lastTag && focusTo(lastTag);
            exit = true;
        } else if (KEY_DELETE_LEFT === key) {
            lastTag = toValueLastFromMap(_tags);
            lastTag && picker.let(getTagValue(lastTag));
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
                firstTag = toValueFirstFromMap(_tags);
                firstTag && focusTo(firstTag);
                exit = true;
            } else if (KEY_END === key) {
                lastTag = toValueLastFromMap(_tags);
                lastTag && focusTo(lastTag);
                exit = true;
            } else if (KEY_ARROW_LEFT === key) {
                lastTag = toValueLastFromMap(_tags);
                lastTag && focusTo(lastTag);
                exit = true;
            } else if (KEY_DELETE_LEFT === key) {
                lastTag = toValueLastFromMap(_tags);
                lastTag && picker.let(getTagValue(lastTag));
                picker.focus();
                exit = true;
            }
        } else if (caretIsToTheFirst) {
            if (KEY_ARROW_LEFT === key) {
                lastTag = toValueLastFromMap(_tags);
                lastTag && focusTo(lastTag);
                exit = true;
            }
        }
    }
    exit && offEventDefault(e);
}

function onKeyUpTextInput(e) {
    let $ = this,
        picker = getReference($);
    picker._event = e;
    _keyIsCtrl = _keyIsShift = false;
}

function onPasteTag(e) {
    let $ = this,
        picker = getReference($),
        {_tags, state} = picker,
        n = state.n + '__tag--selected';
    let isAllSelected = true,
        value = (e.clipboardData || W.clipboardData).getData('text') + "";
    picker._event = e;
    try {
        forEachMap(_tags, v => {
            if (!hasClass(v, n)) {
                isAllSelected = false;
                throw "";
            }
        });
    } catch (e) {}
    // Delete all tag(s) before paste
    if (isAllSelected && picker.value) {
        forEachArray(picker.value.split(state.join), tag => picker.let(tag, 1));
    }
    let values = value.split(state.join);
    forEachArray(values, tag => picker.set(tag, -1, 1));
    picker.fire('paste', [e, values]).focus().fire('change', [e]);
    offEventDefault(e);
}

function onPasteTextInput(e) {
    let $ = this,
        picker = getReference($),
        {_mask, self, state} = picker,
        {hint} = _mask;
    let value = (e.clipboardData || W.clipboardData).getData('text') + "";
    picker._event = e;
    insertAtSelection($, value), setText(hint, getText($) ? "" : self.placeholder);
    delay(() => {
        value = getText($);
        picker.text = "";
        if (value) {
            let values = value.split(state.join);
            forEachArray(values, tag => picker.set(tag, -1, 1));
            picker.fire('paste', [e, values]).fire('change', [e]);
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
    picker._event = e;
    focusTo($), toggleClass($, n);
    if (_keyIsCtrl) {
        // ?
    } else if (_keyIsShift) {
        selectToNone();
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
        selectToNone();
        let asContextMenu = 2 === e.button, // Probably a “right-click”
            selection = 0;
        forEachMap(_tags, v => {
            if (hasClass(v, n)) {
                ++selection;
            }
            if ($ !== v && !asContextMenu) {
                letClass(v, n);
            }
        });
        // If it has selection(s) previously, use the event to cancel the other(s)
        if (selection > 0) {
            setClass($, n); // Then select the current tag
        }
    }
    if (hasClass($, n)) {
        focusTo($), selectTo(getChildFirst($));
    } else {
        selectTo(toValueLastFromMap(_tags));
    }
    picker.fire('touch.tag', [e]);
    offEventDefault(e);
    offEventPropagation(e);
}

function onPointerDownTagX(e) {
    let $ = this,
        tag = getParent($),
        picker = getReference(tag);
    picker._event = e;
    offEvent('mousedown', $, onPointerDownTagX);
    offEvent('touchstart', $, onPointerDownTagX);
    picker.let(getTagValue(tag)).focus(), offEventDefault(e);
}

function onResetForm(e) {
    let $ = this,
        picker = getReference($);
    picker._event = e;
    picker.let().fire('reset', [e]);
}

function onSubmitForm(e) {
    let $ = this,
        picker = getReference($),
        {_tags, state} = picker;
    picker._event = e;
    if (_tags.size < state.min) {
        return picker.fire('min.tags', [e]).focus(), offEventDefault(e);
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
    $._event = null;
    $._tags = new Map;
    $._value = getValue(self) || null;
    $.self = self;
    $.state = state;
    let {n} = state;
    const form = getParentForm(self);
    const mask = setElement('div', {
        'class': n,
        'tabindex': isDisabled(self) ? false : -1
    });
    $.mask = mask;
    const maskFlex = setElement('span', {
        'class': n + '__flex'
    });
    const text = setElement('span', {
        'class': n + '__text'
    });
    const textInput = setElement('span', {
        'autocapitalize': 'off',
        'contenteditable': isDisabled(self) ? false : "",
        'spellcheck': 'false'
    });
    const textInputHint = setElement('span', self.placeholder + "");
    setChildLast(mask, maskFlex);
    setChildLast(maskFlex, text);
    setChildLast(text, textInput);
    setChildLast(text, textInputHint);
    setClass(self, n + '__self');
    setNext(self, mask);
    if (form) {
        setReference(form, $);
        onEvent('reset', form, onResetForm);
        onEvent('submit', form, onSubmitForm);
    }
    onEvent('beforeinput', textInput, onBeforeInputTextInput);
    onEvent('blur', textInput, onBlurTextInput);
    onEvent('click', mask, onClickMask);
    onEvent('focus', self, onFocusSelf);
    onEvent('focus', textInput, onFocusTextInput);
    onEvent('invalid', self, onInvalidSelf);
    onEvent('keydown', textInput, onKeyDownTextInput);
    onEvent('keyup', textInput, onKeyUpTextInput);
    onEvent('paste', textInput, onPasteTextInput);
    self.tabIndex = -1;
    setReference(mask, $);
    setReference(textInput, $);
    let _mask = {};
    _mask.flex = maskFlex;
    _mask.hint = textInputHint;
    _mask.input = textInput;
    _mask.of = self;
    _mask.self = mask;
    _mask.text = text;
    $._mask = _mask;
    // Attach the current tag(s)
    if ($._value) {
        forEachArray($._value.split(state.join), tag => $.set(tag, -1, 1, 1));
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
    selectToNone();
    let $ = this,
        {_mask, _tags} = $,
        {input} = _mask;
    forEachMap(_tags, v => v.blur());
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
    offEvent('beforeinput', input, onBeforeInputTextInput);
    offEvent('blur', input, onBlurTextInput);
    offEvent('click', mask, onClickMask);
    offEvent('focus', input, onFocusTextInput);
    offEvent('focus', self, onFocusSelf);
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
        {_active, _event, _tags} = $;
    if (!_active) {
        return false;
    }
    $.fire('get.tag', [_event, v]);
    if (!hasKeyInMap(v, _tags)) {
        return null;
    }
    let indexOf = -1;
    try {
        forEachMap(_tags, (value, k) => {
            ++indexOf;
            if (v === k) {
                throw "";
            }
        });
    } catch (e) {}
    return indexOf;
};

$$.let = function (v, _skipHookChange) {
    let $ = this,
        {_active, _event, _let, _tags, _value, self, state} = $;
    if (!_active) {
        return $;
    }
    // Reset
    if (!isDefined(v)) {
        if ($.value) {
            forEachArray($.value.split(state.join), tag => $.let(tag, 1));
        }
        return forEachArray(_value.split(state.join), tag => $.set(tag, -1, 1)), $.fire('change', [_event]);
    }
    if (!isArray(v)) {
        v = [v, v];
    }
    if (_tags.size < state.min + 1) {
        return $.fire('min.tags', [_event, v[0]]);
    }
    if (!hasKeyInMap(v[0], _tags)) {
        return $.fire('not.tag', [_event, v[0]]);
    }
    $.fire('is.tag', [_event, v[0]]);
    let tag = getValueInMap(v[0], _tags),
        tagText = getChild(tag, 0),
        tagX = getChild(tag, 1);
    if (isFunction(_let)) {
        _let.call($, tag);
    }
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
    letValueInMap(v[0], $._tags);
    self.value = toKeysFromMap($._tags).join(state.join);
    $.fire('let.tag', [_event, v[0]]);
    if (!_skipHookChange) {
        $.fire('change', [_event, v[0]]);
    }
    return $;
};

$$.set = function (v, at, _skipHookChange, _attach) {
    let $ = this,
        {_active, _event, _mask, _set, _tags, _valid, self, state} = $,
        {text} = _mask,
        {n, pattern} = state;
    if (!_active && !_attach) {
        return $;
    }
    if (!isArray(v)) {
        v = [v, v];
    }
    if (_tags.size >= state.max) {
        return $.fire('max.tags', [_event, v[0]]);
    }
    if (isFunction(_valid)) {
        v[0] = _valid.call($, v[0]);
    }
    if ("" === v[0] || (isString(pattern) && !toPattern(pattern).test(v[0]))) {
        return $.fire('not.tag', [_event, v[0]]);
    }
    if (hasKeyInMap(v[0], _tags)) {
        return $.fire('has.tag', [_event, v[0]]);
    }
    $.fire('is.tag', [_event, v[0]]);
    let tag = setElement('span', {
            'class': n + '__tag',
            'data-value': v[0],
            'tabindex': _active ? -1 : false
        }),
        tagText = setElement('span', fromHTML(v[1] ?? v[0])),
        tagX = setElement('span', {
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
        let tags = toKeysFromMap(_tags);
        tags.splice(at, 0, v[0]);
        $._tags = new Map;
        setValueInMap(v[0], tag, _tags);
        if (isFunction(_set)) {
            _set.call($, tag);
        }
        forEachArray(tags, k => {
            let v;
            setValueInMap(k, v = getValueInMap(k, _tags), $._tags);
            setPrev(text, v);
        });
    } else {
        setValueInMap(v[0], tag, $._tags);
        if (isFunction(_set)) {
            _set.call($, tag);
        }
        setPrev(text, tag);
    }
    self.value = toKeysFromMap($._tags).join(state.join);
    $.fire('set.tag', [_event, v[0]]);
    if (!_skipHookChange) {
        $.fire('change', [_event, v[0]]);
    }
    return $;
};

export default TagPicker;