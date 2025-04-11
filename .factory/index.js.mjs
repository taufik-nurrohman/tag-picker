import {/* focusTo, */insertAtSelection, selectTo, selectToNone} from '@taufik-nurrohman/selection';
import {delay} from '@taufik-nurrohman/tick';
import {forEachArray, forEachMap, getPrototype, getReference, hasKeyInMap, letValueInMap, setObjectAttributes, setObjectMethods, setReference, setValueInMap} from '@taufik-nurrohman/f';
import {fromStates, fromValue} from '@taufik-nurrohman/from';
import {getAria, getElement, getElementIndex, getDatum, getID, getParent, getParentForm, getState, getText, getValue, isDisabled, isReadOnly, isRequired, letStyle, setAria, setAttribute, setChildLast, setClass, setClasses, setElement, setID, setNext, setPrev, setStyle, setStyles, setText, setValue} from '@taufik-nurrohman/document';
import {hasValue} from '@taufik-nurrohman/has';
import {hook} from '@taufik-nurrohman/hook';
import {isArray, isFloat, isInstance, isInteger, isObject, isSet, isString} from '@taufik-nurrohman/is';
import {offEvent, offEventDefault, onEvent} from '@taufik-nurrohman/event';
import {toCount, toValue} from '@taufik-nurrohman/to';

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

function createTags() {
    return [];
}

function createTagsFrom() {
    return [];
}

function focusTo(node) {
    return node.focus(), node;
}

function getTagValue(tag) {
    return getDatum(tag, 'value', false);
}

function onBeforeInputTextInput(e) {
    let $ = this,
        data = e.data,
        picker = getReference($),
        {_active, _mask, state, tags} = picker,
        {hint} = _mask,
        {escape} = state, exit, key;
    key = isString(data) && 1 === toCount(data) ? data : 0;
    picker._event = e;
    delay(() => getText($, 0) ? setStyle(hint, 'visibility', 'hidden') : letStyle(hint, 'visibility'), 1)();
    if (
        (KEY_ENTER === key && (hasValue('\n', escape) || hasValue(13, escape))) ||
        (KEY_TAB === key && (hasValue('\t', escape) || hasValue(9, escape))) ||
        (hasValue(key, escape))
    ) {
        exit = true;
        setValueInMap(toValue(v = getText($)), v, tags);
        picker.focus().text = "";
    }
    exit && offEventDefault(e);
}

function onCutTextInput() {
    let $ = this,
        picker = getReference($),
        {_mask} = picker,
        {hint} = _mask;
    delay(() => getText($, 0) ? setStyle(hint, 'visibility', 'hidden') : letStyle(hint, 'visibility'), 1)();
}

function onFocusSelf() {
    getReference(this).focus();
}

function onKeyDownTextInput(e) {
    let $ = this,
        key = e.key,
        keyCode = e.keyCode,
        keyIsCtrl = e.ctrlKey,
        keyIsShift = e.shiftKey,
        picker = getReference($),
        {_active, _mask, state, tags} = picker,
        {hint} = _mask,
        {escape} = state, exit, v;
    if (!_active) {
        return offEventDefault(e);
    }
    picker._event = e;
    delay(() => getText($, 0) ? setStyle(hint, 'visibility', 'hidden') : letStyle(hint, 'visibility'), 1)();
    if (
        (KEY_ENTER === key && (hasValue('\n', escape) || hasValue(13, escape))) ||
        (KEY_TAB === key && (hasValue('\t', escape) || hasValue(9, escape))) ||
        (hasValue(key, escape) || hasValue(keyCode, escape))
    ) {
        exit = true;
        setValueInMap(toValue(v = getText($)), v, tags);
        picker.focus().text = "";
    }
    exit && offEventDefault(e);
}

function onPasteTextInput(e) {
    offEventDefault(e);
    let $ = this,
        picker = getReference($),
        {_mask} = picker,
        {hint} = _mask;
    delay(() => getText($, 0) ? setStyle(hint, 'visibility', 'hidden') : letStyle(hint, 'visibility'), 1)();
    insertAtSelection($, e.clipboardData.getData('text/plain'));
}

function onPointerDownTagX(e) {
    let $ = this,
        tag = getParent($),
        picker = getReference(tag),
        {tags} = picker;
    picker._event = e;
    offEvent('mousedown', $, onPointerDownTagX);
    offEvent('touchstart', $, onPointerDownTagX);
    letValueInMap(toValue(getTagValue(tag)), tags);
    picker.focus(), offEventDefault(e);
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
        createTagsFrom(of, tags, of._mask.flex);
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
            let $ = this, values = [];
            forEachMap($._tags, v => values.push(getTagValue(v[2])));
            return $.fire('set.tags', [values]);
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
                {state} = $;
            if ($.value) {
                forEachArray($.value.split(state.join), v => $.let(v, 0));
            }
            forEachArray(value.split(state.join), v => $.set(v, 0));
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
        $._event = null;
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
                'disabled': isDisabledSelf ? 'true' : false,
                'multiselectable': 'true',
                'readonly': isReadOnlySelf ? 'true' : false
            },
            'class': n,
            'role': 'combobox'
        });
        $.mask = mask;
        const maskFlex = setElement('span', {
            'class': n + '__flex',
            'role': 'group'
        });
        const text = setElement('span', {
            'class': n + '__text'
        });
        const textInput = setElement('span', {
            'aria': {
                'disabled': isDisabledSelf ? 'true' : false,
                'multiline': 'false',
                'placeholder': theInputPlaceholder,
                'readonly': isReadOnlySelf ? 'true' : false,
            },
            'autocapitalize': 'off',
            'contenteditable': isDisabledSelf || isReadOnlySelf ? false : "",
            'role': 'textbox',
            'spellcheck': 'false',
            'tabindex': isReadOnlySelf ? 0 : false
        });
        const textInputHint = setElement('span', theInputPlaceholder + "", {
            'role': 'none'
        });
        setChildLast(mask, maskFlex);
        setChildLast(maskFlex, text);
        setChildLast(text, textInput);
        setChildLast(text, textInputHint);
        setReference(textInput, $);
        setClass(self, n + '__self');
        setNext(self, mask);
        setChildLast(mask, self);
        if (form) {
            setID(form);
            setReference(form, $);
        }
        onEvent('beforeinput', textInput, onBeforeInputTextInput);
        onEvent('cut', textInput, onCutTextInput);
        onEvent('focus', self, onFocusSelf);
        onEvent('keydown', textInput, onKeyDownTextInput);
        onEvent('paste', textInput, onPasteTextInput);
        self.tabIndex = -1;
        setReference(mask, $);
        $._mask = {
            flex: maskFlex,
            hint: textInputHint,
            input: textInput,
            of: self,
            self: mask,
            text: text,
            values: new Set
        };
        // Re-assign some state value(s) using the setter to either normalize or reject the initial value
        // $.max = isMultipleSelect ? (max ?? Infinity) : 1;
        // $.min = isInputSelf ? 0 : (min ?? 1);
        let {_active} = $,
            {join, tags} = state, values;
        // Force the `this._active` value to `true` to set the initial value
        $._active = true;
        // Attach the current tag(s)
        values = createTagsFrom($, tags || theInputValue.split(join), maskFlex);
        $._value = values.join(join);
        // After the initial value has been set, restore the previous `this._active` value
        $._active = _active;
        // Force `id` attribute(s)
        setAria(self, 'hidden', true);
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
    }
});

setObjectAttributes(TagPickerTags, {
    name: {
        value: name + 'Tags'
    }
}, 1);

setObjectMethods(TagPickerTags, {
    at: function (key) {
        return getValueInMap(toValue(key), this.values);
    },
    count: function () {
        return toMapCount(this.values);
    },
    delete: function (key, _fireValue = 1, _fireHook = 1) {
        console.log('delete ' + key);
    },
    get: function (key) {
        let $ = this,
            {values} = $,
            value = getValueInMap(toValue(key), values), parent;
        if (value && (parent = getParent(value[2])) && 'group' === getRole(parent)) {
            return [getElementIndex(value[2]), getElementIndex(parent)];
        }
        return value ? getElementIndex(value[2]) : -1;
    },
    has: function (key) {
        return hasKeyInMap(toValue(key), this.values);
    },
    let: function (key, _fireHook = 1) {
        return this.delete(key, 1, _fireHook);
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
        let {_mask, state} = of,
            {text} = _mask,
            {n} = state,
            classes, styles, tag, tagText, tagX;
        // `picker.tags.set('asdf')`
        if (!isSet(value)) {
            value = [key, {}];
        // `picker.tags.set('asdf', 'asdf')`
        } else if (isFloat(value) || isInteger(value) || isString(value)) {
            value = [value, {}];
        // `picker.tags.set('asdf', [ … ])`
        } else {}
        let {disabled, selected, value: v} = value[1];
        v = fromValue(v || key);
        tag = value[2] || setElement('span', {
            'aria': {
                'disabled': disabled ? 'true' : false,
                'selected': selected ? 'true' : false
            },
            'class': n + '__tag',
            'data': {
                'value': v
            },
            'role': 'option',
            'tabindex': disabled ? false : -1,
            'title': getState(value[1], 'title') ?? false
        });
        tagText = setElement('span', fromValue(value[0]));
        n += '__x';
        tagX = value[2] ? getElement('.' + n, value[2]) : setElement('span', {
            'class': n,
            'role': 'none',
            'tabindex': disabled ? false : -1
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
        if (!disabled && !value[2]) {
            // onEvent('focus', option, onFocusOption);
            // onEvent('keydown', option, onKeyDownOption);
            // onEvent('mousedown', option, onPointerDownOption);
            // onEvent('mouseup', option, onPointerUpOption);
            // onEvent('touchend', option, onPointerUpOption);
            // onEvent('touchstart', option, onPointerDownOption);
            onEvent('mousedown', tagX, onPointerDownTagX);
            onEvent('touchstart', tagX, onPointerDownTagX);
        }
        setChildLast(tag, tagText);
        setChildLast(tag, tagX);
        setPrev(text, tag);
        setReference(tag, of);
        value[2] = tag;
        setValueInMap(key, value, values);
        state.tags = values;
        return (_fireHook && of.fire('set.tag', [key])), true;
    }
});

TagPicker.Tags = TagPickerTags;

export default TagPicker;