/*!
 *
 * The MIT License (MIT)
 *
 * Copyright © 2024 Taufik Nurrohman <https://github.com/taufik-nurrohman>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
(function (g, f) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = f() : typeof define === 'function' && define.amd ? define(f) : (g = typeof globalThis !== 'undefined' ? globalThis : g || self, g.TagPicker = f());
})(this, (function () {
    'use strict';
    var hasValue = function hasValue(x, data) {
        return -1 !== data.indexOf(x);
    };
    var isArray = function isArray(x) {
        return Array.isArray(x);
    };
    var isDefined = function isDefined(x) {
        return 'undefined' !== typeof x;
    };
    var isFunction = function isFunction(x) {
        return 'function' === typeof x;
    };
    var isInstance = function isInstance(x, of) {
        return x && isSet(of) && x instanceof of ;
    };
    var isNull = function isNull(x) {
        return null === x;
    };
    var isObject = function isObject(x, isPlain) {
        if (isPlain === void 0) {
            isPlain = true;
        }
        if ('object' !== typeof x) {
            return false;
        }
        return isPlain ? isInstance(x, Object) : true;
    };
    var isSet = function isSet(x) {
        return isDefined(x) && !isNull(x);
    };
    var isString = function isString(x) {
        return 'string' === typeof x;
    };
    var toCaseKebab = function toCaseKebab(x, separator) {
        if (separator === void 0) {
            separator = '-';
        }
        return x.replace(/[A-Z]/g, function (m0) {
            return separator + toCaseLower(m0);
        }).replace(/\W+/g, separator);
    };
    var toCaseLower = function toCaseLower(x) {
        return x.toLowerCase();
    };
    var toCount = function toCount(x) {
        return x.length;
    };
    var toObjectKeys = function toObjectKeys(x) {
        return Object.keys(x);
    };
    var toObjectValues = function toObjectValues(x) {
        return Object.values(x);
    };
    var fromStates = function fromStates() {
        for (var _len = arguments.length, lot = new Array(_len), _key = 0; _key < _len; _key++) {
            lot[_key] = arguments[_key];
        }
        var out = lot.shift();
        for (var i = 0, j = toCount(lot); i < j; ++i) {
            for (var k in lot[i]) {
                // Assign value
                if (!isSet(out[k])) {
                    out[k] = lot[i][k];
                    continue;
                }
                // Merge array
                if (isArray(out[k]) && isArray(lot[i][k])) {
                    out[k] = [ /* Clone! */ ].concat(out[k]);
                    for (var ii = 0, jj = toCount(lot[i][k]); ii < jj; ++ii) {
                        if (!hasValue(lot[i][k][ii], out[k])) {
                            out[k].push(lot[i][k][ii]);
                        }
                    }
                    // Merge object recursive
                } else if (isObject(out[k]) && isObject(lot[i][k])) {
                    out[k] = fromStates({
                        /* Clone! */ }, out[k], lot[i][k]);
                    // Replace value
                } else {
                    out[k] = lot[i][k];
                }
            }
        }
        return out;
    };
    var fromValue = function fromValue(x) {
        if (isArray(x)) {
            return x.map(function (v) {
                return fromValue(x);
            });
        }
        if (isObject(x)) {
            for (var k in x) {
                x[k] = fromValue(x[k]);
            }
            return x;
        }
        if (false === x) {
            return 'false';
        }
        if (null === x) {
            return 'null';
        }
        if (true === x) {
            return 'true';
        }
        return "" + x;
    };
    var D = document;
    var W = window;
    var getChildFirst = function getChildFirst(parent) {
        return parent.firstElementChild || null;
    };
    var getName = function getName(node) {
        return toCaseLower(node && node.nodeName || "") || null;
    };
    var getNext = function getNext(node, anyNode) {
        return node['next' + (anyNode ? "" : 'Element') + 'Sibling'] || null;
    };
    var getParent = function getParent(node, query) {
        if (query) {
            return node.closest(query) || null;
        }
        return node.parentNode || null;
    };
    var getParentForm = function getParentForm(node) {
        var state = 'form';
        if (hasState(node, state) && state === getName(node[state])) {
            return node[state];
        }
        return getParent(node, state);
    };
    var getPrev = function getPrev(node, anyNode) {
        return node['previous' + ('Element') + 'Sibling'] || null;
    };
    var getText = function getText(node, trim) {
        if (trim === void 0) {
            trim = true;
        }
        var state = 'textContent';
        if (!hasState(node, state)) {
            return false;
        }
        var content = node[state];
        content = trim ? content.trim() : content;
        return "" !== content ? content : null;
    };
    var hasState = function hasState(node, state) {
        return state in node;
    };
    var letAttribute = function letAttribute(node, attribute) {
        return node.removeAttribute(attribute), node;
    };
    var letClass = function letClass(node, value) {
        return node.classList.remove(value), node;
    };
    var letElement = function letElement(node) {
        var parent = getParent(node);
        return node.remove(), parent;
    };
    var setAttribute = function setAttribute(node, attribute, value) {
        if (true === value) {
            value = attribute;
        }
        return node.setAttribute(attribute, fromValue(value)), node;
    };
    var setAttributes = function setAttributes(node, attributes) {
        var value;
        for (var attribute in attributes) {
            value = attributes[attribute];
            if (value || "" === value || 0 === value) {
                setAttribute(node, attribute, value);
            } else {
                letAttribute(node, attribute);
            }
        }
        return node;
    };
    var setChildLast = function setChildLast(parent, node) {
        return parent.append(node), node;
    };
    var setClass = function setClass(node, value) {
        return node.classList.add(value), node;
    };
    var setElement = function setElement(node, content, attributes) {
        node = isString(node) ? D.createElement(node) : node;
        if (isObject(content)) {
            attributes = content;
            content = false;
        }
        if (isString(content)) {
            setHTML(node, content);
        }
        if (isObject(attributes)) {
            setAttributes(node, attributes);
        }
        return node;
    };
    var setHTML = function setHTML(node, content, trim) {
        if (trim === void 0) {
            trim = true;
        }
        if (null === content) {
            return node;
        }
        var state = 'innerHTML';
        return hasState(node, state) && (node[state] = trim ? content.trim() : content), node;
    };
    var setNext = function setNext(current, node) {
        return getParent(current).insertBefore(node, getNext(current, true)), node;
    };
    var setPrev = function setPrev(current, node) {
        return getParent(current).insertBefore(node, current), node;
    };
    var setText = function setText(node, content, trim) {
        if (trim === void 0) {
            trim = true;
        }
        if (null === content) {
            return node;
        }
        var state = 'textContent';
        return hasState(node, state) && (node[state] = trim ? content.trim() : content), node;
    };
    var toggleClass = function toggleClass(node, name, force) {
        return node.classList.toggle(name, force), node;
    };

    function hook($, $$) {
        $$ = $$ || $;
        $$.fire = function (name, data) {
            var $ = this,
                hooks = $.hooks;
            if (!isSet(hooks[name])) {
                return $;
            }
            hooks[name].forEach(function (then) {
                return then.apply($, data);
            });
            return $;
        };
        $$.off = function (name, then) {
            var $ = this,
                hooks = $.hooks;
            if (!isSet(name)) {
                return hooks = {}, $;
            }
            if (isSet(hooks[name])) {
                if (isSet(then)) {
                    var j = hooks[name].length;
                    // Clean-up empty hook(s)
                    if (0 === j) {
                        delete hooks[name];
                    } else {
                        for (var i = 0; i < j; ++i) {
                            if (then === hooks[name][i]) {
                                hooks[name].splice(i, 1);
                                break;
                            }
                        }
                    }
                } else {
                    delete hooks[name];
                }
            }
            return $;
        };
        $$.on = function (name, then) {
            var $ = this,
                hooks = $.hooks;
            if (!isSet(hooks[name])) {
                hooks[name] = [];
            }
            if (isSet(then)) {
                hooks[name].push(then);
            }
            return $;
        };
        return $.hooks = {}, $;
    }
    var offEvent = function offEvent(name, node, then) {
        node.removeEventListener(name, then);
    };
    var offEventDefault = function offEventDefault(e) {
        return e && e.preventDefault();
    };
    var offEventPropagation = function offEventPropagation(e) {
        return e && e.stopPropagation();
    };
    var onEvent = function onEvent(name, node, then, options) {
        if (options === void 0) {
            options = false;
        }
        node.addEventListener(name, then, options);
    };
    var isPattern = function isPattern(pattern) {
        return isInstance(pattern, RegExp);
    };
    var toPattern = function toPattern(pattern, opt) {
        if (isPattern(pattern)) {
            return pattern;
        }
        return new RegExp(pattern, isSet(opt) ? opt : 'g');
    };
    var KEY_A = 'a';
    var KEY_ARROW_LEFT = 'ArrowLeft';
    var KEY_ARROW_RIGHT = 'ArrowRight';
    var KEY_DELETE_LEFT = 'Backspace';
    var KEY_DELETE_RIGHT = 'Delete';

    function isDisabled(self) {
        return self.disabled;
    }

    function theText(self) {
        return getText(self);
    }

    function theValue(self) {
        return self.value.replace(/\r/g, "");
    }

    function getCharBeforeCaret(container) {
        var range,
            selection = W.getSelection();
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0).cloneRange();
            range.collapse(true);
            range.setStart(container, 0);
            return (range + "").slice(-1);
        }
    }

    function TagPicker(self, state) {
        var $ = this;
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
        } : state || {}));
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
    var $$ = TagPicker.prototype;
    $$._filter = function (v) {
        var $ = this,
            state = $.state;
        v = (v || "").split(state.join).join("").trim();
        return toCaseKebab(v).replace(/^-+|-+$/g, "");
    };

    function onEventBlurShadow() {
        var $ = this,
            picker = $['_' + TagPicker.name],
            state = picker.state;
        letClass($, state['class'] + '--focus');
    }

    function onEventBlurTag() {
        var $ = this,
            picker = $['_' + TagPicker.name],
            _shadow = picker._shadow,
            state = picker.state,
            c = state['class'],
            shadow = _shadow.self;
        letClass(shadow, c += '--focus');
        letClass(shadow, c += '-tag');
    }

    function onEventBlurTextInput() {
        var $ = this,
            picker = $['_' + TagPicker.name],
            _shadow = picker._shadow,
            state = picker.state,
            text = _shadow.text,
            c = state['class'],
            shadow = _shadow.self;
        letClass(text, c + '__text--focus');
        letClass(shadow, c += '--focus');
        letClass(shadow, c += '-text');
    }

    function onEventClickShadow(e) {
        var $ = this,
            picker = $['_' + TagPicker.name],
            _shadow = picker._shadow,
            input = _shadow.input;
        input.focus(), offEventDefault(e);
    }

    function onEventClickTag(e) {
        var $ = this,
            picker = $['_' + TagPicker.name],
            _tags = picker._tags,
            state = picker.state,
            c = state['class'] + '__tag--selected';
        for (var k in _tags) {
            if ($ === _tags[k]) {
                continue;
            }
            letClass(_tags[k], c);
        }
        toggleClass($, c);
        offEventPropagation(e);
    }

    function onEventClickTagX(e) {
        var $ = this,
            tag = getParent($),
            picker = tag['_' + TagPicker.name],
            _shadow = picker._shadow,
            input = _shadow.input;
        offEvent('click', $, onEventClickTagX);
        picker.let(tag.title);
        input.focus(), offEventDefault(e);
    }

    function onEventCopyTextCopy() {
        var $ = this,
            picker = $['_' + TagPicker.name],
            _shadow = picker._shadow,
            input = _shadow.input;
        W.setTimeout(function () {
            return letElement($), input.focus();
        }, 1);
    }

    function onEventCutTextCopy() {
        var $ = this,
            picker = $['_' + TagPicker.name],
            _shadow = picker._shadow,
            state = picker.state,
            input = _shadow.input;
        $.value.split(state.join).forEach(function (tag) {
            return picker.let(tag);
        });
        W.setTimeout(function () {
            return letElement($), input.focus();
        }, 1);
    }

    function onEventFocusTextInput() {
        var $ = this,
            picker = $['_' + TagPicker.name],
            _shadow = picker._shadow,
            _tags = picker._tags,
            state = picker.state,
            copy = _shadow.copy,
            text = _shadow.text,
            c = state['class'],
            shadow = _shadow.self;
        for (var k in _tags) {
            letClass(_tags[k], c + '__tag--selected');
        }
        letClass(shadow, c + '--focus-tags');
        letElement(copy);
        setClass(text, c + '__text--focus');
        setClass(shadow, c += '--focus');
        setClass(shadow, c += '-text');
    }

    function onEventFocusSelf() {
        var $ = this,
            picker = $['_' + TagPicker.name];
        picker.focus();
    }

    function onEventFocusShadow() {
        var $ = this,
            picker = $['_' + TagPicker.name],
            state = picker.state;
        setClass($, state['class'] + '--focus');
    }

    function onEventFocusTag() {
        var $ = this,
            picker = $['_' + TagPicker.name],
            _shadow = picker._shadow,
            state = picker.state,
            c = state['class'],
            shadow = _shadow.self;
        setClass(shadow, c += '--focus');
        setClass(shadow, c += '-tag');
    }

    function onEventKeyDownTag(e) {
        var $ = this,
            exit,
            key = e.key,
            keyIsCtrl = e.ctrlKey,
            keyIsShift = e.shiftKey,
            picker = $['_' + TagPicker.name],
            _shadow = picker._shadow,
            _tags = picker._tags,
            state = picker.state,
            copy = _shadow.copy,
            self = _shadow.self,
            text = _shadow.text,
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
            for (var k in _tags) {
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
        var $ = this,
            key = e.key,
            keyIsCtrl = e.ctrlKey,
            keyIsShift = e.shiftKey,
            picker = $['_' + TagPicker.name],
            _shadow = picker._shadow,
            state = picker.state,
            input = _shadow.input;
        if (KEY_DELETE_LEFT === key || KEY_DELETE_RIGHT === key) {
            $.value.split(state.join).forEach(function (tag) {
                return picker.let(tag);
            });
            input.focus();
        } else if (!keyIsCtrl && !keyIsShift) {
            input.focus();
        }
    }

    function onEventKeyDownTextInput(e) {
        var $ = this,
            exit,
            v,
            key = e.key,
            keyCode = e.keyCode,
            keyIsCtrl = e.ctrlKey,
            keyIsShift = e.shiftKey,
            picker = $['_' + TagPicker.name],
            _shadow = picker._shadow,
            _tags = picker._tags,
            state = picker.state,
            copy = _shadow.copy,
            hint = _shadow.hint,
            self = _shadow.self,
            c = state['class'],
            lastTag;
        escape = state.escape;
        if (escape.includes(key) || escape.includes(keyCode)) {
            return picker.set(theText($)), setText($, ""), setText(hint, picker.self.placeholder), picker.focus(), offEventDefault(e);
        }
        W.setTimeout(function () {
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
            for (var k in _tags) {
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
        var $ = this,
            picker = $['_' + TagPicker.name],
            _shadow = picker._shadow,
            state = picker.state,
            hint = _shadow.hint;
        W.setTimeout(function () {
            var value = getText($);
            if (null !== value) {
                value.split(state.join).forEach(function (tag) {
                    return picker.set(tag);
                });
            }
            setText($, ""), setText(hint, picker.self.placeholder);
        }, 1);
    }
    $$.attach = function (self, state) {
        var $ = this;
        self = self || $.self;
        state = state || $.state;
        $._active = true;
        $._tags = {};
        $._value = theValue(self);
        $.self = self;
        $.state = state;
        var c = state['class'],
            n = '_' + TagPicker.name;
        getParentForm(self);
        var shadow = setElement('div', {
            'class': c,
            'tabindex': isDisabled(self) ? false : -1
        });
        var shadowTags = setElement('span', {
            'class': c + '__tags'
        });
        var text = setElement('span', {
            'class': c + '__text'
        });
        var textCopy = setElement('input', {
            'class': c + '__copy',
            'tabindex': -1,
            'type': 'text'
        });
        var textInput = setElement('span', {
            'contenteditable': isDisabled(self) ? false : 'true',
            'spellcheck': 'false',
            'style': 'white-space:pre;'
        });
        var textInputHint = setElement('span', self.placeholder + "");
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
        var _shadow = {};
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
            for (var i = 0, j = toCount(state.with); i < j; ++i) {
                var value = state.with[i];
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
    $$.blur = function () {};
    $$.click = function () {};
    $$.detach = function () {
        var $ = this,
            _shadow = $._shadow,
            self = $.self,
            state = $.state,
            copy = _shadow.copy,
            input = _shadow.input,
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
            for (var i = 0, j = toCount(state.with); i < j; ++i) {
                var value = state.with[i];
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
        var $ = this,
            _shadow = $._shadow;
        _shadow.input && _shadow.input.focus();
        return $;
    };
    $$.get = function (v) {
        var $ = this,
            _active = $._active;
        $._shadow;
        var _tags = $._tags;
        if (!_active) {
            return false;
        }
        if (!_tags[v]) {
            return null;
        }
        return v;
    };
    $$.let = function (v) {
        var $ = this,
            _active = $._active;
        $._shadow;
        var _tags = $._tags,
            state = $.state;
        if (!_active) {
            return $;
        }
        if (!_tags[v]) {
            return false;
        }
        var tag = _tags[v],
            tagX = getChildFirst(tag);
        offEvent('blur', tag, onEventBlurTag);
        offEvent('click', tagX, onEventClickTagX);
        offEvent('focus', tag, onEventFocusTag);
        offEvent('keydown', tag, onEventKeyDownTag);
        offEvent('mousedown', tag, onEventClickTag);
        offEvent('touchstart', tag, onEventClickTag);
        letElement(tag);
        delete $._tags[v];
        return $.self.value = toObjectKeys($._tags).join(state.join), $;
    };
    $$.set = function (v) {
        var $ = this,
            _active = $._active,
            _filter = $._filter,
            _shadow = $._shadow,
            _tags = $._tags,
            state = $.state,
            pattern = state.pattern;
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
        var tag = setElement('span', {
            'class': $.state['class'] + '__tag',
            'tabindex': -1,
            'title': v
        });
        var tagX = setElement('a', {
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
        return $.self.value = toObjectKeys($._tags).join(state.join), $;
    };
    Object.defineProperty($$, 'tags', {
        get: function get() {
            return toObjectKeys(this._tags);
        },
        set: function set(tags) {
            var $ = this;
            $._tags = {};
            $.self.value = "";
            tags.forEach(function (tag) {
                return $.set(tag);
            });
        }
    });
    Object.defineProperty($$, 'value', {
        get: function get() {
            var value = this.self.value;
            return "" === value ? null : value;
        },
        set: function set(value) {
            this.self.value = value;
        }
    });
    return TagPicker;
}));