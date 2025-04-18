/*!
 *
 * The MIT License (MIT)
 *
 * Copyright © 2025 Taufik Nurrohman <https://github.com/taufik-nurrohman>
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

    function _arrayLikeToArray(r, a) {
        (null == a || a > r.length) && (a = r.length);
        for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
        return n;
    }

    function _arrayWithHoles(r) {
        if (Array.isArray(r)) return r;
    }

    function _createForOfIteratorHelperLoose(r, e) {
        var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (t) return (t = t.call(r)).next.bind(t);
        if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || r && "number" == typeof r.length) {
            t && (r = t);
            var o = 0;
            return function () {
                return o >= r.length ? {
                    done: !0
                } : {
                    done: !1,
                    value: r[o++]
                };
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _iterableToArrayLimit(r, l) {
        var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (null != t) {
            var e,
                n,
                i,
                u,
                a = [],
                f = !0,
                o = !1;
            try {
                if (i = (t = t.call(r)).next, 0 === l) {
                    if (Object(t) !== t) return;
                    f = !1;
                } else
                    for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
            } catch (r) {
                o = !0, n = r;
            } finally {
                try {
                    if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
                } finally {
                    if (o) throw n;
                }
            }
            return a;
        }
    }

    function _maybeArrayLike(r, a, e) {
        if (a && !Array.isArray(a) && "number" == typeof a.length) {
            var y = a.length;
            return _arrayLikeToArray(a, e < y ? e : y);
        }
        return r(a, e);
    }

    function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _slicedToArray(r, e) {
        return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
    }

    function _unsupportedIterableToArray(r, a) {
        if (r) {
            if ("string" == typeof r) return _arrayLikeToArray(r, a);
            var t = {}.toString.call(r).slice(8, -1);
            return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
        }
    }
    var isArray = function isArray(x) {
        return Array.isArray(x);
    };
    var isDefined = function isDefined(x) {
        return 'undefined' !== typeof x;
    };
    var isFunction = function isFunction(x) {
        return 'function' === typeof x;
    };
    var isInstance = function isInstance(x, of, exact) {
        if (!x || 'object' !== typeof x) {
            return false;
        }
        if (exact) {
            return isSet(of) && isSet(x.constructor) && of === x.constructor;
        }
        return isSet(of) && x instanceof of ;
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
    var isNumeric = function isNumeric(x) {
        return /^[+-]?(?:\d*\.)?\d+$/.test(x + "");
    };
    var isObject = function isObject(x, isPlain) {
        if (isPlain === void 0) {
            isPlain = true;
        }
        if (!x || 'object' !== typeof x) {
            return false;
        }
        return isPlain ? isInstance(x, Object, 1) : true;
    };
    var isSet = function isSet(x) {
        return isDefined(x) && !isNull(x);
    };
    var isString = function isString(x) {
        return 'string' === typeof x;
    };
    var hasValue = function hasValue(x, data) {
        return -1 !== data.indexOf(x);
    };
    var fromHTML = function fromHTML(x, escapeQuote) {
        x = x.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;');
        return x;
    };
    var _fromStates = function fromStates() {
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
                    out[k] = _fromStates({
                        /* Clone! */ }, out[k], lot[i][k]);
                    // Replace value
                } else {
                    out[k] = lot[i][k];
                }
            }
        }
        return out;
    };
    var _fromValue = function fromValue(x) {
        if (isArray(x)) {
            return x.map(function (v) {
                return _fromValue(x);
            });
        }
        if (isObject(x)) {
            for (var k in x) {
                x[k] = _fromValue(x[k]);
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
    var toCaseCamel = function toCaseCamel(x) {
        return x.replace(/[-_.](\w)/g, function (m0, m1) {
            return toCaseUpper(m1);
        });
    };
    var toCaseLower = function toCaseLower(x) {
        return x.toLowerCase();
    };
    var toCaseUpper = function toCaseUpper(x) {
        return x.toUpperCase();
    };
    var toCount = function toCount(x) {
        return x.length;
    };
    var toJSON = function toJSON(x) {
        return JSON.stringify(x);
    };
    var toNumber = function toNumber(x, base) {
        if (base === void 0) {
            base = 10;
        }
        return base ? parseInt(x, base) : parseFloat(x);
    };
    var _toValue = function toValue(x) {
        if (isArray(x)) {
            return x.map(function (v) {
                return _toValue(v);
            });
        }
        if (isObject(x)) {
            for (var k in x) {
                x[k] = _toValue(x[k]);
            }
            return x;
        }
        if (isString(x) && isNumeric(x)) {
            if ('0' === x[0] && -1 === x.indexOf('.')) {
                return x;
            }
            return toNumber(x);
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
    var forEachArray = function forEachArray(array, at) {
        for (var i = 0, j = toCount(array), v; i < j; ++i) {
            v = at(array[i], i);
            if (-1 === v) {
                array.splice(i, 1);
                continue;
            }
            if (0 === v) {
                break;
            }
            if (1 === v) {
                continue;
            }
        }
        return array;
    };
    var forEachMap = function forEachMap(map, at) {
        for (var _iterator = _createForOfIteratorHelperLoose(map), _step; !(_step = _iterator()).done;) {
            var _step$value = _maybeArrayLike(_slicedToArray, _step.value, 2),
                k = _step$value[0],
                v = _step$value[1];
            v = at(v, k);
            if (-1 === v) {
                letValueInMap(k, map);
                continue;
            }
            if (0 === v) {
                break;
            }
            if (1 === v) {
                continue;
            }
        }
        return map;
    };
    var forEachObject = function forEachObject(object, at) {
        var v;
        for (var k in object) {
            v = at(object[k], k);
            if (-1 === v) {
                delete object[k];
                continue;
            }
            if (0 === v) {
                break;
            }
            if (1 === v) {
                continue;
            }
        }
        return object;
    };
    var getReference = function getReference(key) {
        return getValueInMap(key, references) || null;
    };
    var getValueInMap = function getValueInMap(k, map) {
        return map.get(k);
    };
    var hasKeyInMap = function hasKeyInMap(k, map) {
        return map.has(k);
    };
    var letValueInMap = function letValueInMap(k, map) {
        return map.delete(k);
    };
    var setReference = function setReference(key, value) {
        return setValueInMap(key, value, references);
    };
    var setValueInMap = function setValueInMap(k, v, map) {
        return map.set(k, v);
    };
    var toKeysFromMap = function toKeysFromMap(map) {
        var r = [];
        return forEachMap(map, function (v, k) {
            r.push(k);
        }), r;
    };
    var toValueFirstFromMap = function toValueFirstFromMap(map) {
        return toValuesFromMap(map).shift();
    };
    var toValueLastFromMap = function toValueLastFromMap(map) {
        return toValuesFromMap(map).pop();
    };
    var toValuesFromMap = function toValuesFromMap(map) {
        var r = [];
        return forEachMap(map, function (v) {
            r.push(v);
        }), r;
    };
    var references = new WeakMap();

    function _toArray(iterable) {
        return Array.from(iterable);
    }
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
        return parseValue ? _toValue(value) : value;
    };
    var getChild = function getChild(parent, index, anyNode) {
        return getChildren(parent, index || 0, anyNode);
    };
    var getChildFirst = function getChildFirst(parent, anyNode) {
        return parent['first' + (anyNode ? "" : 'Element') + 'Child'] || null;
    };
    var getChildren = function getChildren(parent, index, anyNode) {
        var children = _toArray(parent['child' + (anyNode ? 'Nodes' : 'ren')]);
        return isNumber(index) ? children[index] || null : children;
    };
    var getDatum = function getDatum(node, datum, parseValue) {
        var value = getAttribute(node, 'data-' + datum, parseValue);
        (value + "").trim();
        return value;
    };
    var getElement = function getElement(query, scope) {
        return (scope || D).querySelector(query);
    };
    var getElements = function getElements(query, scope) {
        return _toArray((scope || D).querySelectorAll(query));
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
    var getType = function getType(node) {
        return node && node.nodeType || null;
    };
    var getValue = function getValue(node, parseValue) {
        var value = (node.value || "").replace(/\r?\n|\r/g, '\n');
        value = value;
        return "" !== value ? value : null;
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
    var isDisabled = function isDisabled(node) {
        return node.disabled;
    };
    var isReadOnly = function isReadOnly(node) {
        return node.readOnly;
    };
    var isRequired = function isRequired(node) {
        return node.required;
    };
    var letAria = function letAria(node, aria) {
        return letAttribute(node, 'aria-' + aria);
    };
    var letAttribute = function letAttribute(node, attribute) {
        return node.removeAttribute(attribute), node;
    };
    var letClass = function letClass(node, value) {
        return node.classList.remove(value), node;
    };
    var letDatum = function letDatum(node, datum) {
        return letAttribute(node, 'data-' + datum);
    };
    var letElement = function letElement(node) {
        var parent = getParent(node);
        return node.remove(), parent;
    };
    var letHTML = function letHTML(node) {
        var state = 'innerHTML';
        return hasState(node, state) && (node[state] = ""), node;
    };
    var letStyle = function letStyle(node, style) {
        return node.style[toCaseCamel(style)] = null, node;
    };
    var setAria = function setAria(node, aria, value) {
        return setAttribute(node, 'aria-' + aria, true === value ? 'true' : value);
    };
    var setArias = function setArias(node, data) {
        return forEachObject(data, function (v, k) {
            v || "" === v || 0 === v ? setAria(node, k, v) : letAria(node, k);
        }), node;
    };
    var setAttribute = function setAttribute(node, attribute, value) {
        if (true === value) {
            value = attribute;
        }
        return node.setAttribute(attribute, _fromValue(value)), node;
    };
    var setAttributes = function setAttributes(node, attributes) {
        return forEachObject(attributes, function (v, k) {
            if ('aria' === k && isObject(v)) {
                return setArias(node, v), 1;
            }
            if ('class' === k) {
                return setClasses(node, v), 1;
            }
            if ('data' === k && isObject(v)) {
                return setData(node, v), 1;
            }
            if ('style' === k && isObject(v)) {
                return setStyles(node, v), 1;
            }
            v || "" === v || 0 === v ? setAttribute(node, k, v) : letAttribute(node, k);
        }), node;
    };
    var setChildLast = function setChildLast(parent, node) {
        return parent.append(node), node;
    };
    var setClass = function setClass(node, value) {
        return node.classList.add(value), node;
    };
    var setClasses = function setClasses(node, classes) {
        if (isArray(classes)) {
            return forEachArray(classes, function (k) {
                return setClass(node, k);
            }), node;
        }
        if (isObject(classes)) {
            return forEachObject(classes, function (v, k) {
                return v ? setClass(node, k) : letClass(node, k);
            }), node;
        }
        return node.className = classes, node;
    };
    var setData = function setData(node, data) {
        return forEachObject(data, function (v, k) {
            v || "" === v || 0 === v ? setDatum(node, k, v) : letDatum(node, k);
        }), node;
    };
    var setDatum = function setDatum(node, datum, value) {
        if (isArray(value) || isObject(value)) {
            value = toJSON(value);
        }
        return setAttribute(node, 'data-' + datum, true === value ? 'true' : value);
    };
    var setElement = function setElement(node, content, attributes, options) {
        node = isString(node) ? D.createElement(node, isString(options) ? {
            is: options
        } : options) : node;
        if (isArray(content) && toCount(content)) {
            letHTML(node);
            forEachArray(content, function (v) {
                return setChildLast(isString(v) ? setElementText(v) : v);
            });
        } else if (isObject(content)) {
            attributes = content;
            content = false;
        }
        if (isString(content)) {
            setHTML(node, content);
        }
        if (isObject(attributes)) {
            return setAttributes(node, attributes), node;
        }
        return node;
    };
    var setElementText = function setElementText(text) {
        return isString(text) ? text = D.createTextNode(text) : text, text;
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
    var setStyle = function setStyle(node, style, value) {
        if (isNumber(value)) {
            value += 'px';
        }
        return node.style[toCaseCamel(style)] = _fromValue(value), node;
    };
    var setStyles = function setStyles(node, styles) {
        return forEachObject(styles, function (v, k) {
            v || "" === v || 0 === v ? setStyle(node, k, v) : letStyle(node, k);
        }), node;
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
            return forEachArray(hooks[event], function (v) {
                v.apply(that || $, data);
            }), $;
        };
        $$.off = function (event, task) {
            var $ = this,
                hooks = $.hooks;
            if (!isSet(event)) {
                return hooks = {}, $;
            }
            if (isSet(hooks[event])) {
                if (isSet(task)) {
                    var j = toCount(hooks[event]);
                    // Clean-up empty hook(s)
                    if (0 === j) {
                        delete hooks[event];
                    } else {
                        for (var i = 0; i < j; ++i) {
                            if (task === hooks[event][i]) {
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
        $$.on = function (event, task) {
            var $ = this,
                hooks = $.hooks;
            if (!isSet(hooks[event])) {
                hooks[event] = [];
            }
            if (isSet(task)) {
                hooks[event].push(task);
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
    var _getSelection = function _getSelection() {
        return D.getSelection();
    };
    var _setRange = function _setRange() {
        return D.createRange();
    };
    // <https://stackoverflow.com/a/6691294/1163000>
    // The `node` parameter is currently not in use
    var insertAtSelection = function insertAtSelection(node, content, mode, selection) {
        selection = selection || _getSelection();
        var from, range, to;
        if (selection.rangeCount) {
            range = selection.getRangeAt(0);
            range.deleteContents();
            to = D.createDocumentFragment();
            var nodeCurrent, nodeFirst, nodeLast;
            if (isString(content)) {
                from = setElement('div');
                setHTML(from, content);
                while (nodeCurrent = getChildFirst(from, 1)) {
                    nodeLast = setChildLast(to, nodeCurrent);
                }
            } else if (isArray(content)) {
                forEachArray(content, function (v) {
                    return nodeLast = setChildLast(to, v);
                });
            } else {
                nodeLast = setChildLast(to, content);
            }
            nodeFirst = getChildFirst(to, 1);
            range.insertNode(to);
            if (nodeLast) {
                range = range.cloneRange();
                range.setStartAfter(nodeLast);
                range.setStartBefore(nodeFirst);
                setSelection(node, range, selectToNone(selection));
            }
        }
        return selection;
    };
    // The `node` parameter is currently not in use
    var letSelection = function letSelection(node, selection) {
        selection = selection || _getSelection();
        return selection.empty(), selection;
    };
    // <https://stackoverflow.com/a/13950376/1163000>
    var restoreSelection = function restoreSelection(node, store, selection) {
        var index = 0,
            range = _setRange();
        range.setStart(node, 0);
        range.collapse(true);
        var exit,
            hasStart,
            nodeCurrent,
            nodeStack = [node];
        while (!exit && (nodeCurrent = nodeStack.pop())) {
            if (3 === getType(nodeCurrent)) {
                var indexNext = index + toCount(nodeCurrent);
                if (!hasStart && store[0] >= index && store[0] <= indexNext) {
                    range.setStart(nodeCurrent, store[0] - index);
                    hasStart = true;
                }
                if (hasStart && store[1] >= index && store[1] <= indexNext) {
                    exit = true;
                    range.setEnd(nodeCurrent, store[1] - index);
                }
                index = indexNext;
            } else {
                forEachArray(getChildren(nodeCurrent, null, 1), function (v) {
                    return nodeStack.push(v);
                });
            }
        }
        return setSelection(node, range, letSelection(node, selection));
    };
    var selectTo = function selectTo(node, mode, selection) {
        selection = selection || _getSelection();
        letSelection(node, selection);
        var range = _setRange();
        range.selectNodeContents(node);
        selection = setSelection(node, range, selection);
        if (1 === mode) {
            selection.collapseToEnd();
        } else if (-1 === mode) {
            selection.collapseToStart();
        } else;
    };
    var selectToNone = function selectToNone(selection) {
        selection = selection || _getSelection();
        // selection.removeAllRanges();
        if (selection.rangeCount) {
            selection.removeRange(selection.getRangeAt(0));
        }
        return selection;
    };
    // The `node` parameter is currently not in use
    var setSelection = function setSelection(node, range, selection) {
        selection = selection || _getSelection();
        if (isArray(range)) {
            return restoreSelection(node, range, selection);
        }
        return selection.addRange(range), selection;
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

    function getTagValue(tag) {
        return getDatum(tag, 'value', false);
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
        setReference(self, hook($, TagPicker._));
        var newState = _fromStates({}, TagPicker.state, isString(state) ? {
            join: state
        } : state || {});
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
    var $$ = TagPicker._ = TagPicker.prototype;
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
            var $ = this,
                _event = $._event,
                state = $.state;
            if ($.value) {
                forEachArray($.value.split(state.join), function (tag) {
                    return $.let(tag, 1);
                });
            }
            forEachArray(value.split(state.join), function (tag) {
                return $.set(tag, -1, 1);
            });
            $.fire('change', [_event]);
        }
    });
    $$._let = false;
    $$._set = false;
    $$._valid = function (v) {
        var $ = this,
            state = $.state;
        return (v || "").replace(/[^ -~]/g, ' ').split(state.join).join("").replace(/\s+/g, ' ').trim();
    };
    var _keyIsCtrl = false,
        _keyIsShift = false;

    function onBlurTag(e) {
        selectToNone();
        var $ = this,
            picker = getReference($);
        picker._mask;
        var _tags = picker._tags,
            mask = picker.mask,
            state = picker.state,
            n = state.n;
        picker._event = e;
        if (!_keyIsCtrl && !_keyIsShift) {
            forEachMap(_tags, function (v) {
                return letClass(v, n + '__tag--selected');
            });
        }
        letClass(mask, n += '--focus');
        letClass(mask, n += '-tag');
    }

    function onBlurTextInput(e) {
        selectToNone();
        var $ = this,
            picker = getReference($),
            _mask = picker._mask,
            mask = picker.mask,
            state = picker.state,
            text = _mask.text,
            n = state.n;
        picker._event = e;
        letClass(text, n + '__text--focus');
        letClass(mask, n += '--focus');
        letClass(mask, n += '-text');
        picker.fire('blur', [e]);
    }

    function onClickMask(e) {
        var $ = this,
            picker = getReference($),
            on = e.target,
            state = picker.state,
            n = state.n + '__tag';
        picker._event = e;
        if (!hasClass(on, n) && !getParent(on, '.' + n)) {
            picker.focus();
        }
    }

    function onContextMenuTag(e) {
        var $ = this,
            picker = getReference($),
            state = picker.state,
            n = state.n + '__tag--selected';
        picker._event = e;
        setClass($, n);
        focusTo($), selectTo(getChildFirst($));
    }

    function onCopyTag(e) {
        var $ = this,
            picker = getReference($),
            _tags = picker._tags,
            state = picker.state,
            n = state.n + '__tag--selected';
        var selection = [];
        picker._event = e;
        forEachMap(_tags, function (v, k) {
            if (hasClass(v, n)) {
                selection.push(k);
            }
        });
        e.clipboardData.setData('text/plain', selection.join(state.join));
        picker.fire('copy', [e, selection]).focus();
        offEventDefault(e);
    }

    function onCutTag(e) {
        var $ = this,
            picker = getReference($),
            _mask = picker._mask,
            _tags = picker._tags,
            state = picker.state;
        _mask.input;
        var n = state.n + '__tag--selected';
        var selection = [];
        picker._event = e;
        forEachMap(_tags, function (v, k) {
            if (hasClass(v, n)) {
                selection.push(k), picker.let(k, 1);
            }
        });
        e.clipboardData.setData('text/plain', selection.join(state.join));
        picker.fire('cut', [e, selection]).fire('change', [e, getTagValue($)]).focus();
        offEventDefault(e);
    }

    function onFocusTextInput(e) {
        var $ = this,
            picker = getReference($),
            _mask = picker._mask,
            _tags = picker._tags,
            mask = picker.mask,
            self = picker.self,
            state = picker.state,
            hint = _mask.hint,
            input = _mask.input,
            text = _mask.text,
            n = state.n;
        picker._event = e;
        forEachMap(_tags, function (v) {
            return letClass(v, n + '__tag--selected');
        });
        setClass(text, n + '__text--focus');
        setClass(mask, n += '--focus');
        setClass(mask, n += '-text');
        delay(function () {
            return setText(hint, getText(input, false) ? "" : self.placeholder);
        }, 1)();
        picker.focus().fire('focus', [e]);
    }

    function onFocusSelf(e) {
        var $ = this,
            picker = getReference($);
        picker._event = e;
        picker.focus();
    }

    function onInvalidSelf(e) {
        var $ = this,
            picker = getReference($);
        picker._event = e;
        picker.fire('min.tags', [e]).focus(), offEventDefault(e); // Disable native validation tooltip for required input(s)
    }

    function onFocusTag(e) {
        var $ = this,
            picker = getReference($);
        picker._mask;
        var mask = picker.mask,
            state = picker.state,
            n = state.n;
        picker._event = e;
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
            picker = getReference($),
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
                forEachMap(_tags, function (v) {
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
            var selection = [];
            forEachMap(_tags, function (v, k) {
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
                    var c, current;
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
                    var _current;
                    while (_current = selection.shift()) {
                        nextTag = (getValueInMap(_current, _tags)) && getNext(_current);
                        picker.let(_current, 1);
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
        var $ = this,
            key = e.key,
            picker = getReference($),
            _tags = picker._tags,
            state = picker.state,
            n = state.n + '__tag--selected';
        picker._event = e;
        if (_keyIsShift) {
            if (KEY_ARROW_LEFT === key || KEY_ARROW_RIGHT === key);
            else {
                var selection = 0;
                forEachMap(_tags, function (v) {
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
        var $ = this,
            data = e.data,
            picker = getReference($),
            state = picker.state,
            escape = state.escape;
        var key = isString(data) && 1 === toCount(data) ? data : 0;
        picker._event = e;
        if ('\n' === key && (hasValue('\n', escape) || hasValue(13, escape)) || '\t' === key && (hasValue('\t', escape) || hasValue(9, escape)) || hasValue(key, escape)) {
            return picker.set(getText($)).focus().text = "", offEventDefault(e);
        }
    }

    function onKeyDownTextInput(e) {
        var $ = this,
            exit,
            key = e.key,
            keyCode = e.keyCode,
            keyIsCtrl = _keyIsCtrl = e.ctrlKey,
            keyIsShift = _keyIsShift = e.shiftKey,
            picker = getReference($),
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
        picker._event = e;
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
                    lastTag = toValueLastFromMap(_tags);
                    if (lastTag) {
                        lastTag && (focusTo(lastTag), selectTo(getChildFirst(lastTag)));
                        setClass(lastTag, n);
                        exit = true;
                    }
                }
            }
        } else if (keyIsCtrl) {
            if (KEY_A === key && null === getText($, false) && null !== (picker.value)) {
                forEachMap(_tags, function (v) {
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
                var form = getParentForm(self);
                if (form && isFunction(form.requestSubmit)) {
                    // <https://developer.mozilla.org/en-US/docs/Glossary/Submit_button>
                    var submit = getElement('button:not([type]),button[type=submit],input[type=image],input[type=submit]', form);
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
        var $ = this,
            picker = getReference($);
        picker._event = e;
        _keyIsCtrl = _keyIsShift = false;
    }

    function onPasteTag(e) {
        var $ = this,
            picker = getReference($),
            _tags = picker._tags,
            state = picker.state,
            n = state.n + '__tag--selected';
        var isAllSelected = true,
            value = (e.clipboardData || W.clipboardData).getData('text') + "";
        picker._event = e;
        try {
            forEachMap(_tags, function (v) {
                if (!hasClass(v, n)) {
                    isAllSelected = false;
                    throw "";
                }
            });
        } catch (e) {}
        // Delete all tag(s) before paste
        if (isAllSelected && picker.value) {
            forEachArray(picker.value.split(state.join), function (tag) {
                return picker.let(tag, 1);
            });
        }
        var values = value.split(state.join);
        forEachArray(values, function (tag) {
            return picker.set(tag, -1, 1);
        });
        picker.fire('paste', [e, values]).focus().fire('change', [e]);
        offEventDefault(e);
    }

    function onPasteTextInput(e) {
        var $ = this,
            picker = getReference($),
            _mask = picker._mask,
            self = picker.self,
            state = picker.state,
            hint = _mask.hint;
        var value = (e.clipboardData || W.clipboardData).getData('text') + "";
        picker._event = e;
        insertAtSelection($, value), setText(hint, getText($) ? "" : self.placeholder);
        delay(function () {
            value = getText($);
            picker.text = "";
            if (value) {
                var values = value.split(state.join);
                forEachArray(values, function (tag) {
                    return picker.set(tag, -1, 1);
                });
                picker.fire('paste', [e, values]).fire('change', [e]);
            }
        }, 1)();
        offEventDefault(e);
    }

    function onPointerDownTag(e) {
        var $ = this,
            picker = getReference($),
            _active = picker._active,
            _mask = picker._mask,
            _tags = picker._tags,
            state = picker.state,
            text = _mask.text,
            n = state.n + '__tag--selected';
        if (!_active) {
            return;
        }
        picker._event = e;
        focusTo($), toggleClass($, n);
        if (_keyIsCtrl);
        else if (_keyIsShift) {
            selectToNone();
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
            selectToNone();
            var asContextMenu = 2 === e.button,
                // Probably a “right-click”
                selection = 0;
            forEachMap(_tags, function (v) {
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
        var $ = this,
            tag = getParent($),
            picker = getReference(tag);
        picker._event = e;
        offEvent('mousedown', $, onPointerDownTagX);
        offEvent('touchstart', $, onPointerDownTagX);
        picker.let(getTagValue(tag)).focus(), offEventDefault(e);
    }

    function onResetForm(e) {
        var $ = this,
            picker = getReference($);
        picker._event = e;
        picker.let().fire('reset', [e]);
    }

    function onSubmitForm(e) {
        var $ = this,
            picker = getReference($),
            _tags = picker._tags,
            state = picker.state;
        picker._event = e;
        if (_tags.size < state.min) {
            return picker.fire('min.tags', [e]).focus(), offEventDefault(e);
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
        state = _fromStates({}, $.state, state || {});
        if (hasClass(self, state.n + '__self')) {
            return $;
        }
        if (isRequired(self) && !state.min) {
            state.min = 1; // Force minimum tag(s) to insert to be `1`
        }
        $._active = !isDisabled(self) && !isReadOnly(self);
        $._event = null;
        $._tags = new Map();
        $._value = getValue(self) || null;
        $.self = self;
        $.state = state;
        var _state = state,
            n = _state.n;
        var form = getParentForm(self);
        var mask = setElement('div', {
            'class': n,
            'tabindex': isDisabled(self) ? false : -1
        });
        $.mask = mask;
        var maskFlex = setElement('span', {
            'class': n + '__flex'
        });
        var text = setElement('span', {
            'class': n + '__text'
        });
        var textInput = setElement('span', {
            'autocapitalize': 'off',
            'contenteditable': isDisabled(self) ? false : "",
            'spellcheck': 'false'
        });
        var textInputHint = setElement('span', self.placeholder + "");
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
        var _mask = {};
        _mask.flex = maskFlex;
        _mask.hint = textInputHint;
        _mask.input = textInput;
        _mask.of = self;
        _mask.self = mask;
        _mask.text = text;
        $._mask = _mask;
        // Attach the current tag(s)
        if ($._value) {
            forEachArray($._value.split(state.join), function (tag) {
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
        selectToNone();
        var $ = this,
            _mask = $._mask,
            _tags = $._tags,
            input = _mask.input;
        forEachMap(_tags, function (v) {
            return v.blur();
        });
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
            _event = $._event,
            _tags = $._tags;
        if (!_active) {
            return false;
        }
        $.fire('get.tag', [_event, v]);
        if (!hasKeyInMap(v, _tags)) {
            return null;
        }
        var indexOf = -1;
        try {
            forEachMap(_tags, function (value, k) {
                ++indexOf;
                if (v === k) {
                    throw "";
                }
            });
        } catch (e) {}
        return indexOf;
    };
    $$.let = function (v, _skipHookChange) {
        var $ = this,
            _active = $._active,
            _event = $._event,
            _let = $._let,
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
                forEachArray($.value.split(state.join), function (tag) {
                    return $.let(tag, 1);
                });
            }
            return forEachArray(_value.split(state.join), function (tag) {
                return $.set(tag, -1, 1);
            }), $.fire('change', [_event]);
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
        var tag = getValueInMap(v[0], _tags);
        getChild(tag, 0);
        var tagX = getChild(tag, 1);
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
        var _v$;
        var $ = this,
            _active = $._active,
            _event = $._event,
            _mask = $._mask,
            _set = $._set,
            _tags = $._tags,
            _valid = $._valid,
            self = $.self,
            state = $.state,
            text = _mask.text,
            n = state.n,
            pattern = state.pattern;
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
        if ("" === v[0] || isString(pattern) && !toPattern(pattern).test(v[0])) {
            return $.fire('not.tag', [_event, v[0]]);
        }
        if (hasKeyInMap(v[0], _tags)) {
            return $.fire('has.tag', [_event, v[0]]);
        }
        $.fire('is.tag', [_event, v[0]]);
        var tag = setElement('span', {
                'class': n + '__tag',
                'data-value': v[0],
                'tabindex': _active ? -1 : false
            }),
            tagText = setElement('span', fromHTML((_v$ = v[1]) != null ? _v$ : v[0])),
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
            var tags = toKeysFromMap(_tags);
            tags.splice(at, 0, v[0]);
            $._tags = new Map();
            setValueInMap(v[0], tag, _tags);
            if (isFunction(_set)) {
                _set.call($, tag);
            }
            forEachArray(tags, function (k) {
                var v;
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
    return TagPicker;
}));