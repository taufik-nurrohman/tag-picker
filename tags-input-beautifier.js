/*!
 * =======================================================
 *  SIMPLEST TAGS INPUT BEAUTIFIER 2.2.1
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
        ev = 'addEventListener';

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
        $.version = '2.2.1';

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

    })(win[NS] = function(target, o) {
        var $ = this,
            hash = Date.now(),
            placeholder = target[get]('data-' + plc) || target[plc] || "",
            config = {
                join: ', ',
                max: 9999,
                escape: [','],
                alert: true,
                text: ['Delete \u201C%s%\u201D', 'Duplicate \u201C%s%\u201D', 'Please match the requested format: %s%'],
                classes: ['tags', 'tag', 'tags-input', 'tags-output', 'tags-view'],
                update: function() {}
            },
            wrap = el('span'),
            input = el('span'),
            id = 'data-tag', pt, edit, i, j;
        win[NS][instance][target.id || target.name || object_keys_length(win[NS][instance])] = $;
        o = typeof o === "string" ? {join: o} : (o || {});
        for (i in config) {
            if (typeof o[i] !== "undefined") config[i] = o[i];
        }
        pt = config[pttn] || target[get]('data-' + pttn);
        if (config[plc]) {
            placeholder = config[plc];
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
        target[cla] = config[clas][3];
        wrap[cla] = config[clas][0] + ' ' + config[clas][0] + '-' + hash;
        wrap[ev]("click", on_focus, false);
        target[ev]("focus", on_focus, false);
        wrap.id = config[clas][0] + ':' + (target.id || hash);
        wrap[html] = '<span class="' + config[clas][4] + '"></span>';
        input[cla] = config[clas][2];
        input[html] = '<span contenteditable spellcheck="false" style="white-space:nowrap;outline:none;"></span><span>' + placeholder + '</span>';
        target[parent][prepend](wrap, target[next] || null);
        wrap[first][append](input);
        edit = input[first];
        $.tags = {};
        $.success = 1; // TODO
        $.error = 0;
        $.filter = function(t) {
            if (!pt) {
                return (t + "")[re](new RegExp('[' + config.join[re](/\s/g, "") + ']|[-\\s]{2,}|^\\s+|\\s+$', 'g'), "")[tlc]();
            }
            // When `pattern` option is defined or the target element has
            // a `data-pattern` attribute, this method will simply output
            // `false` if the requested pattern does not match with the input.
            return !t || (new RegExp(pt)).test(t) ? t : false;
        };
        $.update = function(v, is_first) {
            target.value = "";
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
            return config.update($), $;
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
                    $.error = 1;
                    s = (text[2] || t)[re](/%s%/g, pt);
                    if (typeof alt === "function") {
                        alt(s, t, $);
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
                x = el('a');
            a[cla] = config[clas][1];
            a[set](id, t);
            x.href = 'javascript:;';
            x.title = (text[0] || "")[re](/%s%/g, t);
            x[ev]("click", function(e) {
                var t = this,
                    s = t[parent],
                    n = t[parent][get](id);
                s[parent][remove](s);
                $.reset(n), on_focus();
                e[stop]();
            }, false);
            a[append](x), _reset();
            if ($.tags[t]) {
                if (!is_first) {
                    if (alt) {
                        $.error = 1;
                        s = (text[1] || t)[re](/%s%/g, t);
                        if (typeof alt === "function") {
                            alt(s, t, $);
                        } else {
                            alert(s);
                        }
                    }
                } else {
                    wrap[first][prepend](a, input);
                }
            } else {
                $.tags[t] = 1;
                wrap[first][prepend](a, input);
            }
            target.value = object_keys($.tags).join(config.join);
            return (!is_first && config.update($)), $;
        };
        (function() {
            return edit[ev]("blur", function() {
                $.error = 0;
                $.set(this[text]);
            }, false),
            edit[ev]("paste", on_paste, false),
            edit[ev]("keydown", function(e) {
                $.error = 0;
                var t = this,
                    k = e.keyCode,
                    p = wrap,
                    x = config.escape,
                    key = (e.key || String.fromCharCode(k))[tlc](),
                    ctrl = e.ctrlKey,
                    shift = e.shiftKey,
                    data = input[previous] && input[previous][get](id),
                    shadow = edit[next],
                    is_tab = key === 'tab' || !shift && k === 9,
                    is_enter = key === 'enter' || !shift && k === 13,
                    is_space = key === ' ' || !shift && k === 32,
                    is_backspace = key === 'backspace' || !shift && k === 8, form;
                // submit form on `enter` key in the `span[contenteditable]`
                if (!ctrl && is_enter && x[pos]('\n') === -1) {
                    while (p = p[parent]) {
                        if (p.nodeName[tlc]() === 'form') {
                            form = p;
                            break;
                        }
                    }
                    $.set(t[text]);
                    $.error === 0 && form && form.submit();
                // paste event with `control` + `v`
                } else if (ctrl && (key === 'v' || !shift && k === 86)) {
                    on_paste();
                // `backspace`
                } else if (!t[text] && is_backspace) {
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
                        shadow[html] = v ? "" : placeholder;
                        for (i = 0, j = x.length; i < j; ++i) {
                            if (x[i] && v[pos](x[i]) !== -1) {
                                $.set(v.split(x[i]).join(""));
                                break;
                            }
                        }
                    }, 1);
                }
            }, false), $;
        })();
        $.update(target.value.split(config.join), 1);
        $.config = config;
        $.input = input;
        $.view = wrap;
        $.target = $.output = target;
    });

})(window, document, 'TIB');