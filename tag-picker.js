/*!
 * ==============================================================
 *  TAG PICKER 3.0.7
 * ==============================================================
 * Author: Taufik Nurrohman <https://github.com/taufik-nurrohman>
 * License: MIT
 * --------------------------------------------------------------
 */

(function(win, doc, NS) {

    var Arrow = 'Arrow',
        ArrowLeft = Arrow + 'Left',
        ArrowRight = Arrow + 'Right',
        Backspace = 'Backspace',
        Delete = 'Delete',
        Enter = 'Enter',
        Tab = 'Tab',

        __instance__ = '__instance__',

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

        $$.version = '3.0.7';

        // Collect all instance(s)
        $$[__instance__] = {};

        // Apply to all instance(s)
        $$.each = function(fn, t) {
            var i, j;
            return delay(function() {
                j = $$[__instance__];
                for (i in j) {
                    fn.call(j[i], i);
                }
            }, 0 === t ? 0 : (t || 1)), $$;
        };

        // Language library
        $$.I = {
            'Maximum tags allowed is %d': 'Maximum tags allowed is %d.',
            'Minimum tags allowed is %d': 'Minimum tags allowed is %d.',
            'Remove tag %s': 'Remove tag \u201C%s\u201D',
            'Tag %s already exists': 'Tag \u201C%s\u201D already exists.'
        };

        $$.i = function(text, args) {
            text = $$.I[text] || text;
            args && args[forEach](function(v) {
                text = text[replace]('%' + (isNumber(v) ? 'd' : 's'), v);
            });
            return text;
        };

        $$._ = $$.prototype;

    })(win[NS] = function(source, o) {

        if (!source) return;

        var $ = this,
            $$ = win[NS],
            placeholder = source.placeholder || "",
            tabindex = source[getAttribute]('tabindex'),
            hooks = {},
            state = Object.assign({
                'alert': true,
                'class': 'tag-picker',
                'escape': [',', 188],
                'join': ', ',
                'max': 9999,
                'min': 0,
                'x': false
            }, isString(o) ? {
                'join': o
            } : (o || {})),
            i, j, k, v;

        // Already instantiated, skip!
        if (source[NS]) {
            return $;
        }

        // Return new instance if `TP` was called without the `new` operator
        if (!($ instanceof $$)) {
            return new $$(source, state);
        }

        // Store tag picker instance to `TP.__instance__`
        $$[__instance__][source.id || source.name || Object.keys($$[__instance__]).length] = $;

        // Mark current DOM as active tag picker to prevent duplicate instance
        source[NS] = 1;

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

        function onInput(guard) {
            if (source[disabled] || source[readOnly]) {
                return inputSet("");
            }
            var name = n(editorInput[textContent]), index;
            if (name) {
                if (!tagGet(name)) {
                    tagSetNode(name), tagSet(name);
                    index = $.tags.length;
                    hookFire('change', [name, index]);
                    hookFire('set.tag', [name, index]);
                } else if (guard) {
                    alertSet('Tag %s already exists', [name]);
                }
                inputSet("");
            }
        }

        function onBlurInput() {
            onInput(1);
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
                name;
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
                    onInput(1);
                } else {
                    inputSet("");
                    alertSet('Maximum tags allowed is %d', [max]);
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
                            onInput(1);
                        } else {
                            inputSet("");
                            alertSet('Maximum tags allowed is %d', [max]);
                        }
                        preventDefault(e);
                    // Escape character only, delete!
                    } else if ("" === v && !isCtrl && !isShift) {
                        if ("" === vv && (Backspace === kk || 8 === k)) {
                            name = $.tags[lengthTags - 1];
                            classLet(view, 'focus.tag');
                            tagLetNode(name), tagLet(name);
                            if (lastTag) {
                                hookFire('change', [name, lengthTags - 1]);
                                hookFire('let.tag', [name, lengthTags - 1]);
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
                alertSet('Minimum tags allowed is %d', [min]);
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
                name = t.title;
            classLet(view, 'focus');
            classLet(view, 'focus.tag');
            hookFire('blur.tag', [name, arrayKey(name, $.tags)]);
        }

        function onClickTag() {
            var name = this.title;
            hookFire('click.tag', [name, arrayKey(name, $.tags)]);
        }

        function onFocusTag() {
            var t = this,
                name = t.title;
            classSet(view, 'focus');
            classSet(view, 'focus.tag');
            hookFire('focus.tag', [name, arrayKey(name, $.tags)]);
        }

        function onClickTagX(e) {
            if (!source[disabled] && !source[readOnly]) {
                var name = this[parentNode].title;
                tagLetNode(name), tagLet(name), inputSet("", 1);
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
                    var name = t.title,
                        index = arrayKey(name, $.tags);
                    classLet(view, 'focus.tag');
                    tagLetNode(name), tagLet(name);
                    // Focus to the previous tag or to the tag input after remove
                    if (Backspace === kk || 8 === k) {
                        previousTag ? previousTag.focus() : inputSet("", 1);
                    // Focus to the next tag or to the tag input after remove
                    } else /* if (Delete === kk || 46 === k) */ {
                        nextTag && nextTag !== editor ? nextTag.focus() : inputSet("", 1);
                    }
                    hookFire('change', [name, index]);
                    hookFire('let.tag', [name, index]);
                }
                preventDefault(e);
            }
        }

        function alertSet(key, v) {
            var a = state.alert, k;
            if (true === a && (k = $$.i(key, v))) {
                alert(k);
            } else if (isFunction(a)) {
                a.apply($, v);
            // Function name as string stored in the `TP` object
            } else if (isString(a) && $$[a]) {
                $$[a].apply($, v);
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

        function tagGet(name, hook) {
            var index = arrayKey(name, $.tags);
            hook && hookFire('get.tag', [name, index]);
            return isNumber(index) ? name : null;
        }

        function tagLet(name) {
            var index = arrayKey(name, $.tags);
            if (isNumber(index) && index >= 0) {
                $.tags.splice(index, 1);
                source.value = $.tags.join(state.join);
                return true;
            }
            return false;
        }

        function tagSet(name, index) {
            if (isNumber(index)) {
                index = index < 0 ? 0 : index;
                $.tags.splice(index, 0, name);
            } else {
                $.tags.push(name);
            }
            // Update value
            source.value = $.tags.join(state.join);
        }

        function tagSetNode(name, index) {
            var tag = nodeSet('span', 0, {
                'class': 'tag',
                'tabindex': source[disabled] ? false : '0',
                'title': name
            });
            if (state.x) {
                var x = nodeSet('a', 0, {
                    'href': "",
                    'tabindex': '-1',
                    'title': $$.i('Remove tag %s', [name])
                });
                on(x, 'click', onClickTagX);
                tag[appendChild](x);
            }
            on(tag, 'blur', onBlurTag);
            on(tag, 'click', onClickTag);
            on(tag, 'focus', onFocusTag);
            on(tag, 'keydown', onKeyDownTag);
            if (tags[parentNode]) {
                if (isNumber(index) && $.tags[index]) {
                    tags[insertBefore](tag, tags[children][index]);
                } else {
                    tags[insertBefore](tag, editor);
                }
            }
        }

        function tagLetNode(name) {
            var index = arrayKey(name, $.tags), tag;
            if (isNumber(index) && index >= 0 && (tag = tags.children[index])) {
                off(tag, 'blur', onBlurTag);
                off(tag, 'click', onClickTag);
                off(tag, 'focus', onFocusTag);
                off(tag, 'keydown', onKeyDownTag);
                if (state.x) {
                    var x = tag[firstChild];
                    off(x, 'click', onClickTagX);
                    nodeLet(x);
                }
                nodeLet(tag);
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
        form = source[parentNode];
        while (form && form[nodeName] && 'form' !== form[nodeName][toLowerCase]()) {
            form = form[parentNode];
        }

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

        $.get = function(name) {
            return source[disabled] ? null : tagGet(name, 1);
        };

        $.let = function(name, guard) {
            if (!source[disabled] && !source[readOnly]) {
                var min = state.min;
                onInput();
                if (guard && min > 0 && $.tags.length < min) {
                    alertSet('Minimum tags allowed is %d', [min]);
                    return $;
                }
                tagLetNode(name), tagLet(name);
            }
            return $;
        };

        $.on = hookSet;
        $.off = hookLet;

        $.pop = function() {
            if (!source[NS]) {
                return $; // Already ejected
            }
            delete source[NS];
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
            return nodeLet(view), hookFire('pop');
        };

        $.set = function(name, index, guard) {
            if (!source[disabled] && !source[readOnly]) {
                if (!tagGet(name)) {
                    var max = state.max;
                    if ($.tags.length < max) {
                        tagSetNode(name, index), tagSet(name, index);
                    } else if (guard) {
                        alertSet('Maximum tags allowed is %d', [max]);
                    }
                } else if (guard) {
                    alertSet('Tag %s already exists', [name]);
                }
            }
            return $;
        };

        $.value = function(values) {
            return (!source[disabled] && !source[readOnly] && tagsSet(values)), $;
        };

    });

})(window, document, 'TP');
