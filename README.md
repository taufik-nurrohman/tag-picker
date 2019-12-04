Tag Picker
==========

> Better tags input interaction with JavaScript.

What is this?

Demo
----

![Image](https://user-images.githubusercontent.com/1669261/69968635-633f9d80-154d-11ea-8632-1694fd52a985.gif)

&rarr; https://taufik-nurrohman.github.io/tag-picker

Usage
-----

~~~ .html
<!DOCTYPE html>
<html dir="ltr">
  <head>
    <meta charset="utf-8">
    <link href="tag-picker.min.css" rel="stylesheet">
  </head>
  <body>
    <p><input name="tags" type="text"></p>
    <script src="tag-picker.min.js"></script>
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

### Get Tag Editor Element

~~~ .js
console.log(picker.input);
~~~

### Get Tags View Element

~~~ .js
console.log(picker.self);
console.log(picker.view); // Alias
~~~

### Get Original Input Element

~~~ .js
console.log(picker.source);
console.log(picker.output); // Alias
~~~

### Get Configuration Data

~~~ .js
console.log(picker.state);
~~~

### Add Tags

~~~ .js
picker.value('foo, bar, baz');
~~~

### Add _bar_ Tag

~~~ .js
picker.set('bar');
~~~

### Remove _bar_ Tag

~~~ .js
tags.let('bar');
~~~

### Remove All Tags

~~~ .js
picker.value("");
~~~

### Tag Name Filter

Create custom tag name filter:

~~~ .js
picker.f = function(text) {
    // Force lower-case letter(s) and trim white-space(s)
    return text.toLowerCase().trim();
};
~~~

### Get _bar_ Tag

~~~ .js
console.log(picker.get('bar'));
~~~

### Get All Tags

~~~ .js
console.log(picker.tags);
~~~

### Check if _bar_ Tag Exists

~~~ .js
if (null !== picker.get('bar')) { … }
~~~

~~~ .js
if (picker.tags.indexOf('bar') >= 0) { … }
~~~


### Count All Tags

~~~ .js
console.log(picker.tags.length);
~~~

### Destroy UI

~~~ .js
picker.pop();
~~~

Hooks
-----

Name | Description
---- | -----------
`blur` | Will be triggered after release focus on the tag editor.
`change` | Will be triggered on every time the tags data is updated.
`click` | Will be triggered after click on the tag editor.
`focus` | Will be triggered after focus on the tag editor.
`pop` | Will be triggered after `picker.pop()`.
`blur.tag` | Will be triggered after release focus on a tag item.
`click.tag` | Will be triggered after click on a tag item.
`focus.tag` | Will be triggered after focus on a tag item.
`get.tag` | Will be triggered after `picker.get('foo')`.
`let.tag` | Will be triggered after `picker.let('foo')`.
`set.tag` | Will be triggered after `picker.set('foo')`.

### Add Hook

~~~ .js
picker.on('set.tag', function(name, index) {
    alert('name: ' + name + ', index: ' + index);
});
~~~

### Add Hook with ID

~~~ .js
picker.on('set.tag', function(name, index) {
    alert('name: ' + name + ', index: ' + index);
}, 'hook-id');
~~~

### Remove Hooks

~~~ .js
picker.off('set.tag');
~~~

### Remove Hook by ID

~~~ .js
picker.off('set.tag', 'hook-id');
~~~

### Trigger Hooks

~~~ .js
picker.fire('set.tag', ['foo', 0]);
~~~

### Trigger Hook by ID

~~~ .js
picker.fire('set.tag', ['foo', 0], 'hook-id');
~~~

Translations
------------

Translation data are stored in the `TP.I` as object:

~~~ .js
console.log(TP.I);
~~~