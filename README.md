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

Playground
----------

 * http://codepen.io/tovic/pen/ZQewJq