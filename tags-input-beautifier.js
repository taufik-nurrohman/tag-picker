/*!
 * =======================================================
 *  SIMPLEST TAGS INPUT BEAUTIFIER
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
        set = 'setAttribute',
        get = 'getAttribute',
        reset = 'removeAttribute',
        append = 'appendChild',
        remove = 'removeChild',
        html = 'innerHTML',
        text = 'textContent',
        cn = 'className',
        tlc = 'toLowerCase';

    function is_set(x) {
        return typeof x !== "undefined";
    }

    function object_keys_length(o) {
        return Object.keys(o).length;
    }

    (function($) {

        // plugin version
        $.version = '2.0.2';

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
                update: function() {}
            }, i, output;

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
        $.reset = function() {
            return output[text] = "", $;
        };

        // set new tag item
        $.set = function(t) {
            var d = input.previousSibling,
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

        // update tag(s) value …
        $.update = function() {
            var v = Object.keys($.tags).join(config.join);
            if (output) {
                output.value = v;
            }
            return config.update($.tags), $;
        };

        // convert text input into “tag” item
        function _create() {
            var wrap = el('span'),
                classes = config.classes;
            output = el('span');
            output[set]('contenteditable', 'true');
            output[set]('spellcheck', 'false');
            output[set]('data-placeholder', input.placeholder);
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
            $.reset();
            // empty tag name or reached the max tags, do nothing!
            if (!v || object_keys_length($.tags) === config.max) {
                return false;
            }
            // duplicate tag name, alert!
            if (v in $.tags) {
                alert(config.text[1].replace(/%s/g, v));
                return $.reset(), false;
            }
            return $.set(v).update(), false;
        }

        // apply the beautifier
        $.create = function() {
            _create();
            $.reset();
            output.onkeydown = function(e) {
                var display = input.previousSibling,
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
                    return add(v), true;
                }
                return $;
            };
            output.onblur = function() {
                return add(this[text]);
            };
            return $.update();
        };

        return ($.output = output), $;

    });

})(window, document);