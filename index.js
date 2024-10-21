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
    var isInteger = function isInteger(x) {
        return isNumber(x) && 0 === x % 1;
    };
    var isNull = function isNull(x) {
        return null === x;
    };
    var isNumber = function isNumber(x) {
        return 'number' === typeof x;
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
    var toCaseLower = function toCaseLower(x) {
        return x.toLowerCase();
    };
    var toCount = function toCount(x) {
        return x.length;
    };
    var toObjectCount = function toObjectCount(x) {
        return toCount(toObjectKeys(x));
    };
    var toObjectKeys = function toObjectKeys(x) {
        return Object.keys(x);
    };
    var toObjectValues = function toObjectValues(x) {
        return Object.values(x);
    };
    var fromHTML = function fromHTML(x, escapeQuote) {
        x = x.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;');
        return x;
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
    var getChildren = function getChildren(parent, index) {
        var children = parent.children;
        return isNumber(index) ? children[index] || null : children || [];
    };
    var getElement = function getElement(query, scope) {
        return (scope || D).querySelector(query);
    };
    var getElements = function getElements(query, scope) {
        return (scope || D).querySelectorAll(query);
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
        $$.fire = function (event, data, that) {
            var $ = this,
                hooks = $.hooks;
            if (!isSet(hooks[event])) {
                return $;
            }
            hooks[event].forEach(function (then) {
                return then.apply(that || $, data);
            });
            return $;
        };
        $$.off = function (event, then) {
            var $ = this,
                hooks = $.hooks;
            if (!isSet(event)) {
                return hooks = {}, $;
            }
            if (isSet(hooks[event])) {
                if (isSet(then)) {
                    var j = hooks[event].length;
                    // Clean-up empty hook(s)
                    if (0 === j) {
                        delete hooks[event];
                    } else {
                        for (var i = 0; i < j; ++i) {
                            if (then === hooks[event][i]) {
                                hooks[event].splice(i, 1);
                                break;
                            }
                        }
                    }
                } else {
                    delete hooks[event];
                }
            }
            return $;
        };
        $$.on = function (event, then) {
            var $ = this,
                hooks = $.hooks;
            if (!isSet(hooks[event])) {
                hooks[event] = [];
            }
            if (isSet(then)) {
                hooks[event].push(then);
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
    var KEY_TAB = 'Tab';
    var name = 'TagPicker';

    function defineProperty(of, key, state) {
        Object.defineProperty(of, key, state);
    }

    function focusTo(node) {
        node.focus();
    }

    function getCharBeforeCaret(node) {
        var range,
            selection = W.getSelection();
        if (selection.rangeCount) {
            range = selection.getRangeAt(0).cloneRange();
            range.collapse(true);
            range.setStart(node, 0);
            return (range + "").slice(-1);
        }
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
        var selection = D.getSelection();
        {
            // selection.removeAllRanges();
            if (selection.rangeCount) {
                selection.removeRange(selection.getRangeAt(0));
            }
        }
    }

    function selectTo(node, mode) {
        var selection = D.getSelection();
        selectNone();
        var range = D.createRange();
        range.selectNodeContents(node);
        selection.addRange(range);
        if (1 === mode) {
            selection.collapseToEnd();
        } else if (-1 === mode) {
            selection.collapseToStart();
        }
    }

    function setValueAtCaret(node, value) {
        var range,
            selection = W.getSelection();
        if (selection.rangeCount) {
            range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(D.createTextNode(value));
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
        self['_' + name] = hook($, TagPicker.prototype);
        var newState = fromStates({}, TagPicker.state, isString(state) ? {
            join: state
        } : state || {});
        // Special case for `state.escape`: Replace instead of join
        if (isObject(state) && state.escape) {
            newState.escape = state.escape;
        }
        return $.attach(self, newState);
    }
    TagPicker.state = {
        'escape': [','],
        'join': ', ',
        'max': Infinity,
        'min': 0,
        'n': 'tag-picker',
        'pattern': null,
        'with': []
    };
    TagPicker.version = '4.0.4';
    defineProperty(TagPicker, 'name', {
        value: name
    });
    var $$ = TagPicker.prototype;
    defineProperty($$, 'text', {
        get: function get() {
            return getText(this._mask.input);
        },
        set: function set(text) {
            var $ = this,
                _mask = $._mask,
                self = $.self,
                hint = _mask.hint,
                input = _mask.input;
            text = text + "";
            setText(hint, "" === text ? self.placeholder : "");
            setText(input, text);
            selectTo(input);
        }
    });
    defineProperty($$, 'value', {
        get: function get() {
            var value = getValue(this.self);
            return "" === value ? null : value;
        },
        set: function set(value) {
            var $ = this;
            $._tags;
            var state = $.state;
            if ($.value) {
                $.value.split(state.join).forEach(function (tag) {
                    return $.let(tag, 1);
                });
            }
            value.split(state.join).forEach(function (tag) {
                return $.set(tag, -1, 1);
            });
            $.fire('change');
        }
    });
    $$._filter = function (v) {
        var $ = this,
            state = $.state;
        return (v || "").replace(/[^ -~]/g, ' ').split(state.join).join("").replace(/\s+/g, ' ').trim();
    };
    var _keyIsCtrl = false,
        _keyIsShift = false;

    function onBlurTag() {
        selectNone();
        var $ = this,
            picker = $['_' + name];
        picker._mask;
        var _tags = picker._tags,
            mask = picker.mask,
            state = picker.state,
            n = state.n;
        if (!_keyIsCtrl && !_keyIsShift) {
            for (var k in _tags) {
                letClass(_tags[k], n + '__tag--selected');
            }
        }
        letClass(mask, n += '--focus');
        letClass(mask, n += '-tag');
    }

    function onBlurTextInput(e) {
        selectNone();
        var $ = this,
            picker = $['_' + name],
            _mask = picker._mask,
            mask = picker.mask,
            state = picker.state,
            text = _mask.text,
            n = state.n;
        letClass(text, n + '__text--focus');
        letClass(mask, n += '--focus');
        letClass(mask, n += '-text');
        picker.fire('blur', [e]);
    }

    function onClickMask(e) {
        var $ = this,
            picker = $['_' + name],
            on = e.target,
            state = picker.state,
            n = state.n + '__tag';
        if (!hasClass(on, n) && !getParent(on, '.' + n)) {
            picker.focus();
        }
    }

    function onContextMenuTag(e) {
        var $ = this,
            picker = $['_' + name];
        picker._tags;
        var state = picker.state,
            n = state.n + '__tag--selected';
        setClass($, n);
        focusTo($), selectTo(getChildFirst($));
    }

    function onCopyTag(e) {
        var $ = this,
            picker = $['_' + name],
            _tags = picker._tags,
            state = picker.state,
            n = state.n + '__tag--selected';
        var selection = [];
        for (var k in _tags) {
            if (hasClass(_tags[k], n)) {
                selection.push(k);
            }
        }
        e.clipboardData.setData('text/plain', selection.join(state.join));
        picker.fire('copy', [e, selection]).focus();
        offEventDefault(e);
    }

    function onCutTag(e) {
        var $ = this,
            picker = $['_' + name],
            _mask = picker._mask,
            _tags = picker._tags,
            state = picker.state;
        _mask.input;
        var n = state.n + '__tag--selected';
        var selection = [];
        for (var k in _tags) {
            if (hasClass(_tags[k], n)) {
                selection.push(k), picker.let(k, 1);
            }
        }
        e.clipboardData.setData('text/plain', selection.join(state.join));
        picker.fire('cut', [e, selection]).fire('change', [$.title]).focus();
        offEventDefault(e);
    }

    function onFocusTextInput(e) {
        var $ = this,
            picker = $['_' + name],
            _mask = picker._mask,
            _tags = picker._tags,
            mask = picker.mask,
            self = picker.self,
            state = picker.state,
            hint = _mask.hint,
            input = _mask.input,
            text = _mask.text,
            n = state.n;
        for (var k in _tags) {
            letClass(_tags[k], n + '__tag--selected');
        }
        setClass(text, n + '__text--focus');
        setClass(mask, n += '--focus');
        setClass(mask, n += '-text');
        delay(function () {
            return setText(hint, getText(input, false) ? "" : self.placeholder);
        }, 1)();
        picker.focus().fire('focus', [e]);
    }

    function onFocusSelf() {
        var $ = this,
            picker = $['_' + name];
        picker.focus();
    }

    function onInvalidSelf(e) {
        var $ = this,
            picker = $['_' + name];
        picker.fire('min.tags').focus(), offEventDefault(e); // Disable native validation tooltip for required input(s)
    }

    function onFocusTag(e) {
        var $ = this,
            picker = $['_' + name];
        picker._mask;
        var mask = picker.mask,
            state = picker.state,
            n = state.n;
        setClass(mask, n += '--focus');
        setClass(mask, n += '-tag');
        picker.fire('focus.tag', [e]);
    }

    function onKeyDownTag(e) {
        var $ = this,
            exit,
            key = e.key,
            keyIsCtrl = _keyIsCtrl = e.ctrlKey,
            keyIsShift = _keyIsShift = e.shiftKey,
            picker = $['_' + name],
            _mask = picker._mask,
            _tags = picker._tags;
        picker.mask;
        var state = picker.state,
            text = _mask.text,
            prevTag = getPrev($),
            nextTag = getNext($),
            firstTag,
            lastTag,
            n = state.n + '__tag--selected',
            v;
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
                for (var k in _tags) {
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
            var selection = [];
            for (var _k in _tags) {
                if (hasClass(_tags[_k], n)) {
                    selection.push(_k);
                }
                if ($ !== _tags[_k]) {
                    letClass(_tags[_k], n);
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
                    var current;
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
                    var _current;
                    while (_current = selection.shift()) {
                        nextTag = _tags[_current] && getNext(_tags[_current]);
                        picker.let(_current, 1);
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
        var $ = this,
            key = e.key,
            picker = $['_' + name],
            _tags = picker._tags,
            state = picker.state,
            n = state.n + '__tag--selected';
        if (_keyIsShift) {
            if (KEY_ARROW_LEFT === key || KEY_ARROW_RIGHT === key);
            else {
                var selection = 0;
                for (var k in _tags) {
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
        var $ = this,
            key = getCharBeforeCaret($),
            picker = $['_' + name],
            state = picker.state,
            escape = state.escape;
        if ('\n' === key && (hasValue('\n', escape) || hasValue(13, escape)) || '\t' === key && (hasValue('\t', escape) || hasValue(9, escape)) || hasValue(key, escape)) {
            return picker.set(getText($).slice(0, -1)).focus().text = "", offEventDefault(e);
        }
    }

    function onKeyDownTextInput(e) {
        var $ = this,
            exit,
            key = e.key,
            keyCode = e.keyCode,
            keyIsCtrl = _keyIsCtrl = e.ctrlKey,
            keyIsShift = _keyIsShift = e.shiftKey,
            picker = $['_' + name],
            _active = picker._active,
            _mask = picker._mask,
            _tags = picker._tags;
        picker.mask;
        var self = picker.self,
            state = picker.state,
            hint = _mask.hint,
            n = state.n + '__tag--selected',
            firstTag,
            lastTag;
        escape = state.escape;
        if (!_active) {
            return offEventDefault(e);
        }
        if (KEY_ENTER === key && (hasValue('\n', escape) || hasValue(13, escape)) || KEY_TAB === key && (hasValue('\t', escape) || hasValue(9, escape)) || hasValue(key, escape) || hasValue(keyCode, escape)) {
            return picker.set(getText($)).focus().text = "", offEventDefault(e);
        }
        delay(function () {
            return setText(hint, getText($, false) ? "" : self.placeholder);
        }, 1)();
        var caretIsToTheFirst = "" === getCharBeforeCaret($),
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
            if (KEY_A === key && null === getText($, false) && null !== (picker.value)) {
                for (var k in _tags) {
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
                var form = getParentForm(self);
                if (form && isFunction(form.requestSubmit)) {
                    // <https://developer.mozilla.org/en-US/docs/Glossary/Submit_button>
                    var submit = getElement('button:not([type]),button[type=submit],input[type=image],input[type=submit]', form);
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
        var $ = this,
            picker = $['_' + name],
            _tags = picker._tags,
            state = picker.state,
            n = state.n + '__tag--selected';
        var isAllSelected = true,
            value = (e.clipboardData || W.clipboardData).getData('text') + "";
        for (var k in _tags) {
            if (!hasClass(_tags[k], n)) {
                isAllSelected = false;
                break;
            }
        }
        // Delete all tag(s) before paste
        if (isAllSelected && picker.value) {
            picker.value.split(state.join).forEach(function (tag) {
                return picker.let(tag, 1);
            });
        }
        var values = value.split(state.join);
        values.forEach(function (tag) {
            return picker.set(tag, -1, 1);
        });
        picker.fire('paste', [e, values]).focus().fire('change');
        offEventDefault(e);
    }

    function onPasteTextInput(e) {
        var $ = this,
            picker = $['_' + name],
            _mask = picker._mask,
            self = picker.self,
            state = picker.state,
            hint = _mask.hint;
        var value = (e.clipboardData || W.clipboardData).getData('text') + "";
        setValueAtCaret($, value), setText(hint, getText($) ? "" : self.placeholder);
        delay(function () {
            value = getText($);
            picker.text = "";
            if (value) {
                var values = value.split(state.join);
                values.forEach(function (tag) {
                    return picker.set(tag, -1, 1);
                });
                picker.fire('paste', [e, values]).fire('change');
            }
        }, 1)();
        offEventDefault(e);
    }

    function onPointerDownTag(e) {
        var $ = this,
            picker = $['_' + name],
            _active = picker._active,
            _mask = picker._mask,
            _tags = picker._tags,
            state = picker.state,
            text = _mask.text,
            n = state.n + '__tag--selected';
        if (!_active) {
            return;
        }
        focusTo($), toggleClass($, n);
        if (_keyIsCtrl);
        else if (_keyIsShift) {
            selectNone();
            var parentTag = getParent($),
                selectedTags = getElements('.' + n, parentTag),
                firstTag = selectedTags[0],
                lastTag = selectedTags[toCount(selectedTags) - 1],
                nextTag;
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
            var asContextMenu = 2 === e.button,
                // Probably a “right-click”
                selection = 0;
            for (var k in _tags) {
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
        var $ = this,
            tag = getParent($),
            picker = tag['_' + name],
            _mask = picker._mask;
        _mask.input;
        offEvent('click', $, onPointerDownTagX);
        picker.let(tag.title).focus(), offEventDefault(e);
    }

    function onResetForm(e) {
        var $ = this,
            picker = $['_' + name];
        picker.let().fire('reset', [e]);
    }

    function onSubmitForm(e) {
        var $ = this,
            picker = $['_' + name],
            _tags = picker._tags,
            state = picker.state;
        if (toObjectCount(_tags) < state.min) {
            return picker.fire('min.tags').focus(), offEventDefault(e);
        }
        return picker.fire('submit', [e]);
    }
    $$.attach = function (self, state) {
        var $ = this;
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
        var n = state.n;
        var form = getParentForm(self);
        var mask = setElement('div', {
            'class': n,
            'tabindex': isDisabled(self) ? false : -1
        });
        $.mask = mask;
        var maskTags = setElement('span', {
            'class': n + '__tags'
        });
        var text = setElement('span', {
            'class': n + '__text'
        });
        var textInput = setElement('span', {
            'contenteditable': isDisabled(self) ? false : "",
            'spellcheck': 'false'
        });
        var textInputHint = setElement('span', self.placeholder + "");
        setChildLast(mask, maskTags);
        setChildLast(maskTags, text);
        setChildLast(text, textInput);
        setChildLast(text, textInputHint);
        setClass(self, n + '__self');
        setNext(self, mask);
        if (form) {
            form['_' + name] = $;
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
        mask['_' + name] = $;
        textInput['_' + name] = $;
        var _mask = {};
        _mask.hint = textInputHint;
        _mask.input = textInput;
        _mask.of = self;
        _mask.self = mask;
        _mask.tags = maskTags;
        _mask.text = text;
        $._mask = _mask;
        // Attach the current tag(s)
        if ($._value) {
            $._value.split(state.join).forEach(function (tag) {
                return $.set(tag, -1, 1, 1);
            });
        }
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
    $$.blur = function () {
        selectNone();
        var $ = this,
            _mask = $._mask,
            _tags = $._tags,
            input = _mask.input;
        for (var k in _tags) {
            _tags[k].blur();
        }
        return input.blur();
    };
    $$.detach = function () {
        var $ = this,
            _mask = $._mask,
            mask = $.mask,
            self = $.self,
            state = $.state,
            input = _mask.input;
        if (!hasClass(self, state.n + '__self')) {
            return $;
        }
        var form = getParentForm(self);
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
        letClass(self, state.n + '__self');
        letElement(mask);
        $._mask = {
            of: self
        };
        $.mask = null;
        return $;
    };
    $$.focus = function (mode) {
        var $ = this,
            _mask = $._mask,
            input = _mask.input;
        return input && (focusTo(input), selectTo(input, mode)), $;
    };
    $$.get = function (v) {
        var $ = this,
            _active = $._active,
            _tags = $._tags;
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
        var $ = this,
            _active = $._active,
            _tags = $._tags,
            _value = $._value,
            self = $.self,
            state = $.state;
        if (!_active) {
            return $;
        }
        // Reset
        if (!isDefined(v)) {
            if ($.value) {
                $.value.split(state.join).forEach(function (tag) {
                    return $.let(tag, 1);
                });
            }
            return _value.split(state.join).forEach(function (tag) {
                return $.set(tag, -1, 1);
            }), $.fire('change');
        }
        if (toObjectCount(_tags) < state.min) {
            return $.fire('min.tags', [v]);
        }
        if (!_tags[v]) {
            return $;
        }
        var tag = _tags[v];
        getChildren(tag, 0);
        var tagX = getChildren(tag, 1);
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
        var $ = this,
            _active = $._active,
            _filter = $._filter,
            _mask = $._mask,
            _tags = $._tags,
            self = $.self,
            state = $.state,
            text = _mask.text,
            pattern = state.pattern,
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
        if ("" === v || isString(pattern) && !toPattern(pattern).test(v)) {
            return $.fire('not.tag', [v]);
        }
        if (_tags[v]) {
            return $.fire('has.tag', [v]);
        }
        $.fire('is.tag', [v]);
        var tag = setElement('span', {
            'class': n + '__tag',
            'tabindex': _active ? -1 : false,
            'title': v
        });
        var tagText = setElement('span', fromHTML(v));
        var tagX = setElement('span', {
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
            tag['_' + name] = $;
        }
        setChildLast(tag, tagText);
        setChildLast(tag, tagX);
        if (isInteger(at) && at >= 0) {
            var tags = toObjectKeys(_tags);
            tags.splice(at, 0, v);
            $._tags = {};
            _tags[v] = tag;
            tags.forEach(function (k) {
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
    return TagPicker;
}));