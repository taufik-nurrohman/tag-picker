Simplest Tags Input Beautifier
==============================

> Better tags input interaction with JavaScript.

What is this?

**Demo:**

![Image](https://cloud.githubusercontent.com/assets/1669261/12162361/7b457e14-b533-11e5-990a-8805cac26bb3.gif)

&rarr; https://rawgit.com/tovic/tags-input-beautifier/master/index.html

Got it?

Usage
-----

First, load the CSS file in the `<head>` area:

~~~ .html
  …
  <link href="css/tags.min.css" rel="stylesheet">
</head>
~~~

Then, create a HTML text input element in the `<body>` area:

~~~ .html
<input name="tags" type="text">
~~~

Then, load the JS file just before the `</body>` tag:

~~~ .html
  …
  <script src="js/tags.min.js"></script>
</body>
~~~


Then, run the plugin:

~~~ .html
  …
  <script src="js/tags.min.js"></script>
  <script>
  var foo = new Tags(document.querySelector('input[name="tags"]'));
  foo.beautify();
  </script>
</body>
~~~

Options
-------

~~~ .javascript
var foo = new Tags(elem, config);
~~~

Variable | Description
-------- | -----------
`elem` | The text input element you want to beautify.
`config` | The configuration data. See below!

~~~ .javascript
config = {
    join: ', ', // Tags joiner of the output value
    max: 9999, // Maximum tags allowed
    values: ['foo', 'bar'], // pre-defined tags data
    d_text: 'Duplicate %s Tag', // Alert text if duplicate tags found
    x_text: 'Remove %s Tag', // Remove message in `x` button
    i_class: 'tags-input', // Classes to be added to the tags input element
    o_class: 'tags-output', // Custom classes for the tags output 
    w_class: 'tags', // Custom classes for the tags input wrapper
    update: function() {} // Hook that will be triggered on every tags item update
};
~~~

Methods
-------

### Initiation

~~~ .javascript
var foo = new Tags( … );
~~~

### Run the Plugin

~~~ .javascript
foo.beautify();
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
foo.clear();
~~~

### Clear Tags Output Preview

~~~ .javascript
foo.input.previousSibling.innerHTML = "";
~~~

### Refresh Tags Output

~~~ .javascript
foo.refresh();
~~~

### Clear Tags Output Value

~~~ .javascript
foo.input.previousSibling.innerHTML = "";
foo.clear();
foo.refresh();
~~~

### Validate Tag Name

Create custom tag input sanitizer before plugin execution:

~~~ .javascript
foo.sanitize = function(text) {
    text = text.replace(/^\s+|\s+$/g, ""); // trim white-space(s)
    text = text.replace(/,/g, ""); // disallow `,` in tag name
    text = text.toLowerCase(); // force lower-case letter(s)
    return text;
};

foo.beautify();
~~~

### Add Tag Item Dynamically

~~~ .javascript
foo.add('new tag name');
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