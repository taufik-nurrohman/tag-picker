Tag Picker
==========

> Better tags input interaction with JavaScript.

Demo
----

![Tag Picker](https://user-images.githubusercontent.com/1669261/69968635-633f9d80-154d-11ea-8632-1694fd52a985.gif)

[Demo and Documentation](https://taufik-nurrohman.github.io/tag-picker "View Demo")

---

Release Notes
-------------

### 3.0.14

 - Removed `TP._` method.

### 3.0.13

 - Updated donation target.

### 3.0.12

 - Fixed for missing `change`, `click.tag` and `let.tag` hook on remove button click events (#16)

### 3.0.11

 - Fixed common issue with ES6 module which does not reference the `this` scope to `window` object by default.

### 3.0.10

 - Added ability to clear the hook storage object if it’s empty.

### 3.0.9

 - Added `TP.state` property to set initial state globally.

### 3.0.8

 - Removed `TP.each()` method.
 - Renamed `TP.__instance__` to `TP.instances`.
 - Added `has.tag`, `max.tags` and `min.tags` hooks.
 - Removed translation feature. Use the new hooks!
 - Removed `state.alert` option. Use the new hooks to create your own alert messages!

### 3.0.7

 - Updated hook system and added more examples.

### 3.0.6

 - Consider `disabled` and `readonly` attribute to control the tag picker behaviour.

### 3.0.5

 - None.

### 3.0.4

 - Fixed tab-index of the “×” button.

### 3.0.3

 - Better tabbing behaviour.

### 3.0.2

 - Removed experimental JavaScript module pattern.

### 3.0.1

 - Small bug fixes and improvements.

### 3.0.0

 - Changed project name from `tags-input-beautifier` to `tag-picker`.
 - The “×” button is removed. You can now trigger focus on a tag item and delete it using `Backspace` or `Delete` key. You can also navigate between tag items using `ArrowLeft` and `ArrowRight` key.

### 2.2.5

 - None.
