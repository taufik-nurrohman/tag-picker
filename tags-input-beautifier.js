/*!
 * =======================================================
 *  SIMPLEST TAGS INPUT BEAUTIFIER 2.0.4
 * =======================================================
 *
 *   Author: Taufik Nurrohman
 *   URL: https://github.com/tovic
 *   License: MIT
 *
 * -- USAGE: ---------------------------------------------
 *
 *   var foo = new TIB(document.querySelector('input'));
 *   foo.create();
 *
 * -------------------------------------------------------
 *
 */

(function(win, doc) {

    var instance = '__instance__',
        delay = setTimeout,
        parent = 'parentNode',
        previous = 'previousSibling',
        set = 'setAttribute',
        get = 'getAttribute',
        reset = 'removeAttribute',
        append = 'appendChild',
        remove = 'removeChild',
        html = 'innerHTML',
        text = 'textContent',
        cn = 'className',
        nn = 'nodeName',
        tlc = 'toLowerCase';

    function is_set(x) {
        return typeof x !== "undefined";
    }

    function object_keys_length(o) {
        return Object.keys(o).length;
    }

    (function($) {

        // plugin version
        $.version = '2.0.4';

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

    })(win.TIB = function(input, config) {

        config = config || {};

        var $ = this,
            el = function(x) {
                return doc.createElement(x);
            },
            d = {
                join: ', ',
                max: 9999,
                values: true,
                classes: ['tags', 'tags-input', 'tags-output'],
                text: ['Remove \u201C%s\u201D Tag', 'Duplicate \u201C%s\u201D Tag'],
                alert: true,
                update: function() {}
            }, i, j, output;

        TIB[instance][input.id || input.name || object_keys_length(TIB[instance])] = $;

        $.tags = {};

        if (typeof config === "string") {
            config = {
                join: config
            };
        }

        for (i in d) {
            if (!is_set(config[i])) config[i] = d[i];
        }

        $.input = input;
        $.config = config;

        // validate tag name
        $.filter = function(t) {
            return t.replace(new RegExp('[' + config.join.replace(/\s/g, "") + ']|^\\s+|\\s+$|\\s{2,}', 'g'), "")[tlc]();
        };

        // clear tag(s) input field
        $.clear = function() {
            return output[text] = "", $;
        };
  
        // reset tag(s) input field and output
        $.reset = function(t) {
            input[previous][html] = "";
            if (t) {
                delete $.tags[t];
                j = $.tags;
                $.tags = {};
                for (i in j) {
                    $.set(i);
                }
            } else {
                $.tags = {};
            }
            return $.clear().update();
        };

        // set new tag item
        $.set = function(t) {
            var d = input[previous],
                s = el('span'),
                a = el('a');
            s[html] = t;
            a.title = config.text[0].replace(/%s/g, t);
            a[set]('data-tag', t);
            a.href = 'javascript:;';
            a.onclick = function() {
                delete $.tags[this[get]('data-tag')];
                this[parent][parent][remove](this[parent]);
                return $.update(), output.focus(), false;
            };
            s[append](a);
            d[append](s);
            $.tags[t] = 1;
            return $;
        };

        // update tag(s) value…
        $.update = function() {
            var v = Object.keys($.tags).join(config.join);
            input.value = v;
            return config.update($.tags), $;
        };

        // convert text input into “tag” item
        function _create() {
            var wrap = el('span'),
                classes = config.classes;
            output = el('span');
            output[set]('contenteditable', 'true');
            output[set]('spellcheck', 'false');
            output[set]('placeholder', input.placeholder);
            input.type = 'hidden';
            input[cn] += ' ' + classes[1];
            wrap[cn] = classes[0];
            wrap[html] = '<span class="' + classes[2] + '"></span>';
            wrap.onclick = function() {
                output.focus();
            };
            input[parent].insertBefore(wrap, input);
            wrap[append](input);
            wrap[append](output);
            if (config.values === true) {
                config.values = input.value.split(config.join);
            }
            for (i in config.values) {
                var s = $.filter(config.values[i]);
                s && $.set(s);
            }
        };

        function add(value) {
            var v = $.filter(value);
            $.clear();
            // empty tag name or reached the max tags, do nothing!
            if (!v || object_keys_length($.tags) === config.max) {
                return false;
            }
            // duplicate tag name, alert!
            if (v in $.tags) {
                if (config.alert) alert(config.text[1].replace(/%s/g, v));
                return $.clear(), false;
            }
            return $.set(v).update(), false;
        }

        // apply the beautifier
        $.create = function() {
            _create();
            $.clear();
            output.onkeydown = function(e) {
                var display = input[previous],
                    d = display.lastChild,
                    k = e.keyCode,
                    key = (e.key || "")[tlc](),
                    v = this[text],
                    shift = e.shiftKey, d;
                // `backspace`
                if (!v && (key === 'backspace' || k === 8)) {
                    if (d) {
                        var dd = d.children[0][get]('data-tag');
                        display[remove](d);
                        delete $.tags[dd];
                    }
                    return $.update(), false;
                // `comma` key
                } else  if (key === ',' || (!shift && k === 188)) {
                    return add(v);
                // `enter` key
                } else if (key === 'enter' || k === 13) {
                    var form,
                        p = input;
                    // submit form on `enter` key in the `span[contenteditable]`
                    while (p = p[parent]) {
                        if (p[nn][tlc]() === 'form') {
                            form = p;
                            break;
                        }
                    }
                    return add(v), (form && form.submit()), false;
                }
                return $;
            };
            output.onblur = function() {
                return add(this[text]);
            };
            return $.update();
        };

        return ($.output = input[previous]), $;

    });

})(window, document);