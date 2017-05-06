Simplest Tags Input Beautifier
==============================

> Better tags input interaction with JavaScript.

What is this?

**Demo:**

![Image](https://cloud.githubusercontent.com/assets/1669261/12162361/7b457e14-b533-11e5-990a-8805cac26bb3.gif)

&rarr; https://tovic.github.io/tags-input-beautifier

Got it?

Usage
-----

First, load the CSS file in the `<head>` area:

~~~ .html
  …
  <link href="tags-input-beautifier.min.css" rel="stylesheet">
</head>
~~~

Then, create a HTML text input element in the `<body>` area:

~~~ .html
<input name="tags" type="text">
~~~

Then, load the JS file just before the `</body>` tag:

~~~ .html
  …
  <script src="tags-input-beautifier.min.js"></script>
</body>
~~~


Then, run the plugin:

~~~ .html
  …
  <script src="tags-input-beautifier.min.js"></script>
  <script>
  var tags = new TIB(document.querySelector('input[name="tags"]'));
  </script>
</body>
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
    text: ['Delete \u201C%s\u201D Tag', 'Duplicate \u201C%s\u201D Tag'],
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

### Get Tags Data

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

### Check for Tags Length

~~~ .js
console.log(Object.keys(tags.tags).length);
~~~

Playground
----------

 - http://codepen.io/tovic/pen/ZQewJq