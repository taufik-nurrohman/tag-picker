/*!
 * ==============================================================
 *  TAG PICKER 3.0.9
 * ==============================================================
 * Author: Taufik Nurrohman <https://github.com/taufik-nurrohman>
 * License: MIT
 * --------------------------------------------------------------
 */

(function(win, doc, name) {

    var Arrow = 'Arrow',
        ArrowLeft = Arrow + 'Left',
        ArrowRight = Arrow + 'Right',
        Backspace = 'Backspace',
        Delete = 'Delete',
        Enter = 'Enter',
        Tab = 'Tab',

        appendChild = 'appendChild',
        children = 'children',
        classList = 'classList',
        createElement = 'createElement',
        ctrlKey = 'ctrlKey',
        disabled = 'disabled',
        firstChild = 'firstChild',
        forEach = 'forEach',
        getAttribute = 'getAttribute',
        indexOf = 'indexOf',
        innerHTML = 'innerHTML',
        insertBefore = 'insertBefore',
        instances = 'instances',
        key = 'key',
        keyCode = key + 'Code',
        lastChild = 'lastChild',
        nextSibling = 'nextSibling',
        nodeName = 'nodeName',
        parentNode = 'parentNode',
        previousSibling = 'previousSibling',
        readOnly = 'readOnly',
        removeAttribute = 'removeAttribute',
        removeChild = 'removeChild',
        replace = 'replace',
        setAttribute = 'setAttribute',
        shiftKey = 'shiftKey',
        textContent = 'textContent',
        toLowerCase = 'toLowerCase',

        delay = setTimeout;

    function arrayKey(a, b) {
        var i = b[indexOf](a);
        return i < 0 ? null : i;
    }

    function classGet(a, name) {
        return a[classList].contains(name);
    }

    function classLet(a, name) {
        return a[classList].remove(name);
    }

    function classSet(a, name) {
        return a[classList].add(name);
    }

    function inArray(a, b) {
        return b[indexOf](a) >= 0;
    }

    function isFunction(x) {
        return 'function' === typeof x;
    }

    function isNumber(x) {
        return 'number' === typeof x;
    }

    function isSet(x) {
        return 'undefined' !== typeof x || null === x;
    }

    function isString(x) {
        return 'string' === typeof x;
    }

    function nodeLet(el) {
        nodeGet(el) && el[parentNode][removeChild](el);
    }

    function nodeGet(el) {
        return el && el[parentNode];
    }

    function nodeSet(name, content, attr) {
        var el = isString(name) ? doc[createElement](name) : name, k, v;
        if (content || "" === content) {
            el[innerHTML] = content;
        }
        if (attr) {
            for (k in attr) {
                v = attr[k];
                if (null === v || false === v) {
                    el[removeAttribute](k);
                } else {
                    el[setAttribute](k, v);
                }
            }
        }
        return el;
    }

    (function($$) {

        $$.version = '3.0.9';

        $$.state = {
            'class': 'tag-picker',
            'escape': [',', 188],
            'join': ', ',
            'max': 9999,
            'min': 0,
            'x': false
        };

        // Collect all instance(s)
        $$[instances] = {};

        $$._ = $$.prototype;

    })(win[name] = function(source, o) {

        if (!source) return;

        var $ = this,
            $$ = win[name],
            placeholder = source.placeholder || "",
            tabindex = source[getAttribute]('tabindex'),
            hooks = {},
            state = Object.assign({}, $$.state, isString(o) ? {
                'join': o
            } : (o || {})),
            i, j, k, v;

        // Already instantiated, skip!
        if (source[name]) {
            return $;
        }

        // Return new instance if `TP` was called without the `new` operator
        if (!($ instanceof $$)) {
            return new $$(source, state);
        }

        // Store tag picker instance to `TP.instances`
        $$[instances][source.id || source.name || Object.keys($$[instances]).length] = $;

        // Mark current DOM as active tag picker to prevent duplicate instance
        source[name] = 1;

        var view = nodeSet('span', 0, {
                'class': state['class']
            }),
            tags = nodeSet('span', 0, {
                'class': 'tags'
            }),
            editor = nodeSet('span', 0, {
                'class': 'editor tag'
            }),
            editorInput = nodeSet('span', 0, {
                'contenteditable': source[disabled] ? false : 'true',
                'spellcheck': 'false',
                'style': 'white-space:pre;'
            }),
            editorInputPlaceholder = nodeSet('span'), form;

        function hookLet(name, fn) {
            if (!isSet(name)) {
                return (hooks = {}), $;
            }
            if (isSet(hooks[name])) {
                if (isSet(fn)) {
                    for (var i = 0, j = hooks[name].length; i < j; ++i) {
                        if (fn === hooks[name][i]) {
                            hooks[name].splice(i, 1);
                        }
                    }
                } else {
                    delete hooks[name];
                }
            }
            return $;
        }

        function hookSet(name, fn) {
            if (!isSet(hooks[name])) {
                hooks[name] = [];
            }
            if (isSet(fn)) {
                hooks[name].push(fn);
            }
            return $;
        }

        function hookFire(name, lot) {
            if (!isSet(hooks[name])) {
                return $;
            }
            for (var i = 0, j = hooks[name].length; i < j; ++i) {
                hooks[name][i].apply($, lot);
            }
            return $;
        }

        // Default filter for the tag name
        $.f = function(v) {
            return v[toLowerCase]()[replace](/[^ a-z0-9-]/g, "");
        };

        function n(v) {
            return $.f(v)[replace](new RegExp('(' + state.escape.join('|')[replace](/\\/g, '\\\\') + ')+'), "").trim();
        }

        function onInput() {
            if (source[disabled] || source[readOnly]) {
                return inputSet("");
            }
            var tag = n(editorInput[textContent]),
                tags = $.tags, index;
            if (tag) {
                if (!tagGet(tag)) {
                    tagSetNode(tag), tagSet(tag);
                    index = tags.length;
                    hookFire('change', [tag, index]);
                    hookFire('set.tag', [tag, index]);
                } else {
                    hookFire('has.tag', [tag, arrayKey(tag, tags)]);
                }
                inputSet("");
            }
        }

        function onBlurInput() {
            onInput();
            classLet(view, 'focus');
            classLet(view, 'focus.input');
            hookFire('blur', [v, $.tags.length]);
        }

        function onClickInput() {
            hookFire('click', [$.tags]);
        }

        function onFocusInput() {
            classSet(view, 'focus');
            classSet(view, 'focus.input');
            hookFire('focus', [$.tags]);
        }

        function onKeyDownInput(e) {
            var escape = state.escape,
                t = this,
                k = e[keyCode], // Legacy browser(s)
                kk = e[key], // Modern browser(s)
                isCtrl = e[ctrlKey],
                isEnter = Enter === kk || 13 === k,
                isShift = e[shiftKey],
                isTab = Tab === kk || 9 === k,
                lastTag = editor[previousSibling],
                lengthTags = $.tags.length,
                max = state.max,
                vv = n(editorInput[textContent]), // Last value before delay
                tag;
            // Set preferred key name
            if (isEnter) {
                kk = '\n';
            } else if (isTab) {
                kk = '\t';
            }
            // Skip `Tab` key
            if (isTab) {
                // :)
            } else if (source[disabled] || source[readOnly]) {
                // Submit the closest `<form>` element with `Enter` key
                if (isEnter && source[readOnly]) {
                    trySubmit();
                }
                preventDefault(e);
            } else if (inArray(kk, escape) || inArray(k, escape)) {
                if (lengthTags < max) {
                    // Add the tag name found in the tag editor
                    onInput();
                } else {
                    inputSet("");
                    hookFire('max.tags', [max]);
                }
                preventDefault(e);
            // Submit the closest `<form>` element with `Enter` key
            } else if (isEnter) {
                trySubmit(), preventDefault(e);
            } else {
                delay(function() {
                    var text = editorInput[textContent],
                        v = n(text);
                    // Last try for buggy key detection on mobile device(s)
                    // Check for the last typed key in the tag editor
                    if (inArray(text.slice(-1), escape)) {
                        if (lengthTags < max) {
                            // Add the tag name found in the tag editor
                            onInput();
                        } else {
                            inputSet("");
                            hookFire('max.tags', [max]);
                        }
                        preventDefault(e);
                    // Escape character only, delete!
                    } else if ("" === v && !isCtrl && !isShift) {
                        if ("" === vv && (Backspace === kk || 8 === k)) {
                            tag = $.tags[lengthTags - 1];
                            classLet(view, 'focus.tag');
                            tagLetNode(tag), tagLet(tag);
                            if (lastTag) {
                                hookFire('change', [tag, lengthTags - 1]);
                                hookFire('let.tag', [tag, lengthTags - 1]);
                            }
                        } else if (ArrowLeft === kk || 37 === k) {
                            // Focus to the last tag
                            lastTag && lastTag.focus();
                        }
                    }
                    editorInputPlaceholder[innerHTML] = v ? "" : placeholder;
                }, 0);
            }
        }

        function tagsSet(values) {
            // Remove …
            if (view[parentNode]) {
                var prev;
                while (prev = editor[previousSibling]) {
                    tagLetNode(prev.title);
                }
            }
            $.tags = [];
            source.value = "";
            // … then add tag(s)
            values = values ? values.split(state.join) : [],
            j = state.max, i, v;
            for (i = 0; i < j; ++i) {
                if (!values[i]) {
                    break;
                }
                if ("" !== (v = n(values[i]))) {
                    if (tagGet(v)) {
                        continue;
                    }
                    tagSetNode(v), tagSet(v);
                    hookFire('change', [v, i]);
                    hookFire('set.tag', [v, i]);
                }
            }
        }

        function onSubmitForm(e) {
            if (source[disabled]) {
                return;
            }
            var min = state.min;
            onInput(); // Force to add the tag name found in the tag editor
            if (min > 0 && $.tags.length < min) {
                inputSet("", 1);
                hookFire('min.tags', [min]);
                preventDefault(e);
                return;
            }
            // Do normal `submit` event
            return 1;
        }

        function onPasteInput() {
            delay(function() {
                if (!source[disabled] && !source[readOnly]) {
                    tagsSet(editorInput[textContent]);
                }
                inputSet("");
            }, 0);
        }

        function onClickView(e) {
            if (e && view === e.target) {
                editorInput.focus();
                onClickInput();
            }
        }

        function onFocusSource() {
            editorInput.focus();
        }

        function onBlurTag() {
            var t = this,
                tag = t.title,
                tags = $.tags;
            classLet(view, 'focus');
            classLet(view, 'focus.tag');
            hookFire('blur.tag', [tag, arrayKey(tag, tags)]);
        }

        function onClickTag() {
            var tag = this.title,
                tags = $.tags;
            hookFire('click.tag', [tag, arrayKey(tag, tags)]);
        }

        function onFocusTag() {
            var t = this,
                tag = t.title,
                tags = $.tags;
            classSet(view, 'focus');
            classSet(view, 'focus.tag');
            hookFire('focus.tag', [tag, arrayKey(tag, tags)]);
        }

        function onClickTagX(e) {
            if (!source[disabled] && !source[readOnly]) {
                var tag = this[parentNode].title;
                tagLetNode(tag), tagLet(tag), inputSet("", 1);
            }
            preventDefault(e);
        }

        function onKeyDownTag(e) {
            var t = this,
                k = e[keyCode], // Legacy browser(s)
                kk = e[key], // Modern browser(s)
                isCtrl = e[ctrlKey],
                isEnter = Enter === kk || 13 === k,
                isReadOnly = source[readOnly],
                isShift = e[shiftKey],
                isTab = Tab === kk || 9 === k,
                previousTag = t[previousSibling],
                nextTag = t[nextSibling];
            // Focus to the previous tag
            if (!isReadOnly && (ArrowLeft === kk || 37 === k)) {
                previousTag && (previousTag.focus(), preventDefault(e));
            // Focus to the next tag or to the tag input
            } else if (!isReadOnly && (ArrowRight === kk || 39 === k)) {
                nextTag && nextTag !== editor ? nextTag.focus() : inputSet("", 1);
                preventDefault(e);
            // Remove tag with `Backspace` or `Delete` key
            } else if (
                Backspace === kk || Delete === kk ||
                8 === k || 46 === k
            ) {
                if (!isReadOnly) {
                    var tag = t.title,
                        index = arrayKey(tag, $.tags);
                    classLet(view, 'focus.tag');
                    tagLetNode(tag), tagLet(tag);
                    // Focus to the previous tag or to the tag input after remove
                    if (Backspace === kk || 8 === k) {
                        previousTag ? previousTag.focus() : inputSet("", 1);
                    // Focus to the next tag or to the tag input after remove
                    } else /* if (Delete === kk || 46 === k) */ {
                        nextTag && nextTag !== editor ? nextTag.focus() : inputSet("", 1);
                    }
                    hookFire('change', [tag, index]);
                    hookFire('let.tag', [tag, index]);
                }
                preventDefault(e);
            }
        }

        function inputSet(v, focus) {
            editorInput[textContent] = v;
            editorInputPlaceholder[textContent] = v ? "" : placeholder;
            focus && editorInput.focus();
        } inputSet("");

        function off(el, name, fn) {
            el.removeEventListener(name, fn);
        }

        function on(el, name, fn) {
            el.addEventListener(name, fn, false);
        }

        function preventDefault(e) {
            e && e.preventDefault();
        }

        function tagGet(tag, hook) {
            var index = arrayKey(tag, $.tags);
            hook && hookFire('get.tag', [tag, index]);
            return isNumber(index) ? tag : null;
        }

        function tagLet(tag) {
            var index = arrayKey(tag, $.tags);
            if (isNumber(index) && index >= 0) {
                $.tags.splice(index, 1);
                source.value = $.tags.join(state.join);
                return true;
            }
            return false;
        }

        function tagSet(tag, index) {
            if (isNumber(index)) {
                index = index < 0 ? 0 : index;
                $.tags.splice(index, 0, tag);
            } else {
                $.tags.push(tag);
            }
            // Update value
            source.value = $.tags.join(state.join);
        }

        function tagSetNode(tag, index) {
            var node = nodeSet('span', 0, {
                'class': 'tag',
                'tabindex': source[disabled] ? false : '0',
                'title': tag
            });
            if (state.x) {
                var x = nodeSet('a', 0, {
                    'href': "",
                    'tabindex': '-1'
                });
                on(x, 'click', onClickTagX);
                node[appendChild](x);
            }
            on(node, 'blur', onBlurTag);
            on(node, 'click', onClickTag);
            on(node, 'focus', onFocusTag);
            on(node, 'keydown', onKeyDownTag);
            if (tags[parentNode]) {
                if (isNumber(index) && $.tags[index]) {
                    tags[insertBefore](node, tags[children][index]);
                } else {
                    tags[insertBefore](node, editor);
                }
            }
        }

        function tagLetNode(tag) {
            var index = arrayKey(tag, $.tags), node;
            if (isNumber(index) && index >= 0 && (node = tags.children[index])) {
                off(node, 'blur', onBlurTag);
                off(node, 'click', onClickTag);
                off(node, 'focus', onFocusTag);
                off(node, 'keydown', onKeyDownTag);
                if (state.x) {
                    var x = node[firstChild];
                    off(x, 'click', onClickTagX);
                    nodeLet(x);
                }
                nodeLet(node);
            }
        }

        function trySubmit() {
            onSubmitForm() && form && form.submit();
        }

        classSet(source, state['class'] + '-source');
        source[parentNode][insertBefore](view, source[nextSibling]);
        view[appendChild](tags);
        tags[appendChild](editor);
        editor[appendChild](editorInput);
        editor[appendChild](editorInputPlaceholder);

        nodeSet(source, 0, {
            'tabindex': '-1'
        });

        // Capture the closest `<form>` element
        form = source.form;

        on(editorInput, 'blur', onBlurInput);
        on(editorInput, 'click', onClickInput);
        on(editorInput, 'focus', onFocusInput);
        on(editorInput, 'keydown', onKeyDownInput);
        on(editorInput, 'paste', onPasteInput);
        on(source, 'focus', onFocusSource);
        on(view, 'click', onClickView);

        form && on(form, 'submit', onSubmitForm);

        $.tags = [];

        tagsSet(source.value); // Fill value(s)

        $.hooks = hooks;
        $.input = editorInput;
        $.self = $.view = view;
        $.source = $.output = source;
        $.state = state;

        $.blur = function() {
            return (!source[disabled] && (editorInput.blur(), onBlurInput())), $;
        };

        $.click = function() {
            return view.click(), onClickView(), $;
        };

        $.fire = hookFire;

        $.focus = function() {
            if (!source[disabled]) {
                editorInput.focus();
                onFocusInput();
            }
            return $;
        };

        $.get = function(tag) {
            return source[disabled] ? null : tagGet(tag, 1);
        };

        $.let = function(tag) {
            if (!source[disabled] && !source[readOnly]) {
                var min = state.min;
                onInput();
                if (min > 0 && $.tags.length < min) {
                    hookFire('min.tags', [min]);
                    return $;
                }
                tagLetNode(tag), tagLet(tag);
            }
            return $;
        };

        $.on = hookSet;
        $.off = hookLet;

        $.pop = function() {
            if (!source[name]) {
                return $; // Already ejected
            }
            delete source[name];
            off(editorInput, 'blur', onBlurInput);
            off(editorInput, 'click', onClickInput);
            off(editorInput, 'focus', onFocusInput);
            off(editorInput, 'keydown', onKeyDownInput);
            off(editorInput, 'paste', onPasteInput);
            off(source, 'focus', onFocusSource);
            off(view, 'click', onClickView);
            form && off(form, 'submit', onSubmitForm);
            $.tags[forEach](tagLetNode);
            classLet(source, state['class'] + '-source');
            nodeSet(source, 0, {
                'tabindex': tabindex
            });
            return nodeLet(view), hookFire('pop', [$.tags]);
        };

        $.set = function(tag, index) {
            if (!source[disabled] && !source[readOnly]) {
                var max = state.max,
                    tags = $.tags;
                if (!tagGet(tag)) {
                    if (tags.length < max) {
                        tagSetNode(tag, index), tagSet(tag, index);
                    } else {
                        hookFire('max.tags', [max]);
                    }
                } else {
                    hookFire('has.tag', [tag, arrayKey(tag, tags)]);
                }
            }
            return $;
        };

        $.value = function(values) {
            return (!source[disabled] && !source[readOnly] && tagsSet(values)), $;
        };

    });

})(this, this.document, 'TP');
