/*!
 *
 * The MIT License (MIT)
 *
 * Copyright © 2021 Taufik Nurrohman <https://github.com/taufik-nurrohman>
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
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.TP = factory());
})(this, function() {
    'use strict';
    var isArray = function isArray(x) {
        return Array.isArray(x);
    };
    var isDefined = function isDefined(x) {
        return 'undefined' !== typeof x;
    };
    var isInstance = function isInstance(x, of ) {
        return x && isSet( of ) && x instanceof of ;
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
    var fromStates = function fromStates() {
        for (var _len = arguments.length, lot = new Array(_len), _key = 0; _key < _len; _key++) {
            lot[_key] = arguments[_key];
        }
        return Object.assign.apply(Object, [{}].concat(lot));
    };
    var fromValue = function fromValue(x) {
        if (isArray(x)) {
            return x.map(function(v) {
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
    var toArrayKey = function toArrayKey(x, data) {
        var i = data.indexOf(x);
        return -1 !== i ? i : null;
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
    var toValue = function toValue(x) {
        if (isArray(x)) {
            return x.map(function(v) {
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
    var getName = function getName(node) {
        return toCaseLower(node && node.nodeName || "") || null;
    };
    var getNext = function getNext(node) {
        return node.nextElementSibling || null;
    };
    var getParent = function getParent(node) {
        return node.parentNode || null;
    };
    var getParentForm = function getParentForm(node) {
        var state = 'form';
        if (hasState(node, state) && state === getName(node[state])) {
            return node[state];
        }
        var parent = getParent(node);
        while (parent) {
            if (state === getName(parent)) {
                break;
            }
            parent = getParent(parent);
        }
        return parent || null;
    };
    var getPrev = function getPrev(node) {
        return node.previousElementSibling || null;
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
    var hasParent = function hasParent(node) {
        return null !== getParent(node);
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
    var letClasses = function letClasses(node, classes) {
        if (isArray(classes)) {
            return classes.forEach(function(name) {
                return node.classList.remove(name);
            }), node;
        }
        if (isObject(classes)) {
            for (var name in classes) {
                classes[name] && node.classList.remove(name);
            }
            return node;
        }
        return node.className = "", node;
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
    var setClasses = function setClasses(node, classes) {
        if (isArray(classes)) {
            return classes.forEach(function(name) {
                return node.classList.add(name);
            }), node;
        }
        if (isObject(classes)) {
            for (var name in classes) {
                if (classes[name]) {
                    node.classList.add(name);
                } else {
                    node.classList.remove(name);
                }
            }
        } // if (isString(classes)) {
        node.className = classes; // }
        return node;
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
        return getParent(current).insertBefore(node, getNext(current)), node;
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
    var offEvent = function offEvent(name, node, then) {
        node.removeEventListener(name, then);
    };
    var offEventDefault = function offEventDefault(e) {
        return e && e.preventDefault();
    };
    var offEventPropagation = function offEventPropagation(e) {
        return e && e.stopPropagation();
    };
    var offEvents = function offEvents(names, node, then) {
        names.forEach(function(name) {
            return offEvent(name, node, then);
        });
    };
    var onEvent = function onEvent(name, node, then, options) {
        if (options === void 0) {
            options = false;
        }
        node.addEventListener(name, then, options);
    };
    var onEvents = function onEvents(names, node, then, options) {
        if (options === void 0) {
            options = false;
        }
        names.forEach(function(name) {
            return onEvent(name, node, then, options);
        });
    };
    var hasValue = function hasValue(x, data) {
        return -1 !== data.indexOf(x);
    };

    function hook($) {
        var hooks = {};

        function fire(name, data) {
            if (!isSet(hooks[name])) {
                return $;
            }
            hooks[name].forEach(function(then) {
                return then.apply($, data);
            });
            return $;
        }

        function off(name, then) {
            if (!isSet(name)) {
                return hooks = {}, $;
            }
            if (isSet(hooks[name])) {
                if (isSet(then)) {
                    for (var i = 0, _j = hooks[name].length; i < _j; ++i) {
                        if (then === hooks[name][i]) {
                            hooks[name].splice(i, 1);
                            break;
                        }
                    } // Clean-up empty hook(s)
                    if (0 === j) {
                        delete hooks[name];
                    }
                } else {
                    delete hooks[name];
                }
            }
            return $;
        }

        function on(name, then) {
            if (!isSet(hooks[name])) {
                hooks[name] = [];
            }
            if (isSet(then)) {
                hooks[name].push(then);
            }
            return $;
        }
        $.hooks = hooks;
        $.fire = fire;
        $.off = off;
        $.on = on;
        return $;
    }
    var isPattern = function isPattern(pattern) {
        return isInstance(pattern, RegExp);
    };
    var toPattern = function toPattern(pattern, opt) {
        if (isPattern(pattern)) {
            return pattern;
        } // No need to escape `/` in the pattern string
        pattern = pattern.replace(/\//g, '\\/');
        return new RegExp(pattern, isSet(opt) ? opt : 'g');
    };
    let delay = W.setTimeout,
        name = 'TP';
    const KEY_A = ['a', 65];
    const KEY_ARROW_LEFT = ['ArrowLeft', 37];
    const KEY_ARROW_RIGHT = ['ArrowRight', 39];
    const KEY_DELETE_LEFT = ['Backspace', 8];
    const KEY_DELETE_RIGHT = ['Delete', 46];
    const KEY_ENTER = ['Enter', 13];
    const KEY_TAB = ['Tab', 9];

    function TP(source, state = {}) {
        if (!source) return;
        const $ = this; // Already instantiated, skip!
        if (source[name]) {
            return;
        } // Return new instance if `TP` was called without the `new` operator
        if (!isInstance($, TP)) {
            return new TP(source, state);
        }
        let sourceIsDisabled = () => source.disabled,
            sourceIsReadOnly = () => source.readOnly,
            thePlaceholder = getAttribute(source, 'placeholder'),
            theTabIndex = getAttribute(source, 'tabindex');
        let {
            fire
        } = hook($);
        $.state = state = fromStates(TP.state, isString(state) ? {
            join: state
        } : state || {});
        $.source = source; // Store current instance to `TP.instances`
        TP.instances[source.id || source.name || toObjectCount(TP.instances)] = $; // Mark current DOM as active tag picker to prevent duplicate instance
        source[name] = 1;
        let classNameB = state['class'],
            classNameE = classNameB + '__',
            classNameM = classNameB + '--',
            form = getParentForm(source),
            // Capture the closest `<form>` element
            self = setElement('span', {
                'class': classNameB,
                'tabindex': sourceIsDisabled() ? false : '-1'
            }),
            text = setElement('span', {
                'class': classNameE + 'tag ' + classNameE + 'text'
            }),
            textInput = setElement('span', {
                'contenteditable': sourceIsDisabled() ? false : 'true',
                'spellcheck': 'false',
                'style': 'white-space:pre;'
            }),
            textInputHint = setElement('span'),
            textOutput = setElement('span', {
                'class': classNameE + 'tags'
            });
        let currentTagIndex = 0,
            currentTags = {};

        function getCurrentTags() {
            return currentTags;
        }

        function setCurrentTags() {
            currentTags = {}; // Reset!
            let i,
                items = getChildren(textOutput),
                j = toCount(items) - 1; // Minus 1 to skip the tag editor element
            for (i = 0; i < j; ++i) {
                if (hasClass(items[i], classNameE + 'tag--focus')) {
                    currentTags[i] = items[i];
                }
            }
        }

        function n(v) {
            return $.f(v).replace(toPattern('(' + state.escape.join('|').replace(/\\/g, '\\\\') + ')+'), "").trim();
        }

        function doBlurTags(exceptThisTag) {
            doToTags(exceptThisTag, function(index) {
                letClass(this, classNameE + 'tag--focus');
            });
        }

        function doFocusTags(exceptThisTag) {
            doToTags(exceptThisTag, function(index) {
                setClass(this, classNameE + 'tag--focus');
            });
        }

        function doToTags(exceptThisTag, then) {
            let i,
                items = getChildren(textOutput),
                j = toCount(items) - 1; // Minus 1 to skip the tag editor element
            for (i = 0; i < j; ++i) {
                if (exceptThisTag === items[i]) {
                    continue;
                }
                then.call(items[i], i);
            }
        }

        function onBlurFocusTag(e) {
            currentTags = {}; // Reset!
            let t = this,
                type = e.type,
                tag = t.title,
                tags = $.tags,
                index = toArrayKey(tag, tags),
                classNameTagM = classNameE + 'tag--';
            if ('blur' === type) {
                letClass(t, classNameTagM + 'focus');
                letClasses(self, [classNameM + 'focus', classNameM + 'focus-tag']);
            } else {
                setClass(t, classNameTagM + 'focus');
                setClasses(self, [classNameM + 'focus', classNameM + 'focus-tag']);
                currentTagIndex = index;
                currentTags[index] = t;
            }
            fire(type + '.tag', [tag, index]);
        }

        function onBlurFocusText(e) {
            let tags = $.tags,
                type = e.type,
                classNameTextM = classNameE + 'text--';
            if ('blur' === type) {
                letClass(text, classNameTextM + 'focus');
                letClasses(self, [classNameM + 'focus', classNameM + 'focus-text']);
                onInput();
            } else {
                setClass(text, classNameTextM + 'focus');
                setClasses(self, [classNameM + 'focus', classNameM + 'focus-text']);
                doBlurTags(text);
            }
            fire(type, [tags, toCount(tags)]);
        }

        function onBlurFocusSelf(e) {
            let type = e.type;
            if ('blur' === type) {
                letClass(self, classNameM + 'focus');
            } else {
                setClass(self, classNameM + 'focus');
            }
        }

        function onClickSelf(e) {
            if (e && self === e.target) {
                textInput.focus();
            }
            let tags = $.tags;
            fire('click', [tags, toCount(tags)]);
        }

        function onClickTag() {
            let t = this,
                tag = t.title,
                tags = $.tags;
            fire('click.tag', [tag, toArrayKey(tag, tags)]);
        }

        function onInput() {
            if (sourceIsDisabled() || sourceIsReadOnly()) {
                return setInput("");
            }
            let tag = n(getText(textInput)),
                index;
            if (tag) {
                if (!getTag(tag)) {
                    setTagElement(tag), setTag(tag);
                    index = toCount($.tags);
                    fire('change', [tag, index]);
                    fire('set.tag', [tag, index]);
                } else {
                    fire('has.tag', [tag, toArrayKey(tag, $.tags)]);
                }
                setInput("");
            }
        }

        function onBlurSelf() {
            letClass(self, classNameM + 'focus-self');
        }

        function onKeyDownInput(e) {
            offEventPropagation(e);
            let escape = state.escape,
                key = e.key,
                // Modern browser(s)
                keyCode = e.keyCode,
                // Legacy browser(s)
                keyIsCtrl = e.ctrlKey,
                keyIsEnter = KEY_ENTER[0] === key || KEY_ENTER[1] === keyCode,
                keyIsShift = e.shiftKey,
                keyIsTab = KEY_TAB[0] === key || KEY_TAB[1] === keyCode,
                tag,
                theTagLast = getPrev(text),
                theTagsCount = toCount($.tags),
                theTagsMax = state.max,
                theValueLast = n(getText(textInput)); // Last value before delay
            // Set preferred key name
            if (keyIsEnter) {
                key = '\n';
            } else if (keyIsTab) {
                key = '\t';
            } // Skip `Tab` key
            if (keyIsTab);
            else if (keyIsCtrl && "" === theValueLast && (KEY_A[0] === key || KEY_A[1] === keyCode)) {
                self.focus(), onFocusSelf(e), offEventDefault(e);
            } else if (sourceIsDisabled() || sourceIsReadOnly()) {
                // Submit the closest `<form>` element with `Enter` key
                if (keyIsEnter && sourceIsReadOnly()) {
                    doSubmitTry();
                }
                offEventDefault(e);
            } else if (hasValue(key, escape) || hasValue(keyCode, escape)) {
                if (theTagsCount < theTagsMax) {
                    // Add the tag name found in the tag editor
                    onInput();
                } else {
                    setInput("");
                    fire('max.tags', [theTagsMax]);
                }
                offEventDefault(e); // Submit the closest `<form>` element with `Enter` key
            } else if (keyIsEnter) {
                doSubmitTry(), offEventDefault(e);
            } else {
                delay(() => {
                    let theText = getText(textInput) || "",
                        value = n(theText); // Last try for buggy key detection on mobile device(s)
                    // Check for the last typed key in the tag editor
                    if (hasValue(theText.slice(-1), escape)) {
                        if (theTagsCount < theTagsMax) {
                            // Add the tag name found in the tag editor
                            onInput();
                        } else {
                            setInput("");
                            fire('max.tags', [theTagsMax]);
                        }
                        offEventDefault(e); // Escape character only, delete!
                    } else if ("" === value && !keyIsCtrl && !keyIsShift) {
                        if ("" === theValueLast && (KEY_DELETE_LEFT[0] === key || KEY_DELETE_LEFT[0] === keyCode)) {
                            letClass(self, classNameM + 'focus-tag');
                            tag = $.tags[theTagsCount - 1];
                            letTagElement(tag), letTag(tag);
                            if (theTagLast) {
                                fire('change', [tag, theTagsCount - 1]);
                                fire('let.tag', [tag, theTagsCount - 1]);
                            }
                        } else if (KEY_ARROW_LEFT[0] === key || KEY_ARROW_LEFT[1] === keyCode) {
                            // Focus to the last tag
                            theTagLast && theTagLast.focus();
                        }
                    }
                    setText(textInputHint, value ? "" : thePlaceholder);
                }, 0);
            }
        }

        function onKeyDownSelf(e) {
            $.tags;
            let key = e.key,
                // Modern browser(s)
                keyCode = e.keyCode,
                // Legacy browser(s)
                keyIsCtrl = e.ctrlKey,
                keyIsShift = e.shiftKey;
            if (sourceIsReadOnly()) {
                return;
            }
            let classNameTagM = classNameE + 'tag--';
            let theTag, theTagNext, theTagPrev, theTags, theTagIndex;
            if (!keyIsCtrl) {
                // Remove tag(s) with `Backspace` or `Delete` key
                if (!keyIsShift && (KEY_DELETE_LEFT[0] === key || KEY_DELETE_LEFT[1] === keyCode || KEY_DELETE_RIGHT[0] === key || KEY_DELETE_RIGHT[1] === keyCode)) {
                    setCurrentTags();
                    theTags = getCurrentTags();
                    let isBackspace = KEY_DELETE_LEFT[0] === key || KEY_DELETE_LEFT[1] === keyCode,
                        theTagTitle;
                    for (theTagIndex in theTags) {
                        theTag = theTags[theTagIndex];
                        letTagElement(theTagTitle = theTag.title), letTag(theTagTitle);
                    }
                    currentTagIndex = toObjectKeys(theTags);
                    currentTagIndex = +(currentTagIndex[0] || 0);
                    if (theTag = getChildren(textOutput, isBackspace ? currentTagIndex - 1 : currentTagIndex)) {
                        if (text === theTag) {
                            setInput("", 1);
                        } else {
                            theTag.focus();
                        }
                    } else {
                        setInput("", 1);
                    }
                    offEventDefault(e); // Focus to the previous tag
                } else if (KEY_ARROW_LEFT[0] === key || KEY_ARROW_LEFT[1] === keyCode) {
                    if (theTag = getChildren(textOutput, currentTagIndex - 1)) {
                        let theTagWasFocus = hasClass(theTag, classNameTagM + 'focus');
                        theTag.focus(), offEventDefault(e);
                        if (keyIsShift) {
                            setClass(theTagNext = getNext(theTag), classNameTagM + 'focus');
                            if (theTagWasFocus) {
                                letClass(theTagNext, classNameTagM + 'focus');
                            }
                        } else {
                            doBlurTags(theTag);
                        }
                    } else if (!keyIsShift) {
                        doBlurTags(getChildren(textOutput, 0));
                    } // Focus to the next tag or to the tag editor
                } else if (KEY_ARROW_RIGHT[0] === key || KEY_ARROW_RIGHT[1] === keyCode) {
                    if (theTag = getChildren(textOutput, currentTagIndex + 1)) {
                        let theTagWasFocus = hasClass(theTag, classNameTagM + 'focus');
                        text === theTag && !keyIsShift ? setInput("", 1) : theTag.focus(), offEventDefault(e);
                        if (keyIsShift) {
                            setClass(theTagPrev = getPrev(theTag), classNameTagM + 'focus');
                            if (theTagWasFocus) {
                                letClass(theTagPrev, classNameTagM + 'focus');
                            }
                        } else {
                            doBlurTags(theTag);
                        }
                    }
                }
            } else {
                // Select all tag(s) with `Ctrl+A` key
                if (KEY_A[0] === key || KEY_A[1] === keyCode) {
                    self.focus(), doFocusTags(), setCurrentTags(), offEventDefault(e);
                }
            } // if (!sourceIsReadOnly() && !keyIsCtrl && key && 1 === toCount(key)) {
            //     // Typing a single character should delete the entire tag(s)
            //     setTags(""), setInput(key, 1), offEventDefault(e);
            // } else if (!keyIsCtrl && !keyIsShift) {
            //     if (
            //         KEY_DELETE_LEFT[0] === key ||
            //         KEY_DELETE_LEFT[1] === keyCode ||
            //         KEY_DELETE_RIGHT[0] === key ||
            //         KEY_DELETE_RIGHT[1] === keyCode
            //     ) {
            //         setTags(""), setInput("", 1), offEventDefault(e);
            //     } else if (
            //         KEY_ARROW_RIGHT[0] === key ||
            //         KEY_ARROW_RIGHT[1] === keyCode
            //     ) {
            //         setInput("", 1), offEventDefault(e);
            //     }
            // }
        }

        function setTags(values) {
            // Remove …
            if (hasParent(self)) {
                let prev;
                while (prev = getPrev(text)) {
                    letTagElement(prev.title);
                }
            }
            $.tags = [];
            source.value = ""; // … then add tag(s)
            values = values ? values.split(state.join) : [];
            for (let i = 0, theTagsMax = state.max, value; i < theTagsMax; ++i) {
                if (!values[i]) {
                    break;
                }
                if ("" !== (value = n(values[i]))) {
                    if (getTag(value)) {
                        continue;
                    }
                    setTagElement(value), setTag(value);
                    fire('change', [value, i]);
                    fire('set.tag', [value, i]);
                }
            }
        }

        function onSubmitForm(e) {
            if (sourceIsDisabled()) {
                return;
            }
            let theTagsMin = state.min;
            onInput(); // Force to add the tag name found in the tag editor
            if (theTagsMin > 0 && toCount($.tags) < theTagsMin) {
                setInput("", 1);
                fire('min.tags', [theTagsMin]);
                offEventDefault(e);
                return;
            } // Do normal `submit` event
            return 1;
        }

        function onPasteInput() {
            delay(() => {
                if (!sourceIsDisabled() && !sourceIsReadOnly()) {
                    setTags(getText(textInput));
                }
                setInput("");
            }, 0);
        }

        function onFocusSelf(e) {
            e.key;
            e.keyCode;
            e.ctrlKey;
            setClass(self, classNameM + 'focus-self');
        }

        function onFocusSource() {
            textInput.focus();
        }

        function onClickTagX(e) {
            if (!sourceIsDisabled() && !sourceIsReadOnly()) {
                let t = this,
                    tag = getParent(t).title,
                    index = toArrayKey(tag, $.tags);
                letTagElement(tag), letTag(tag), setInput("", 1);
                fire('change', [tag, index]);
                fire('click.tag', [tag, index]);
                fire('let.tag', [tag, index]);
            }
            offEventDefault(e);
        }

        function setInput(value, fireFocus) {
            setText(textInput, value);
            setText(textInputHint, value ? "" : thePlaceholder);
            if (fireFocus) {
                textInput.focus(); // Move caret to the end!
                let range = D.createRange(),
                    selection = W.getSelection();
                range.selectNodeContents(textInput);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
        setInput("");

        function getTag(tag, fireHooks) {
            let index = toArrayKey(tag, $.tags);
            fireHooks && fire('get.tag', [tag, index]);
            return isNumber(index) ? tag : null;
        }

        function letTag(tag) {
            let index = toArrayKey(tag, $.tags);
            if (isNumber(index) && index >= 0) {
                $.tags.splice(index, 1);
                source.value = $.tags.join(state.join);
                return true;
            }
            return false;
        }

        function setTag(tag, index) {
            if (isNumber(index)) {
                index = index < 0 ? 0 : index;
                $.tags.splice(index, 0, tag);
            } else {
                $.tags.push(tag);
            } // Update value
            source.value = $.tags.join(state.join);
        }

        function setTagElement(tag, index) {
            let element = setElement('span', {
                'class': classNameE + 'tag',
                'tabindex': sourceIsDisabled() ? false : '0',
                'title': tag
            });
            let x = setElement('a', {
                'class': classNameE + 'tag-x',
                'href': "",
                'tabindex': '-1',
                'target': '_top'
            });
            onEvent('click', x, onClickTagX);
            setChildLast(element, x);
            onEvent('click', element, onClickTag);
            onEvents(['blur', 'focus'], element, onBlurFocusTag); // onEvent('keydown', element, onKeyDownTag);
            if (hasParent(textOutput)) {
                if (isNumber(index) && $.tags[index]) {
                    setPrev(getChildren(textOutput, index), element);
                } else {
                    setPrev(text, element);
                }
            }
        }

        function letTagElement(tag) {
            let index = toArrayKey(tag, $.tags),
                element;
            if (isNumber(index) && index >= 0 && (element = getChildren(textOutput, index))) {
                offEvent('click', element, onClickTag);
                offEvents(['blur', 'focus'], element, onBlurFocusTag); // offEvent('keydown', element, onKeyDownTag);
                let x = getChildFirst(element);
                if (x) {
                    offEvent('click', x, onClickTagX);
                    letElement(x);
                }
                letElement(element);
            }
        }

        function doSubmitTry() {
            onSubmitForm() && form && form.dispatchEvent(new Event('submit', {
                cancelable: true
            }));
        }
        setChildLast(self, textOutput);
        setChildLast(textOutput, text);
        setChildLast(text, textInput);
        setChildLast(text, textInputHint);
        setClass(source, classNameE + 'source');
        setNext(source, self);
        setElement(source, {
            'tabindex': '-1'
        });
        onEvents(['blur', 'focus'], textInput, onBlurFocusText);
        onEvent('blur', self, onBlurSelf);
        onEvent('click', self, onClickSelf);
        onEvents(['blur', 'focus'], self, onBlurFocusSelf);
        onEvent('focus', self, onFocusSelf);
        onEvent('focus', source, onFocusSource);
        onEvent('keydown', textInput, onKeyDownInput);
        onEvent('keydown', self, onKeyDownSelf);
        onEvent('paste', textInput, onPasteInput);
        form && onEvent('submit', form, onSubmitForm); // $.blur = () => ((!sourceIsDisabled() && (textInput.blur(), onBlurInput())), $);
        $.click = () => (self.click(), onClickSelf(), $); // Default filter for the tag name
        $.f = text => toCaseLower(text || "").replace(/[^ a-z\d-]/g, ""); // $.focus = () => {
        //     if (!sourceIsDisabled()) {
        //         textInput.focus();
        //         onFocusInput();
        //     }
        //     return $;
        // };
        $.get = tag => sourceIsDisabled() ? null : getTag(tag, 1);
        $.input = textInput;
        $.let = tag => {
            if (!sourceIsDisabled() && !sourceIsReadOnly()) {
                if (!tag) {
                    setTags("");
                } else {
                    let theTagsMin = state.min;
                    onInput();
                    if (theTagsMin > 0 && toCount($.tags) < theTagsMin) {
                        fire('min.tags', [theTagsMin]);
                        return $;
                    }
                    letTagElement(tag), letTag(tag);
                }
            }
            return $;
        };
        $.pop = () => {
            if (!source[name]) {
                return $; // Already ejected!
            }
            delete source[name];
            let tags = $.tags;
            letClass(source, classNameE + 'source');
            offEvents(['blur', 'focus'], textInput, onBlurFocusText);
            offEvent('blur', self, onBlurSelf);
            offEvent('click', self, onClickSelf);
            offEvents(['blur', 'focus'], self, onBlurFocusSelf);
            offEvent('focus', self, onFocusSelf);
            offEvent('focus', source, onFocusSource);
            offEvent('keydown', textInput, onKeyDownInput);
            offEvent('keydown', self, onKeyDownSelf);
            offEvent('paste', textInput, onPasteInput);
            form && offEvent('submit', form, onSubmitForm);
            tags.forEach(letTagElement);
            setElement(source, {
                'tabindex': theTabIndex
            });
            return letElement(self), fire('pop', [tags]);
        };
        $.self = self;
        $.set = (tag, index) => {
            if (!tag) {
                return $;
            }
            if (!sourceIsDisabled() && !sourceIsReadOnly()) {
                if (isArray(tag)) {
                    setTags(tag.join(state.join));
                } else {
                    let tags = $.tags,
                        theTagsMax = state.max;
                    if (!getTag(tag)) {
                        if (toCount(tags) < theTagsMax) {
                            setTagElement(tag, index), setTag(tag, index);
                        } else {
                            fire('max.tags', [theTagsMax]);
                        }
                    } else {
                        fire('has.tag', [tag, toArrayKey(tag, tags)]);
                    }
                }
            }
            return $;
        };
        $.source = $.output = source;
        $.state = state;
        $.tags = [];
        setTags(source.value); // Fill value(s)
        return $;
    }
    TP.instances = {};
    TP.state = {
        'class': 'tag-picker',
        'escape': [',', 188],
        'join': ', ',
        'max': 9999,
        'min': 0
    };
    TP.version = '3.3.0';
    return TP;
});