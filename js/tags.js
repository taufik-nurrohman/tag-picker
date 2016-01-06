/**
 * =====================================================
 *  SIMPLEST TAGS INPUT BEAUTIFIER
 * =====================================================
 *
 *  Author: Taufik Nurrohman
 *  URL: https://github.com/tovic, http://latitudu.com
 *  License: MIT
 *
 * -- USAGE: -------------------------------------------
 * var foo = new Tags(document.querySelector('input'));
 * foo.beautify();
 * -----------------------------------------------------
 *
 */

var Tags = function(input, config) {
    var base = this,
        d = {
            join: ', ',
            max: 9999,
            d_text: 'Duplicate %s Tag',
            r_text: 'Remove %s Tag',
            i_class: 'tags-input',
            o_class: 'tags-output',
            w_class: 'tags'
        };
    if (typeof config === "string") {
        config = {
            join: config
        };
    }
    for (var i in d) {
        if (typeof config[i] === "undefined") config[i] = d[i];
    }
    base.input = input;
    base.config = config;
    base.output = null;
    base.tags = {};
    // validate tag name
    base.slug = function(str) {
        return str.replace(/[\s,]/g, "").toLowerCase();
    };
    // clear field
    base.clear = function() {
        base.input.value = "";
        return false;
    };
    // convert text input into "tags input"
    base.draw = function() {
        var e = base.input,
            n = e.name,
            w = document.createElement('label');
        base.output = document.createElement('input');
        base.output.name = n;
        base.output.type = "hidden";
        base.input.removeAttribute('name');
        e.className += ' ' + config.i_class;
        w.className = config.w_class;
        w.innerHTML = '<span class="' + config.o_class + '"></span>';
        e.parentNode.insertBefore(w, e);
        w.appendChild(e);
        w.appendChild(base.output);
    };
    // launch the application
    base.beautify = function() {
        base.draw();
        input.onkeydown = function(e) {
            var display = input.previousSibling,
                k = e.keyCode,
                v = base.slug(this.value),
                s = document.createElement('span'),
                a = document.createElement('a');
            setTimeout(function() {
                // console.log(base.tags);
                var v = Object.keys(base.tags).join(config.join);
                if (base.output !== false) {
                    base.output.value = v;
                }
            }, 1);
            // `backspace`
            if (v === "" && k === 8) {
                var d = display.lastChild;
                if (d) {
                    var dd = d.children[0].getAttribute('data-key');
                    display.removeChild(d);
                    delete base.tags[dd];
                }
                return false;
            }
            // `comma`, `space` or `enter` key
            if (!e.shiftKey && (k === 188 || k === 32 || k === 13)) {
                // empty tag name, do nothing!
                if (v === "") return base.clear();
                // reset input value
                this.value = "";
                // reached the max tags, do nothing!
                if (Object.keys(base.tags).length === config.max) {
                    return base.clear();
                }
                // duplicate tag name, alert!
                if (v in base.tags) {
                    alert(config.d_text.replace(/%s/g, v));
                    return base.clear();
                }
                s.innerHTML = v;
                a.title = config.r_text.replace(/%s/g, v);
                a.setAttribute('data-key', v);
                a.href = '#tag:remove';
                a.innerHTML = '&times';
                a.onclick = function() {
                    delete base.tags[this.getAttribute('data-key')];
                    this.parentNode.parentNode.removeChild(this.parentNode);
                    return false;
                };
                s.appendChild(a);
                display.appendChild(s);
                base.tags[v] = 1;
                return false;
            }
        };
    };
};