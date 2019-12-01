Simplest Tags Input Beautifier
==============================

> Better tags input interaction with JavaScript.

What is this?

Demo
----

![Image](https://cloud.githubusercontent.com/assets/1669261/12162361/7b457e14-b533-11e5-990a-8805cac26bb3.gif)

&rarr; https://tovic.github.io/tag-picker

Got it?

Usage
-----

~~~ .html
<!DOCTYPE html>
<html dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Demo</title>
    <link href="tags-picker.min.css" rel="stylesheet">
  </head>
  <body>
    <p><input name="tags" type="text"></p>
    <script src="tags-picker.js"></script>
    <script>
    var picker = new TP(document.querySelector('input[name="tags"]'));
    </script>
  </body>
</html>
~~~

Options
-------

~~~ .js
var picker = new TP(source, state);
~~~

Variable | Description
-------- | -----------
`source` | The text input element you want to modify.
`state` | The configuration data. See below!

~~~ .js
state = {
    alert: true,
    escape: [','], // List of character(s) used to trigger the tag addition
    join: ', ', // Tags joiner of the output value
    max: 9999 // Maximum tags allowed
};
~~~

Methods
-------

### Initiation

~~~ .js
var picker = new TP( … );
~~~

### Get Current Tags Data

~~~ .js
console.log(picker.tags);
~~~

### Get Fake Tags Input Element

~~~ .js
console.log(picker.input);
~~~

### Get Tags View HTML Element

~~~ .js
console.log(picker.self);
console.log(picker.view); // Alias
~~~

### Get Original Tags Input Element

~~~ .js
console.log(picker.source);
console.log(picker.output); // Alias
~~~

### Get Configuration Data

~~~ .js
console.log(picker.state);
~~~

_TODO: Version 3.x.x_

<!-- TODO

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
if (tags.tags['bar']) {
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

-->