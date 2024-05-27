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
    var toCaseLower = function toCaseLower(x) {
        return x.toLowerCase();
    };
    var toCount = function toCount(x) {
        return x.length;
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
        var state = 'textContent';
        return hasState(node, state) && (node[state] = trim ? content.trim() : content), node;
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
    var onEvent = function onEvent(name, node, then, options) {
        if (options === void 0) {
            options = false;
        }
        node.addEventListener(name, then, options);
    };

    function isDisabled(self) {
        return self.disabled;
    }

    function theText(self, join) {
        return (getText(self) || "").split(join).join("");
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
    $$._filter = function (tag) {
        return toCaseLower(tag || "").trim();
    };

    function onEventClickTagX(e) {
        var $ = this;
        $['_' + TagPicker.name];
        offEvent('click', $, onEventClickTagX);
        letElement(getParent($));
        offEventDefault(e);
    }

    function onEventFocusSelf() {
        var $ = this,
            picker = $['_' + TagPicker.name];
        picker._shadow.input && picker._shadow.input.focus();
    }

    function onEventKeyDownTextInput(e) {
        var $ = this,
            key = e.key,
            keyCode = e.keyCode,
            picker = $['_' + TagPicker.name],
            escape = picker.state.escape;
        if (escape.includes(key) || escape.includes(keyCode)) {
            console.log(key);
            return picker.set(theText($, picker.state.join)), offEventDefault(e);
        }
        console.log(theText($));
    }
    $$.attach = function (self, state) {
        var $ = this,
            value;
        self = self || $.self;
        state = state || $.state;
        $._active = true;
        $._shadow = {};
        $._value = value = theValue(self);
        $.self = $._shadow.of = self;
        $.state = state;
        $.tags = value.split(state.join);
        var classNameB = state['class'],
            classNameE = classNameB + '__';
        getParentForm(self);
        var shadow = setElement('div', {
            'class': classNameB,
            'tabindex': isDisabled(self) ? false : -1
        });
        var shadowTags = setElement('span', {
            'class': classNameE + 'tags'
        });
        var text = setElement('span', {
            'class': classNameE + 'tag ' + classNameE + 'text'
        });
        setElement('input', {
            'class': classNameE + 'copy',
            'tabindex': -1,
            'type': 'text'
        });
        var textInput = setElement('span', {
            'contenteditable': isDisabled(self) ? false : 'true',
            'spellcheck': 'false',
            'style': 'white-space:pre;'
        });
        var textInputHint = setElement('span');
        setChildLast(shadow, shadowTags);
        setChildLast(shadowTags, text);
        setChildLast(text, textInput);
        setChildLast(text, textInputHint);
        setClass(self, classNameE + 'self');
        setNext(self, shadow);
        onEvent('focus', self, onEventFocusSelf);
        onEvent('keydown', textInput, onEventKeyDownTextInput);
        textInput['_' + TagPicker.name] = $;
        $._shadow.input = textInput;
        $._shadow.self = shadow;
        $._shadow.tags = shadowTags;
        $._shadow.text = text;
        // Attach extension(s)
        if (isSet(state) && isArray(state.with)) {
            for (var i = 0, j = toCount(state.with); i < j; ++i) {
                var _value = state.with[i];
                if (isString(_value)) {
                    _value = TagPicker[_value];
                }
                // `const Extension = function (self, state = {}) {}`
                if (isFunction(_value)) {
                    _value.call($, self, state);
                    continue;
                }
                // `const Extension = {attach: function (self, state = {}) {}, detach: function (self, state = {}) {}}`
                if (isObject(_value) && isFunction(_value.attach)) {
                    _value.attach.call($, self, state);
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
            self = $.self,
            state = $.state;
        $._active = false;
        offEvent('focus', self, onEventFocusSelf);
        offEvent('keydown', self._shadow.input, onEventKeyDownTextInput);
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
        return $;
    };
    $$.focus = function () {};
    $$.get = function () {};
    $$.let = function () {};
    $$.set = function (v) {
        var $ = this;
        var tag = setElement('span', {
            'class': $.state['class'] + '__tag',
            'tabindex': -1
        });
        var tagText = setElement('span', v);
        var x = setElement('a', {
            'class': $.state['class'] + '__tag-x',
            'href': "",
            'tabindex': -1,
            'target': '_top'
        });
        onEvent('click', x, onEventClickTagX);
        setChildLast(tag, tagText);
        setChildLast(tag, x);
        setPrev($._shadow.text, tag);
        setText($._shadow.input, "");
    };
    Object.defineProperty($$, 'value', {
        get: function get() {
            return this.self.value;
        },
        set: function set(value) {
            this.self.value = value;
        }
    });
    return TagPicker;
}));