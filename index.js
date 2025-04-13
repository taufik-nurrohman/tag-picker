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
    var isFloat = function isFloat(x) {
        return isNumber(x) && 0 !== x % 1;
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
    var fromJSON = function fromJSON(x) {
        var value = null;
        try {
            value = JSON.parse(x);
        } catch (e) {}
        return value;
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
    var toMapCount = function toMapCount(x) {
        return x.size;
    };
    var toNumber = function toNumber(x, base) {
        if (base === void 0) {
            base = 10;
        }
        return base ? parseInt(x, base) : parseFloat(x);
    };
    var toString = function toString(x, base) {
        return isNumber(x) ? x.toString(base) : "" + x;
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
    var forEachObject$1 = function forEachObject(object, at) {
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
    var getPrototype = function getPrototype(of) {
        return of.prototype;
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
    var setObjectAttributes = function setObjectAttributes(of, attributes, asStaticAttributes) {
        if (!asStaticAttributes) {
            of = getPrototype(of);
        }
        return forEachObject$1(attributes, function (v, k) {
            Object.defineProperty(of, k, v);
        }), of;
    };
    var setObjectMethods = function setObjectMethods(of, methods, asStaticMethods) {
        {
            of = getPrototype(of);
        }
        return forEachObject$1(methods, function (v, k) {
            of [k] = v;
        }), of;
    };
    var setReference = function setReference(key, value) {
        return setValueInMap(key, value, references);
    };
    var setValueInMap = function setValueInMap(k, v, map) {
        return map.set(k, v);
    };
    var references = new WeakMap();

    function _toArray(iterable) {
        return Array.from(iterable);
    }
    var D = document;
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
    var getChildFirst = function getChildFirst(parent, anyNode) {
        return parent['first' + (anyNode ? "" : 'Element') + 'Child'] || null;
    };
    var getChildren = function getChildren(parent, index, anyNode) {
        var children = _toArray(parent['child' + ('Nodes')]);
        return isNumber(index) ? children[index] || null : children;
    };
    var getDatum = function getDatum(node, datum, parseValue) {
        if (parseValue === void 0) {
            parseValue = true;
        }
        var value = getAttribute(node, 'data-' + datum, parseValue),
            v = (value + "").trim();
        if (parseValue && v && ('[' === v[0] && ']' === v.slice(-1) || '{' === v[0] && '}' === v.slice(-1)) && null !== (v = fromJSON(value))) {
            return v;
        }
        return value;
    };
    var getElement = function getElement(query, scope) {
        return (scope || D).querySelector(query);
    };
    var getElementIndex = function getElementIndex(node, anyNode) {
        if (!node || !getParent(node)) {
            return -1;
        }
        var index = 0;
        while (node = getPrev(node, anyNode)) {
            ++index;
        }
        return index;
    };
    var getID = function getID(node, batch) {
        if (batch === void 0) {
            batch = 'e:';
        }
        if (hasID(node)) {
            return getAttribute(node, 'id');
        }
        if (!isSet(theID[batch])) {
            theID[batch] = 0;
        }
        return batch + toString(Date.now() + (theID[batch] += 1), 16);
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
        return node['previous' + (anyNode ? "" : 'Element') + 'Sibling'] || null;
    };
    var getState = function getState(node, state) {
        return hasState(node, state) && node[state] || null;
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
    var hasID = function hasID(node) {
        return hasAttribute(node, 'id');
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
        return forEachObject$1(data, function (v, k) {
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
        return forEachObject$1(attributes, function (v, k) {
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
            return forEachObject$1(classes, function (v, k) {
                return v ? setClass(node, k) : letClass(node, k);
            }), node;
        }
        return node.className = classes, node;
    };
    var setData = function setData(node, data) {
        return forEachObject$1(data, function (v, k) {
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
    var setID = function setID(node, value, batch) {
        if (batch === void 0) {
            batch = 'e:';
        }
        return setAttribute(node, 'id', isSet(value) ? value : getID(node, batch));
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
        return forEachObject$1(styles, function (v, k) {
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
    var setValue = function setValue(node, value) {
        if (null === value) {
            return letAttribute(node, 'value');
        }
        return node.value = _fromValue(value), node;
    };
    var theID = {};
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
                forEachArray(getChildren(nodeCurrent, null), function (v) {
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
    var onEvent = function onEvent(name, node, then, options) {
        if (options === void 0) {
            options = false;
        }
        node.addEventListener(name, then, options);
    };
    var KEY_ENTER = 'Enter';
    var KEY_TAB = 'Tab';
    var name = 'TagPicker';

    function createTags($, tags) {
        var map = isInstance(tags, Map) ? tags : new Map();
        if (isArray(tags)) {
            forEachArray(tags, function (tag) {
                if (isArray(tag)) {
                    var _tag$, _tag$2, _tag$1$value;
                    tag[0] = (_tag$ = tag[0]) != null ? _tag$ : "";
                    tag[1] = (_tag$2 = tag[1]) != null ? _tag$2 : {};
                    setValueInMap(_toValue((_tag$1$value = tag[1].value) != null ? _tag$1$value : tag[0]), tag, map);
                } else {
                    setValueInMap(_toValue(tag), [tag, {}], map);
                }
            });
        } else if (isObject(tags, 0)) {
            forEachObject(tags, function (v, k) {
                if (isArray(v)) {
                    var _v$, _v$2, _v$1$value;
                    tags[k][0] = (_v$ = v[0]) != null ? _v$ : "";
                    tags[k][1] = (_v$2 = v[1]) != null ? _v$2 : {};
                    setValueInMap(_toValue((_v$1$value = v[1].value) != null ? _v$1$value : k), v, map);
                } else {
                    setValueInMap(_toValue(k), [v, {}], map);
                }
            });
        }
        var _tags = $._tags,
            self = $.self,
            state = $.state;
        state.n;
        var r = [];
        getValue(self);
        // Reset the tag(s) data, but do not fire the `let.tags` hook
        _tags.delete(null, 0);
        forEachMap(map, function (v, k) {
            var _v$1$value3;
            if (isArray(v) && v[1] && !v[1].disabled) {
                var _v$1$value2;
                r.push(_toValue((_v$1$value2 = v[1].value) != null ? _v$1$value2 : k));
            }
            // Set the tag data, but do not fire the `set.tag` hook
            _tags.set(_toValue(isArray(v) && v[1] ? (_v$1$value3 = v[1].value) != null ? _v$1$value3 : k : k), v, 0);
        });
        state.tags = map;
        return r;
    }

    function focusTo(node) {
        return node.focus(), node;
    }

    function getTagValue(tag, parseValue) {
        return getDatum(tag, 'value', parseValue);
    }

    function onBeforeInputTextInput(e) {
        var $ = this,
            data = e.data,
            picker = getReference($);
        picker._active;
        var _mask = picker._mask,
            state = picker.state,
            tags = picker.tags;
        _mask.hint;
        var escape = state.escape,
            exit,
            key;
        key = isString(data) && 1 === toCount(data) ? data : 0;
        picker._event = e;
        if (KEY_ENTER === key && (hasValue('\n', escape) || hasValue(13, escape)) || KEY_TAB === key && (hasValue('\t', escape) || hasValue(9, escape)) || hasValue(key, escape)) {
            exit = true;
            setValueInMap(_toValue(v = getText($)), v, tags);
            picker.focus().text = "";
        }
        exit && offEventDefault(e);
    }

    function onCutTextInput() {
        var $ = this,
            picker = getReference($),
            _mask = picker._mask,
            hint = _mask.hint;
        delay(function () {
            return getText($, 0) ? setStyle(hint, 'visibility', 'hidden') : letStyle(hint, 'visibility');
        }, 1)();
    }

    function onFocusSelf() {
        getReference(this).focus();
    }

    function onKeyDownTextInput(e) {
        var $ = this,
            key = e.key,
            keyCode = e.keyCode;
        e.ctrlKey;
        e.shiftKey;
        var picker = getReference($),
            _active = picker._active,
            _mask = picker._mask,
            state = picker.state,
            tags = picker.tags,
            hint = _mask.hint,
            escape = state.escape,
            exit,
            v;
        if (!_active) {
            return offEventDefault(e);
        }
        picker._event = e;
        delay(function () {
            return getText($, 0) ? setStyle(hint, 'visibility', 'hidden') : letStyle(hint, 'visibility');
        }, 1)();
        if (KEY_ENTER === key && (hasValue('\n', escape) || hasValue(13, escape)) || KEY_TAB === key && (hasValue('\t', escape) || hasValue(9, escape)) || hasValue(key, escape) || hasValue(keyCode, escape)) {
            exit = true;
            setValueInMap(_toValue(v = getText($)), v, tags);
            picker.focus().text = "";
        }
        exit && offEventDefault(e);
    }

    function onPasteTextInput(e) {
        offEventDefault(e);
        var $ = this,
            picker = getReference($),
            _mask = picker._mask,
            hint = _mask.hint;
        delay(function () {
            return getText($, 0) ? setStyle(hint, 'visibility', 'hidden') : letStyle(hint, 'visibility');
        }, 1)();
        insertAtSelection($, e.clipboardData.getData('text/plain'));
    }

    function onPointerDownTagX(e) {
        var $ = this,
            tag = getParent($),
            picker = getReference(tag),
            tags = picker.tags;
        picker._event = e;
        offEvent('mousedown', $, onPointerDownTagX);
        offEvent('touchstart', $, onPointerDownTagX);
        letValueInMap(getTagValue(tag, 1), tags);
        picker.focus(), offEventDefault(e);
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
        // Special case for `state.escape`: replace instead of join the value(s)
        if (isObject(state) && state.escape) {
            newState.escape = state.escape;
        }
        return $.attach(self, newState);
    }

    function TagPickerTags(of, tags) {
        var $ = this;
        // Return new instance if `TagPickerTags` was called without the `new` operator
        if (!isInstance($, TagPickerTags)) {
            return new TagPickerTags(of, tags);
        }
        $.of = of;
        $.values = new Map();
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
    TagPicker.version = '4.1.0';
    setObjectAttributes(TagPicker, {
        name: {
            value: name
        }
    }, 1);
    setObjectAttributes(TagPicker, {
        active: {
            get: function get() {
                return this._active;
            },
            set: function set(value) {
                var $ = this;
                return $;
            }
        },
        fix: {
            get: function get() {
                return this._fix;
            },
            set: function set(value) {
                var $ = this;
                return $;
            }
        },
        max: {
            get: function get() {},
            set: function set(value) {
                var $ = this;
                return $;
            }
        },
        min: {
            get: function get() {},
            set: function set(value) {
                var $ = this;
                return $;
            }
        },
        tags: {
            get: function get() {
                return this._tags;
            },
            set: function set(options) {
                var $ = this,
                    values = [];
                forEachMap($._tags, function (v) {
                    return values.push(getTagValue(v[2]));
                });
                return $.fire('set.tags', [values]);
            }
        },
        text: {
            get: function get() {
                return getText(this._mask.input);
            },
            set: function set(value) {
                var $ = this,
                    _active = $._active,
                    _mask = $._mask,
                    hint = _mask.hint,
                    input = _mask.input,
                    v;
                if (!_active) {
                    return $;
                }
                setText(input, v = _fromValue(value));
                return v ? setStyle(hint, 'visibility', 'hidden') : letStyle(hint, 'visibility'), $;
            }
        },
        value: {
            get: function get() {
                var value = getValue(this.self);
                return "" !== value ? value : null;
            },
            set: function set(value) {
                var $ = this,
                    state = $.state;
                if ($.value) {
                    forEachArray($.value.split(state.join), function (v) {
                        return $.tags.let(v, 0);
                    });
                }
                forEachArray(value.split(state.join), function (v) {
                    return $.tags.set(v, 0);
                });
                return $;
            }
        }
    });
    TagPicker._ = setObjectMethods(TagPicker, {
        attach: function attach(self, state) {
            var $ = this;
            self = self || $.self;
            if (state && isString(state)) {
                state = {
                    join: state
                };
            }
            state = _fromStates({}, $.state, state || {});
            $._event = null;
            $._tags = new TagPickerTags($);
            $._value = null;
            $.self = self;
            $.state = state;
            var _state = state;
            _state.max;
            var min = _state.min,
                n = _state.n,
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
            var form = getParentForm(self);
            var mask = setElement('div', {
                'aria': {
                    'disabled': isDisabledSelf ? 'true' : false,
                    'multiselectable': 'true',
                    'readonly': isReadOnlySelf ? 'true' : false
                },
                'class': n,
                'role': 'combobox'
            });
            $.mask = mask;
            var maskFlex = setElement('span', {
                'class': n + '__flex',
                'role': 'group'
            });
            var text = setElement('span', {
                'class': n + '__text'
            });
            var textInput = setElement('span', {
                'aria': {
                    'disabled': isDisabledSelf ? 'true' : false,
                    'multiline': 'false',
                    'placeholder': theInputPlaceholder,
                    'readonly': isReadOnlySelf ? 'true' : false
                },
                'autocapitalize': 'off',
                'contenteditable': isDisabledSelf || isReadOnlySelf ? false : "",
                'role': 'textbox',
                'spellcheck': 'false',
                'tabindex': isReadOnlySelf ? 0 : false
            });
            var textInputHint = setElement('span', theInputPlaceholder + "", {
                'aria': {
                    'hidden': 'true'
                }
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
                values: new Set()
            };
            // Re-assign some state value(s) using the setter to either normalize or reject the initial value
            // $.max = isMultipleSelect ? (max ?? Infinity) : 1;
            // $.min = isInputSelf ? 0 : (min ?? 1);
            var _active = $._active,
                _state2 = state,
                join = _state2.join,
                tags = _state2.tags,
                values;
            // Force the `this._active` value to `true` to set the initial value
            $._active = true;
            // Attach the current tag(s)
            values = createTags($, tags || theInputValue.split(join));
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
                forEachArray(state.with, function (v, k) {
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
        focus: function focus(mode) {
            var $ = this,
                _mask = $._mask,
                input = _mask.input;
            return focusTo(input), selectTo(input, mode), $;
        }
    });
    setObjectAttributes(TagPickerTags, {
        name: {
            value: name + 'Tags'
        }
    }, 1);
    setObjectMethods(TagPickerTags, {
        at: function at(key) {
            return getValueInMap(_toValue(key), this.values);
        },
        count: function count() {
            return toMapCount(this.values);
        },
        delete: function _delete(key, _fireHook) {
            if (_fireHook === void 0) {
                _fireHook = 1;
            }
            var $ = this,
                of = $.of,
                values = $.values,
                _active = of._active;
            of._mask;
            var self = of.self,
                state = of.state,
                join = state.join,
                n = state.n,
                r,
                tagsValues = [];
            if (!_active) {
                return false;
            }
            if (!isSet(key)) {
                forEachMap(values, function (v, k) {
                    return $.delete(k, 0);
                });
                return _fireHook && of.fire('let.tags', [
                    []
                ]) && 0 === $.count();
            }
            if (!(r = getValueInMap(key = _toValue(key), values))) {
                return _fireHook && of.fire('not.tag', [key]), false;
            }
            var tag = r[2],
                tagX = getElement('.' + n + '__x', tag);
            offEvent('mousedown', tagX, onPointerDownTagX);
            offEvent('touchstart', tagX, onPointerDownTagX);
            letElement(tag);
            r = letValueInMap(key, values);
            state.tags = values;
            forEachMap(values, function (v, k) {
                return tagsValues.push(_fromValue(k));
            });
            setValue(self, tagsValues = tagsValues.join(join));
            return _fireHook && of.fire('let.tag', [key]).fire('change', ["" !== tagsValues ? tagsValues : null]), r;
        },
        get: function get(key) {
            var $ = this,
                values = $.values,
                value = getValueInMap(_toValue(key), values);
            return value ? getElementIndex(value[2]) : -1;
        },
        has: function has(key) {
            return hasKeyInMap(_toValue(key), this.values);
        },
        let: function _let(key, _fireHook) {
            if (_fireHook === void 0) {
                _fireHook = 1;
            }
            return this.delete(key, _fireHook);
        },
        set: function set(key, value, _fireHook) {
            var _getState;
            if (_fireHook === void 0) {
                _fireHook = 1;
            }
            var $ = this,
                of = $.of,
                values = $.values,
                _active = of._active;
            if (!_active) {
                return false;
            }
            if ($.has(key = _toValue(key))) {
                return _fireHook && of.fire('has.tag', [key]), false;
            }
            var _mask = of._mask,
                self = of.self,
                state = of.state,
                text = _mask.text,
                join = state.join,
                n = state.n,
                classes,
                styles,
                tag,
                tagText,
                tagX,
                tagsValues = [];
            // `picker.tags.set('asdf')`
            if (!isSet(value)) {
                value = [key, {}];
                // `picker.tags.set('asdf', 'asdf')`
            } else if (isFloat(value) || isInteger(value) || isString(value)) {
                value = [value, {}];
                // `picker.tags.set('asdf', [ … ])`
            } else;
            var _value$ = value[1],
                disabled = _value$.disabled,
                selected = _value$.selected,
                v = _value$.value;
            v = _fromValue(v || key);
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
                'title': (_getState = getState(value[1], 'title')) != null ? _getState : false
            });
            tagText = value[2] ? getElement('.' + n + '__tag-text', value[2]) : setElement('span', _fromValue(value[0]), {
                'class': n + '__tag-text',
                'role': 'none'
            });
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
            forEachMap(values, function (v, k) {
                return tagsValues.push(_fromValue(k));
            });
            setValue(self, tagsValues = tagsValues.join(join));
            return _fireHook && of.fire('set.tag', [key]).fire('change', ["" !== tagsValues ? tagsValues : null]), true;
        }
    });
    TagPicker.Tags = TagPickerTags;
    return TagPicker;
}));