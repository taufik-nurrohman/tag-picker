/*!
 * =======================================================
 *  SIMPLEST TAGS INPUT BEAUTIFIER
 * =======================================================
 *
 *   Author: Taufik Nurrohman
 *   URL: https://github.com/tovic, http://latitudu.com
 *   License: MIT
 *
 * -- USAGE: ---------------------------------------------
 *
 *   var foo = new Tags(document.querySelector('input'));
 *   foo.beautify();
 *
 * -------------------------------------------------------
 *
 */

var Tags = function(input, config) {

    config = config || {};

    var base = this,
        el = function(x) {
            return document.createElement(x);
        },
        d = {
            join: ', ',
            max: 9999,
            values: true,
            d_text: 'Duplicate \u201C%s\u201D Tag',
            x_text: 'Remove \u201C%s\u201D Tag',
            i_class: 'tags-input',
            o_class: 'tags-output',
            w_class: 'tags',
            update: function() {}
        };

    base.tags = {};

    if (typeof config === "string") {
        config = {
            join: config
        };
    }

    for (var i in d) {
        if (typeof config[i] === "undefined") config[i] = d[i];
    }

    base.input = input;
    base.output = false;
    base.config = config;

    // validate tag name
    base.sanitize = function(text) {
        return text.replace(/,|^\s+|\s+$|\s{2,}/g, "").toLowerCase();
    };

    // clear tag(s) input field
    base.clear = function() {
        input.value = "";
    };

    // create new tag item
    base.add = function(text) {
        var d = input.previousSibling,
            s = el('span'),
            a = el('a');
        s.innerHTML = text;
        a.title = config.x_text.replace(/%s/g, text);
        a.setAttribute('data-tag', text);
        a.href = '#tag:remove';
        a.innerHTML = '&times;';
        a.onclick = function() {
            delete base.tags[this.getAttribute('data-tag')];
            this.parentNode.parentNode.removeChild(this.parentNode);
            return base.refresh(), false;
        };
        s.appendChild(a);
        d.appendChild(s);
        base.tags[text] = 1;
    };

    // refresh tag(s) value ...
    base.refresh = function() {
        var v = Object.keys(base.tags).join(config.join);
        if (base.output !== false) {
            base.output.value = v;
        }
        config.update(base.tags);
    };

    // convert text input into "tags input"
    base.draw = function() {
        var e = input,
            n = e.name,
            w = el('label');
        base.output = el('input');
        base.output.name = n;
        base.output.type = "hidden";
        e.removeAttribute('name');
        e.className += ' ' + config.i_class;
        w.className = config.w_class;
        w.innerHTML = '<span class="' + config.o_class + '"></span>';
        e.parentNode.insertBefore(w, e);
        w.appendChild(e);
        w.appendChild(base.output);
        if (config.values === true) {
            config.values = input.value.split(config.join);
        }
        for (var i in config.values) {
            base.add(base.sanitize(config.values[i]));
        }
    };

    // apply the beautifier
    base.beautify = function() {
        base.draw();
        base.clear();
        input.onkeydown = function(e) {
            var display = input.previousSibling,
                k = e.keyCode,
                v = base.sanitize(this.value);
            // `backspace`
            if (v === "" && k === 8) {
                var d = display.lastChild;
                if (d) {
                    var dd = d.children[0].getAttribute('data-tag');
                    display.removeChild(d);
                    delete base.tags[dd];
                }
                return base.refresh(), false;
            }
            // `comma` key
            if (!e.shiftKey && k === 188) {
                // clear tag(s) input field
                base.clear();
                // empty tag name or reached the max tags, do nothing!
                if (v === "" || Object.keys(base.tags).length === config.max) {
                    return false;
                }
                // duplicate tag name, alert!
                if (v in base.tags) {
                    alert(config.d_text.replace(/%s/g, v));
                    return base.clear(), false;
                }
                return base.add(v), base.refresh(), false;
            }
        };
        base.refresh();
    };

};