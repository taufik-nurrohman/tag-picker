/*!
 * ==========================================================
 *  TAG PICKER PLUGIN 3.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(win, doc, NS) {

    var instance = '__instance__',
        delay = setTimeout;

    function array_key(a, b) {
        var i = b.indexOf(a);
        return i < 0 ? null : i;
    }

    function el(name, content, attr) {
        var e = is_string(name) ? doc.createElement(name) : name, k, v;
        if (content || "" === content) {
            e.innerHTML = content;
        }
        if (attr) {
            for (k in attr) {
                v = attr[k];
                if (null === v || false === v) {
                    e.removeAttribute(k);
                } else {
                    e.setAttribute(k, v);
                }
            }
        }
        return e;
    }

    function extend(a, b) {
        return Object.assign(a, b);
    }

    function in_array(a, b) {
        return b.indexOf(a) >= 0;
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

        // Return new instance if `TP` was called without the `new` operator
        if (!($ instanceof $$)) {
            return new $$(source, o);
        }

        // Store tag picker instance to `TP.__instance__`
        $$[instance][source.id || source.name || object_length($$[instance])] = $;

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
            editor = el('span', '<span contenteditable spellcheck="false" style="white-space:pre;"></span><span></span>', {
                'class': 'editor tag'
            }),
            editor_input = editor.children[0],
            editor_placeholder = editor.children[1];

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

        function hook(name, fn, id) {
            if (!is_set(name)) {
                return hooks;
            }
            if (!is_set(fn) || null === fn || false === fn) {
                return hook_let(name, fn, id);
            }
            return hook_set(name, fn, id);
        }

        // Default filter for the tag name
        $.f = function(v) {
            return v.toLowerCase().replace(/[^ a-z0-9-]/g, "");
        };

        function n(v) {
            return $.f(v).replace(new RegExp('[' + state.escape.join("").replace(/\\/g, '\\\\') + ']+$'), "").trim();
        }

        function event_blur_input() {
            var v = n(editor_input.textContent);
            if (v) {
                tag_set(v);
                tag_set_node(v);
                input_set("");
            }
            hook_fire('tags.blur', [v, $.tags.length]);
        }

        function event_click_input() {
            hook_fire('tags.click', [$.tags]);
        }

        function event_focus_input() {
            hook_fire('tags.focus', [$.tags]);
        }

        function event_keydown_input(e) {
            var escape = state.escape,
                key = e.key.toLowerCase(),
                last = editor.previousSibling,
                length = $.tags.length,
                max = state.max, name, last;
            key = ({
                'enter': '\n',
                'tab': '\t'
            })[key] || key;
            // Submit the closest `<form>` element with `enter` key
            if ('\n' === key && !in_array(key, escape)) {
                var parent = this.parentNode;
                while (parent && parent.nodeName && 'form' !== parent.nodeName.toLowerCase()) {
                    parent = parent.parentNode;
                }
                parent && parent.submit();
                event_stop(e);
            // Skip `tab` key
            } else if ('\t' === key) {
                // :)
            } else {
                var vv = n(editor_input.textContent); // Last value before timer
                delay(function() {
                    var text = editor_input.textContent,
                        v = n(text);
                    // Escape character only, delete!
                    if (in_array(text, escape)) {
                        input_set("");
                    } else if ("" === v) {
                        if ("" === vv && 'backspace' === key) {
                            name = $.tags[length - 1];
                            tag_let_node(name);
                            tag_let(name);
                            hook_fire('tag.let', [name, length - 1]);
                        } else if ('arrowleft' === key) {
                            // Focus to the last tag
                            last && last.focus();
                        }
                    } else if (in_array(key, escape)) {
                        name = v;
                        input_set(v = "");
                        if ("" === name || length >= max) {
                            // :(
                        } else if (tag_get(name)) {
                            alert_set(name);
                        } else {
                            tag_set_node(name);
                            tag_set(name);
                            hook_fire('tag.set', [name, length]);
                        }
                        event_stop(e);
                    }
                    editor_placeholder.innerHTML = v ? "" : placeholder;
                }, 0);
            }
        }

        function event_paste_input() {
            delay(function() {
                var any = editor_input.textContent.split(state.join),
                    j = state.max, v;
                for (var i = 0; i < j; ++i) {
                    if (!any[i]) {
                        break;
                    }
                    if ("" !== (v = n(any[i]))) {
                        tag_set(v);
                        tag_set_node(v);
                        hook_fire('tag.set', [v, i]);
                    }
                }
                input_set("");
            }, 0);
        }

        function event_click_view(e) {
            if (view === e.target) {
                editor_input.focus();
                event_click_input();
            }
        }

        function event_focus_source() {
            editor_input.focus();
        }

        function event_stop(e) {
            e.preventDefault();
        }

        function event_click_tag() {
            var name = this.title;
            hook_fire('tag.click', [name, array_key(name, $.tags)]);
        }

        function event_focus_tag() {
            var name = this.title;
            hook_fire('tag.focus', [name, array_key(name, $.tags)]);
        }

        function event_keydown_tag(e) {
            var t = this,
                key = e.key.toLowerCase(),
                prev = t.previousSibling,
                next = t.nextSibling;
            // Focus to the previous tag
            if ('arrowleft' === key) {
                prev && prev.focus();
            // Focus to the next tag or to the tag input
            } else if ('arrowright' === key) {
                next && next !== editor ? next.focus() : input_set("", 1);
            // Remove tag with `backspace` or `delete` key
            } else if ('backspace' === key || 'delete' === key) {
                var name = t.title,
                    index = array_key(name, $.tags);
                tag_let_node(name);
                tag_let(name);
                // Focus to the previous tag or to the tag input after remove
                if ('backspace' === key) {
                    prev ? prev.focus() : input_set("", 1);
                // Focus to the next tag or to the tag input after remove
                } else /* if ('delete' === key) */ {
                    next && next !== editor ? next.focus() : input_set("", 1);
                }
                hook_fire('tag.let', [name, index]);
            }
            event_stop(e);
        }

        event_set(editor_input, 'blur', event_blur_input);
        event_set(editor_input, 'click', event_click_input);
        event_set(editor_input, 'focus', event_focus_input);
        event_set(editor_input, 'keydown', event_keydown_input);
        event_set(editor_input, 'paste', event_paste_input);
        event_set(source, 'focus', event_focus_source);
        event_set(view, 'click', event_click_view);

        function alert_set(v) {
            var a = state.alert;
            if (true === a) {
                alert($$.i('Duplicate tag name: %s', [v]));
            } else if (is_function(a)) {
                a.apply($, [v]);
            // Function name as string stored in the global `window` object
            } else if (is_string(a) && win[a]) {
                win[a].apply($, [v]);
            }
        }

        function input_set(v, focus) {
            editor_input.textContent = v;
            editor_placeholder.textContent = v ? "" : placeholder;
            focus && editor_input.focus();
        } input_set("");

        function event_let(el, name, fn) {
            el.removeEventListener(name, fn);
        }

        function event_set(el, name, fn) {
            el.addEventListener(name, fn, false);
        }

        function tag_get(name) {
            var index = array_key(name, $.tags);
            hook_fire('tag.get', [name, index]);
            return is_number(index) ? name : null;
        }

        function tag_let(name) {
            var index = array_key(name, $.tags);
            if (index >= 0) {
                $.tags.splice(index, 1);
                source.value = $.tags.join(state.join);
                return true;
            }
            return false;
        }

        function tag_set(name, index) {
            if (is_number(index)) {
                index = index < 0 ? 0 : index;
                $.tags = $.tags.splice(0, index).concat(name).concat($.tags.splice(index));
            } else {
                $.tags.push(name);
            }
            source.value = $.tags.join(state.join);
        }

        function tag_set_node(name, index) {
            var tag = el('span', "", {
                'class': 'tag',
                'draggable': true,
                'tabindex': 1,
                'title': name
            });
            event_set(tag, 'click', event_click_tag);
            event_set(tag, 'focus', event_focus_tag);
            event_set(tag, 'keydown', event_keydown_tag);
            if (is_number(index)) {
                tags.insertBefore(tag, tags.children[index]);
            } else {
                tags.insertBefore(tag, editor);
            }
        }

        function tag_let_node(name) {
            var index = array_key(name, $.tags), tag;
            if (index >= 0 && (tag = tags.children[index])) {
                event_let(tag, 'click', event_click_tag);
                event_let(tag, 'focus', event_focus_tag);
                event_let(tag, 'keydown', event_keydown_tag);
                tags.removeChild(tag);
                return true;
            }
            return false;
        }

        source.classList.add(state['class'] + '-source');
        source.parentNode.insertBefore(view, source);
        view.appendChild(tags);
        tags.appendChild(editor);

        $.tags = [];

        editor_input.textContent = source.value;
        event_paste_input(); // Fill value(s)

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

        $.focus = function() {
            editor_input.focus();
            event_focus_input();
        };

        $.get = function(name) {
            return tag_get(name);
        };

        $.hook = hook;
        $.hook.get = hook_get;
        $.hook.let = hook_let;
        $.hook.set = hook_set;
        $.hook.fire = hook_fire;

        $.let = function(name) {
            tag_let_node(name);
            tag_let(name);
            return $;
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

        function is_mounted() {
            return !!view.parentNode;
        }

        $.create = function(o) {
            if (is_mounted()) {
                return $; // Already created
            }
            return new $$($.source, o);
        };

        $.destroy = function() {
            if (!is_mounted()) {
                return $; // Already destroyed
            }
            event_let(editor_input, 'blur', event_blur_input);
            event_let(editor_input, 'click', event_click_input);
            event_let(editor_input, 'focus', event_focus_input);
            event_let(editor_input, 'keydown', event_keydown_input);
            event_let(editor_input, 'paste', event_paste_input);
            event_let(source, 'focus', event_focus_source);
            event_let(view, 'click', event_click_view);
            $.tags.forEach(function(v) {
                tag_let_node(v);
            });
            view.parentNode.removeChild(view);
            source.classList.remove(state['class'] + '-source');
            return hook_fire('tags.let');
        };

        return hook_fire('tags.set');

    });

})(window, document, 'TP');