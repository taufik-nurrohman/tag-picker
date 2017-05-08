Simplest Tags Input Beautifier
==============================

> Better tags input interaction with JavaScript.

What is this?

Demo
----

![Image](https://cloud.githubusercontent.com/assets/1669261/12162361/7b457e14-b533-11e5-990a-8805cac26bb3.gif)

&rarr; https://tovic.github.io/tags-input-beautifier

Got it?

Usage
-----

~~~ .html
<!DOCTYPE html>
<html dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Demo</title>
    <link href="tags-input-beautifier.min.css" rel="stylesheet">
  </head>
  <body>
    <input name="tags" type="text">
    <script src="tags-input-beautifier.min.js"></script>
    <script>
    var tags = new TIB(document.querySelector('input[name="tags"]'));
    </script>
  </body>
</html>
~~~

Options
-------

~~~ .js
var tags = new TIB(target, config);
~~~

Variable | Description
-------- | -----------
`target` | The text input element you want to beautify.
`config` | The configuration data. See below!

~~~ .js
config = {
    join: ', ', // Tags joiner of the output value
    max: 9999, // Maximum tags allowed
    escape: [',', '\n'], // List of character(s) used to trigger the tag addition
    alert: true,
    text: ['Delete \u201C%s\u201D', 'Duplicate \u201C%s\u201D'],
    classes: ['tags', 'tag', 'tags-input', 'tags-output', 'tags-view'], // HTML classes
    update: function($) {} // Hook that will be triggered on every tags item update
};
~~~

Methods
-------

### Initiation

~~~ .js
var tags = new TIB( … );
~~~

### Get Current Tags Data

~~~ .js
console.log(tags.tags);
~~~

### Get Fake Tags Input Element

~~~ .js
console.log(tags.input);
~~~

### Get Tags View HTML Element

~~~ .js
console.log(tags.view);
~~~

### Get Original Tags Input Element

~~~ .js
console.log(tags.output);
~~~

### Get Configuration Data

~~~ .js
console.log(tags.config);
~~~

### Remove All Tags

~~~ .js
tags.reset();
~~~

### Remove _bar_ Tag

~~~ .js
tags.reset('bar');
~~~

### Refresh Tags Value

~~~ .js
tags.update();
~~~

Merge new values to the current values:

~~~ .js
tags.update(['foo', 'bar', 'baz']);
~~~

### Sanitize Tag Name

Create custom tag input sanitizer:

~~~ .js
tags.filter = function(text) {
    text = text.replace(/^\s+|\s+$/g, ""); // trim white-space(s)
    text = text.replace(/,/g, ""); // disallow `,` in tag name
    text = text.toLowerCase(); // force lower-case letter(s)
    return text;
};
~~~

### Add _bar_ Tag

~~~ .js
tags.set('bar');
~~~

### Check for Duplicate Tag Name

~~~ .js
if ('bar' in tags.tags) {
    alert('Duplicate `bar` !!!')
}
~~~

~~~ .js
if (tags.tags['bar']) {
    alert('Duplicate `bar` !!!')
}
~~~

### Check for Tags Length

~~~ .js
console.log(Object.keys(tags.tags).length);
~~~

Markup
------

The initial HTML markup:

~~~ .html
<input type="text" value="foo, bar, baz" placeholder="Placeholder here…" id="id-1">
~~~

The generated HTML markup:

~~~ .html
<input class="tags-output" type="text" value="foo, bar, baz" placeholder="Placeholder here…" id="input-1">
<span class="tags tags-id-1" id="tags-id-1">
  <span class="tags-view">
    <span class="tag" data-tag="foo"><a href="javascript:;" title="Delete “foo”"></a></span>
    <span class="tag" data-tag="bar"><a href="javascript:;" title="Delete “bar”"></a></span>
    <span class="tag" data-tag="baz"><a href="javascript:;" title="Delete “baz”"></a></span>
    <span class="tags-input">
      <span contenteditable spellcheck="false" style="white-space:nowrap;outline:none;"></span>
      <span>Placeholder here…</span>
    </span>
  </span>
</span>
~~~

Playground
----------

 - http://codepen.io/tovic/pen/ZQewJq