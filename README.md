Tag Picker
==========

> Better tags input interaction with JavaScript.

![Tag Picker](https://user-images.githubusercontent.com/1669261/69968635-633f9d80-154d-11ea-8632-1694fd52a985.gif)

Tag Picker is a simple JavaScript application that aims to provide better experience for users in adding and removing comma-separated list of words.

[Demo and Documentation](https://taufik-nurrohman.github.io/tag-picker "View Demo")

Contribute
----------

 - **Please do not make pull requests by editing the files that are in the root of the project. They are generated automatically by the build tool.**
 - Install [Git](https://en.wikipedia.org/wiki/Git) and [Node.js](https://en.wikipedia.org/wiki/Node.js)
 - Run `git clone https://github.com/taufik-nurrohman/tag-picker.git`
 - Run `cd tag-picker && npm install`
 - Edit the files in the `.source/-` folder.
 - Run `npm run pack` to generate the production ready files.

---

Release Notes
-------------

### 3.1.7

 - Included CSS and SCSS files to the NPM package.
 - Included custom HTML5 `<tag-picker>` element script to the NPM package.

### 3.1.6

 - Added custom setter and getter for the HTML5 `<tag-picker>` element so that it will look like native HTML5 elements.
 - Removed `picker.view` property.
 - Restructured the test files.

### 3.1.1, 3.1.2, 3.1.3, 3.1.4, 3.1.5

 - Maintenance.

### 3.1.0

 - Prioritized maintainability over file size. Say hello to Node.js and ES6! :wave:
 - Output file for the browser is now using the [Universal Module Definition](https://github.com/umdjs/umd) format.

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
