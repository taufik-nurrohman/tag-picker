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

    function _iterableToArrayLimit(r, l) {
        var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (null != t) {
            var e,
                n,
                i,
                u,
                a = [],
                f = true,
                o = false;
            try {
                if (i = (t = t.call(r)).next, 0 === l) {
                    if (Object(t) !== t) return;
                    f = !1;
                } else
                    for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
            } catch (r) {
                o = true, n = r;
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
            return _arrayLikeToArray(a, void 0 !== e && e < y ? e : y);
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
        return 'number' === typeof x && !Number.isNaN(x);
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

    function _toIterator(v) {
        return v[Symbol.iterator]();
    }
    var forEachArray = function forEachArray(array, at) {
        for (var i = 0, j = toCount(array), v; i < j; ++i) {
            v = at.call(array, array[i], i);
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
        var items = _toIterator(map),
            item = items.next();
        while (!item.done) {
            var _item$value = _maybeArrayLike(_slicedToArray, item.value, 2),
                k = _item$value[0],
                v = _item$value[1];
            v = at.call(map, v, k);
            if (-1 === v) {
                letValueInMap(k, map);
            } else if (0 === v) {
                break;
            }
            item = items.next();
        }
        return map;
    };
    var forEachObject = function forEachObject(object, at) {
        var v;
        for (var k in object) {
            v = at.call(object, object[k], k);
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
        return forEachObject(attributes, function (v, k) {
            Object.defineProperty(of, k, v);
        }), of;
    };
    var setObjectMethods = function setObjectMethods(of, methods, asStaticMethods) {
        {
            of = getPrototype(of);
        }
        return forEachObject(methods, function (v, k) {
            of [k] = v;
        }), of;
    };
    var setReference = function setReference(key, value) {
        return setValueInMap(key, value, references);
    };
    var setValueInMap = function setValueInMap(k, v, map) {
        return map.set(k, v);
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

    function _toArray$1(iterable) {
        return Array.from(iterable);
    }
    var D = document;
    var W = window;
    var getAria = function getAria(node, aria, parseValue) {
        if (parseValue === void 0) {
            parseValue = true;
        }
        return getAttribute(node, 'aria-' + aria, parseValue);
    };
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
        var children = _toArray$1(parent['child' + ('Nodes')]);
        return isNumber(index) ? children[index] || null : children;
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
    var getHTML = function getHTML(node, trim) {
        if (trim === void 0) {
            trim = true;
        }
        var state = 'innerHTML';
        if (!hasState(node, state)) {
            return false;
        }
        var content = node[state];
        content = trim ? content.trim() : content;
        return "" !== content ? content : null;
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
    var getRole = function getRole(node) {
        return getAttribute(node, 'role');
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
        value = parseValue ? _toValue(value) : value;
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
    var setID = function setID(node, value, batch) {
        if (batch === void 0) {
            batch = 'e:';
        }
        return setAttribute(node, 'id', isSet(value) ? value : getID(node, batch));
    };
    var setNext = function setNext(current, node) {
        return current.after(node), node;
    };
    var setPrev = function setPrev(current, node) {
        return current.before(node), node;
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
    var setValue = function setValue(node, value) {
        if (null === value) {
            return letAttribute(node, 'value');
        }
        return node.value = _fromValue(value), node;
    };
    var theID = {};
    var now = Date.now;
    var history = new WeakMap();
    var historyIndex = new WeakMap();
    var _getSelection = function _getSelection() {
        return D.getSelection();
    };
    var _setRange = function _setRange() {
        return D.createRange();
    };
    var getCharBeforeCaret = function getCharBeforeCaret(node, n, selection) {
        selection = selection || _getSelection();
        if (!hasSelection(node, selection)) {
            return null;
        }
        var range = selection.getRangeAt(0).cloneRange();
        range.collapse(true);
        range.setStart(node, 0);
        return (range + "").slice(-1);
    };
    // The `node` parameter is currently not in use
    var hasSelection = function hasSelection(node, selection) {
        return (selection || _getSelection()).rangeCount > 0;
    };
    // <https://stackoverflow.com/a/6691294/1163000>
    // The `node` parameter is currently not in use
    var insertAtSelection = function insertAtSelection(node, content, mode, selection) {
        selection = selection || _getSelection();
        var from, range, to;
        if (!hasSelection(node, selection)) {
            return false;
        }
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
            {
                range.collapse();
            }
            setSelection(node, range, selectToNone(node, selection));
        }
        return selection;
    };
    // The `node` parameter is currently not in use
    var letSelection = function letSelection(node, selection) {
        selection = selection || _getSelection();
        return selection.empty(), selection;
    };
    var redo = function redo(node, selection) {
        var _getValueInMap, _getValueInMap2;
        var h = (_getValueInMap = getValueInMap(node, history)) != null ? _getValueInMap : [],
            i = (_getValueInMap2 = getValueInMap(node, historyIndex)) != null ? _getValueInMap2 : toCount(h) - 1,
            j;
        if (!(j = h[i + 1])) {
            return restoreSelection(node, h[i][1], selection);
        }
        i++;
        setValueInMap(node, i, historyIndex);
        return setHTML(node, j[0]), restoreSelection(node, j[1], selection);
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
    // <https://stackoverflow.com/a/13950376/1163000>
    var saveSelection = function saveSelection(node, selection) {
        var range = (_getSelection()).getRangeAt(0),
            rangeClone = range.cloneRange();
        rangeClone.selectNodeContents(node);
        rangeClone.setEnd(range.startContainer, range.startOffset);
        var start = toCount(rangeClone + "");
        return [start, start + toCount(range + "")];
    };
    var saveState = function saveState(node, selection) {
        var _getValueInMap3, _getValueInMap4, _getHTML;
        var h = (_getValueInMap3 = getValueInMap(node, history)) != null ? _getValueInMap3 : [],
            i = (_getValueInMap4 = getValueInMap(node, historyIndex)) != null ? _getValueInMap4 : toCount(h) - 1,
            j,
            v = (_getHTML = getHTML(node)) != null ? _getHTML : "";
        j = hasSelection(node, selection) ? saveSelection(node) : [];
        if (h[i] && v === h[i][0] && j[0] === h[i][1][0] && j[1] === h[i][1][1]) {
            return node; // No change
        }
        // Trim future history if `undo()` was used
        if (i < toCount(h) - 1) {
            h.splice(i + 1);
        }
        h.push([v, j, now()]);
        setValueInMap(node, h, history);
        setValueInMap(node, ++i, historyIndex);
        return node;
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
    // The `node` parameter is currently not in use
    var selectToNone = function selectToNone(node, selection) {
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
    var undo = function undo(node, selection) {
        var _getValueInMap5, _getValueInMap6;
        var h = (_getValueInMap5 = getValueInMap(node, history)) != null ? _getValueInMap5 : [],
            i = (_getValueInMap6 = getValueInMap(node, historyIndex)) != null ? _getValueInMap6 : toCount(h) - 1,
            j;
        if (!(j = h[i - 1])) {
            return restoreSelection(node, h[i][1], selection);
        }
        i--;
        setValueInMap(node, i, historyIndex);
        return setHTML(node, j[0]), restoreSelection(node, j[1], selection);
    };

    function _toArray(iterable) {
        return Array.from(iterable);
    }
    var clearTimeout = W.clearTimeout,
        setTimeout = W.setTimeout; // For better minification
    var delay = function delay(task, time) {
        var stickyTime = isInteger(time) && time >= 0,
            timer;
        return [function () {
            var _this2 = this;
            var lot = _toArray(arguments);
            if (!stickyTime) {
                time = lot.shift();
            }
            timer = setTimeout(function () {
                return task.apply(_this2, lot);
            }, time);
        }, function () {
            timer && clearTimeout(timer);
        }];
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
    var isPattern = function isPattern(pattern) {
        return isInstance(pattern, RegExp);
    };
    var toPattern = function toPattern(pattern, opt) {
        if (isPattern(pattern)) {
            return pattern;
        }
        return new RegExp(pattern, isSet(opt) ? opt : 'g');
    };
    var EVENT_DOWN = 'down';
    var EVENT_UP = 'up';
    var EVENT_BLUR = 'blur';
    var EVENT_COPY = 'copy';
    var EVENT_CUT = 'cut';
    var EVENT_FOCUS = 'focus';
    var EVENT_INPUT = 'input';
    var EVENT_INPUT_START = 'before' + EVENT_INPUT;
    var EVENT_INVALID = 'invalid';
    var EVENT_KEY = 'key';
    var EVENT_KEY_DOWN = EVENT_KEY + EVENT_DOWN;
    var EVENT_KEY_UP = EVENT_KEY + EVENT_UP;
    var EVENT_MOUSE = 'mouse';
    var EVENT_MOUSE_DOWN = EVENT_MOUSE + EVENT_DOWN;
    var EVENT_PASTE = 'paste';
    var EVENT_RESET = 'reset';
    var EVENT_SUBMIT = 'submit';
    var EVENT_TOUCH = 'touch';
    var EVENT_TOUCH_START = EVENT_TOUCH + 'start';
    var KEY_LEFT = 'Left';
    var KEY_RIGHT = 'Right';
    var KEY_A = 'a';
    var KEY_ARROW = 'Arrow';
    var KEY_ARROW_LEFT = KEY_ARROW + KEY_LEFT;
    var KEY_ARROW_RIGHT = KEY_ARROW + KEY_RIGHT;
    var KEY_BEGIN = 'Home';
    var KEY_DELETE_LEFT = 'Backspace';
    var KEY_DELETE_RIGHT = 'Delete';
    var KEY_END = 'End';
    var KEY_ENTER = 'Enter';
    var KEY_ESCAPE = 'Escape';
    var KEY_TAB = 'Tab';
    var KEY_Y = 'y';
    var KEY_Z = 'z';
    var TOKEN_CONTENTEDITABLE = 'contenteditable';
    var TOKEN_DISABLED = 'disabled';
    var TOKEN_FALSE = 'false';
    var TOKEN_INVALID = EVENT_INVALID;
    var TOKEN_PRESSED = 'pressed';
    var TOKEN_READONLY = 'readonly';
    var TOKEN_READ_ONLY = 'readOnly';
    var TOKEN_REQUIRED = 'required';
    var TOKEN_TABINDEX = 'tabindex';
    var TOKEN_TAB_INDEX = 'tabIndex';
    var TOKEN_TRUE = 'true';
    var TOKEN_VALUE = 'value';
    var TOKEN_VALUES = TOKEN_VALUE + 's';
    var TOKEN_VISIBILITY = 'visibility';
    var _delay = delay(function (picker) {
            letAria(picker.mask, TOKEN_INVALID);
        }),
        _delay2 = _maybeArrayLike(_slicedToArray, _delay, 2),
        letError = _delay2[0],
        letErrorAbort = _delay2[1];
    var setError = function setError(picker) {
        var mask = picker.mask,
            state = picker.state,
            time = state.time,
            error = time.error;
        if (isInteger(error) && error > 0) {
            setAria(mask, TOKEN_INVALID, true);
        }
    };
    var _delay3 = delay(function ($) {
            saveState($);
        }, 1),
        _delay4 = _maybeArrayLike(_slicedToArray, _delay3, 1),
        saveStateLazy = _delay4[0];
    var _delay5 = delay(function (picker) {
            var _mask = picker._mask,
                input = _mask.input;
            toggleHintByValue(picker, getText(input, 0));
        }),
        _delay6 = _maybeArrayLike(_slicedToArray, _delay5, 1),
        toggleHint = _delay6[0];
    var toggleHintByValue = function toggleHintByValue(picker, value) {
        var _mask = picker._mask,
            hint = _mask.hint;
        value ? setStyle(hint, TOKEN_VISIBILITY, 'hidden') : letStyle(hint, TOKEN_VISIBILITY);
    };
    var name = 'TagPicker';
    var _keyIsCtrl, _keyIsShift, _keyOverTag;

    function createTags($, tags) {
        var map = isInstance(tags, Map) ? tags : new Map();
        if (isArray(tags)) {
            forEachArray(tags, function (tag) {
                if (isArray(tag)) {
                    var _tag$, _tag$2, _tag$1$TOKEN_VALUE;
                    tag[0] = (_tag$ = tag[0]) != null ? _tag$ : "";
                    tag[1] = (_tag$2 = tag[1]) != null ? _tag$2 : {};
                    setValueInMap(_toValue((_tag$1$TOKEN_VALUE = tag[1][TOKEN_VALUE]) != null ? _tag$1$TOKEN_VALUE : tag[0]), tag, map);
                } else {
                    setValueInMap(_toValue(tag), [tag, {}], map);
                }
            });
        } else if (isObject(tags, 0)) {
            forEachObject(tags, function (v, k) {
                if (isArray(v)) {
                    var _v$, _v$2, _v$1$TOKEN_VALUE;
                    tags[k][0] = (_v$ = v[0]) != null ? _v$ : "";
                    tags[k][1] = (_v$2 = v[1]) != null ? _v$2 : {};
                    setValueInMap(_toValue((_v$1$TOKEN_VALUE = v[1][TOKEN_VALUE]) != null ? _v$1$TOKEN_VALUE : k), v, map);
                } else {
                    setValueInMap(_toValue(k), [v, {}], map);
                }
            });
        }
        var _tags = $._tags,
            r = [];
        // Reset the tag(s) data, but do not fire the `let.tags` hook
        _tags.let(null, 0);
        forEachMap(map, function (v, k) {
            var _v$1$TOKEN_VALUE3;
            if (isArray(v) && v[1]) {
                var _v$1$TOKEN_VALUE2;
                r.push((_v$1$TOKEN_VALUE2 = v[1][TOKEN_VALUE]) != null ? _v$1$TOKEN_VALUE2 : k);
            }
            // Set the tag data, but do not fire the `set.tag` hook
            _tags.set(_toValue(isArray(v) && v[1] ? (_v$1$TOKEN_VALUE3 = v[1][TOKEN_VALUE]) != null ? _v$1$TOKEN_VALUE3 : k : k), v, 0);
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
        var $ = this,
            data = e.data,
            inputType = e.inputType,
            picker = getReference($),
            _active = picker._active,
            _fix = picker._fix;
        if (!_active || _fix) {
            return offEventDefault(e);
        }
        var _tags = picker._tags,
            state = picker.state,
            escape = state.escape,
            exit,
            key,
            tagLast,
            v;
        key = isString(data) && 1 === toCount(data) ? data : 0;
        if (KEY_ENTER === key && (hasValue('\n', escape) || hasValue(13, escape)) || KEY_TAB === key && (hasValue('\t', escape) || hasValue(9, escape)) || 0 !== key && hasValue(key, escape)) {
            exit = true;
            setValueInMap(_toValue(v = getText($)), v, _tags);
            focusTo(picker).text = "";
        } else if ('deleteContentBackward' === inputType && !getText($, 0)) {
            if (tagLast = toValueLastFromMap(_tags)) {
                exit = true;
                letValueInMap(getTagValue(tagLast[2]), _tags);
            }
        }
        exit && offEventDefault(e);
    }

    function onBlurTag() {
        var $ = this,
            picker = getReference($),
            _tags = picker._tags;
        if (!_keyIsCtrl && !_keyIsShift) {
            forEachMap(_tags, function (v) {
                return letAria(v[2], TOKEN_PRESSED);
            });
        }
    }

    function onBlurTextInput() {
        var $ = this,
            picker = getReference($),
            mask = picker.mask,
            state = picker.state,
            time = state.time,
            error = time.error;
        letError(isInteger(error) && error > 0 ? error : 0, picker);
        onEvent(EVENT_MOUSE_DOWN, mask, onPointerDownMask);
        onEvent(EVENT_TOUCH_START, mask, onPointerDownMask);
    }

    function onCopyTag(e) {
        offEventDefault(e);
        var $ = this,
            picker = getReference($),
            _tags = picker._tags,
            state = picker.state,
            join = state.join,
            selected = [];
        setAria($, TOKEN_PRESSED, true);
        forEachMap(_tags, function (v) {
            if (getAria(v[2], TOKEN_PRESSED)) {
                selected.push(getTagValue(v[2]));
            }
        });
        e.clipboardData.setData('text/plain', selected.join(join));
        if (EVENT_CUT !== e.type && toCount(selected) < 2) {
            letAria($, TOKEN_PRESSED);
        }
    }

    function onCutTag(e) {
        offEventDefault(e);
        var $ = this,
            picker = getReference($),
            _tags = picker._tags;
        onCopyTag.call($, e);
        forEachMap(_tags, function (v) {
            if (getAria(v[2], TOKEN_PRESSED)) {
                letValueInMap(getTagValue(v[2]), _tags);
            }
        });
        focusTo(picker.fire('change', [picker[TOKEN_VALUE]]));
    }

    function onCutTextInput() {
        var $ = this;
        saveState($), toggleHint(1, getReference($)), saveStateLazy($);
    }

    function onFocusSelf() {
        focusTo(getReference(this));
    }
    // Select the tag text on focus to hide the text cursor
    function onFocusTag() {
        selectTo(this);
    }

    function onFocusTextInput() {
        var $ = this,
            picker = getReference($),
            mask = picker.mask,
            state = picker.state,
            pattern = state.pattern,
            value = getText($);
        if (value && isString(pattern) && !toPattern(pattern).test(value)) {
            letErrorAbort(), setError(picker);
        }
        selectTo($);
        offEvent(EVENT_MOUSE_DOWN, mask, onPointerDownMask);
        offEvent(EVENT_TOUCH_START, mask, onPointerDownMask);
    }
    // Better mobile support
    function onInputTextInput(e) {
        var $ = this,
            picker = getReference($),
            _active = picker._active,
            _fix = picker._fix;
        if (!_active || _fix) {
            return offEventDefault(e);
        }
        var state = picker.state,
            pattern = state.pattern,
            inputType = e.inputType,
            v = getText($, 0);
        if ('deleteContent' === inputType.slice(0, 13) && !v) {
            toggleHintByValue(picker, 0), saveStateLazy($);
        } else if ('insertText' === inputType) {
            toggleHintByValue(picker, 1), saveStateLazy($);
        }
        if (isString(pattern) && !toPattern(pattern).test(v)) {
            letErrorAbort(), setError(picker);
        } else {
            letError(0, picker);
        }
    }

    function onInvalidSelf(e) {
        e && offEventDefault(e);
        var $ = this;
        onBlurTextInput.call($), setError(getReference($));
    }

    function onKeyDownTag(e) {
        var $ = _keyOverTag = this,
            key = e.key,
            keyIsCtrl = _keyIsCtrl = e.ctrlKey,
            keyIsShift = _keyIsShift = e.shiftKey,
            picker = getReference($),
            _active = picker._active,
            _fix = picker._fix;
        if (!_active || _fix) {
            return offEventDefault(e);
        }
        var _mask = picker._mask,
            _tags = picker._tags,
            text = _mask.text,
            exit,
            tagFirst,
            tagLast,
            tagNext,
            tagPrev;
        if (keyIsShift) {
            exit = true;
            setAria($, TOKEN_PRESSED, true);
            if (KEY_ARROW_LEFT === key) {
                if (tagPrev = getPrev($)) {
                    if (getAria(tagPrev, TOKEN_PRESSED)) {
                        letAria($, TOKEN_PRESSED);
                    } else {
                        setAria(tagPrev, TOKEN_PRESSED, true);
                    }
                    focusTo(tagPrev);
                }
            } else if (KEY_ARROW_RIGHT === key) {
                if ((tagNext = getNext($)) && tagNext !== text) {
                    if (getAria(tagNext, TOKEN_PRESSED)) {
                        letAria($, TOKEN_PRESSED);
                    } else {
                        setAria(tagNext, TOKEN_PRESSED, true);
                    }
                    focusTo(tagNext);
                }
            } else if (KEY_TAB === key) {
                selectToNone();
            }
        } else if (keyIsCtrl) {
            if (KEY_A === key) {
                exit = true;
                forEachMap(_tags, function (v) {
                    return setAria(v[2], TOKEN_PRESSED, true), focusTo(v[2]), selectTo(v[2]);
                });
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
                getAria($, TOKEN_PRESSED) ? letAria($, TOKEN_PRESSED) : setAria($, TOKEN_PRESSED, true);
            } else {
                setAria($, TOKEN_PRESSED, true);
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
                tagPrev = getPrev($);
                letValueInMap(getTagValue($), _tags);
                forEachMap(_tags, function (v) {
                    if (getAria(v[2], TOKEN_PRESSED)) {
                        tagPrev = getPrev(v[2]);
                        letValueInMap(getTagValue(v[2]), _tags);
                    }
                });
                focusTo(tagPrev || picker), picker.fire('change', [picker[TOKEN_VALUE]]);
            } else if (KEY_DELETE_RIGHT === key) {
                exit = true;
                tagNext = getNext($);
                letValueInMap(getTagValue($), _tags);
                forEachMap(_tags, function (v) {
                    if (getAria(v[2], TOKEN_PRESSED)) {
                        tagNext = getNext(v[2]);
                        letValueInMap(getTagValue(v[2]), _tags);
                    }
                });
                focusTo(tagNext && tagNext !== text ? tagNext : picker), picker.fire('change', [picker[TOKEN_VALUE]]);
            } else if (KEY_ENTER === key || ' ' === key) {
                exit = true;
                getAria($, TOKEN_PRESSED) ? letAria($, TOKEN_PRESSED) : setAria($, TOKEN_PRESSED, true);
            } else if (KEY_ESCAPE === key || KEY_TAB === key) {
                exit = true;
                selectToNone(), focusTo(picker);
                // Any type-able key
            } else if (1 === toCount(key)) {
                forEachMap(_tags, function (v) {
                    if (getAria(v[2], TOKEN_PRESSED)) {
                        letValueInMap(getTagValue(v[2]), _tags);
                    }
                });
                selectToNone(), focusTo(picker).fire('change', [picker[TOKEN_VALUE]]);
            }
        }
        exit && offEventDefault(e);
    }

    function onKeyDownTextInput(e) {
        var $ = this,
            key = e.key,
            keyCode = e.keyCode,
            keyIsCtrl = _keyIsCtrl = e.ctrlKey,
            keyIsShift = _keyIsShift = e.shiftKey,
            picker = getReference($),
            _active = picker._active,
            _fix = picker._fix;
        if (!_active || _fix) {
            return;
        }
        var _tags = picker._tags,
            self = picker.self,
            state = picker.state,
            escape = state.escape,
            exit,
            form,
            submit,
            v;
        if (KEY_ENTER === key && (hasValue('\n', escape) || hasValue(13, escape)) || KEY_TAB === key && (hasValue('\t', escape) || hasValue(9, escape)) || hasValue(key, escape) || hasValue(keyCode, escape)) {
            setValueInMap(_toValue(v = getText($)), v, _tags);
            return focusTo(picker).text = "", offEventDefault(e);
        }
        toggleHint(1, picker);
        var caretIsToTheFirst = "" === getCharBeforeCaret($),
            tagFirst,
            tagLast,
            textIsVoid = !getText($, 0);
        if (keyIsShift) {
            if (KEY_ARROW_LEFT === key) {
                if (caretIsToTheFirst || textIsVoid) {
                    exit = true;
                    selectToNone();
                    tagLast = toValueLastFromMap(_tags);
                    tagLast && focusTo(tagLast[2]) && setAria(tagLast[2], TOKEN_PRESSED, true);
                }
            } else if (KEY_ENTER === key) {
                exit = true;
            } else if (KEY_TAB === key) {
                selectToNone();
            }
        } else if (keyIsCtrl) {
            if (KEY_A === toCaseLower(key) && textIsVoid && _tags.count()) {
                exit = true;
                forEachMap(_tags, function (v) {
                    return setAria(v[2], TOKEN_PRESSED, true), focusTo(v[2]), selectTo(v[2]);
                });
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
            } else if (!keyIsShift && KEY_Z === toCaseLower(key)) {
                exit = true;
                undo($);
            } else if (keyIsShift && KEY_Z === toCaseLower(key) || KEY_Y === toCaseLower(key)) {
                exit = true;
                redo($);
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
                    selectToNone();
                    tagLast = toValueLastFromMap(_tags);
                    tagLast && focusTo(tagLast[2]);
                } else if (KEY_DELETE_LEFT === key) {
                    if (textIsVoid) {
                        exit = true;
                        tagLast = toValueLastFromMap(_tags);
                        tagLast && letValueInMap(getTagValue(tagLast[2]), _tags);
                    }
                }
            }
        }
        exit && offEventDefault(e);
    }

    function onKeyUpTag(e) {
        _keyOverTag = 0;
        var $ = this,
            key = e.key,
            picker = getReference($),
            _tags = picker._tags,
            selected = 0;
        forEachMap(_tags, function (v) {
            if (getAria(v[2], TOKEN_PRESSED)) {
                ++selected;
            }
        });
        _keyIsCtrl = e.ctrlKey;
        _keyIsShift = e.shiftKey;
        if (selected < 2 && !_keyIsCtrl && !_keyIsShift && KEY_ENTER !== key && ' ' !== key) {
            letAria($, TOKEN_PRESSED);
        }
    }

    function onKeyUpTextInput(e) {
        _keyIsCtrl = e.ctrlKey;
        _keyIsShift = e.shiftKey;
    }

    function onPasteTag(e) {
        offEventDefault(e);
        var $ = this,
            picker = getReference($),
            _tags = picker._tags,
            state = picker.state,
            join = state.join;
        forEachArray(e.clipboardData.getData('text/plain').split(join), function (v) {
            if (!hasKeyInMap(v = _toValue(v.trim()), _tags)) {
                setValueInMap(v, v, _tags);
            }
        });
        forEachMap(_tags, function (v) {
            return letAria(v[2], TOKEN_PRESSED);
        });
        focusTo(picker.fire('change', [picker[TOKEN_VALUE]]));
    }

    function onPasteTextInput(e) {
        offEventDefault(e);
        var $ = this,
            picker = getReference($),
            _tags = picker._tags,
            self = picker.self,
            state = picker.state,
            join = state.join,
            v;
        saveState($), toggleHint(1, picker), insertAtSelection($, v = e.clipboardData.getData('text/plain')), saveStateLazy($);
        if (v !== getText($));
        else {
            forEachArray((getText($) + "").split(join), function (v) {
                if (!hasKeyInMap(v = _toValue(v.trim()), _tags)) {
                    setValueInMap(v, v, _tags);
                } else {
                    onInvalidSelf.call(self);
                    picker.fire('has.tag', [_toValue(v)]);
                }
            });
            forEachMap(_tags, function (v) {
                return letAria(v[2], TOKEN_PRESSED);
            });
            picker.fire('change', [picker[TOKEN_VALUE]]).text = "";
        }
    }

    function onPointerDownMask(e) {
        offEventDefault(e);
        var $ = this,
            picker = getReference($),
            target = e.target;
        // Is it focused on a tag mask?
        if (target && 'option' === getRole(target)) {
            return; // Yes it is!
        }
        // Is it focused on a node in the tag mask?
        while (target && $ !== target) {
            target = getParent(target);
            if (target && 'option' === getRole(target)) {
                return; // Yes it is!
            }
        }
        // It focuses on something else in the root mask. The default is to execute `picker.focus()`
        focusTo(picker);
    }

    function onPointerDownTag(e) {
        offEventDefault(e);
        var $ = this,
            picker = getReference($),
            _tags = picker._tags;
        focusTo($), selectTo($);
        if (!_keyIsCtrl) {
            forEachMap(_tags, function (v) {
                return letAria(v[2], TOKEN_PRESSED);
            });
        }
        if (_keyIsCtrl) {
            setAria($, TOKEN_PRESSED, true);
        } else if (_keyIsShift && _keyOverTag) {
            var tagEndIndex = getElementIndex($),
                tagStartIndex = getElementIndex(_keyOverTag),
                tagCurrent = _keyOverTag,
                tagNext,
                tagPrev;
            setAria($, TOKEN_PRESSED, true);
            setAria(_keyOverTag, TOKEN_PRESSED, true);
            // Select to the right
            if (tagEndIndex > tagStartIndex) {
                while (tagNext = getNext(tagCurrent)) {
                    if ($ === tagNext) {
                        break;
                    }
                    setAria(tagCurrent = tagNext, TOKEN_PRESSED, true);
                }
                // Select to the left
            } else if (tagEndIndex < tagStartIndex) {
                while (tagPrev = getPrev(tagCurrent)) {
                    if ($ === tagPrev) {
                        break;
                    }
                    setAria(tagCurrent = tagPrev, TOKEN_PRESSED, true);
                }
            }
        }
    }

    function onPointerDownTagX(e) {
        offEventDefault(e);
        var $ = this,
            tag = getParent($),
            picker = getReference(tag),
            _active = picker._active,
            _fix = picker._fix;
        if (!_active || _fix) {
            return focusTo(picker);
        }
        var _tags = picker._tags;
        letValueInMap(getTagValue(tag), _tags);
        focusTo(picker);
    }

    function onResetForm() {
        getReference(this).reset();
    }

    function onSubmitForm(e) {
        var $ = this,
            picker = getReference($),
            _tags = picker._tags,
            max = picker.max,
            min = picker.min,
            self = picker.self,
            count = _tags.count(),
            exit;
        if (count > max) {
            exit = true;
            focusTo(picker.fire('max.tags', [count, max]));
        } else if (count < min) {
            exit = true;
            focusTo(picker.fire('min.tags', [count, min]));
        }
        exit && (onInvalidSelf.call(self), offEventDefault(e));
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
        $[TOKEN_VALUES] = new Map();
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
        'time': {
            'error': 1000
        },
        'with': []
    };
    TagPicker.version = '4.2.7';
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
                selectToNone();
                var $ = this,
                    _mask = $._mask,
                    _tags = $._tags,
                    mask = $.mask,
                    self = $.self,
                    input = _mask.input,
                    v = !!value;
                self[TOKEN_DISABLED] = !($._active = v);
                if (v) {
                    letAria(input, TOKEN_DISABLED);
                    letAria(mask, TOKEN_DISABLED);
                    setAttribute(input, TOKEN_CONTENTEDITABLE, "");
                    forEachMap(_tags, function (v) {
                        setAttribute(v[2], TOKEN_CONTENTEDITABLE, "");
                        setAttribute(v[2], TOKEN_TABINDEX, -1);
                    });
                } else {
                    letAttribute(input, TOKEN_CONTENTEDITABLE);
                    setAria(input, TOKEN_DISABLED, true);
                    setAria(mask, TOKEN_DISABLED, true);
                    forEachMap(_tags, function (v) {
                        letAttribute(v[2], TOKEN_CONTENTEDITABLE);
                        letAttribute(v[2], TOKEN_TABINDEX);
                    });
                }
                return $;
            }
        },
        fix: {
            get: function get() {
                return this._fix;
            },
            set: function set(value) {
                selectToNone();
                var $ = this,
                    _mask = $._mask,
                    _tags = $._tags,
                    mask = $.mask,
                    self = $.self,
                    input = _mask.input,
                    v = !!value;
                self[TOKEN_READ_ONLY] = $._fix = v;
                if (v) {
                    letAttribute(input, TOKEN_CONTENTEDITABLE);
                    setAria(input, TOKEN_READONLY, true);
                    setAria(mask, TOKEN_READONLY, true);
                    setAttribute(input, TOKEN_TABINDEX, 0);
                    forEachMap(_tags, function (v) {
                        letAttribute(v[2], TOKEN_CONTENTEDITABLE);
                        letAttribute(v[2], TOKEN_TABINDEX);
                    });
                } else {
                    letAria(input, TOKEN_READONLY);
                    letAria(mask, TOKEN_READONLY);
                    letAttribute(input, TOKEN_TABINDEX);
                    setAttribute(input, TOKEN_CONTENTEDITABLE, "");
                    forEachMap(_tags, function (v) {
                        setAttribute(v[2], TOKEN_CONTENTEDITABLE, "");
                        setAttribute(v[2], TOKEN_TABINDEX, -1);
                    });
                }
                return $;
            }
        },
        max: {
            get: function get() {
                var max = this.state.max;
                return Infinity === max || isInteger(max) && max >= 0 ? max : Infinity;
            },
            set: function set(value) {
                var $ = this;
                return $.state.max = isInteger(value) && value >= 0 ? value : Infinity, $;
            }
        },
        min: {
            get: function get() {
                var min = this.state.min;
                return isInteger(min) && min >= 0 ? min : 0;
            },
            set: function set(value) {
                var $ = this;
                return $.state.min = isInteger(value) && value >= 0 ? value : 0, $;
            }
        },
        tags: {
            get: function get() {
                return this._tags;
            },
            set: function set(tags) {
                selectToNone();
                var $ = this,
                    tagsValues = [];
                createTags($, tags);
                forEachMap($._tags, function (v) {
                    return tagsValues.push(getTagValue(v[2], 1));
                });
                return $.fire('set.tags', [tagsValues]);
            }
        },
        text: {
            get: function get() {
                return getText(this._mask.input);
            },
            set: function set(value) {
                var $ = this,
                    _active = $._active,
                    _fix = $._fix;
                if (!_active || _fix) {
                    return $;
                }
                var _mask = $._mask,
                    input = _mask.input,
                    v;
                return setText(input, v = _fromValue(value)), toggleHintByValue($, v), $;
            }
        },
        value: {
            get: function get() {
                var value = getValue(this.self);
                return "" !== value ? value : null;
            },
            set: function set(value) {
                var $ = this,
                    _active = $._active;
                if (!_active) {
                    return $;
                }
                var _tags = $._tags,
                    state = $.state,
                    join = state.join;
                $[TOKEN_VALUE] && forEachArray($[TOKEN_VALUE].split(join), function (v) {
                    return letValueInMap(v, _tags);
                });
                value && forEachArray(value.split(join), function (v) {
                    return setValueInMap(v, v, _tags);
                });
                return $.fire('change', [$[TOKEN_VALUE]]);
            }
        },
        vital: {
            get: function get() {
                return this._vital;
            },
            set: function set(value) {
                selectToNone();
                var $ = this,
                    _mask = $._mask,
                    mask = $.mask,
                    min = $.min,
                    self = $.self,
                    input = _mask.input,
                    v = !!value;
                self[TOKEN_REQUIRED] = $._vital = v;
                if (v) {
                    if (0 === min) {
                        $.min = 1;
                    }
                    setAria(input, TOKEN_REQUIRED, true);
                    setAria(mask, TOKEN_REQUIRED, true);
                } else {
                    $.min = 0;
                    letAria(input, TOKEN_REQUIRED);
                    letAria(mask, TOKEN_REQUIRED);
                }
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
            $._tags = new TagPickerTags($);
            $.self = self;
            $.state = state;
            var _state = state,
                max = _state.max,
                min = _state.min,
                n = _state.n,
                isDisabledSelf = isDisabled(self),
                isReadOnlySelf = isReadOnly(self),
                isRequiredSelf = isRequired(self),
                theInputID = self.id,
                theInputName = self.name,
                theInputPlaceholder = self.placeholder,
                theInputValue = getValue(self);
            $._active = !isDisabledSelf;
            $._fix = isReadOnlySelf;
            $._vital = isRequiredSelf;
            if (isRequiredSelf && min < 1) {
                state.min = min = 1; // Force minimum tag(s) to insert to be `1`
            }
            var form = getParentForm(self);
            var mask = setElement('div', {
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
            var maskFlex = setElement('span', {
                'class': n + '__flex',
                'role': 'none'
            });
            var text = setElement('span', {
                'class': n + '__text',
                'role': 'none'
            });
            var textInput = setElement('span', {
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
            var textInputHint = setElement('span', theInputPlaceholder + "", {
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
            onEvent(EVENT_BLUR, textInput, onBlurTextInput);
            onEvent(EVENT_CUT, textInput, onCutTextInput);
            onEvent(EVENT_FOCUS, self, onFocusSelf);
            onEvent(EVENT_FOCUS, textInput, onFocusTextInput);
            onEvent(EVENT_INPUT, textInput, onInputTextInput);
            onEvent(EVENT_INPUT_START, textInput, onBeforeInputTextInput);
            onEvent(EVENT_INVALID, self, onInvalidSelf);
            onEvent(EVENT_KEY_DOWN, textInput, onKeyDownTextInput);
            onEvent(EVENT_KEY_UP, textInput, onKeyUpTextInput);
            onEvent(EVENT_MOUSE_DOWN, mask, onPointerDownMask);
            onEvent(EVENT_PASTE, textInput, onPasteTextInput);
            onEvent(EVENT_TOUCH_START, mask, onPointerDownMask);
            self[TOKEN_TAB_INDEX] = -1;
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
            $.max = max = Infinity === max || isInteger(max) && max >= 0 ? max : Infinity;
            $.min = min = isInteger(min) && min >= 0 ? min : 0;
            var _active = $._active,
                _state2 = state,
                join = _state2.join,
                tagsValues;
            // Force the `this._active` value to `true` to set the initial value
            $._active = true;
            // Attach the current tag(s)
            tagsValues = createTags($, theInputValue ? theInputValue.split(join) : []);
            $['_' + TOKEN_VALUE] = tagsValues.join(join);
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
                forEachArray(state.with, function (v, k) {
                    if (isString(v)) {
                        v = TagPicker[v];
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
            return saveState(textInput), $;
        },
        blur: function blur() {
            selectToNone();
            var $ = this,
                _mask = $._mask,
                _tags = $._tags,
                input = _mask.input;
            forEachMap(_tags, function (v) {
                return v[2].blur();
            });
            return input.blur(), $;
        },
        detach: function detach() {
            var $ = this,
                _mask = $._mask,
                mask = $.mask,
                self = $.self,
                state = $.state,
                input = _mask.input;
            var form = getParentForm(self);
            $._active = false;
            $._tags = new TagPickerTags($);
            $['_' + TOKEN_VALUE] = null;
            if (form) {
                offEvent(EVENT_RESET, form, onResetForm);
                offEvent(EVENT_SUBMIT, form, onSubmitForm);
            }
            offEvent(EVENT_BLUR, input, onBlurTextInput);
            offEvent(EVENT_CUT, input, onCutTextInput);
            offEvent(EVENT_FOCUS, input, onFocusTextInput);
            offEvent(EVENT_FOCUS, self, onFocusSelf);
            offEvent(EVENT_INPUT, input, onInputTextInput);
            offEvent(EVENT_INPUT_START, input, onBeforeInputTextInput);
            offEvent(EVENT_INVALID, self, onInvalidSelf);
            offEvent(EVENT_KEY_DOWN, input, onKeyDownTextInput);
            offEvent(EVENT_KEY_UP, input, onKeyUpTextInput);
            offEvent(EVENT_MOUSE_DOWN, mask, onPointerDownMask);
            offEvent(EVENT_PASTE, input, onPasteTextInput);
            offEvent(EVENT_TOUCH_START, mask, onPointerDownMask);
            // Detach extension(s)
            if (isArray(state.with)) {
                forEachArray(state.with, function (v, k) {
                    if (isString(v)) {
                        v = TagPicker[v];
                    }
                    if (isObject(v) && isFunction(v.detach)) {
                        v.detach.call($, self, state);
                    }
                });
            }
            self[TOKEN_TAB_INDEX] = null;
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
        focus: function focus(mode) {
            var $ = this,
                _active = $._active;
            if (!_active) {
                return $;
            }
            var _mask = $._mask,
                input = _mask.input;
            return focusTo(input), selectTo(input, mode), $;
        },
        reset: function reset(focus, mode) {
            var $ = this,
                _active = $._active;
            if (!_active) {
                return $;
            }
            $[TOKEN_VALUE] = $['_' + TOKEN_VALUE];
            return focus ? $.focus(mode) : $;
        }
    });
    setObjectAttributes(TagPickerTags, {
        name: {
            value: name + 'Tags'
        }
    }, 1);
    TagPickerTags._ = setObjectMethods(TagPickerTags, {
        at: function at(key) {
            return getValueInMap(_toValue(key), this[TOKEN_VALUES]);
        },
        count: function count() {
            return toMapCount(this[TOKEN_VALUES]);
        },
        // To be used by the `letValueInMap()` function
        delete: function _delete(key, _fireHook) {
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
            var min = of.min,
                self = of.self,
                state = of.state,
                join = state.join,
                n = state.n,
                count,
                r,
                tagsValues = [];
            if ((count = $.count()) <= min) {
                _fireHook && onInvalidSelf.call(self);
                return _fireHook && of.fire('min.tags', [count, min]), false;
            }
            if (!isSet(key)) {
                forEachMap(values, function (v, k) {
                    return $.let(k, 0);
                });
                return _fireHook && of.fire('let.tags', [
                    []
                ]).fire('change', [null]), 0 === $.count();
            }
            if (!(r = getValueInMap(key = _toValue(key), values))) {
                onInvalidSelf.call(self);
                return _fireHook && of.fire('not.tag', [key]), false;
            }
            var tag = r[2],
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
            return hasKeyInMap(_toValue(key), this[TOKEN_VALUES]);
        },
        let: function _let(key, _fireHook) {
            if (_fireHook === void 0) {
                _fireHook = 1;
            }
            return this.delete(key, _fireHook);
        },
        set: function set(key, value, _fireHook) {
            var _value$1$active, _value$1$mark, _getState;
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
            var _fix = of._fix,
                _mask = of._mask,
                max = of.max,
                self = of.self,
                state = of.state,
                text = _mask.text,
                join = state.join,
                n = state.n,
                pattern = state.pattern,
                count,
                r,
                tag,
                tagText,
                tagX,
                tagsValues = [];
            if ((count = $.count()) >= max) {
                _fireHook && onInvalidSelf.call(self);
                return _fireHook && of.fire('max.tags', [count, max]), false;
            }
            // `picker.tags.set('asdf')`
            if (!isSet(value)) {
                value = [key, {
                    active: true,
                    mark: false
                }];
                // `picker.tags.set('asdf', 'asdf')`
            } else if (isFloat(value) || isInteger(value) || isString(value)) {
                value = [value, {
                    active: true,
                    mark: false
                }];
                // `picker.tags.set('asdf', [ … ])`
            } else;
            // All tag(s) act as selected option(s) that complement the mask root. The mask root functions as a `listbox`
            // with active `aria-multiselectable` attribute. For visually impaired user(s), this element should be described
            // as a multiple selection control with all option(s) selected. There is no point in having a way to disable a
            // tag to exclude it from the selection. The best strategy is to simply remove the tag. That’s why the `active`
            // option is always `true` and every tag has an active `aria-selected` attribute.
            value[1].active = (_value$1$active = value[1].active) != null ? _value$1$active : true;
            // This `mark` option is used to determine the state of the `aria-pressed` attribute.
            value[1].mark = (_value$1$mark = value[1].mark) != null ? _value$1$mark : false;
            var _value$ = value[1],
                mark = _value$.mark,
                v = _value$.value;
            if (null === key || "" === (v = _fromValue(v || key).trim()) || isString(pattern) && !toPattern(pattern).test(v)) {
                onInvalidSelf.call(self);
                return _fireHook && of.fire('not.tag', [key]), false;
            }
            if (isFunction(pattern)) {
                if (isArray(r = pattern.call(of, v))) {
                    var _r$1$TOKEN_VALUE;
                    key = v = r[1] ? (_r$1$TOKEN_VALUE = r[1][TOKEN_VALUE]) != null ? _r$1$TOKEN_VALUE : r[0] : r[0];
                    value = r;
                } else if (isString(r)) {
                    key = v = r;
                    value[0] = r;
                }
            }
            if ($.has(key = _toValue(key))) {
                onInvalidSelf.call(self);
                return _fireHook && of.fire('has.tag', [key]), false;
            }
            tag = value[2] || setElement('data', {
                'aria': {
                    'pressed': mark ? TOKEN_TRUE : false,
                    'selected': TOKEN_TRUE
                },
                'class': n + '__tag',
                // Make the tag “content editable”, so that the “Cut” option is available in the context menu, but do not
                // allow user(s) to edit the tag text. We just want to make sure that the “Cut” option is available.
                'contenteditable': TOKEN_TRUE,
                // <https://html.spec.whatwg.org/multipage/interaction.html#attr-inputmode-keyword-none>
                'inputmode': 'none',
                'role': 'option',
                'spellcheck': TOKEN_FALSE,
                'tabindex': -1,
                'title': (_getState = getState(value[1], 'title')) != null ? _getState : false,
                'value': v,
                // <https://www.w3.org/TR/virtual-keyboard#dom-elementcontenteditable-virtualkeyboardpolicy>
                'virtualkeyboardpolicy': 'manual'
            });
            // Disable focus on “read-only” tag picker
            if (_fix) {
                letAttribute(tag, TOKEN_CONTENTEDITABLE);
                letAttribute(tag, TOKEN_TABINDEX);
            }
            tagText = value[2] ? getElement('.' + n + '__v', value[2]) : setElement('span', _fromValue(value[0]), {
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
            forEachMap(values, function (v, k) {
                return tagsValues.push(_fromValue(k));
            });
            setValue(self, tagsValues = tagsValues.join(join));
            return _fireHook && of.fire('set.tag', [key]).fire('change', ["" !== tagsValues ? tagsValues : null]), true;
        }
    });
    // In order for an object to be iterable, it must have a `Symbol.iterator` key
    getPrototype(TagPickerTags)[Symbol.iterator] = function () {
        return this[TOKEN_VALUES][Symbol.iterator]();
    };
    TagPicker.Tags = TagPickerTags;
    return TagPicker;
}));