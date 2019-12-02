/*!
 * ==========================================================
 *  TAG PICKER PLUGIN 3.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(win, doc, NS) {

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
        forEach = 'forEach',
        fromCharCode = 'fromCharCode',
        indexOf = 'indexOf',
        innerHTML = 'innerHTML',
        insertBefore = 'insertBefore',
        instance = '__instance__',
        key = 'key',
        keyCode = key + 'Code',
        lastChild = 'lastChild',
        nextSibling = 'nextSibling',
        nodeName = 'nodeName',
        parentNode = 'parentNode',
        previousSibling = 'previousSibling',
        removeAttribute = 'removeAttribute',
        removeChild = 'removeChild',
        replace = 'replace',
        setAttribute = 'setAttribute',
        textContent = 'textContent',
        toLowerCase = 'toLowerCase',

        delay = setTimeout;

    function array_key(a, b) {
        var i = b[indexOf](a);
        return i < 0 ? null : i;
    }

    function el(name, content, attr) {
        var e = is_string(name) ? doc[createElement](name) : name, k, v;
        if (content || "" === content) {
            e[innerHTML] = content;
        }
        if (attr) {
            for (k in attr) {
                v = attr[k];
                if (null === v || false === v) {
                    e[removeAttribute](k);
                } else {
                    e[setAttribute](k, v);
                }
            }
        }
        return e;
    }

    function class_get(a, name) {
        return a[classList].contains(name);
    }

    function class_let(a, name) {
        return a[classList].remove(name);
    }

    function class_set(a, name) {
        return a[classList].add(name);
    }

    function extend(a, b) {
        return Object.assign(a, b);
    }

    function in_array(a, b) {
        return b[indexOf](a) >= 0;
    }

    function is_function(x) {
        return 'function' === typeof x;
    }

    function is_number(x) {
        return 'number' === typeof x;
    }

    function is_set(x) {
        return 'undefined' !== typeof x;
    }

    function is_string(x) {
        return 'string' === typeof x;
    }

    function object_length(x) {
        return Object.keys(x).length;
    }

    (function($$) {

        $$.version = '3.0.0';

        // Collect all instance(s)
        $$[instance] = {};

        // Apply to all instance(s)
        $$.each = function(fn, t) {
            return delay(function() {
                var ins = $$[instance], i;
                for (i in ins) {
                    fn.call(ins[i], i, ins);
                }
            }, 0 === t ? 0 : (t || 1)), $$;
        };

        // Language library
        $$.I = {
            'Duplicate tag name: %s': 'Duplicate tag name: \u201C%s\u201D'
        };

        $$.i = function(text, args) {
            text = win[NS].I[text] || text;
            args && args.forEach(function(v) {
                text = text.replace('%s', v);
            });
            return text;
        };

    })(win[NS] = function(source, o) {

        if (!source) return;

        var $ = this,
            $$ = win[NS],
            placeholder = source.placeholder || "",
            defaults = {
                'alert': true,
                'class': 'tag-picker',
                'escape': [','],
                'join': ', ',
                'max': 9999
            },
            i, j, k, v;

        // Already instantiated, skip!
        if (source[NS]) {
            return $;
        }

        // Return new instance if `TP` was called without the `new` operator
        if (!($ instanceof $$)) {
            return new $$(source, o);
        }

        // Store tag picker instance to `TP.__instance__`
        $$[instance][source.id || source.name || object_length($$[instance])] = $;

        // Mark current DOM as active tag picker to prevent duplicate instance
        source[NS] = 1;

        if (is_string(o)) {
            o = {
                'join': o
            };
        }

        var hooks = {},
            state = extend(defaults, o),
            view = el('span', "", {
                'class': state['class']
            }),
            tags = el('span', "", {
                'class': 'tags'
            }),
            editor = el('span', "", {
                'class': 'editor tag'
            }),
            editor_input = el('span', "", {
                'contenteditable': 'true',
                'spellcheck': 'false',
                'style': 'white-space:pre;'
            }),
            editor_placeholder = el('span');

        function hook_get(name, id) {
            if (!is_set(name)) {
                return hooks;
            }
            if (!is_set(id)) {
                return hooks[name] || {};
            }
            return hooks[name][id] || null;
        }

        function hook_set(name, fn, id) {
            if (!is_set(hooks[name])) {
                hooks[name] = {};
            }
            if (!is_set(id)) {
                id = object_length(hooks[name]);
            }
            return hooks[name][id] = fn, $;
        }

        function hook_let(name, id) {
            if (!is_set(name)) {
                return hooks = {}, $;
            }
            if (!is_set(id)) {
                return hooks[name] = {}, $;
            }
            return delete hooks[name][id], $;
        }

        function hook_fire(name, lot, id) {
            if (!is_set(hooks[name])) {
                return $;
            }
            if (!is_set(id)) {
                for (var i in hooks[name]) {
                    hooks[name][i].apply($, lot);
                }
            } else {
                if (is_set(hooks[name][id])) {
                    hooks[name][id].apply($, lot);
                }
            }
            return $;
        }

        // Default filter for the tag name
        $.f = function(v) {
            return v[toLowerCase]()[replace](/[^ a-z0-9-]/g, "");
        };

        function n(v) {
            return $.f(v)[replace](new RegExp('[' + state.escape.join("")[replace](/\\/g, '\\\\') + ']+$'), "").trim();
        }

        function event_blur_input() {
            var v = n(editor_input[textContent]);
            if (v) {
                if (!tag_get(v)) {
                    tag_set_node(v);
                    tag_set(v);
                }
                input_set("");
            }
            class_let(view, 'focus');
            hook_fire('blur', [v, $.tags.length]);
        }

        function event_click_input() {
            hook_fire('click', [$.tags]);
        }

        function event_focus_input() {
            class_set(view, 'focus');
            hook_fire('focus', [$.tags]);
        }

        function event_keydown_input(e) {
            var escape = state.escape,
                t = this,
                k = e[keyCode], // Old browser(s)
                kk = (e[key] || String[fromCharCode](k)), // Modern browser(s)
                last = editor[previousSibling],
                length = $.tags.length,
                max = state.max, name;
            // Set preferred key name
            if (Enter === kk) {
                kk = '\n';
            } else if (Tab === kk) {
                kk = '\t';
            }
            // Submit the closest `<form>` element with `Enter` key
            if (('\n' === kk || 13 === k) && !in_array(kk, escape)) {
                var form = t[parentNode];
                while (form && form[nodeName] && 'form' !== form[nodeName][toLowerCase]()) {
                    form = form[parentNode];
                }
                event_blur_input(); // Force to add the tag name found in the tag editor
                form && form.submit();
                event_stop(e);
            // Skip `Tab` key
            } else if ('\t' === kk || 9 === k) {
                // :)
            } else {
                var vv = n(editor_input[textContent]); // Last value before delay
                delay(function() {
                    var text = editor_input[textContent],
                        v = n(text);
                    // Escape character only, delete!
                    if (in_array(text, escape)) {
                        input_set("");
                    } else if ("" === v) {
                        if ("" === vv && (Backspace === kk || 8 === k)) {
                            name = $.tags[length - 1];
                            tag_let_node(name);
                            tag_let(name);
                            hook_fire('let.tag', [name, length - 1]);
                        } else if (ArrowLeft === kk || 37 === k) {
                            // Focus to the last tag
                            last && last.focus();
                        }
                    } else if (in_array(kk, escape)) {
                        name = v;
                        input_set(v = "");
                        if ("" === name || length >= max) {
                            // :(
                        } else if (tag_get(name)) {
                            alert_set(name);
                        } else {
                            tag_set_node(name);
                            tag_set(name);
                            hook_fire('set.tag', [name, length]);
                        }
                        event_stop(e);
                    }
                    editor_placeholder[innerHTML] = v ? "" : placeholder;
                }, 0);
            }
        }

        function tags_set(values) {
            // Remove …
            var prev;
            if (view[parentNode]) {
                while (prev = editor[previousSibling]) {
                    tag_let_node(prev.title);
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
                    if (tag_get(v)) {
                        continue;
                    }
                    tag_set_node(v);
                    tag_set(v);
                    hook_fire('set.tag', [v, i]);
                }
            }
            return $;
        }

        function event_paste_input() {
            delay(function() {
                tags_set(editor_input[textContent]);
                input_set("");
            }, 0);
        }

        function event_click_view(e) {
            if (e && view === e.target) {
                editor_input.focus();
                event_click_input();
            }
        }

        function event_focus_source() {
            editor_input.focus();
        }

        function event_click_tag() {
            var name = this.title;
            hook_fire('click.tag', [name, array_key(name, $.tags)]);
        }

        function event_focus_tag() {
            var name = this.title;
            hook_fire('focus.tag', [name, array_key(name, $.tags)]);
        }

        function event_keydown_tag(e) {
            var t = this,
                k = e[keyCode], // Old browser(s)
                kk = (e[key] || String[fromCharCode](k)), // Modern browser(s)
                prev = t[previousSibling],
                next = t[nextSibling];
            // Focus to the previous tag
            if (ArrowLeft === kk || 37 === k) {
                prev && prev.focus();
            // Focus to the next tag or to the tag input
            } else if (ArrowRight === kk || 39 === k) {
                next && next !== editor ? next.focus() : input_set("", 1);
            // Remove tag with `Backspace` or `Delete` key
            } else if (
                Backspace === kk || Delete === kk ||
                8 === k || 46 === k
            ) {
                var name = t.title,
                    index = array_key(name, $.tags);
                tag_let_node(name);
                tag_let(name);
                // Focus to the previous tag or to the tag input after remove
                if (Backspace === kk || 8 === k) {
                    prev ? prev.focus() : input_set("", 1);
                // Focus to the next tag or to the tag input after remove
                } else /* if (Delete === kk) */ {
                    next && next !== editor ? next.focus() : input_set("", 1);
                }
                hook_fire('let.tag', [name, index]);
            }
            event_stop(e);
        }

        function alert_set(v) {
            var a = state.alert;
            if (true === a) {
                alert($$.i('Duplicate tag name: %s', [v]));
            } else if (is_function(a)) {
                a.apply($, [v]);
            // Function name as string stored in the `TP` object
            } else if (is_string(a) && $$[a]) {
                $$[a].apply($, [v]);
            }
        }

        function input_set(v, focus) {
            editor_input[textContent] = v;
            editor_placeholder[textContent] = v ? "" : placeholder;
            focus && editor_input.focus();
        } input_set("");

        function event_let(el, name, fn) {
            el.removeEventListener(name, fn);
        }

        function event_set(el, name, fn) {
            el.addEventListener(name, fn, false);
        }

        function event_stop(e) {
            e.preventDefault();
        }

        function tag_get(name, hook) {
            var index = array_key(name, $.tags);
            hook && hook_fire('get.tag', [name, index]);
            return is_number(index) ? name : null;
        }

        function tag_let(name) {
            var index = array_key(name, $.tags);
            if (is_number(index) && index >= 0) {
                $.tags.splice(index, 1);
                source.value = $.tags.join(state.join);
                return true;
            }
            return false;
        }

        function tag_set(name, index) {
            if (is_number(index)) {
                index = index < 0 ? 0 : index;
                $.tags = $.tags.splice(0, index).concat([name]).concat($.tags.splice(index - 1));
            } else {
                $.tags.push(name);
            }
            // Update value
            source.value = $.tags.join(state.join);
        }

        function tag_set_node(name, index) {
            var tag = el('span', "", {
                'class': 'tag',
                'tabindex': '1',
                'title': name
            });
            event_set(tag, 'click', event_click_tag);
            event_set(tag, 'focus', event_focus_tag);
            event_set(tag, 'keydown', event_keydown_tag);
            if (tags[parentNode]) {
                if (is_number(index) && $.tags[index]) {
                    tags[insertBefore](tag, tags[children][index]);
                } else {
                    tags[insertBefore](tag, editor);
                }
            }
        }

        function tag_let_node(name) {
            var index = array_key(name, $.tags), tag;
            if (is_number(index) && index >= 0 && (tag = tags.children[index])) {
                event_let(tag, 'click', event_click_tag);
                event_let(tag, 'focus', event_focus_tag);
                event_let(tag, 'keydown', event_keydown_tag);
                tags[removeChild](tag);
                return true;
            }
            return false;
        }

        class_set(source, state['class'] + '-source');
        source[parentNode][insertBefore](view, source);
        view[appendChild](tags);
        tags[appendChild](editor);
        editor[appendChild](editor_input);
        editor[appendChild](editor_placeholder);

        event_set(editor_input, 'blur', event_blur_input);
        event_set(editor_input, 'click', event_click_input);
        event_set(editor_input, 'focus', event_focus_input);
        event_set(editor_input, 'keydown', event_keydown_input);
        event_set(editor_input, 'paste', event_paste_input);
        event_set(source, 'focus', event_focus_source);
        event_set(view, 'click', event_click_view);

        $.tags = [];

        tags_set(source.value); // Fill value(s)

        $.input = editor_input;
        $.self = $.view = view;
        $.source = $.output = source;
        $.state = state;

        $.blur = function() {
            editor_input.blur();
            event_blur_input();
        };

        $.click = function() {
            view.click();
            event_click_view();
        };

        $.eject = function() {
            if (!source[NS]) {
                return $; // Already ejected
            }
            delete source[NS];
            event_let(editor_input, 'blur', event_blur_input);
            event_let(editor_input, 'click', event_click_input);
            event_let(editor_input, 'focus', event_focus_input);
            event_let(editor_input, 'keydown', event_keydown_input);
            event_let(editor_input, 'paste', event_paste_input);
            event_let(source, 'focus', event_focus_source);
            event_let(view, 'click', event_click_view);
            $.tags[forEach](tag_let_node);
            view[parentNode][removeChild](view);
            class_let(source, state['class'] + '-source');
            return hook_fire('eject');
        };

        $.fire = function(name, lot, id) {
            return hook_fire(name, lot, id);
        };

        $.focus = function() {
            editor_input.focus();
            event_focus_input();
        };

        $.get = function(name) {
            return tag_get(name, 1);
        };

        $.let = function(name) {
            tag_let_node(name);
            tag_let(name);
            return $;
        };

        $.on = function(name, fn, id) {
            return hook_set(name, fn, id);
        };

        $.off = function(name, id) {
            return hook_let(name, id);
        };

        $.set = function(name, index, guard) {
            if (!tag_get(name)) {
                tag_set_node(name, index);
                tag_set(name, index);
            } else if (guard) {
                alert_set(name);
            }
            return $;
        };

        $.value = function(values) {
            return tags_set(values);
        };

    });

})(window, document, 'TP');