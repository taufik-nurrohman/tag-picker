import {forEachArray, forEachMap, getPrototype, getReference, setObjectAttributes, setObjectMethods, setReference} from '@taufik-nurrohman/f';
import {fromStates, fromValue} from '@taufik-nurrohman/from';
import {getAria, getID, getParentForm, getText, getValue, isDisabled, isReadOnly, isRequired, letStyle, setAria, setChildLast, setClass, setElement, setID, setNext, setStyle, setText, setValue} from '@taufik-nurrohman/document';
import {hook} from '@taufik-nurrohman/hook';
import {isArray, isInstance, isObject, isSet, isString} from '@taufik-nurrohman/is';
import {toValue} from '@taufik-nurrohman/to';

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
            return (v ? setStyle(hint, 'color', 'transparent') : letStyle(hint, 'color')), $;
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

setObjectAttributes(TagPickerTags, {
    name: {
        value: name + 'Tags'
    }
}, 1);

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
            'class': n + '__text',
            'tabindex': 0
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
        if (form) {
            setID(form);
            setReference(form, $);
        }
        self.tabIndex = -1;
        setReference(mask, $);
        let _mask = {};
        _mask.flex = maskFlex;
        _mask.hint = textInputHint;
        _mask.input = textInput;
        _mask.of = self;
        _mask.self = mask;
        _mask.values = new Set;
        _mask.text = text;
        $._mask = _mask;
        // Re-assign some state value(s) using the setter to either normalize or reject the initial value
        // $.max = isMultipleSelect ? (max ?? Infinity) : 1;
        // $.min = isInputSelf ? 0 : (min ?? 1);
        let {_active} = $,
            {tags} = state, values = [];
        // Force the `this._active` value to `true` to set the initial value
        $._active = true;
        // Attach the current tag(s)
        if (tags) {
            values = createTagsFrom($, tags, maskFlex);
        } else if (theInputValue) {
            values = createTagsFrom($, theInputValue.split(state.join), maskFlex);
        }
        $._value = values.join(state.join);
        // After the initial value has been set, restore the previous `this._active` value
        $._active = _active;
        // Force `id` attribute(s)
        setAria(self, 'hidden', true);
        setAria(textInput, 'controls', getID(maskFlex));
        setID(mask);
        setID(maskFlex);
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
    }
});

// In order for an object to be iterable, it must have a `Symbol.iterator` key
getPrototype(TagPickerTags)[Symbol.iterator] = function () {
    return this.values[Symbol.iterator]();
};

TagPicker.Tags = TagPickerTags;

export default TagPicker;