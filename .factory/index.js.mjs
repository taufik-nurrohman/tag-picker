import {/* focusTo, */getCharBeforeCaret, getSelection, insertAtSelection, selectTo, selectToNone} from '@taufik-nurrohman/selection';
import {delay} from '@taufik-nurrohman/tick';
import {forEachArray, forEachMap, getPrototype, getReference, getValueInMap, hasKeyInMap, letValueInMap, setObjectAttributes, setObjectMethods, setReference, setValueInMap, toValueFirstFromMap, toValueLastFromMap} from '@taufik-nurrohman/f';
import {fromStates, fromValue} from '@taufik-nurrohman/from';
import {getAria, getElement, getElementIndex, getHTML, getID, getNext, getParent, getParentForm, getPrev, getRole, getState, getText, getValue, isDisabled, isReadOnly, isRequired, letAria, letElement, letStyle, setAria, setAttribute, setChildLast, setClass, setClasses, setElement, setID, setNext, setPrev, setStyle, setStyles, setText, setValue} from '@taufik-nurrohman/document';
import {hasValue} from '@taufik-nurrohman/has';
import {hook} from '@taufik-nurrohman/hook';
import {isArray, isFloat, isInstance, isInteger, isObject, isSet, isString} from '@taufik-nurrohman/is';
import {offEvent, offEventDefault, onEvent} from '@taufik-nurrohman/event';
import {toCount, toMapCount, toValue} from '@taufik-nurrohman/to';

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

const TOKEN_FALSE = 'false';
const TOKEN_TRUE = 'true';

const name = 'TagPicker';

let _keyIsCtrl, _keyIsShift;

function createTags($, tags) {
    const map = isInstance(tags, Map) ? tags : new Map;
    if (isArray(tags)) {
        forEachArray(tags, tag => {
            if (isArray(tag)) {
                tag[0] = tag[0] ?? "";
                tag[1] = tag[1] ?? {};
                setValueInMap(toValue(tag[1].value ?? tag[0]), tag, map);
            } else {
                setValueInMap(toValue(tag), [tag, {}], map);
            }
        });
    } else if (isObject(tags, 0)) {
        forEachObject(tags, (v, k) => {
            if (isArray(v)) {
                tags[k][0] = v[0] ?? "";
                tags[k][1] = v[1] ?? {};
                setValueInMap(toValue(v[1].value ?? k), v, map);
            } else {
                setValueInMap(toValue(k), [v, {}], map);
            }
        });
    }
    let {_tags, state} = $, r = [];
    // Reset the tag(s) data, but do not fire the `let.tags` hook
    _tags.let(null, 0);
    forEachMap(map, (v, k) => {
        if (isArray(v) && v[1]) {
            r.push(v[1].value ?? k);
        }
        // Set the tag data, but do not fire the `set.tag` hook
        _tags.set(toValue(isArray(v) && v[1] ? (v[1].value ?? k) : k), v, 0);
    });
    state.tags = map;
    return r;
}

function focusTo(node) {
    return node.focus(), node;
}

function getTagValue(tag, parseValue) {
    return getValue(tag, parseValue);
}

// Do not allow user(s) to edit the tag text
function onBeforeInputTag(e) {
    offEventDefault(e);
}

function onBeforeInputTextInput(e) {
    let $ = this,
        data = e.data,
        picker = getReference($),
        {_active, _mask, _tags, state} = picker,
        {hint} = _mask,
        {escape} = state, exit, key;
    key = isString(data) && 1 === toCount(data) ? data : 0;
    if (
        (KEY_ENTER === key && (hasValue('\n', escape) || hasValue(13, escape))) ||
        (KEY_TAB === key && (hasValue('\t', escape) || hasValue(9, escape))) ||
        (hasValue(key, escape))
    ) {
        exit = true;
        setValueInMap(toValue(v = getText($)), v, _tags);
        focusTo(picker).text = "";
    }
    exit && offEventDefault(e);
}

function onBlurTag() {
    let $ = this,
        picker = getReference($),
        {_tags} = picker;
    if (!_keyIsCtrl && !_keyIsShift) {
        forEachMap(_tags, v => letAria(v[2], 'selected'));
    }
}

function onCutTag(e) {
    offEventDefault(e);
    let $ = this,
        picker = getReference($),
        {_tags, state} = picker,
        {join} = state, selected = [], v;
    setAria($, 'selected', true);
    forEachMap(_tags, v => {
        if (getAria(v[2], 'selected')) {
            selected.push(v = getTagValue(v[2]));
            _tags.let(v, 0);
        }
    });
    e.clipboardData.setData('text/plain', selected.join(join)), focusTo(picker.fire('change', [picker.value]));
}

function onCutTextInput() {
    let $ = this,
        picker = getReference($),
        {_mask} = picker,
        {hint} = _mask;
    delay(() => getText($, 0) ? setStyle(hint, 'visibility', 'hidden') : letStyle(hint, 'visibility'), 1)();
}

function onFocusSelf() {
    focusTo(getReference(this));
}

// Select the tag text on focus to hide the text cursor
function onFocusTag() {
    selectTo(this);
}

function onFocusTextInput() {
    selectTo(this);
}

function onKeyDownTag(e) {
    let $ = this,
        key = e.key,
        keyCode = e.keyCode,
        keyIsCtrl = _keyIsCtrl = e.ctrlKey,
        keyIsShift = _keyIsShift = e.shiftKey,
        picker = getReference($),
        {_active} = picker;
    if (!_active) {
        return offEventDefault(e);
    }
    let {_mask, _tags} = picker,
        {text} = _mask,
        exit, tagPrev, tagNext;
    if (keyIsShift) {
        exit = true;
        setAria($, 'selected', true);
        if (KEY_ARROW_LEFT === key) {
            if (tagPrev = getPrev($)) {
                if (getAria(tagPrev, 'selected')) {
                    letAria($, 'selected');
                } else {
                    setAria(tagPrev, 'selected', true);
                }
                focusTo(tagPrev);
            }
        } else if (KEY_ARROW_RIGHT === key) {
            if ((tagNext = getNext($)) && tagNext !== text) {
                if (getAria(tagNext, 'selected')) {
                    letAria($, 'selected');
                } else {
                    setAria(tagNext, 'selected', true);
                }
                focusTo(tagNext);
            }
        } else if (KEY_TAB === key) {
            selectToNone();
        }
    } else if (keyIsCtrl) {
        if (KEY_A === key) {
            exit = true;
            forEachMap(_tags, v => (setAria(v[2], 'selected', true), focusTo(v[2]), selectTo(v[2])));
        } else if (KEY_ARROW_LEFT === key) {
            exit = true;
            if (tagPrev = getPrev($)) {
                focusTo(tagPrev);
            }
        } else if (KEY_ARROW_RIGHT === key) {
            exit = true;
            if ((tagNext = getNext($)) && tagNext !== text) {
                focusTo(tagNext);
            }
        } else {
            setAria($, 'selected', true);
        }
    } else {
        if (KEY_ARROW_LEFT === key) {
            exit = true;
            if (tagPrev = getPrev($)) {
                focusTo(tagPrev);
            }
        } else if (KEY_ARROW_RIGHT === key) {
            exit = true;
            focusTo((tagNext = getNext($)) && tagNext !== text ? tagNext : picker);
        } else if (KEY_DELETE_LEFT === key) {
            exit = true;
            tagPrev = getPrev($);
            _tags.let(getTagValue($), 0);
            forEachMap(_tags, v => {
                if (getAria(v[2], 'selected')) {
                    tagPrev = getPrev(v[2]);
                    _tags.let(getTagValue(v[2]), 0);
                }
            });
            focusTo(tagPrev || picker), picker.fire('change', [picker.value]);
        } else if (KEY_DELETE_RIGHT === key) {
            exit = true;
            tagNext = getNext($);
            _tags.let(getTagValue($), 0);
            forEachMap(_tags, v => {
                if (getAria(v[2], 'selected')) {
                    tagNext = getNext(v[2]);
                    _tags.let(getTagValue(v[2]), 0);
                }
            });
            focusTo(tagNext && tagNext !== text ? tagNext : picker), picker.fire('change', [picker.value]);
        } else if (KEY_ENTER === key || ' ' === key) {
            exit = true;
            getAria($, 'selected') ? letAria($, 'selected') : setAria($, 'selected', true);
            forEachMap(_tags, v => {
                if (v[2] !== $ && getAria(v[2], 'selected')) {
                    _tags.let(getTagValue(v[2]), 0);
                }
            });
        } else if (KEY_ESCAPE === key || KEY_TAB === key) {
            exit = true;
            selectToNone(), focusTo(picker);
        } else {
            forEachMap(_tags, v => {
                if (getAria(v[2], 'selected')) {
                    _tags.let(getTagValue(v[2]), 0);
                }
            });
            selectToNone(), focusTo(picker).fire('change', [picker.value]);
        }
    }
    exit && offEventDefault(e);
}

function onKeyDownTextInput(e) {
    let $ = this,
        key = e.key,
        keyCode = e.keyCode,
        keyIsCtrl = _keyIsCtrl = e.ctrlKey,
        keyIsShift = _keyIsShift = e.shiftKey,
        picker = getReference($),
        {_active} = picker;
    if (!_active) {
        return offEventDefault(e);
    }
    let {_mask, _tags, state} = picker,
        {hint} = _mask,
        {escape} = state, exit, v;
    if (
        (KEY_ENTER === key && (hasValue('\n', escape) || hasValue(13, escape))) ||
        (KEY_TAB === key && (hasValue('\t', escape) || hasValue(9, escape))) ||
        (hasValue(key, escape) || hasValue(keyCode, escape))
    ) {
        setValueInMap(toValue(v = getText($)), v, _tags);
        return (focusTo(picker).text = ""), offEventDefault(e);
    }
    delay(() => getText($, 0) ? setStyle(hint, 'visibility', 'hidden') : letStyle(hint, 'visibility'), 1)();
    let caretIsToTheFirst = "" === getCharBeforeCaret($),
        tagFirst, tagLast,
        textIsVoid = null === getText($, 0);
    if (keyIsShift) {
        if (KEY_TAB === key) {
            selectToNone();
        } else if (KEY_ARROW_LEFT === key) {
            exit = true;
            selectToNone();
            tagLast = toValueLastFromMap(_tags);
            tagLast && focusTo(tagLast[2]) && setAria(tagLast[2], 'selected', true);
        }
    } else if (keyIsCtrl) {
        if (KEY_A === key && textIsVoid && _tags.count()) {
            exit = true;
            forEachMap(_tags, v => (setAria(v[2], 'selected', true), focusTo(v[2]), selectTo(v[2])));
        } else if (KEY_ARROW_LEFT === key) {
            exit = true;
            tagLast = toValueLastFromMap(_tags);
            tagLast && focusTo(tagLast[2]);
        }
    } else {
        if (KEY_ENTER === key) {
            // TODO
        } else if (KEY_TAB === key) {
            selectToNone();
        } else if (caretIsToTheFirst || textIsVoid) {
            if (KEY_ARROW_LEFT === key) {
                exit = true;
                tagLast = toValueLastFromMap(_tags);
                tagLast && focusTo(tagLast[2]);
            } else if (KEY_DELETE_LEFT === key) {
                if (tagLast = toValueLastFromMap(_tags)) {
                    if (!textIsVoid && getHTML($) === getSelection($)) {
                        // Text was all selected
                    } else {
                        exit = true;
                        letValueInMap(getTagValue(tagLast[2]), _tags);
                    }
                }
            }
        }
    }
    exit && offEventDefault(e);
}

function onKeyUpTag(e) {
    let $ = this,
        key = e.key,
        keyIsCtrl = _keyIsCtrl = e.ctrlKey,
        keyIsShift = _keyIsShift = e.shiftKey,
        picker = getReference($),
        {_tags} = picker, selected = 0;
    forEachMap(_tags, v => {
        if (getAria(v[2], 'selected')) {
            ++selected;
        }
    });
    if (selected < 2 && !_keyIsCtrl && !_keyIsShift && KEY_ENTER !== key && ' ' !== key) {
        letAria($, 'selected');
    }
}

function onKeyUpTextInput(e) {
    _keyIsCtrl = e.ctrlKey;
    _keyIsShift = e.shiftKey;
}

function onPasteTag(e) {
    offEventDefault(e);
    let $ = this,
        picker = getReference($),
        {_tags, state} = picker,
        {join} = state;
    forEachArray(e.clipboardData.getData('text/plain').split(join), v => {
        if (!hasKeyInMap(v = toValue(v.trim()), _tags)) {
            _tags.set(v, v, 0);
        }
    });
    forEachMap(_tags, v => letAria(v[2], 'selected'));
    focusTo(picker.fire('change', [picker.value]));
}

function onPasteTextInput(e) {
    offEventDefault(e);
    let $ = this,
        picker = getReference($),
        {_mask, _tags, state} = picker,
        {hint} = _mask,
        {join} = state;
    delay(() => getText($, 0) ? setStyle(hint, 'visibility', 'hidden') : letStyle(hint, 'visibility'), 1)();
    insertAtSelection($, e.clipboardData.getData('text/plain'));
    forEachArray((getText($) + "").split(join), v => {
        if (!hasKeyInMap(v = toValue(v.trim()), _tags)) {
            _tags.set(v, v, 0);
        }
    });
    forEachMap(_tags, v => letAria(v[2], 'selected'));
    picker.fire('change', [picker.value]).text = "";
}

function onPointerDownMask(e) {
    let {target} = e;
    if ('option' === getRole(target) || getParent(target, '[role=option]')) {} else {
        focusTo(getReference(this)), offEventDefault(e);
    }
}

function onPointerDownTag(e) {
    offEventDefault(e);
    let $ = this,
        picker = getReference($),
        {_tags} = picker;
    focusTo($);
    if (!_keyIsCtrl && !_keyIsShift) {
        forEachMap(_tags, v => letAria(v[2], 'selected'));
    }
    if (_keyIsCtrl) {
        setAria($, 'selected', true);
    } else if (_keyIsShift) {
        // TODO
    }
}

function onPointerDownTagX(e) {
    let $ = this,
        tag = getParent($),
        picker = getReference(tag),
        {_tags} = picker;
    offEvent('mousedown', $, onPointerDownTagX);
    offEvent('touchstart', $, onPointerDownTagX);
    letValueInMap(getTagValue(tag), _tags);
    focusTo(picker), offEventDefault(e);
}

function onResetForm() {
    getReference(this).reset();
}

function onSubmitForm(e) {
    console.log('submit');
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
    // Special case for `state.escape`: replace instead of join the value(s)
    if (isObject(state) && state.escape) {
        newState.escape = state.escape;
    }
    return $.attach(self, newState);
}

function TagPickerTags(of, tags) {
    const $ = this;
    // Return new instance if `TagPickerTags` was called without the `new` operator
    if (!isInstance($, TagPickerTags)) {
        return new TagPickerTags(of, tags);
    }
    $.of = of;
    $.values = new Map;
    if (tags) {
        createTags(of, tags);
    }
    return $;
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
    'tags': null,
    'with': []
};

TagPicker.version = '%(version)';

setObjectAttributes(TagPicker, {
    name: {
        value: name
    }
}, 1);

setObjectAttributes(TagPicker, {
    active: {
        get: function () {
            return this._active;
        },
        set: function (value) {
            let $ = this;
            return $;
        }
    },
    fix: {
        get: function () {
            return this._fix;
        },
        set: function (value) {
            let $ = this;
            return $;
        }
    },
    max: {
        get: function () {
        },
        set: function (value) {
            let $ = this;
            return $;
        }
    },
    min: {
        get: function () {
        },
        set: function (value) {
            let $ = this;
            return $;
        }
    },
    tags: {
        get: function () {
            return this._tags;
        },
        set: function (options) {
            let $ = this, tagsValues = [];
            forEachMap($._tags, v => tagsValues.push(getTagValue(v[2], 1)));
            return $.fire('set.tags', [tagsValues]);
        }
    },
    text: {
        get: function () {
            return getText(this._mask.input);
        },
        set: function (value) {
            let $ = this,
                {_active, _mask} = $,
                {hint, input} = _mask, v;
            if (!_active) {
                return $;
            }
            setText(input, v = fromValue(value));
            return (v ? setStyle(hint, 'visibility', 'hidden') : letStyle(hint, 'visibility')), $;
        }
    },
    value: {
        get: function () {
            let value = getValue(this.self);
            return "" !== value ? value : null;
        },
        set: function (value) {
            let $ = this,
                {_tags, state} = $,
                {join} = state;
            $.value && forEachArray($.value.split(join), v => _tags.let(v, 0));
            value && forEachArray(value.split(join), v => _tags.set(v, v, 0));
            return $.fire('change', [$.value]);
        }
    }
});

TagPicker._ = setObjectMethods(TagPicker, {
    attach: function (self, state) {
        let $ = this;
        self = self || $.self;
        if (state && isString(state)) {
            state = {
                join: state
            };
        }
        state = fromStates({}, $.state, state || {});
        $._tags = new TagPickerTags($);
        $._value = null;
        $.self = self;
        $.state = state;
        let {max, min, n} = state,
            isDisabledSelf = isDisabled(self),
            isReadOnlySelf = isReadOnly(self),
            isRequiredSelf = isRequired(self),
            theInputPlaceholder = self.placeholder,
            theInputValue = getValue(self);
        $._active = !isDisabledSelf && !isReadOnlySelf;
        $._fix = isReadOnlySelf;
        if (isRequiredSelf && min < 1) {
            state.min = min = 1; // Force minimum tag(s) to insert to be `1`
        }
        const form = getParentForm(self);
        const mask = setElement('div', {
            'aria': {
                'disabled': isDisabledSelf ? TOKEN_TRUE : false,
                'multiselectable': TOKEN_TRUE,
                'readonly': isReadOnlySelf ? TOKEN_TRUE : false
            },
            'class': n,
            'role': 'listbox'
        });
        $.mask = mask;
        const maskFlex = setElement('span', {
            'class': n + '__flex',
            'role': 'none'
        });
        const text = setElement('span', {
            'class': n + '__text',
            'role': 'none'
        });
        const textInput = setElement('span', {
            'aria': {
                'disabled': isDisabledSelf ? TOKEN_TRUE : false,
                'multiline': TOKEN_FALSE,
                'placeholder': theInputPlaceholder,
                'readonly': isReadOnlySelf ? TOKEN_TRUE : false,
            },
            'autocapitalize': 'off',
            'contenteditable': isDisabledSelf || isReadOnlySelf ? false : "",
            'role': 'textbox',
            'spellcheck': TOKEN_FALSE,
            'tabindex': isReadOnlySelf ? 0 : false
        });
        const textInputHint = setElement('span', theInputPlaceholder + "", {
            'aria': {
                'hidden': TOKEN_TRUE
            }
        });
        setChildLast(mask, maskFlex);
        setChildLast(maskFlex, text);
        setChildLast(text, textInput);
        setChildLast(text, textInputHint);
        setAria(self, 'hidden', true);
        setClass(self, n + '__self');
        setReference(textInput, $);
        setNext(self, mask);
        setChildLast(mask, self);
        if (form) {
            onEvent('reset', form, onResetForm);
            onEvent('submit', form, onSubmitForm);
            setID(form);
            setReference(form, $);
        }
        onEvent('beforeinput', textInput, onBeforeInputTextInput);
        onEvent('cut', textInput, onCutTextInput);
        onEvent('focus', self, onFocusSelf);
        onEvent('focus', textInput, onFocusTextInput);
        onEvent('keydown', textInput, onKeyDownTextInput);
        onEvent('keyup', textInput, onKeyUpTextInput);
        onEvent('mousedown', mask, onPointerDownMask);
        onEvent('paste', textInput, onPasteTextInput);
        onEvent('touchstart', mask, onPointerDownMask);
        self.tabIndex = -1;
        setReference(mask, $);
        $._mask = {
            flex: maskFlex,
            hint: textInputHint,
            input: textInput,
            of: self,
            self: mask,
            text: text
        };
        // Re-assign some state value(s) using the setter to either normalize or reject the initial value
        // $.max = isMultipleSelect ? (max ?? Infinity) : 1;
        // $.min = isInputSelf ? 0 : (min ?? 1);
        let {_active} = $,
            {join, tags} = state, tagsValues;
        // Force the `this._active` value to `true` to set the initial value
        $._active = true;
        // Attach the current tag(s)
        tagsValues = createTags($, tags || (theInputValue ? theInputValue.split(join) : []));
        $._value = tagsValues.join(join);
        // After the initial value has been set, restore the previous `this._active` value
        $._active = _active;
        // Force `id` attribute(s)
        setAria(textInput, 'controls', getID(setID(maskFlex)));
        setID(mask);
        setID(self);
        setID(textInput);
        setID(textInputHint);
        // Attach extension(s)
        if (isSet(state) && isArray(state.with)) {
            forEachArray(state.with, (v, k) => {
                if (isString(v)) {
                    v = OptionPicker[v];
                }
                // `const Extension = function (self, state = {}) {}`
                if (isFunction(v)) {
                    v.call($, self, state);
                // `const Extension = {attach: function (self, state = {}) {}, detach: function (self, state = {}) {}}`
                } else if (isObject(v) && isFunction(v.attach)) {
                    v.attach.call($, self, state);
                }
            });
        }
        return $;
    },
    focus: function (mode) {
        let $ = this,
            {_mask} = $,
            {input} = _mask;
        return focusTo(input), selectTo(input, mode), $;
    },
    reset: function (focus, mode) {
        let $ = this,
            {_active} = $;
        if (!_active) {
            return $;
        }
        $.value = $._value;
        return focus ? $.focus(mode) : $;
    }
});

setObjectAttributes(TagPickerTags, {
    name: {
        value: name + 'Tags'
    }
}, 1);

TagPickerTags._ = setObjectMethods(TagPickerTags, {
    at: function (key) {
        return getValueInMap(toValue(key), this.values);
    },
    count: function () {
        return toMapCount(this.values);
    },
    delete: function (key, _fireHook = 1) {
        let $ = this,
            {of, values} = $,
            {_active, _mask, self, state} = of,
            {join, n} = state, r, tagsValues = [];
        if (!_active) {
            return false;
        }
        if (!isSet(key)) {
            forEachMap(values, (v, k) => $.let(k, 0));
            return _fireHook && of.fire('let.tags', [[]]) && 0 === $.count();
        }
        if (!(r = getValueInMap(key = toValue(key), values))) {
            return (_fireHook && of.fire('not.tag', [key])), false;
        }
        let tag = r[2],
            tagX = getElement('.' + n + '__x', tag);
        offEvent('beforeinput', tag, onBeforeInputTag);
        offEvent('blur', tag, onBlurTag);
        offEvent('cut', tag, onCutTag);
        offEvent('focus', tag, onFocusTag);
        offEvent('keydown', tag, onKeyDownTag);
        offEvent('keyup', tag, onKeyUpTag);
        offEvent('mousedown', tag, onPointerDownTag);
        offEvent('mousedown', tagX, onPointerDownTagX);
        offEvent('paste', tag, onPasteTag);
        offEvent('touchstart', tag, onPointerDownTag);
        offEvent('touchstart', tagX, onPointerDownTagX);
        letElement(tagX), letElement(tag);
        r = letValueInMap(key, values);
        state.tags = values;
        forEachMap(values, (v, k) => tagsValues.push(fromValue(k)));
        setValue(self, tagsValues = tagsValues.join(join));
        return (_fireHook && of.fire('let.tag', [key]).fire('change', ["" !== tagsValues ? tagsValues : null])), r;
    },
    get: function (key) {
        let $ = this,
            {values} = $,
            value = getValueInMap(toValue(key), values);
        return value ? getElementIndex(value[2]) : -1;
    },
    has: function (key) {
        return hasKeyInMap(toValue(key), this.values);
    },
    let: function (key, _fireHook = 1) {
        return this.delete(key, _fireHook);
    },
    set: function (key, value, _fireHook = 1) {
        let $ = this,
            {of, values} = $,
            {_active} = of;
        if (!_active) {
            return false;
        }
        if ($.has(key = toValue(key))) {
            return (_fireHook && of.fire('has.tag', [key])), false;
        }
        let {_mask, self, state} = of,
            {text} = _mask,
            {join, n} = state,
            classes, styles, tag, tagText, tagX, tagsValues = [];
        // `picker.tags.set('asdf')`
        if (!isSet(value)) {
            value = [key, {}];
        // `picker.tags.set('asdf', 'asdf')`
        } else if (isFloat(value) || isInteger(value) || isString(value)) {
            value = [value, {}];
        // `picker.tags.set('asdf', [ … ])`
        } else {}
        let {value: v} = value[1];
        v = fromValue(v || key);
        tag = value[2] || setElement('data', {
            'class': n + '__tag',
            // Make the tag “content editable”, so that the “Cut” option is available in the context menu, but do not
            // allow user(s) to edit the tag text. We just want to make sure that the “Cut” option is available.
            'contenteditable': TOKEN_TRUE,
            'role': 'option',
            'tabindex': -1,
            'title': getState(value[1], 'title') ?? false,
            'value': v
        });
        tagText = value[2] ? getElement('.' + n + '__v', value[2]) : setElement('span', fromValue(value[0]), {
            'class': n + '__v',
            'role': 'none'
        });
        n += '__x';
        tagX = value[2] ? getElement('.' + n, value[2]) : setElement('span', {
            'aria': {
                'hidden': TOKEN_TRUE
            },
            'class': n,
            'tabindex': -1
        });
        if (classes = getState(value[1], 'class')) {
            setClasses(tag, classes);
        }
        if (isObject(styles = getState(value[1], 'style'))) {
            setStyles(tag, styles);
        } else if (styles) {
            setAttribute(tag, 'style', styles);
        }
        // Force `id` attribute(s)
        setID(tagText);
        setID(tagX);
        setAria(tagX, 'controls', getID(setID(tag)));
        if (!value[2]) {
            onEvent('beforeinput', tag, onBeforeInputTag);
            onEvent('blur', tag, onBlurTag);
            onEvent('cut', tag, onCutTag);
            onEvent('focus', tag, onFocusTag);
            onEvent('keydown', tag, onKeyDownTag);
            onEvent('keyup', tag, onKeyUpTag);
            onEvent('mousedown', tag, onPointerDownTag);
            onEvent('mousedown', tagX, onPointerDownTagX);
            onEvent('paste', tag, onPasteTag);
            onEvent('touchstart', tag, onPointerDownTag);
            onEvent('touchstart', tagX, onPointerDownTagX);
        }
        setChildLast(tag, tagText);
        setChildLast(tag, tagX);
        setPrev(text, tag);
        setReference(tag, of);
        value[2] = tag;
        setValueInMap(key, value, values);
        state.tags = values;
        forEachMap(values, (v, k) => tagsValues.push(fromValue(k)));
        setValue(self, tagsValues = tagsValues.join(join));
        return (_fireHook && of.fire('set.tag', [key]).fire('change', ["" !== tagsValues ? tagsValues : null])), true;
    }
});

// In order for an object to be iterable, it must have a `Symbol.iterator` key
getPrototype(TagPickerTags)[Symbol.iterator] = function () {
    return this.values[Symbol.iterator]();
};

TagPicker.Tags = TagPickerTags;

export default TagPicker;