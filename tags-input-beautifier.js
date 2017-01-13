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
        remove = 'removeChild';

    function is_set(x) {
        return typeof x !== "undefined";
    }

    function object_keys_length(o) {
        return Object.keys(o).length;
    }

    (function($) {

        // plugin version
        $.version = '2.0.0';

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
        $.filter = function(text) {
            return text.replace(new RegExp('[' + config.join.replace(/\s/g, "") + ']|^\\s+|\\s+$|\\s{2,}', 'g'), "").toLowerCase();
        };

        // clear tag(s) input field
        $.reset = function() {
            return input.value = "", $;
        };

        // set new tag item
        $.set = function(text) {
            var d = input.previousSibling,
                s = el('span'),
                a = el('a');
            s.innerHTML = text;
            a.title = config.text[0].replace(/%s/g, text);
            a[set]('data-tag', text);
            a.href = 'javascript:;';
            a.onclick = function() {
                delete $.tags[this[get]('data-tag')];
                this[parent][parent][remove](this[parent]);
                return $.update(), input.focus(), false;
            };
            s[append](a);
            d[append](s);
            $.tags[text] = 1;
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
            var e = input,
                n = e.name,
                w = el('span'),
                classes = config.classes;
            output = el('input');
            output.name = n;
            output.type = 'hidden';
            e[reset]('name');
            e.className += ' ' + classes[1];
            w.className = classes[0];
            w.innerHTML = '<span class="' + classes[2] + '"></span>';
            w.onclick = function() {
                input.focus();
            };
            e[parent].insertBefore(w, e);
            w[append](e);
            w[append](output);
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
            input.onkeydown = function(e) {
                var display = input.previousSibling,
                    d = display.lastChild,
                    k = e.keyCode,
                    key = e.key || "",
                    v = this.value,
                    shift = e.shiftKey, d;
                // `backspace`
                if (!$.filter(v) && (key === 'Backspace' || k === 8)) {
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
                } else if (key === 'Enter' || e.keyCode === 13) {
                    return add(v), true;
                }
                return $;
            };
            input.onblur = function() {
                return add(this.value);
            };
            return $.update();
        };

        return ($.output = output), $;

    });

})(window, document);