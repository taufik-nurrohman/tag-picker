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
    var isNumber = function isNumber(x) {
        return 'number' === typeof x;
    };
    var isNumeric = function isNumeric(x) {
        return /^-?(?:\d*.)?\d+$/.test(x + "");
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
    var toNumber = function toNumber(x, base) {
        if (base === void 0) {
            base = 10;
        }
        return base ? parseInt(x, base) : parseFloat(x);
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
    var toValue = function toValue(x) {
        if (isArray(x)) {
            return x.map(function (v) {
                return toValue(v);
            });
        }
        if (isNumeric(x)) {
            return toNumber(x);
        }
        if (isObject(x)) {
            for (var k in x) {
                x[k] = toValue(x[k]);
            }
            return x;
        }
        if ('false' === x) {
            return false;
        }
        if ('null' === x) {
            return null;
        }
        if ('true' === x) {
            return true;
        }
        return x;
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
    var getAttribute = function getAttribute(node, attribute, parseValue) {
        if (parseValue === void 0) {
            parseValue = true;
        }
        if (!hasAttribute(node, attribute)) {
            return null;
        }
        var value = node.getAttribute(attribute);
        return parseValue ? toValue(value) : value;
    };
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
    var hasAttribute = function hasAttribute(node, attribute) {
        return node.hasAttribute(attribute);
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
        return (self.value || getAttribute(self, 'value', false) || "").replace(/\r/g, "");
    }

    function isDisabled(self) {
        return self.disabled;
    }

    function isReadOnly(self) {
        return self.readOnly;
    }

    function selectNone(node) {
        var selection = D.getSelection();
        {
            selection.removeAllRanges();
        }
    }

    function selectTo(node) {
        var selection = D.getSelection();
        selectNone();
        var range = D.createRange();
        range.selectNodeContents(node);
        selection.addRange(range);
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
        'max': 9999,
        'min': 0,
        'n': 'tag-picker',
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
            var value = this.self.value;
            return "" === value ? null : value;
        },
        set: function set(value) {
            var $ = this;
            $._tags;
            var state = $.state;
            $.value.split(state.join).forEach(function (tag) {
                return $.let(tag, 0);
            });
            value.split(state.join).forEach(function (tag) {
                return $.set(tag, 0);
            });
            $.fire('change');
        }
    });
    // <https://www.unicode.org/reports/tr18/tr18-23.html#General_Category_Property>
    $$._filter = function (v) {
        var $ = this,
            state = $.state;
        return (v || "").replace(/(?:[\0- \x7F-\xA0\xAD\u0300-\u036F\u0378\u0379\u0380-\u0383\u038B\u038D\u03A2\u0483-\u0489\u0530\u0557\u0558\u058B\u058C\u0590-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7-\u05CF\u05EB-\u05EE\u05F5-\u0605\u0610-\u061A\u061C\u064B-\u065F\u0670\u06D6-\u06DD\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u070E\u070F\u0711\u0730-\u074C\u07A6-\u07B0\u07B2-\u07BF\u07EB-\u07F3\u07FB-\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082F\u083F\u0859-\u085D\u085F\u086B-\u086F\u088F-\u089F\u08CA-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA-\u09BC\u09BE-\u09CD\u09CF-\u09DB\u09DE\u09E2-\u09E5\u09FE-\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A-\u0A58\u0A5D\u0A5F-\u0A65\u0A70\u0A71\u0A75\u0A77-\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA-\u0ABC\u0ABE-\u0ACF\u0AD1-\u0ADF\u0AE2-\u0AE5\u0AF2-\u0AF8\u0AFA-\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A-\u0B3C\u0B3E-\u0B5B\u0B5E\u0B62-\u0B65\u0B78-\u0B82\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BCF\u0BD1-\u0BE5\u0BFB-\u0C04\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C3E-\u0C57\u0C5B\u0C5C\u0C5E\u0C5F\u0C62-\u0C65\u0C70-\u0C76\u0C81-\u0C83\u0C8D\u0C91\u0CA9\u0CB4\u0CBA-\u0CBC\u0CBE-\u0CDC\u0CDF\u0CE2-\u0CE5\u0CF0\u0CF3-\u0D03\u0D0D\u0D11\u0D3B\u0D3C\u0D3E-\u0D4D\u0D50-\u0D53\u0D57\u0D62-\u0D65\u0D80-\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DE5\u0DF0-\u0DF3\u0DF5-\u0E00\u0E31\u0E34-\u0E3E\u0E47-\u0E4E\u0E5C-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EB1\u0EB4-\u0EBC\u0EBE\u0EBF\u0EC5\u0EC7-\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F48\u0F6D-\u0F84\u0F86\u0F87\u0F8D-\u0FBD\u0FC6\u0FCD\u0FDB-\u0FFF\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B-\u135F\u137D-\u137F\u139A-\u139F\u13F6\u13F7\u13FE\u13FF\u1680\u169D-\u169F\u16F9-\u16FF\u1712-\u171E\u1732-\u1734\u1737-\u173F\u1752-\u175F\u176D\u1771-\u177F\u17B4-\u17D3\u17DD-\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180B-\u180F\u181A-\u181F\u1879-\u187F\u1885\u1886\u18A9\u18AB-\u18AF\u18F6-\u18FF\u191F-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A17-\u1A1D\u1A55-\u1A7F\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1B04\u1B34-\u1B44\u1B4D-\u1B4F\u1B6B-\u1B73\u1B7F-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BFB\u1C24-\u1C3A\u1C4A-\u1C4C\u1C89-\u1C8F\u1CBB\u1CBC\u1CC8-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1CFB-\u1CFF\u1DC0-\u1DFF\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF-\u200F\u2028-\u202F\u205F-\u206F\u2072\u2073\u208F\u209D-\u209F\u20C1-\u20FF\u218C-\u218F\u2427-\u243F\u244B-\u245F\u2B74\u2B75\u2B96\u2CEF-\u2CF1\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7F\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF-\u2DFF\u2E5E-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u3000\u302A-\u302F\u3040\u3097-\u309A\u3100-\u3104\u3130\u318F\u31E4-\u31EE\u321F\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA6F8-\uA6FF\uA7CB-\uA7CF\uA7D2\uA7D4\uA7DA-\uA7F1\uA802\uA806\uA80B\uA823-\uA827\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA881\uA8B4-\uA8CD\uA8DA-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA95E\uA97D-\uA983\uA9B3-\uA9C0\uA9CE\uA9DA-\uA9DD\uA9E5\uA9FF\uAA29-\uAA3F\uAA43\uAA4C-\uAA4F\uAA5A\uAA5B\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAC3-\uAADA\uAAEB-\uAAEF\uAAF5-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB6C-\uAB6F\uABE3-\uABEA\uABEC-\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uE000-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB1E\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC3-\uFBD2\uFD90\uFD91\uFDC8-\uFDCE\uFDD0-\uFDEF\uFE00-\uFE0F\uFE1A-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDCFF\uDD03-\uDD06\uDD34-\uDD36\uDD8F\uDD9D-\uDD9F\uDDA1-\uDDCF\uDDFD-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEE0\uDEFC-\uDEFF\uDF24-\uDF2C\uDF4B-\uDF4F\uDF76-\uDF7F\uDF9E\uDFC4-\uDFC7\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDD6E\uDD7B\uDD8B\uDD93\uDD96\uDDA2\uDDB2\uDDBA\uDDBD-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDF7F\uDF86\uDFB1\uDFBB-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56\uDC9F-\uDCA6\uDCB0-\uDCDF\uDCF3\uDCF6-\uDCFA\uDD1C-\uDD1E\uDD3A-\uDD3E\uDD40-\uDD7F\uDDB8-\uDDBB\uDDD0\uDDD1\uDE01-\uDE0F\uDE14\uDE18\uDE36-\uDE3F\uDE49-\uDE4F\uDE59-\uDE5F\uDEA0-\uDEBF\uDEE5-\uDEEA\uDEF7-\uDEFF\uDF36-\uDF38\uDF56\uDF57\uDF73-\uDF77\uDF92-\uDF98\uDF9D-\uDFA8\uDFB0-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCF9\uDD24-\uDD2F\uDD3A-\uDE5F\uDE7F\uDEAA-\uDEAC\uDEAE\uDEAF\uDEB2-\uDEFF\uDF28-\uDF2F\uDF46-\uDF50\uDF5A-\uDF6F\uDF82-\uDF85\uDF8A-\uDFAF\uDFCC-\uDFDF\uDFF7-\uDFFF]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC4E-\uDC51\uDC70\uDC73\uDC74\uDC76-\uDC82\uDCB0-\uDCBA\uDCBD\uDCC2-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDD02\uDD27-\uDD35\uDD45\uDD46\uDD48-\uDD4F\uDD73\uDD77-\uDD82\uDDB3-\uDDC0\uDDC9-\uDDCC\uDDCE\uDDCF\uDDE0\uDDF5-\uDDFF\uDE12\uDE2C-\uDE37\uDE3E\uDE41-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEAA-\uDEAF\uDEDF-\uDEEF\uDEFA-\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A-\uDF3C\uDF3E-\uDF4F\uDF51-\uDF5C\uDF62-\uDFFF]|\uD805[\uDC35-\uDC46\uDC5C\uDC5E\uDC62-\uDC7F\uDCB0-\uDCC3\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDAF-\uDDC0\uDDDC-\uDDFF\uDE30-\uDE40\uDE45-\uDE4F\uDE5A-\uDE5F\uDE6D-\uDE7F\uDEAB-\uDEB7\uDEBA-\uDEBF\uDECA-\uDEFF\uDF1B-\uDF2F\uDF47-\uDFFF]|\uD806[\uDC2C-\uDC3A\uDC3C-\uDC9F\uDCF3-\uDCFE\uDD07\uDD08\uDD0A\uDD0B\uDD14\uDD17\uDD30-\uDD3E\uDD40\uDD42\uDD43\uDD47-\uDD4F\uDD5A-\uDD9F\uDDA8\uDDA9\uDDD1-\uDDE0\uDDE4-\uDDFF\uDE01-\uDE0A\uDE33-\uDE39\uDE3B-\uDE3E\uDE47-\uDE4F\uDE51-\uDE5B\uDE8A-\uDE99\uDEA3-\uDEAF\uDEF9-\uDEFF\uDF0A-\uDFFF]|\uD807[\uDC09\uDC2F-\uDC3F\uDC46-\uDC4F\uDC6D-\uDC6F\uDC90-\uDCFF\uDD07\uDD0A\uDD31-\uDD45\uDD47-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8A-\uDD97\uDD99-\uDD9F\uDDAA-\uDEDF\uDEF3-\uDEF6\uDEF9-\uDF01\uDF03\uDF11\uDF34-\uDF42\uDF5A-\uDFAF\uDFB1-\uDFBF\uDFF2-\uDFFE]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F\uDC75-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD80E-\uD810\uD812-\uD819\uD824-\uD82A\uD82D\uD82E\uD830-\uD832\uD83F\uD87C\uD87D\uD87F\uD889-\uDBFF][\uDC00-\uDFFF]|\uD80B[\uDC00-\uDF8F\uDFF3-\uDFFF]|\uD80D[\uDC30-\uDC40\uDC47-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDE6D\uDEBF\uDECA-\uDECF\uDEEE-\uDEF4\uDEF6-\uDEFF\uDF30-\uDF36\uDF46-\uDF4F\uDF5A\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDE3F\uDE9B-\uDEFF\uDF4B-\uDF4F\uDF51-\uDF92\uDFA0-\uDFDF\uDFE4-\uDFFF]|\uD821[\uDFF8-\uDFFF]|\uD823[\uDCD6-\uDCFF\uDD09-\uDFFF]|\uD82B[\uDC00-\uDFEF\uDFF4\uDFFC\uDFFF]|\uD82C[\uDD23-\uDD31\uDD33-\uDD4F\uDD53\uDD54\uDD56-\uDD63\uDD68-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A\uDC9B\uDC9D\uDC9E\uDCA0-\uDFFF]|\uD833[\uDC00-\uDF4F\uDFC4-\uDFFF]|\uD834[\uDCF6-\uDCFF\uDD27\uDD28\uDD65-\uDD69\uDD6D-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDDEB-\uDDFF\uDE42-\uDE44\uDE46-\uDEBF\uDED4-\uDEDF\uDEF4-\uDEFF\uDF57-\uDF5F\uDF79-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE8C-\uDFFF]|\uD837[\uDC00-\uDEFF\uDF1F-\uDF24\uDF2B-\uDFFF]|\uD838[\uDC00-\uDC2F\uDC6E-\uDCFF\uDD2D-\uDD36\uDD3E\uDD3F\uDD4A-\uDD4D\uDD50-\uDE8F\uDEAE-\uDEBF\uDEEC-\uDEEF\uDEFA-\uDEFE\uDF00-\uDFFF]|\uD839[\uDC00-\uDCCF\uDCEC-\uDCEF\uDCFA-\uDFDF\uDFE7\uDFEC\uDFEF\uDFFF]|\uD83A[\uDCC5\uDCC6\uDCD0-\uDCFF\uDD44-\uDD4A\uDD4C-\uDD4F\uDD5A-\uDD5D\uDD60-\uDFFF]|\uD83B[\uDC00-\uDC70\uDCB5-\uDD00\uDD3E-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDEEF\uDEF2-\uDFFF]|\uD83C[\uDC2C-\uDC2F\uDC94-\uDC9F\uDCAF\uDCB0\uDCC0\uDCD0\uDCF6-\uDCFF\uDDAE-\uDDE5\uDE03-\uDE0F\uDE3C-\uDE3F\uDE49-\uDE4F\uDE52-\uDE5F\uDE66-\uDEFF]|\uD83D[\uDED8-\uDEDB\uDEED-\uDEEF\uDEFD-\uDEFF\uDF77-\uDF7A\uDFDA-\uDFDF\uDFEC-\uDFEF\uDFF1-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE\uDCAF\uDCB2-\uDCFF\uDE54-\uDE5F\uDE6E\uDE6F\uDE7D-\uDE7F\uDE89-\uDE8F\uDEBE\uDEC6-\uDECD\uDEDC-\uDEDF\uDEE9-\uDEEF\uDEF9-\uDEFF\uDF93\uDFCB-\uDFEF\uDFFA-\uDFFF]|\uD869[\uDEE0-\uDEFF]|\uD86D[\uDF3A-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFEF]|\uD87B[\uDE5E-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD884[\uDF4B-\uDF4F]|\uD888[\uDFB0-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g, ' ').split(state.join).join("").replace(/\s+/g, ' ').trim();
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
                selection.push(k), picker.let(k);
            }
        }
        e.clipboardData.setData('text/plain', selection.join(state.join));
        picker.fire('cut', [e, selection]).focus();
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
            n = state.n + '__tag--selected';
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
                picker.let($.title);
                if (toCount(selection) > 1) {
                    var current;
                    while (current = selection.pop()) {
                        prevTag = _tags[current] && getPrev(_tags[current]);
                        picker.let(current);
                    }
                }
                prevTag ? (focusTo(prevTag), selectTo(getChildFirst(prevTag))) : picker.focus();
                exit = true;
            } else if (KEY_DELETE_RIGHT === key) {
                picker.let($.title);
                if (toCount(selection) > 1) {
                    var _current;
                    while (_current = selection.shift()) {
                        nextTag = _tags[_current] && getNext(_tags[_current]);
                        picker.let(_current);
                    }
                }
                nextTag && text !== nextTag ? (focusTo(nextTag), selectTo(getChildFirst(nextTag))) : picker.focus();
                exit = true;
            } else if (KEY_ESCAPE === key || KEY_TAB === key) {
                picker.focus();
                exit = true;
            }
        }
        exit && offEventDefault(e);
    }

    function onKeyUpTag() {
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
        if (isAllSelected) {
            picker.value.split(state.join).forEach(function (tag) {
                return picker.let(tag, 0);
            });
        }
        var values = value.split(state.join);
        values.forEach(function (tag) {
            return picker.set(tag, 0);
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
            if (null !== value) {
                var values = value.split(state.join);
                values.forEach(function (tag) {
                    return picker.set(tag, 0);
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
        picker.let(tag.title);
        picker.focus(), offEventDefault(e);
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
        state = state || $.state;
        $._active = !isDisabled(self) && !isReadOnly(self);
        $._tags = {};
        $._value = getValue(self);
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
        $._value.split(isString(state) ? state : state.join).forEach(function (tag) {
            return $.set(tag, 0, 1);
        });
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
        var form = getParentForm(self);
        $._active = false;
        if (form) {
            offEvent('reset', form, onResetForm);
            offEvent('submit', form, onSubmitForm);
        }
        offEvent('blur', input, onBlurTextInput);
        offEvent('click', mask, onClickMask);
        offEvent('focus', input, onFocusTextInput);
        offEvent('focus', self, onFocusSelf);
        offEvent('input', input, onInputTextInput);
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
    $$.focus = function () {
        var $ = this,
            _mask = $._mask,
            input = _mask.input;
        return input && (focusTo(input), selectTo(input)), $;
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
        return v;
    };
    $$.let = function (v, _hookChange) {
        if (_hookChange === void 0) {
            _hookChange = true;
        }
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
            return $.value.split(state.join).forEach(function (tag) {
                return $.let(tag, 0);
            }), _value.split(state.join).forEach(function (tag) {
                return $.set(tag, 0);
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
        if (_hookChange) {
            $.fire('change', [v]);
        }
        return $;
    };
    $$.set = function (v, _hookChange, _attach) {
        if (_hookChange === void 0) {
            _hookChange = true;
        }
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
            'class': n += '__tag',
            'tabindex': _active ? -1 : false,
            'title': v
        });
        var tagText = setElement('span', fromHTML(v));
        var tagX = setElement('span', {
            'class': n += '-x',
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
        setPrev(text, tag);
        $._tags[v] = tag;
        self.value = toObjectKeys($._tags).join(state.join);
        $.fire('set.tag', [v]);
        if (_hookChange) {
            $.fire('change', [v]);
        }
        return $;
    };
    return TagPicker;
}));