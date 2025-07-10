Tag Picker
==========

Better tags input interaction with JavaScript.

![index.js](https://img.shields.io/github/size/taufik-nurrohman/tag-picker/index.js?branch=main&color=%23f1e05a&label=index.js&labelColor=%231f2328&style=flat-square)
![index.min.js](https://img.shields.io/github/size/taufik-nurrohman/tag-picker/index.min.js?branch=main&color=%23f1e05a&label=index.min.js&labelColor=%231f2328&style=flat-square)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="2.png">
  <source media="(prefers-color-scheme: light)" srcset="1.png">
  <img alt="Tag Picker" src="1.png">
</picture>

Tag Picker is a JavaScript application designed to simplify the management of comma-separated lists of words, offering a
minimalist interface for an enhanced user experience. Users can easily add tags by typing a word and pressing the
<kbd>,</kbd> key (by default), or remove tags with a quick click (or by using common keys such as the
<kbd>Backspace</kbd> or <kbd>Delete</kbd> keys). Developers can easily integrate and customize this application styles
to match the design of their web project.

It supports native keyboard interaction as if it were plain text. You should be able to copy, cut, and paste from/to the
mask. Click a tag to select it, press the <kbd>Control</kbd> key while clicking the tag to select multiple tags. You can
also select the tags using the combination of <kbd>Shift</kbd> and <kbd>ArrowLeft</kbd> or <kbd>ArrowRight</kbd> keys.

Contribute
----------

 - **Please do not make pull requests by editing the files that are in the root of the project. They are generated
   automatically by the build tool.**
 - Install [Git](https://en.wikipedia.org/wiki/Git) and [Node.js](https://en.wikipedia.org/wiki/Node.js)
 - Run `git clone https://github.com/taufik-nurrohman/tag-picker.git`
 - Run `cd tag-picker && npm install --save-dev`
 - Edit the files in the `.factory` folder.
 - Run `npm run pack` to generate the production ready files.