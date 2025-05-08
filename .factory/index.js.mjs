import {/* focusTo, */getCharBeforeCaret, getSelection, insertAtSelection, selectTo, selectToNone} from '@taufik-nurrohman/selection';
import {delay} from '@taufik-nurrohman/tick';
import {forEachArray, forEachMap, forEachObject, getPrototype, getReference, getValueInMap, hasKeyInMap, letValueInMap, setObjectAttributes, setObjectMethods, setReference, setValueInMap, toValueFirstFromMap, toValueLastFromMap} from '@taufik-nurrohman/f';
import {fromStates, fromValue} from '@taufik-nurrohman/from';
import {getAria, getElement, getElementIndex, getHTML, getID, getNext, getParent, getParentForm, getPrev, getRole, getState, getText, getValue, isDisabled, isReadOnly, isRequired, letAria, letAttribute, letClass, letElement, letStyle, setAria, setAttribute, setChildLast, setClass, setClasses, setDatum, setElement, setID, setNext, setPrev, setStyle, setText, setValue} from '@taufik-nurrohman/document';
import {hasValue} from '@taufik-nurrohman/has';
import {hook} from '@taufik-nurrohman/hook';
import {isArray, isFloat, isFunction, isInstance, isInteger, isObject, isSet, isString} from '@taufik-nurrohman/is';
import {offEvent, offEventDefault, onEvent} from '@taufik-nurrohman/event';
import {toCount, toMapCount, toValue} from '@taufik-nurrohman/to';
import {toPattern} from '@taufik-nurrohman/pattern';

const EVENT_DOWN = 'down';
const EVENT_UP = 'up';

const EVENT_BLUR = 'blur';
const EVENT_COPY = 'copy';
const EVENT_CUT = 'cut';
const EVENT_FOCUS = 'focus';
const EVENT_INPUT_START = 'beforeinput';
const EVENT_KEY = 'key';
const EVENT_KEY_DOWN = EVENT_KEY + EVENT_DOWN;
const EVENT_KEY_UP = EVENT_KEY + EVENT_UP;
const EVENT_MOUSE = 'mouse';
const EVENT_MOUSE_DOWN = EVENT_MOUSE + EVENT_DOWN;
const EVENT_MOUSE_UP = EVENT_MOUSE + EVENT_UP;
const EVENT_PASTE = 'paste';
const EVENT_RESET = 'reset';
const EVENT_SUBMIT = 'submit';
const EVENT_TOUCH = 'touch';
const EVENT_TOUCH_END = EVENT_TOUCH + 'end';
const EVENT_TOUCH_START = EVENT_TOUCH + 'start';

const KEY_DOWN = 'Down';
const KEY_LEFT = 'Left';
const KEY_RIGHT = 'Right';
const KEY_UP = 'Up';

const KEY_A = 'a';
const KEY_ARROW = 'Arrow';
const KEY_ARROW_LEFT = KEY_ARROW + KEY_LEFT;
const KEY_ARROW_RIGHT = KEY_ARROW + KEY_RIGHT;
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

let _keyIsCtrl, _keyIsShift, _keyOverTag;

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

// Better mobile support
function onBeforeInputTextInput(e) {
    let $ = this,
        {data, inputType} = e,
        picker = getReference($),
        {_active, _mask, _tags, state} = picker,
        {hint} = _mask,
        {escape} = state, tagLast, exit, key, v;
    key = isString(data) && 1 === toCount(data) ? data : 0;
    if (
        (KEY_ENTER === key && (hasValue('\n', escape) || hasValue(13, escape))) ||
        (KEY_TAB === key && (hasValue('\t', escape) || hasValue(9, escape))) ||
        (0 !== key && hasValue(key, escape))
    ) {
        exit = true;
        setValueInMap(toValue(v = getText($)), v, _tags);
        focusTo(picker).text = "";
    } else if ('deleteContentBackward' === inputType && !getText($, 0)) {
        letStyle(hint, 'visibility');
        if (tagLast = toValueLastFromMap(_tags)) {
            exit = true;
            letValueInMap(getTagValue(tagLast[2]), _tags);
        }
    } else if ('insertText' === inputType) {
        setStyle(hint, 'visibility', 'hidden');
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

function onCopyTag(e) {
    offEventDefault(e);
    let $ = this,
        picker = getReference($),
        {_tags, state} = picker,
        {join} = state, selected = [];
    setAria($, 'selected', true);
    forEachMap(_tags, v => {
        if (getAria(v[2], 'selected')) {
            selected.push(getTagValue(v[2]));
        }
    });
    e.clipboardData.setData('text/plain', selected.join(join));
}

function onCutTag(e) {
    offEventDefault(e);
    let $ = this,
        picker = getReference($),
        {_tags} = picker;
    onCopyTag.call($, e);
    forEachMap(_tags, v => {
        if (getAria(v[2], 'selected')) {
            letValueInMap(getTagValue(v[2]), _tags);
        }
    });
    focusTo(picker.fire('change', [picker.value]));
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
    let $ = _keyOverTag = this,
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
        exit, tagFirst, tagLast, tagNext, tagPrev;
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
        } else if (KEY_BEGIN === key) {
            exit = true;
            tagFirst = toValueFirstFromMap(_tags);
            tagFirst && focusTo(tagFirst[2]);
        } else if (KEY_END === key) {
            exit = true;
            tagLast = toValueLastFromMap(_tags);
            tagLast && focusTo(tagLast[2]);
        } else if (KEY_ENTER === key || ' ' === key) {
            exit = true;
            getAria($, 'selected') ? letAria($, 'selected') : setAria($, 'selected', true);
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
        } else if (KEY_BEGIN === key) {
            exit = true;
            tagFirst = toValueFirstFromMap(_tags);
            tagFirst && focusTo(tagFirst[2]);
        } else if (KEY_END === key) {
            exit = true;
            tagLast = toValueLastFromMap(_tags);
            tagLast && focusTo(tagLast[2]);
        } else if (KEY_DELETE_LEFT === key) {
            exit = true;
            letValueInMap(getTagValue($), _tags);
            tagPrev = getPrev($);
            forEachMap(_tags, v => {
                if (getAria(v[2], 'selected')) {
                    letValueInMap(getTagValue(v[2]), _tags);
                    tagPrev = getPrev(v[2]);
                }
            });
            focusTo(tagPrev || picker), picker.fire('change', [picker.value]);
        } else if (KEY_DELETE_RIGHT === key) {
            exit = true;
            letValueInMap(getTagValue($), _tags);
            tagNext = getNext($);
            forEachMap(_tags, v => {
                if (getAria(v[2], 'selected')) {
                    letValueInMap(getTagValue(v[2]), _tags);
                    tagNext = getNext(v[2]);
                }
            });
            focusTo(tagNext && tagNext !== text ? tagNext : picker), picker.fire('change', [picker.value]);
        } else if (KEY_ENTER === key || ' ' === key) {
            exit = true;
            getAria($, 'selected') ? letAria($, 'selected') : setAria($, 'selected', true);
        } else if (KEY_ESCAPE === key || KEY_TAB === key) {
            exit = true;
            selectToNone(), focusTo(picker);
        // Any type-able key
        } else if (1 === toCount(key)) {
            forEachMap(_tags, v => {
                if (getAria(v[2], 'selected')) {
                    letValueInMap(getTagValue(v[2]), _tags);
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
        {_active, _fix, self} = picker, form, submit;
    if (!_active) {
        if (_fix && KEY_TAB === key) {
            return selectToNone();
        }
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
        textIsVoid = !getText($, 0);
    if (keyIsShift) {
        if (KEY_ENTER === key) {
            exit = true;
        } else if (KEY_TAB === key) {
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
        } else if (KEY_BEGIN === key) {
            exit = true;
            tagFirst = toValueFirstFromMap(_tags);
            tagFirst && focusTo(tagFirst[2]);
        } else if (KEY_ENTER === key) {
            exit = true;
        }
    } else {
        if (KEY_BEGIN === key) {
            exit = true;
            tagFirst = toValueFirstFromMap(_tags);
            tagFirst && focusTo(tagFirst[2]);
        } else if (KEY_ENTER === key) {
            exit = true;
            if ((form = getParentForm(self)) && isFunction(form.requestSubmit)) {
                // <https://developer.mozilla.org/en-US/docs/Glossary/Submit_button>
                submit = getElement('button:not([type]),button[type=submit],input[type=image],input[type=submit]', form);
                submit ? form.requestSubmit(submit) : form.requestSubmit();
            }
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
    _keyOverTag = 0;
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
            setValueInMap(v, v, _tags);
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
            setValueInMap(v, v, _tags);
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
    focusTo($), selectTo($);
    if (!_keyIsCtrl) {
        forEachMap(_tags, v => letAria(v[2], 'selected'));
    }
    if (_keyIsCtrl) {
        setAria($, 'selected', true);
    } else if (_keyIsShift && _keyOverTag) {
        let tagEndIndex = getElementIndex($),
            tagStartIndex = getElementIndex(_keyOverTag),
            tagCurrent = _keyOverTag, tagNext, tagPrev;
        setAria($, 'selected', true);
        setAria(_keyOverTag, 'selected', true);
        // Select to the right
        if (tagEndIndex > tagStartIndex) {
            while (tagNext = getNext(tagCurrent)) {
                if ($ === tagNext) {
                    break;
                }
                setAria(tagCurrent = tagNext, 'selected', true);
            }
        // Select to the left
        } else if (tagEndIndex < tagStartIndex) {
            while (tagPrev = getPrev(tagCurrent)) {
                if ($ === tagPrev) {
                    break;
                }
                setAria(tagCurrent = tagPrev, 'selected', true);
            }
        }
    }
}

function onPointerDownTagX(e) {
    let $ = this,
        tag = getParent($),
        picker = getReference(tag),
        {_tags} = picker;
    letValueInMap(getTagValue(tag), _tags);
    focusTo(picker), offEventDefault(e);
}

function onResetForm() {
    getReference(this).reset();
}

function onSubmitForm(e) {
    let $ = this,
        picker = getReference($),
        {_tags, max, min} = picker,
        count = _tags.count();
    if (count > max) {
        picker.fire('max.tags', [count, max]).focus(), offEventDefault(e);
    } else if (count < min) {
        picker.fire('min.tags', [count, min]).focus(), offEventDefault(e);
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
            let $ = this,
                {_mask, mask, self} = $,
                {input} = _mask,
                v = !!value;
            self.disabled = !($._active = v);
            if (v) {
                letAria(input, 'disabled');
                letAria(mask, 'disabled');
                setAttribute(input, 'contenteditable', "");
            } else {
                letAttribute(input, 'contenteditable');
                setAria(input, 'disabled', true);
                setAria(mask, 'disabled', true);
            }
            return $;
        }
    },
    fix: {
        get: function () {
            return this._fix;
        },
        set: function (value) {
            let $ = this,
                {_mask, mask, self} = $,
                {input} = _mask,
                v = !!value;
            $._active = !($._fix = self.readOnly = v);
            if (v) {
                letAttribute(input, 'contenteditable');
                setAria(input, 'readonly', true);
                setAria(mask, 'readonly', true);
                setAttribute(input, 'tabindex', 0);
            } else {
                letAria(input, 'readonly');
                letAria(mask, 'readonly');
                letAttribute(input, 'tabindex');
                setAttribute(input, 'contenteditable', "");
            }
            return $;
        }
    },
    max: {
        get: function () {
            let {max} = this.state;
            return Infinity === max || (isInteger(max) && max >= 0) ? max : Infinity;
        },
        set: function (value) {
            let $ = this;
            return ($.state.max = isInteger(value) && value >= 0 ? value : Infinity), $;
        }
    },
    min: {
        get: function () {
            let {min} = this.state;
            return isInteger(min) && min >= 0 ? min : 0;
        },
        set: function (value) {
            let $ = this;
            return ($.state.min = isInteger(value) && value >= 0 ? value : 0), $;
        }
    },
    tags: {
        get: function () {
            return this._tags;
        },
        set: function (tags) {
            let $ = this, tagsValues = [];
            createTags($, tags);
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
            $.value && forEachArray($.value.split(join), v => letValueInMap(v, _tags));
            value && forEachArray(value.split(join), v => setValueInMap(v, v, _tags));
            return $.fire('change', [$.value]);
        }
    },
    vital: {
        get: function () {
            return this._vital;
        },
        set: function (value) {
            let $ = this,
                {_mask, mask, min, self} = $,
                {input} = _mask,
                v = !!value;
            self.required = v;
            if (v) {
                if (0 === min) {
                    $.min = 1;
                }
                setAria(input, 'required', true);
                setAria(mask, 'required', true);
            } else {
                $.min = 0;
                letAria(input, 'required');
                letAria(mask, 'required');
            }
            return $;
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
            theInputID = self.id,
            theInputName = self.name,
            theInputPlaceholder = self.placeholder,
            theInputValue = getValue(self);
        $._active = !isDisabledSelf && !isReadOnlySelf;
        $._fix = isReadOnlySelf;
        $._vital = isRequiredSelf;
        if (isRequiredSelf && min < 1) {
            state.min = min = 1; // Force minimum tag(s) to insert to be `1`
        }
        const form = getParentForm(self);
        const mask = setElement('div', {
            'aria': {
                'disabled': isDisabledSelf ? TOKEN_TRUE : false,
                'multiselectable': TOKEN_TRUE,
                'readonly': isReadOnlySelf ? TOKEN_TRUE : false,
                'required': isRequiredSelf ? TOKEN_TRUE : false
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
                'required': isRequiredSelf ? TOKEN_TRUE : false
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
            onEvent(EVENT_RESET, form, onResetForm);
            onEvent(EVENT_SUBMIT, form, onSubmitForm);
            setID(form);
            setReference(form, $);
        }
        onEvent(EVENT_CUT, textInput, onCutTextInput);
        onEvent(EVENT_FOCUS, self, onFocusSelf);
        onEvent(EVENT_FOCUS, textInput, onFocusTextInput);
        onEvent(EVENT_INPUT_START, textInput, onBeforeInputTextInput);
        onEvent(EVENT_KEY_DOWN, textInput, onKeyDownTextInput);
        onEvent(EVENT_KEY_UP, textInput, onKeyUpTextInput);
        onEvent(EVENT_MOUSE_DOWN, mask, onPointerDownMask);
        onEvent(EVENT_PASTE, textInput, onPasteTextInput);
        onEvent(EVENT_TOUCH_START, mask, onPointerDownMask);
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
        $.max = Infinity === max || (isInteger(max) && max >= 0) ? max : Infinity;
        $.min = isInteger(min) && min >= 0 ? min : 0;
        let {_active} = $,
            {join} = state, tagsValues;
        // Force the `this._active` value to `true` to set the initial value
        $._active = true;
        // Attach the current tag(s)
        tagsValues = createTags($, (theInputValue ? theInputValue.split(join) : []));
        $._value = tagsValues.join(join);
        // After the initial value has been set, restore the previous `this._active` value
        $._active = _active;
        // Force `id` attribute(s)
        setAria(textInput, 'controls', getID(setID(maskFlex)));
        setID(mask);
        setID(self);
        setID(textInput);
        setID(textInputHint);
        theInputID && setDatum(mask, 'id', theInputID);
        theInputName && setDatum(mask, 'name', theInputName);
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
    blur: function () {
        selectToNone();
        let $ = this,
            {_mask, _tags} = $,
            {input} = _mask;
        forEachMap(_tags, v => v[2].blur());
        return input.blur(), $;
    },
    detach: function () {
        let $ = this,
            {_mask, mask, self, state} = $,
            {input} = _mask;
        const form = getParentForm(self);
        $._active = false;
        $._tags = new TagPickerTags($);
        $._value = null;
        if (form) {
            offEvent(EVENT_RESET, form, onResetForm);
            offEvent(EVENT_SUBMIT, form, onSubmitForm);
        }
        offEvent(EVENT_CUT, input, onCutTextInput);
        offEvent(EVENT_FOCUS, self, onFocusSelf);
        offEvent(EVENT_FOCUS, input, onFocusTextInput);
        offEvent(EVENT_INPUT_START, input, onBeforeInputTextInput);
        offEvent(EVENT_KEY_DOWN, input, onKeyDownTextInput);
        offEvent(EVENT_KEY_UP, input, onKeyUpTextInput);
        offEvent(EVENT_MOUSE_DOWN, mask, onPointerDownMask);
        offEvent(EVENT_PASTE, input, onPasteTextInput);
        offEvent(EVENT_TOUCH_START, mask, onPointerDownMask);
        // Detach extension(s)
        if (isArray(state.with)) {
            forEachArray(state.with, (v, k) => {
                if (isString(v)) {
                    v = TagPicker[v];
                }
                if (isObject(v) && isFunction(v.detach)) {
                    v.detach.call($, self, state);
                }
            });
        }
        self.tabIndex = null;
        letAria(self, 'hidden');
        letClass(self, state.n + '__self');
        setNext(mask, self);
        letElement(mask);
        $._mask = {
            of: self
        };
        $.mask = null;
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
            {_active} = of;
        if (!_active) {
            return false;
        }
        let {_mask, min, self, state} = of,
            {join, n} = state,
            count, r, tagsValues = [];
        if ((count = $.count()) < min + 1) {
            return (_fireHook && of.fire('min.tags', [count, min])), false;
        }
        if (!isSet(key)) {
            forEachMap(values, (v, k) => $.let(k, 0));
            return (_fireHook && of.fire('let.tags', [[]]).fire('change', [null])), 0 === $.count();
        }
        if (!(r = getValueInMap(key = toValue(key), values))) {
            return (_fireHook && of.fire('not.tag', [key])), false;
        }
        let tag = r[2],
            tagX = getElement('.' + n + '__x', tag);
        offEvent(EVENT_BLUR, tag, onBlurTag);
        offEvent(EVENT_COPY, tag, onCopyTag);
        offEvent(EVENT_CUT, tag, onCutTag);
        offEvent(EVENT_FOCUS, tag, onFocusTag);
        offEvent(EVENT_INPUT_START, tag, onBeforeInputTag);
        offEvent(EVENT_KEY_DOWN, tag, onKeyDownTag);
        offEvent(EVENT_KEY_UP, tag, onKeyUpTag);
        offEvent(EVENT_MOUSE_DOWN, tag, onPointerDownTag);
        offEvent(EVENT_MOUSE_DOWN, tagX, onPointerDownTagX);
        offEvent(EVENT_PASTE, tag, onPasteTag);
        offEvent(EVENT_TOUCH_START, tag, onPointerDownTag);
        offEvent(EVENT_TOUCH_START, tagX, onPointerDownTagX);
        letElement(tagX), letElement(tag);
        r = letValueInMap(key, values);
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
        let {_mask, max, self, state} = of,
            {text} = _mask,
            {join, n, pattern} = state,
            count, r, tag, tagText, tagX, tagsValues = [];
        if ((count = $.count()) >= max) {
            return (_fireHook && of.fire('max.tags', [count, max])), false;
        }
        // `picker.tags.set('asdf')`
        if (!isSet(value)) {
            value = [key, {}];
        // `picker.tags.set('asdf', 'asdf')`
        } else if (isFloat(value) || isInteger(value) || isString(value)) {
            value = [value, {}];
        // `picker.tags.set('asdf', [ … ])`
        } else {}
        let {value: v} = value[1];
        if (null === key || "" === (v = fromValue(v || key).trim()) || (isString(pattern) && !toPattern(pattern).test(v))) {
            return (_fireHook && of.fire('not.tag', [key])), false;
        }
        if (isFunction(pattern)) {
            if (isArray(r = pattern.call(of, v))) {
                key = v = r[1] ? (r[1].value ?? r[0]) : r[0];
                value = r;
            } else if (isString(r)) {
                key = v = r;
                value[0] = r;
            }
        }
        if ($.has(key = toValue(key))) {
            return (_fireHook && of.fire('has.tag', [key])), false;
        }
        tag = value[2] || setElement('data', {
            'class': n + '__tag',
            // Make the tag “content editable”, so that the “Cut” option is available in the context menu, but do not
            // allow user(s) to edit the tag text. We just want to make sure that the “Cut” option is available.
            'contenteditable': TOKEN_TRUE,
            'role': 'option',
            'spellcheck': TOKEN_FALSE,
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
        // Force `id` attribute(s)
        setID(tagText);
        setID(tagX);
        setAria(tagX, 'controls', getID(setID(tag)));
        if (!value[2]) {
            onEvent(EVENT_BLUR, tag, onBlurTag);
            onEvent(EVENT_COPY, tag, onCopyTag);
            onEvent(EVENT_CUT, tag, onCutTag);
            onEvent(EVENT_FOCUS, tag, onFocusTag);
            onEvent(EVENT_INPUT_START, tag, onBeforeInputTag);
            onEvent(EVENT_KEY_DOWN, tag, onKeyDownTag);
            onEvent(EVENT_KEY_UP, tag, onKeyUpTag);
            onEvent(EVENT_MOUSE_DOWN, tag, onPointerDownTag);
            onEvent(EVENT_MOUSE_DOWN, tagX, onPointerDownTagX);
            onEvent(EVENT_PASTE, tag, onPasteTag);
            onEvent(EVENT_TOUCH_START, tag, onPointerDownTag);
            onEvent(EVENT_TOUCH_START, tagX, onPointerDownTagX);
        }
        setChildLast(tag, tagText);
        setChildLast(tag, tagX);
        setPrev(text, tag);
        setReference(tag, of);
        value[2] = tag;
        _fireHook && of.fire('is.tag', [key]);
        setValueInMap(key, value, values);
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