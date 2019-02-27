/*!
 * =======================================================
 *  SIMPLEST TAGS INPUT BEAUTIFIER 2.2.4
 * =======================================================
 *
 *   Author: Taufik Nurrohman
 *   URL: https://github.com/tovic
 *   License: MIT
 *
 * -- USAGE: ---------------------------------------------
 *
 *   var tags = new TIB(document.querySelector('input'));
 *
 * -------------------------------------------------------
 *
 */

(function(win, doc, NS) {

    var instance = '__instance__',
        delay = setTimeout,
        html = 'innerHTML',
        text = 'textContent',
        s = 'class',
        cla = s + 'Name',
        clas = s + 'es',
        tlc = 'toLowerCase',
        re = 'replace',
        pttn = 'pattern',
        plc = 'placeholder',
        pos = 'indexOf',
        first = 'firstChild',
        parent = 'parentNode',
        s = 'Sibling',
        next = 'next' + s,
        previous = 'previous' + s,
        append = 'appendChild',
        prepend = 'insertBefore',
        remove = 'removeChild',
        s = 'Attribute',
        set = 'set' + s,
        get = 'get' + s,
        stop = 'preventDefault',
        ev = 'addEventListener',
        evr = 'removeEventListener',
        scrollLeft = 'scrollLeft';

    function el(n) {
        return doc.createElement(n);
    }

    function object_keys(o) {
        return Object.keys(o);
    }

    function object_keys_length(o) {
        return object_keys(o).length;
    }

    (function($) {

        // plugin version
        $.version = '2.2.4';

        // collect all instance(s)
        $[instance] = {};

        // plug to all instance(s)
        $.each = function(fn, t) {
            return delay(function() {
                var ins = $[instance], i;
                for (i in ins) {
                    fn(ins[i], i, ins);
                }
            }, t === 0 ? 0 : (t || 1)), $;
        };

    })(win[NS] = function(source, o) {
        var $ = this,
            hash = Date.now(),
            placeholder = (source[get]('data-' + plc) || source[plc] || "") + '\u200B',
            config = {
                join: ', ',
                max: 9999,
                step: 5, // scroll step(s)
                escape: [','],
                alert: true,
                text: ['Delete \u201C%{tag}%\u201D', 'Duplicate \u201C%{tag}%\u201D', 'Please match the requested format: %{pattern}%'],
                classes: ['tags', 'tag', 'tags-input', 'tags-output', 'tags-view'],
                update: function() {}
            },
            wrap = el('span'),
            input = el('span'),
            id = 'data-tag', update, pt, edit, i, j;
        win[NS][instance][source.id || source.name || object_keys_length(win[NS][instance])] = $;
        o = typeof o === "string" ? {join: o} : (o || {});
        for (i in o) {
            config[i] = o[i];
        }
        pt = config[pttn] || source[get]('data-' + pttn);
        update = config.update;
        if (config[plc]) {
            placeholder = config[plc] + '\u200B';
        }
        function on_focus() {
            edit.focus();
        }
        function on_paste(e) {
            var t = e ? this : edit, v;
            delay(function() {
                v = t[text].split(config.join);
                for (i in v) {
                    $.set(v[i]);
                }
            }, 1);
        }
        function on_blur() {
            $.error = 0;
            $.set(this[text]);
        }
        function on_keydown(e) {
            $.error = 0;
            var t = this,
                k = e.keyCode,
                p = wrap,
                x = config.escape,
                key = (e.key || String.fromCharCode(k))[tlc](),
                ctrl = e.ctrlKey,
                shift = e.shiftKey,
                step = config.step,
                data = input[previous] && input[previous][get](id),
                shadow = edit[next],
                is_tab = key === 'tab' || !shift && k === 9,
                is_enter = key === 'enter' || !shift && k === 13,
                is_space = key === ' ' || !shift && k === 32,
                is_backspace = key === 'backspace' || !shift && k === 8,
                is_empty = t[text] === "", form;
            // submit form on `enter` key in the `span[contenteditable]`
            if (!ctrl && is_enter && x[pos]('\n') === -1) {
                while (p = p[parent]) {
                    if (p.nodeName[tlc]() === 'form') {
                        form = p;
                        e[stop]();
                        break;
                    }
                }
                $.set(t[text]);
                $.error === 0 && form && form.submit();
            } else if (is_empty && !ctrl && (key === 'arrowleft' || !shift && k === 37)) {
                wrap[scrollLeft] -= step; // scroll to left
            } else if (is_empty && !ctrl && (key === 'arrowright' || !shift && k === 39)) {
                wrap[scrollLeft] += step; // scroll to right
            // paste event with `control` + `v`
            } else if (ctrl && (key === 'v' || !shift && k === 86)) {
                on_paste();
            // `backspace`
            } else if (is_empty && is_backspace) {
                $.reset(data), on_focus();
            } else {
                var y, z;
                for (i in x) {
                    y = x[i];
                    z = y === '\s';
                    if (
                        (z || y === '\t') && is_tab ||
                        (z || y === '\n') && is_enter || // preserved!
                        (z || y === ' ') && is_space
                    ) {
                        delay(function() {
                            $.set(t[text]), on_focus();
                        }, 1);
                        e[stop]();
                        return;
                    }
                }
                delay(function() {
                    var v = t[text];
                    shadow[html] = v ? '\u200B' : placeholder;
                    for (i = 0, j = x.length; i < j; ++i) {
                        if (x[i] && v[pos](x[i]) !== -1) {
                            $.set(v.split(x[i]).join(""));
                            break;
                        }
                    }
                }, 1);
            }
        }
        $.tags = {};
        $.error = 0;
        $.filter = function(t) {
            if (!pt) {
                return (t + "")[re](new RegExp('[' + config.join[re](/\s/g, "") + ']|[-\\s]{2,}|^\\s+|\\s+$', 'g'), "")[tlc]();
            }
            // When `pattern` option is defined or the source element has
            // a `data-pattern` attribute, this method will simply output
            // `false` if the requested pattern does not match with the input.
            return !t || (new RegExp(pt)).test(t) ? t : false;
        };
        $.update = function(v, is_first) {
            source.value = "";
            while ((i = wrap[first][first]) && i[get](id)) {
                wrap[first][remove](i);
            }
            if (v === 0) {
                v = object_keys($.tags);
            } else {
                for (i in v) {
                    j = $.filter(v[i]);
                    if (!j) continue;
                    $.tags[j] = 1;
                }
                v = object_keys($.tags);
            }
            $.tags = {};
            for (i in v) {
                $.set(v[i], is_first);
            }
            return update.call($, $.tags), $;
        };
        $.reset = function(t) {
            t = $.filter(t || "");
            if (!t) {
                $.tags = {};
            } else {
                delete $.tags[t];
            }
            return $.update(0, 1);
        };
        function _reset() {
            edit[html] = "";
            edit[next][html] = placeholder;
        }
        $.set = function(t, is_first) {
            var alt = config.alert,
                text = config.text, s;
            t = $.filter(t);
            // does not match with `pattern`
            if (t === false) {
                // do nothing!
                _reset();
                if (alt) {
                    $.error = 2;
                    s = (text[2] || t)[re](/%\{pattern\}%/g, pt);
                    if (typeof alt === "function") {
                        alt.call($, s, t);
                    } else {
                        alert(s);
                    }
                }
                return $;
            }
            if (
                // empty tag name
                t === "" ||
                // or has reached the max tags
                object_keys_length($.tags) >= config.max
            ) {
                // do nothing!
                return _reset(), $;
            }
            var a = el('span'),
                x = el('a'), y;
            a[cla] = config[clas][1];
            a[set](id, t);
            x.href = 'javascript:;';
            x.title = (text[0] || "")[re](/%\{tag\}%/g, t);
            x[ev]("click", function(e) {
                var t = this,
                    s = t[parent],
                    n = t[parent][get](id);
                s[parent][remove](s);
                $.reset(n), on_focus();
                e[stop]();
            }, false);
            a[append](x), _reset();
            if (y = $.tags[t]) {
                if (!is_first) {
                    if (alt) {
                        $.error = 1;
                        s = (text[1] || t)[re](/%\{tag\}%/g, t);
                        if (typeof alt === "function") {
                            alt.call($, s, y);
                        } else {
                            alert(s);
                        }
                    }
                } else {
                    wrap[first][prepend](a, input);
                }
            } else {
                $.tags[t] = a;
                wrap[first][prepend](a, input);
            }
            source.value = object_keys($.tags).join(config.join);
            return (!is_first && update.call($, $.tags)), $;
        };
        var o_class = source[cla];
        function create(is_first) {
            source[cla] = o_class + ' ' + config[clas][3];
            wrap[cla] = config[clas][0] + ' ' + config[clas][0] + '-' + hash;
            wrap.id = config[clas][0] + ':' + (source.id || hash);
            wrap[html] = '<span class="' + config[clas][4] + '"></span>';
            input[cla] = config[clas][1] + ' ' + config[clas][2];
            input[html] = '<span contenteditable spellcheck="false" style="white-space:nowrap;outline:none;"></span><span>' + placeholder + '</span>';
            source[parent][prepend](wrap, source[next] || null);
            wrap[first][append](input);
            edit = input[first];
            wrap[ev]("click", on_focus, false);
            source[ev]("focus", on_focus, false);
            edit[ev]("blur", on_blur, false);
            edit[ev]("paste", on_paste, false);
            edit[ev]("keydown", on_keydown, false);
            $.update(source.value.split(config.join), is_first);
            return $;
        } create.call($, 1);
        function destroy() {
            source[cla] = o_class;
            wrap[parent][remove](wrap);
            wrap[evr]("click", on_focus);
            source[evr]("focus", on_focus);
            edit[evr]("blur", on_blur);
            edit[evr]("paste", on_paste);
            edit[evr]("keydown", on_keydown);
        }
        $.create = function() {
            return create.call($, 1);
        };
        $.destroy = function() {
            return destroy.call($);
        };
        $.config = config;
        $.input = input;
        $.self = wrap;
        $.source = $.output = source;
    });

})(window, document, 'TIB');