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
  var foo = new TIB(document.querySelector('input[name="tags"]'));
  foo.create();
  </script>
</body>
~~~

Options
-------

~~~ .javascript
var foo = new TIB(input, config);
~~~

Variable | Description
-------- | -----------
`input` | The text input element you want to beautify.
`config` | The configuration data. See below!

~~~ .javascript
config = {
    join: ', ', // Tags joiner of the output value
    max: 9999, // Maximum tags allowed
    values: ['foo', 'bar'], // pre-defined tags data
    classes: ['tags', 'tags-input', 'tags-output'], // HTML classes
    text: ['Remove \u201C%s\u201D Tag', 'Duplicate \u201C%s\u201D Tag'],
    update: function() {} // Hook that will be triggered on every tags item update
};
~~~

Methods
-------

### Initiation

~~~ .javascript
var foo = new TIB( … );
~~~

### Run the Plugin

~~~ .javascript
foo.create();
~~~

### Get Tags Data

~~~ .javascript
console.log(foo.tags);
~~~

### Get Tags Input Element

~~~ .javascript
console.log(foo.input);
~~~

### Get Tags Output Element

~~~ .javascript
console.log(foo.output);
~~~

### Get Configuration Data

~~~ .javascript
console.log(foo.config);
~~~

### Clear Tags Input Value

~~~ .javascript
foo.reset();
~~~

### Clear Tags Output Preview

~~~ .javascript
foo.input.previousSibling.innerHTML = "";
~~~

### Refresh Tags Output

~~~ .javascript
foo.update();
~~~

### Clear Tags Output Value

~~~ .javascript
foo.input.previousSibling.innerHTML = "";
foo.reset().update();
~~~

### Validate Tag Name

Create custom tag input sanitizer before plugin execution:

~~~ .javascript
foo.filter = function(text) {
    text = text.replace(/^\s+|\s+$/g, ""); // trim white-space(s)
    text = text.replace(/,/g, ""); // disallow `,` in tag name
    text = text.toLowerCase(); // force lower-case letter(s)
    return text;
};

foo.create();
~~~

### Add Tag Item Dynamically

~~~ .javascript
foo.set('new tag name');
~~~

### Check for Duplicate Tag Name

~~~ .javascript
if ('my new tag name' in foo.tags) {
    alert('Duplicate `my new tag name` !!!')
}
~~~

### Check for Tags Length

~~~ .javascript
console.log(Object.keys(foo.tags).length);
~~~

Playground
----------

 * http://codepen.io/tovic/pen/ZQewJq