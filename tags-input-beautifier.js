/*!
 * =======================================================
 *  SIMPLEST TAGS INPUT BEAUTIFIER 2.1.3
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
        cla = 'className',
        clas = 'classes',
        tlc = 'toLowerCase',
        re = 'replace',
        first = 'firstChild',
        parent = 'parentNode',
        next = 'nextSibling',
        previous = 'previousSibling',
        append = 'appendChild',
        prepend = 'insertBefore',
        remove = 'removeChild',
        set = 'setAttribute',
        get = 'getAttribute',
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
        $.version = '2.1.3';

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
            placeholder = target.placeholder || "",
            config = {
                join: ', ',
                max: 9999,
                escape: [',', '\n'],
                alert: true,
                text: ['Delete \u201C%s\u201D', 'Duplicate \u201C%s\u201D'],
                classes: ['tags', 'tag', 'tags-input', 'tags-output', 'tags-view'],
                update: function() {}
            },
            wrap = el('span'),
            input = el('span'),
            id = 'data-tag', edit, i, j;
        win[NS][instance][target.id || target.name || object_keys_length(win[NS][instance])] = $;
        o = typeof o === "string" ? {join: o} : (o || {});
        for (i in config) {
            if (typeof o[i] !== "undefined") config[i] = o[i];
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
        wrap.id = config[clas][0] + ':' + (target.id || hash);
        wrap[html] = '<span class="' + config[clas][4] + '"></span>';
        input[cla] = config[clas][2];
        input[html] = '<span contenteditable spellcheck="false" style="white-space:nowrap;outline:none;"></span><span>' + placeholder + '</span>';
        target[parent][prepend](wrap, target[next] || null);
        wrap[first][append](input);
        edit = input[first];
        $.tags = {};
        $.error = 0;
        $.filter = function(t) {
            return (t + "")[re](new RegExp('[' + config.join[re](/\s/g, "") + ']|\\s{2,}|^\\s+|\\s+$', 'g'), "")[tlc]();
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
        $.set = function(t, is_first) {
            t = $.filter(t);
            // empty tag name or reached the max tags, do nothing!
            if (t === "" || object_keys_length($.tags) === config.max) {
                edit[html] = "";
                return $;
            }
            var a = el('span'),
                x = el('a');
            a[cla] = config[clas][1];
            a[set](id, t);
            x.href = 'javascript:;';
            x.title = (config.text[0] || "")[re](/%s/g, t);
            x[ev]("click", function(e) {
                var t = this,
                    s = t[parent],
                    n = t[parent][get](id);
                s[parent][remove](s);
                $.reset(n), on_focus();
                e[stop]();
            }, false);
            a[append](x);
            edit[html] = "";
            edit[next][html] = placeholder;
            if ($.tags[t]) {
                if (!is_first) {
                    if (config.alert) {
                        $.error = 1;
                        var text = (config.text[1] || t)[re](/%s/g, t);
                        if (typeof config.alert === "function") {
                            config.alert(text, t, $);
                        } else {
                            alert(text);
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
                if (!ctrl && is_enter) {
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
                    var x = config.escape, y, z;
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
                            if (x[i] && v.indexOf(x[i]) !== -1) {
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