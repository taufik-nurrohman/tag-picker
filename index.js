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
    var getElement = function getElement(query, scope) {
        return (scope || D).querySelector(query);
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
    var hasClass = function hasClass(node, value) {
        return node.classList.contains(value);
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
    var delay = function delay(then, time) {
        return function () {
            var _arguments2 = arguments,
                _this2 = this;
            setTimeout(function () {
                return then.apply(_this2, _arguments2);
            }, time);
        };
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
    var KEY_BEGIN = 'Home';
    var KEY_DELETE_LEFT = 'Backspace';
    var KEY_DELETE_RIGHT = 'Delete';
    var KEY_END = 'End';
    var KEY_ENTER = 'Enter';
    var KEY_ESCAPE = 'Escape';
    // <https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#focusvisible>
    var focusOptions = {
        focusVisible: true
    };
    var name = 'TagPicker';

    function defineProperty(of, key, state) {
        Object.defineProperty(of, key, state);
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

    function isDisabled(self) {
        return self.disabled;
    }

    function setCaretToEnd(container) {
        var range = D.createRange(),
            selection;
        range.selectNodeContents(container);
        range.collapse(false);
        selection = W.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function theValue(self) {
        return self.value.replace(/\r/g, "");
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
        self['_' + name] = hook($, TagPicker.prototype);
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
    defineProperty(TagPicker, 'name', {
        value: name
    });
    var $$ = TagPicker.prototype;
    defineProperty($$, 'text', {
        get: function get() {
            return getText(this._mask.input);
        },
        set: function set(text) {
            setText(this._mask.input, text);
        }
    });
    defineProperty($$, 'value', {
        get: function get() {
            var value = this.self.value;
            return "" === value ? null : value;
        },
        set: function set(value) {
            var $ = this,
                state = $.state;
            value.split(state.join).forEach(function (tag) {
                return $.set(tag);
            });
        }
    });
    $$._filter = function (v) {
        var $ = this,
            state = $.state;
        v = (v || "").split(state.join).join("").trim();
        return toCaseKebab(v).replace(/^-+|-+$/g, "");
    };

    function onBlurMask() {
        var $ = this,
            picker = $['_' + name],
            state = picker.state;
        letClass($, state['class'] + '--focus');
    }

    function onBlurTag() {
        var $ = this,
            picker = $['_' + name];
        picker._mask;
        var mask = picker.mask,
            state = picker.state,
            c = state['class'];
        letClass(mask, c += '--focus');
        letClass(mask, c += '-tag');
    }

    function onBlurTextInput() {
        var $ = this,
            picker = $['_' + name],
            _mask = picker._mask,
            mask = picker.mask,
            state = picker.state,
            text = _mask.text,
            c = state['class'];
        letClass(text, c + '__text--focus');
        letClass(mask, c += '--focus');
        letClass(mask, c += '-text');
    }

    function onContextMenuMask(e) {
        var $ = this,
            picker = $['_' + name],
            _mask = picker._mask,
            _tags = picker._tags,
            mask = picker.mask,
            state = picker.state,
            copy = _mask.copy,
            c = state['class'] + '__tag--focus';
        var selection = [];
        for (var k in _tags) {
            if (hasClass(_tags[k], c)) {
                selection.push(k);
            }
        }
        if (toCount(selection)) {
            if (mask !== getParent(copy)) {
                copy.value = selection.join(state.join);
                setChildLast(mask, copy);
            }
            copy.focus(), copy.select();
        }
    }

    function onCopyTextCopy() {
        var $ = this,
            picker = $['_' + name],
            _mask = picker._mask;
        _mask.input;
        delay(function () {
            return letElement($), picker.focus();
        }, 1)();
    }

    function onCutTextCopy() {
        var $ = this,
            picker = $['_' + name],
            _mask = picker._mask,
            state = picker.state;
        _mask.input;
        $.value.split(state.join).forEach(function (tag) {
            return picker.let(tag);
        });
        delay(function () {
            return letElement($), picker.focus();
        }, 1)();
    }

    function onFocusTextCopy() {
        var $ = this,
            picker = $['_' + name];
        picker._tags;
        var mask = picker.mask,
            state = picker.state,
            c = state['class'];
        setClass(mask, c + '--focus');
        if (!_keyIsCtrl) {
            setClass(mask, c + '--select');
        }
    }

    function onFocusTextInput() {
        _firstTagSelected = false;
        var $ = this,
            picker = $['_' + name],
            _mask = picker._mask,
            _tags = picker._tags,
            mask = picker.mask,
            self = picker.self,
            state = picker.state,
            copy = _mask.copy,
            hint = _mask.hint,
            input = _mask.input,
            text = _mask.text,
            c = state['class'];
        for (var k in _tags) {
            letClass(_tags[k], c + '__tag--focus');
        }
        letElement(copy);
        letClass(mask, c + '--select');
        setClass(text, c + '__text--focus');
        setClass(mask, c += '--focus');
        setClass(mask, c += '-text');
        setCaretToEnd(input);
        delay(function () {
            return setText(hint, getText(input, false) ? "" : self.placeholder);
        }, 1)();
    }

    function onFocusSelf() {
        var $ = this,
            picker = $['_' + name];
        picker.focus();
    }

    function onFocusMask() {
        var $ = this,
            picker = $['_' + name],
            state = picker.state,
            c = state['class'];
        setClass($, c + '--focus');
    }

    function onFocusTag() {
        var $ = this,
            picker = $['_' + name];
        picker._mask;
        var mask = picker.mask,
            state = picker.state,
            c = state['class'];
        setClass(mask, c += '--focus');
        setClass(mask, c += '-tag');
    }
    var _keyIsCtrl = false,
        _firstTagSelected = false;

    function onKeyDownMask(e) {
        _keyIsCtrl = e.ctrlKey;
        e.shiftKey;
    }

    function onKeyDownTag(e) {
        var $ = this,
            exit,
            key = e.key,
            keyIsCtrl = _keyIsCtrl = e.ctrlKey,
            keyIsShift = e.shiftKey,
            picker = $['_' + name],
            _mask = picker._mask,
            _tags = picker._tags,
            mask = picker.mask,
            state = picker.state,
            copy = _mask.copy,
            text = _mask.text,
            prevTag = getPrev($),
            nextTag = getNext($),
            firstTag,
            lastTag,
            c = state['class'] + '__tag--focus';
        if (keyIsShift) {
            setClass(_firstTagSelected = $, c);
            copy.value = picker.value;
            setChildLast(mask, copy);
            copy.focus(), copy.select();
        } else if (keyIsCtrl) {
            letClass(mask, state['class'] + '--select');
            if (!keyIsShift && KEY_A === key) {
                for (var k in _tags) {
                    setClass(_tags[k], c);
                }
                copy.value = picker.value;
                setChildLast(mask, copy);
                copy.focus(), copy.select();
                exit = true;
            }
        } else {
            if (!keyIsShift) {
                letClass($, c);
            }
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

    function onKeyDownTextCopy(e) {
        var $ = this,
            key = e.key,
            keyIsAlt = e.altKey,
            keyIsCtrl = _keyIsCtrl = e.ctrlKey,
            keyIsShift = e.shiftKey,
            picker = $['_' + name],
            _mask = picker._mask,
            _tags = picker._tags,
            mask = picker.mask,
            state = picker.state,
            copy = _mask.copy;
        _mask.input;
        var text = _mask.text,
            c = state['class'] + '__tag--focus',
            firstTag,
            lastTag,
            nextTag,
            prevTag;
        if (keyIsAlt) {
            return;
        }

        function cancel() {
            letElement(copy);
            for (var k in _tags) {
                letClass(_tags[k], c);
            }
        }
        if (keyIsShift) {
            _firstTagSelected = _firstTagSelected || _tags[$.value.split(state.join).shift()];
            console.log(_firstTagSelected);
            if (KEY_ARROW_LEFT === key) {
                if (prevTag = getPrev(_firstTagSelected)) {
                    console.log(prevTag);
                    setClass(prevTag, c);
                    _firstTagSelected = prevTag;
                }
            } else if (KEY_ARROW_RIGHT === key) {
                if (nextTag = getNext(_firstTagSelected)) {
                    console.log(nextTag);
                    if (text !== nextTag) {
                        setClass(nextTag, c);
                        _firstTagSelected = nextTag;
                    }
                }
            }
        } else if (!keyIsCtrl) {
            if (KEY_ARROW_LEFT === key) {
                firstTag = _tags[$.value.split(state.join).shift()];
                cancel();
                if (prevTag = getPrev(firstTag)) {
                    prevTag.focus(focusOptions);
                } else {
                    firstTag.focus(focusOptions);
                }
            } else if (KEY_ARROW_RIGHT === key) {
                lastTag = _tags[$.value.split(state.join).pop()];
                cancel();
                if ((nextTag = getNext(lastTag)) && text !== nextTag) {
                    nextTag.focus(focusOptions);
                } else {
                    lastTag.focus(focusOptions);
                }
            } else if (KEY_BEGIN === key) {
                cancel(), toObjectValues(_tags).shift().focus(focusOptions);
            } else if (KEY_END === key) {
                cancel(), toObjectValues(_tags).pop().focus(focusOptions);
            } else if (KEY_ENTER === key || ' ' === key) {
                lastTag = $.value.split(state.join).pop();
                cancel(), _tags[lastTag].focus(focusOptions), offEventDefault(e);
            } else if (KEY_ESCAPE === key) {
                cancel(), picker.focus();
            } else {
                $.value.split(state.join).forEach(function (tag) {
                    return picker.let(tag);
                }), picker.focus();
            }
        } else {
            letClass(mask, state['class'] + '--select');
            if (KEY_A === key) {
                for (var k in _tags) {
                    setClass(_tags[k], c);
                }
                copy.value = picker.value;
                copy.focus(), copy.select();
            }
        }
    }

    function onKeyDownTextInput(e) {
        var $ = this,
            exit,
            v,
            key = e.key,
            keyCode = e.keyCode,
            keyIsCtrl = _keyIsCtrl = e.ctrlKey,
            keyIsShift = e.shiftKey,
            picker = $['_' + name],
            _mask = picker._mask,
            _tags = picker._tags,
            mask = picker.mask,
            self = picker.self,
            state = picker.state,
            copy = _mask.copy,
            hint = _mask.hint,
            c = state['class'] + '__tag--focus',
            firstTag,
            lastTag;
        escape = state.escape;
        if (escape.includes(key) || escape.includes(keyCode)) {
            return picker.set(getText($)), setText($, ""), setText(hint, self.placeholder), picker.focus(), offEventDefault(e);
        }
        delay(function () {
            return setText(hint, getText($, false) ? "" : self.placeholder);
        }, 1)();
        var caretIsToTheFirst = "" === getCharBeforeCaret($),
            textIsVoid = null === getText($, false);
        if (KEY_BEGIN === key && (keyIsCtrl || textIsVoid)) {
            firstTag = toObjectValues(_tags).shift();
            firstTag && firstTag.focus(focusOptions);
            exit = true;
        } else if (KEY_END === key && (keyIsCtrl || textIsVoid)) {
            lastTag = toObjectValues(_tags).pop();
            lastTag && lastTag.focus(focusOptions);
            exit = true;
        } else if (KEY_ARROW_LEFT === key && (keyIsCtrl || caretIsToTheFirst)) {
            lastTag = toObjectValues(_tags).pop();
            lastTag && lastTag.focus(focusOptions);
            exit = true;
        } else if (KEY_DELETE_LEFT === key && textIsVoid) {
            lastTag = toObjectValues(_tags).pop();
            lastTag && picker.let(lastTag.title);
            picker.focus();
            exit = true;
        } else if (KEY_ENTER === key) {
            var form = getParentForm(self);
            if (form && isFunction(form.requestSubmit)) {
                // <https://developer.mozilla.org/en-US/docs/Glossary/Submit_button>
                var submit = getElement('button:not([type]),button[type=submit],input[type=image],input[type=submit]', form);
                submit ? form.requestSubmit(submit) : form.requestSubmit();
            }
            exit = true;
        } else if (keyIsCtrl && !keyIsShift && KEY_A === key && null === getText($, false) && null !== (v = picker.value)) {
            for (var k in _tags) {
                setClass(_tags[k], c);
            }
            copy.value = v;
            setChildLast(mask, copy);
            copy.focus(), copy.select();
            exit = true;
        }
        exit && offEventDefault(e);
    }

    function onKeyUpMask() {
        var $ = this,
            picker = $['_' + name],
            _mask = picker._mask,
            _tags = picker._tags,
            mask = picker.mask,
            state = picker.state,
            copy = _mask.copy,
            c = state['class'] + '__tag--focus';
        _keyIsCtrl = false;
        var selection = [];
        for (var k in _tags) {
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

    function onPasteTextCopy() {
        var $ = this,
            value = $.value,
            picker = $['_' + name],
            _mask = picker._mask,
            state = picker.state,
            copy = _mask.copy;
        _mask.input;
        delay(function () {
            "" !== value && value.split(state.join).forEach(function (tag) {
                return picker.let(tag);
            });
            value = $.value; // New value
            if ("" !== value) {
                value.split(state.join).forEach(function (tag) {
                    return picker.set(tag);
                });
            }
            letElement(copy), picker.focus();
        }, 1)();
    }

    function onPasteTextInput() {
        var $ = this,
            picker = $['_' + name],
            _mask = picker._mask,
            state = picker.state,
            hint = _mask.hint;
        delay(function () {
            var value = getText($);
            if (null !== value) {
                value.split(state.join).forEach(function (tag) {
                    return picker.set(tag);
                });
            }
            setText($, ""), setText(hint, picker.self.placeholder);
        }, 1)();
    }

    function onPointerDownMask(e) {
        var $ = this,
            picker = $['_' + name],
            _mask = picker._mask,
            _tags = picker._tags,
            mask = picker.mask,
            state = picker.state,
            copy = _mask.copy,
            input = _mask.input,
            c = state['class'] + '__tag--focus';
        if (mask === getParent(copy)) {
            if (input === e.target) {
                for (var k in _tags) {
                    if (hasClass(_tags[k], c));
                }
                // if (selection < 2) {
                picker.focus();
                // }
            } else {
                copy.focus(), copy.select();
            }
        } else {
            picker.focus();
        }
        offEventDefault(e);
    }

    function onPointerDownTag(e) {
        var $ = this,
            picker = $['_' + name],
            _mask = picker._mask,
            _tags = picker._tags,
            mask = picker.mask,
            state = picker.state,
            copy = _mask.copy,
            c = state['class'] + '__tag--focus';
        if (!_keyIsCtrl) {
            var selection = 0;
            for (var k in _tags) {
                if ($ === _tags[k]) {
                    continue;
                }
                if (hasClass(_tags[k], c)) {
                    ++selection;
                }
                letClass(_tags[k], c);
            }
            if (selection > 1) {
                setClass($, c);
            } else {
                toggleClass($, c);
            }
            if (hasClass($, c)) {
                copy.value = $.title;
                setChildLast(mask, copy);
                delay(function () {
                    return copy.focus(), copy.select();
                }, 1)();
            } else {
                letElement(copy);
            }
        } else {
            toggleClass($, c);
            var _selection = [];
            for (var _k in _tags) {
                if (hasClass(_tags[_k], c)) {
                    _selection.push(_k);
                }
            }
            copy.value = _selection.join(state.join);
            copy.focus(), copy.select();
        }
        offEventPropagation(e);
    }

    function onPointerDownTagX(e) {
        var $ = this,
            tag = getParent($),
            picker = tag['_' + name],
            _mask = picker._mask;
        _mask.input;
        offEvent('click', $, onPointerDownTagX);
        picker.let(tag.title);
        picker.focus(), offEventDefault(e);
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
            n = '_' + name;
        getParentForm(self);
        var mask = setElement('div', {
            'class': c,
            'tabindex': isDisabled(self) ? false : -1
        });
        $.mask = mask;
        var maskTags = setElement('span', {
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
        setChildLast(mask, maskTags);
        setChildLast(maskTags, text);
        setChildLast(text, textInput);
        setChildLast(text, textInputHint);
        setClass(self, c + '__self');
        setNext(self, mask);
        onEvent('blur', mask, onBlurMask);
        onEvent('blur', textInput, onBlurTextInput);
        onEvent('contextmenu', mask, onContextMenuMask);
        onEvent('copy', textCopy, onCopyTextCopy);
        onEvent('cut', textCopy, onCutTextCopy);
        onEvent('focus', mask, onFocusMask);
        onEvent('focus', self, onFocusSelf);
        onEvent('focus', textCopy, onFocusTextCopy);
        onEvent('focus', textInput, onFocusTextInput);
        onEvent('keydown', mask, onKeyDownMask);
        onEvent('keydown', textCopy, onKeyDownTextCopy);
        onEvent('keydown', textInput, onKeyDownTextInput);
        onEvent('keyup', mask, onKeyUpMask);
        onEvent('mousedown', mask, onPointerDownMask);
        onEvent('paste', textCopy, onPasteTextCopy);
        onEvent('paste', textInput, onPasteTextInput);
        onEvent('touchstart', mask, onPointerDownMask);
        self.tabIndex = -1;
        mask[n] = $;
        textCopy[n] = $;
        textInput[n] = $;
        var _mask = {};
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
            _mask = $._mask,
            mask = $.mask,
            self = $.self,
            state = $.state,
            copy = _mask.copy,
            input = _mask.input;
        $._active = false;
        offEvent('blur', input, onBlurTextInput);
        offEvent('blur', mask, onBlurMask);
        offEvent('contextmenu', mask, onContextMenuMask);
        offEvent('copy', copy, onCopyTextCopy);
        offEvent('cut', copy, onCutTextCopy);
        offEvent('focus', copy, onFocusTextCopy);
        offEvent('focus', input, onFocusTextInput);
        offEvent('focus', mask, onFocusMask);
        offEvent('focus', self, onFocusSelf);
        offEvent('keydown', copy, onKeyDownTextCopy);
        offEvent('keydown', input, onKeyDownTextInput);
        offEvent('keydown', mask, onKeyDownMask);
        offEvent('keydown', mask, onKeyUpMask);
        offEvent('mousedown', mask, onPointerDownMask);
        offEvent('paste', copy, onPasteTextCopy);
        offEvent('paste', input, onPasteTextInput);
        offEvent('touchstart', mask, onPointerDownMask);
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
        letElement(mask);
        $._mask = {
            of: self
        };
        $.mask = null;
        return $;
    };
    $$.focus = function () {
        var $ = this,
            _mask = $._mask,
            input = _mask.input;
        return (input && input.focus(), setCaretToEnd(input)), $;
    };
    $$.get = function (v) {
        var $ = this,
            _active = $._active,
            _tags = $._tags;
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
            _active = $._active,
            _tags = $._tags,
            self = $.self,
            state = $.state;
        if (!_active) {
            return $;
        }
        if (!_tags[v]) {
            return false;
        }
        var tag = _tags[v],
            tagX = getChildFirst(tag);
        offEvent('blur', tag, onBlurTag);
        offEvent('focus', tag, onFocusTag);
        offEvent('keydown', tag, onKeyDownTag);
        offEvent('mousedown', tag, onPointerDownTag);
        offEvent('mousedown', tagX, onPointerDownTagX);
        offEvent('touchstart', tag, onPointerDownTag);
        offEvent('touchstart', tagX, onPointerDownTagX);
        letElement(tag);
        delete $._tags[v];
        return self.value = toObjectKeys($._tags).join(state.join), $;
    };
    $$.set = function (v) {
        var $ = this,
            _active = $._active,
            _filter = $._filter,
            _mask = $._mask,
            _tags = $._tags,
            self = $.self,
            state = $.state,
            text = _mask.text,
            pattern = state.pattern,
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
        var tag = setElement('span', {
            'class': c += '__tag',
            'tabindex': -1,
            'title': v
        });
        var tagX = setElement('span', {
            'class': c += '-x',
            'tabindex': -1
        });
        onEvent('blur', tag, onBlurTag);
        onEvent('focus', tag, onFocusTag);
        onEvent('keydown', tag, onKeyDownTag);
        onEvent('mousedown', tag, onPointerDownTag);
        onEvent('mousedown', tagX, onPointerDownTagX);
        onEvent('touchstart', tag, onPointerDownTag);
        onEvent('touchstart', tagX, onPointerDownTagX);
        tag['_' + name] = $;
        setChildLast(tag, tagX);
        setPrev(text, tag);
        $._tags[v] = tag;
        return self.value = toObjectKeys($._tags).join(state.join), $;
    };
    return TagPicker;
}));