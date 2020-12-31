/*!
 *
 * The MIT License (MIT)
 *
 * Copyright © 2020 Taufik Nurrohman
 *
 * <https://github.com/taufik-nurrohman/tag-picker>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.TP = factory());
})(this, function () {
  'use strict';

  var isArray = function isArray(x) {
    return Array.isArray(x);
  };

  var isDefined = function isDefined(x) {
    return 'undefined' !== typeof x;
  };

  var isInstance = function isInstance(x, of) {
    return x && isSet(of) && x instanceof of;
  };

  var isNull = function isNull(x) {
    return null === x;
  };

  var isNumber = function isNumber(x) {
    return 'number' === typeof x;
  };

  var isNumeric = function isNumeric(x) {
    return /^-?(?:\d*.)?\d+$/.test(x + "");
  };

  var isObject = function isObject(x, isPlain) {
    if (isPlain === void 0) {
      isPlain = true;
    }

    if ('object' !== typeof x) {
      return false;
    }

    return isPlain ? isInstance(x, Object) : true;
  };

  var isSet = function isSet(x) {
    return isDefined(x) && !isNull(x);
  };

  var isString = function isString(x) {
    return 'string' === typeof x;
  };

  var fromValue = function fromValue(x) {
    if (isArray(x)) {
      return x.map(function (v) {
        return fromValue(x);
      });
    }

    if (isObject(x)) {
      for (var k in x) {
        x[k] = fromValue(x[k]);
      }

      return x;
    }

    if (false === x) {
      return 'false';
    }

    if (null === x) {
      return 'null';
    }

    if (true === x) {
      return 'true';
    }

    return "" + x;
  };

  var toCaseLower = function toCaseLower(x) {
    return x.toLowerCase();
  };

  var toNumber = function toNumber(x, base) {
    if (base === void 0) {
      base = 10;
    }

    return parseInt(x, base);
  };

  var toValue = function toValue(x) {
    if (isArray(x)) {
      return x.map(function (v) {
        return toValue(v);
      });
    }

    if (isNumeric(x)) {
      return toNumber(x);
    }

    if (isObject(x)) {
      for (var k in x) {
        x[k] = toValue(x[k]);
      }

      return x;
    }

    return {
      'false': false,
      'null': null,
      'true': true
    }[x] || x;
  };

  var D = document;
  var W = window;

  var getAttribute = function getAttribute(node, attribute, parseValue) {
    if (parseValue === void 0) {
      parseValue = true;
    }

    if (!hasAttribute(node, attribute)) {
      return null;
    }

    var value = node.getAttribute(attribute);
    return parseValue ? toValue(value) : value;
  };

  var getChildFirst = function getChildFirst(parent) {
    return parent.firstElementChild || null;
  };

  var getChildren = function getChildren(parent, index) {
    var children = parent.children;
    return isNumber(index) ? children[index] || null : children || [];
  };

  var getName = function getName(node) {
    return toCaseLower(node && node.nodeName || "") || null;
  };

  var getNext = function getNext(node) {
    return node.nextElementSibling || null;
  };

  var getParent = function getParent(node) {
    return node.parentNode || null;
  };

  var getParentForm = function getParentForm(node) {
    var state = 'form';

    if (hasState(node, state) && state === getName(node[state])) {
      return node[state];
    }

    var parent = getParent(node);

    while (parent) {
      if (state === getName(parent)) {
        break;
      }

      parent = getParent(parent);
    }

    return parent || null;
  };

  var getPrev = function getPrev(node) {
    return node.previousElementSibling || null;
  };

  var getText = function getText(node, trim) {
    if (trim === void 0) {
      trim = true;
    }

    var state = 'textContent';

    if (!hasState(node, state)) {
      return false;
    }

    var content = node[state];
    content = trim ? content.trim() : content;
    return "" !== content ? content : null;
  };

  var hasAttribute = function hasAttribute(node, attribute) {
    return node.hasAttribute(attribute);
  };

  var hasParent = function hasParent(node) {
    return null !== getParent(node);
  };

  var hasState = function hasState(node, state) {
    return state in node;
  };

  var letAttribute = function letAttribute(node, attribute) {
    return node.removeAttribute(attribute), node;
  };

  var letClass = function letClass(node, value) {
    return node.classList.remove(value), node;
  };

  var letClasses = function letClasses(node, classes) {
    if (isArray(classes)) {
      return classes.forEach(function (name) {
        return node.classList.remove(name);
      }), node;
    }

    if (isObject(classes)) {
      for (var name in classes) {
        classes[name] && node.classList.remove(name);
      }

      return node;
    }

    return node.className = "", node;
  };

  var letElement = function letElement(node) {
    var parent = getParent(node);
    return node.remove(), parent;
  };

  var setAttribute = function setAttribute(node, attribute, value) {
    if (true === value) {
      value = attribute;
    }

    return node.setAttribute(attribute, fromValue(value)), node;
  };

  var setAttributes = function setAttributes(node, attributes) {
    var value;

    for (var attribute in attributes) {
      value = attributes[attribute];

      if (value || "" === value || 0 === value) {
        setAttribute(node, attribute, value);
      } else {
        letAttribute(node, attribute);
      }
    }

    return node;
  };

  var setChildLast = function setChildLast(parent, node) {
    return parent.append(node), node;
  };

  var setClass = function setClass(node, value) {
    return node.classList.add(value), node;
  };

  var setClasses = function setClasses(node, classes) {
    if (isArray(classes)) {
      return classes.forEach(function (name) {
        return node.classList.add(name);
      }), node;
    }

    if (isObject(classes)) {
      for (var name in classes) {
        if (classes[name]) {
          node.classList.add(name);
        } else {
          node.classList.remove(name);
        }
      }
    } // if (isString(classes)) {


    node.className = classes; // }

    return node;
  };

  var setElement = function setElement(node, content, attributes) {
    node = isString(node) ? D.createElement(node) : node;

    if (isObject(content)) {
      attributes = content;
      content = false;
    }

    if (isString(content)) {
      setHTML(node, content);
    }

    if (isObject(attributes)) {
      setAttributes(node, attributes);
    }

    return node;
  };

  var setHTML = function setHTML(node, content, trim) {
    if (trim === void 0) {
      trim = true;
    }

    if (null === content) {
      return node;
    }

    var state = 'innerHTML';
    return hasState(node, state) && (node[state] = trim ? content.trim() : content), node;
  };

  var setNext = function setNext(current, node) {
    return getParent(current).insertBefore(node, getNext(current)), node;
  };

  var setPrev = function setPrev(current, node) {
    return getParent(current).insertBefore(node, current), node;
  };

  var setText = function setText(node, content, trim) {
    if (trim === void 0) {
      trim = true;
    }

    if (null === content) {
      return node;
    }

    var state = 'textContent';
    return hasState(node, state) && (node[state] = trim ? content.trim() : content), node;
  };

  var eventPreventDefault = function eventPreventDefault(e) {
    return e && e.preventDefault();
  };

  var off = function off(name, node, then) {
    node.removeEventListener(name, then);
  };

  var on = function on(name, node, then, options) {
    if (options === void 0) {
      options = false;
    }

    node.addEventListener(name, then, options);
  };

  function fire(name, data) {
    var $ = this;

    if (!isSet(hooks[name])) {
      return $;
    }

    hooks[name].forEach(function (then) {
      return then.apply($, data);
    });
    return $;
  }

  var hooks = {};

  function off$1(name, then) {
    var $ = this;

    if (!isSet(name)) {
      return hooks = {}, $;
    }

    if (isSet(hooks[name])) {
      if (isSet(then)) {
        for (var i = 0, _j = hooks[name].length; i < _j; ++i) {
          if (then === hooks[name][i]) {
            hooks[name].splice(i, 1);
            break;
          }
        } // Clean-up empty hook(s)


        if (0 === j) {
          delete hooks[name];
        }
      } else {
        delete hooks[name];
      }
    }

    return $;
  }

  function on$1(name, then) {
    var $ = this;

    if (!isSet(hooks[name])) {
      hooks[name] = [];
    }

    if (isSet(then)) {
      hooks[name].push(then);
    }

    return $;
  }

  var isPattern = function isPattern(pattern) {
    return isInstance(pattern, RegExp);
  };

  var toPattern = function toPattern(pattern, opt) {
    if (isPattern(pattern)) {
      return pattern;
    } // No need to escape `/` in the pattern string


    pattern = pattern.replace(/\//g, '\\/');
    return new RegExp(pattern, isSet(opt) ? opt : 'g');
  };

  var delay = W.setTimeout,
      name = 'TP';

  function getCount(ofArray) {
    return ofArray.length;
  }

  function getKey(fromValue, ofArray) {
    var index = ofArray.indexOf(fromValue);
    return index < 0 ? null : index;
  }

  function inArray(theValue, theArray) {
    return theArray.indexOf(theValue) >= 0;
  }

  var KEY_ARROW_LEFT = ['ArrowLeft', 37];
  var KEY_ARROW_RIGHT = ['ArrowRight', 39];
  var KEY_DELETE_LEFT = ['Backspace', 8];
  var KEY_DELETE_RIGHT = ['Delete', 46];
  var KEY_ENTER = ['Enter', 13];
  var KEY_TAB = ['Tab', 9];

  function TP(source, state) {
    if (state === void 0) {
      state = {};
    }

    if (!source) return;
    var $ = this; // Already instantiated, skip!

    if (source[name]) {
      return $;
    } // Return new instance if `F3H` was called without the `new` operator


    if (!isInstance($, TP)) {
      return new TP(source, state);
    }

    var sourceIsDisabled = function sourceIsDisabled() {
      return source.disabled;
    },
        sourceIsReadOnly = function sourceIsReadOnly() {
      return source.readOnly;
    },
        thePlaceholder = getAttribute(source, 'placeholder'),
        theTabIndex = getAttribute(source, 'tabindex');

    $.state = state = Object.assign({}, TP.state, isString(state) ? {
      join: state
    } : state || {});
    $.source = source;
    var fire$1 = fire.bind($),
        off$2 = off$1.bind($),
        on$2 = on$1.bind($); // Store current instance to `TP.instances`

    TP.instances[source.id || source.name || getCount(Object.keys(TP.instances))] = $; // Mark current DOM as active tag picker to prevent duplicate instance

    source[name] = 1;
    var editor = setElement('span', {
      'class': 'editor tag'
    }),
        editorInput = setElement('span', {
      'contenteditable': sourceIsDisabled() ? false : 'true',
      'spellcheck': 'false',
      'style': 'white-space:pre;'
    }),
        editorInputPlaceholder = setElement('span'),
        form = getParentForm(source),
        // Capture the closest `<form>` element
    tags = setElement('span', {
      'class': 'tags'
    }),
        view = setElement('span', {
      'class': state['class']
    });

    function n(text) {
      return $.f(text).replace(toPattern('(' + state.escape.join('|').replace(/\\/g, '\\\\') + ')+'), "").trim();
    }

    function onInput() {
      if (sourceIsDisabled() || sourceIsReadOnly()) {
        return setInput("");
      }

      var tag = n(getText(editorInput)),
          tags = $.tags,
          index;

      if (tag) {
        if (!getTag(tag)) {
          setTagElement(tag), setTag(tag);
          index = getCount(tags);
          fire$1('change', [tag, index]);
          fire$1('set.tag', [tag, index]);
        } else {
          fire$1('has.tag', [tag, getKey(tag, tags)]);
        }

        setInput("");
      }
    }

    function onBlurInput() {
      onInput();
      letClasses(view, ['focus', 'focus.input']);
      fire$1('blur', [$.tags, getCount($.tags)]);
    }

    function onClickInput() {
      fire$1('click', [$.tags]);
    }

    function onFocusInput() {
      setClass(view, 'focus');
      setClass(view, 'focus.input');
      fire$1('focus', [$.tags]);
    }

    function onKeyDownInput(e) {
      var escape = state.escape,
          key = e.key,
          // Modern browser(s)
      keyCode = e.keyCode,
          // Legacy browser(s)
      keyIsCtrl = e.ctrlKey,
          keyIsEnter = KEY_ENTER[0] === key || KEY_ENTER[1] === keyCode,
          keyIsShift = e.shiftKey,
          keyIsTab = KEY_TAB[0] === key || KEY_TAB[1] === keyCode,
          tag,
          theTagLast = getPrev(editor),
          theTagsLength = getCount($.tags),
          theTagsMax = state.max,
          theValueLast = n(getText(editorInput)); // Last value before delay
      // Set preferred key name

      if (keyIsEnter) {
        key = '\n';
      } else if (keyIsTab) {
        key = '\t';
      } // Skip `Tab` key


      if (keyIsTab) ;else if (sourceIsDisabled() || sourceIsReadOnly()) {
        // Submit the closest `<form>` element with `Enter` key
        if (keyIsEnter && sourceIsReadOnly()) {
          doSubmitTry();
        }

        eventPreventDefault(e);
      } else if (inArray(key, escape) || inArray(keyCode, escape)) {
        if (theTagsLength < theTagsMax) {
          // Add the tag name found in the tag editor
          onInput();
        } else {
          setInput("");
          fire$1('max.tags', [theTagsMax]);
        }

        eventPreventDefault(e); // Submit the closest `<form>` element with `Enter` key
      } else if (keyIsEnter) {
        doSubmitTry(), eventPreventDefault(e);
      } else {
        delay(function () {
          var text = getText(editorInput) || "",
              value = n(text); // Last try for buggy key detection on mobile device(s)
          // Check for the last typed key in the tag editor

          if (inArray(text.slice(-1), escape)) {
            if (theTagsLength < theTagsMax) {
              // Add the tag name found in the tag editor
              onInput();
            } else {
              setInput("");
              fire$1('max.tags', [theTagsMax]);
            }

            eventPreventDefault(e); // Escape character only, delete!
          } else if ("" === value && !keyIsCtrl && !keyIsShift) {
            if ("" === theValueLast && (KEY_DELETE_LEFT[0] === key || KEY_DELETE_LEFT[0] === keyCode)) {
              letClass(view, 'focus.tag');
              tag = $.tags[theTagsLength - 1];
              letTagElement(tag), letTag(tag);

              if (theTagLast) {
                fire$1('change', [tag, theTagsLength - 1]);
                fire$1('let.tag', [tag, theTagsLength - 1]);
              }
            } else if (KEY_ARROW_LEFT[0] === key || KEY_ARROW_LEFT[1] === keyCode) {
              // Focus to the last tag
              theTagLast && theTagLast.focus();
            }
          }

          setText(editorInputPlaceholder, value ? "" : thePlaceholder);
        }, 0);
      }
    }

    function setTags(values) {
      // Remove …
      if (hasParent(view)) {
        var prev;

        while (prev = getPrev(editor)) {
          letTagElement(prev.title);
        }
      }

      $.tags = [];
      source.value = ""; // … then add tag(s)

      values = values ? values.split(state.join) : [];

      for (var i = 0, theTagsMax = state.max, value; i < theTagsMax; ++i) {
        if (!values[i]) {
          break;
        }

        if ("" !== (value = n(values[i]))) {
          if (getTag(value)) {
            continue;
          }

          setTagElement(value), setTag(value);
          fire$1('change', [value, i]);
          fire$1('set.tag', [value, i]);
        }
      }
    }

    function onSubmitForm(e) {
      if (sourceIsDisabled()) {
        return;
      }

      var theTagsMin = state.min;
      onInput(); // Force to add the tag name found in the tag editor

      if (theTagsMin > 0 && getCount($.tags) < theTagsMin) {
        setInput("", 1);
        fire$1('min.tags', [theTagsMin]);
        eventPreventDefault(e);
        return;
      } // Do normal `submit` event


      return 1;
    }

    function onPasteInput() {
      delay(function () {
        if (!sourceIsDisabled() && !sourceIsReadOnly()) {
          setTags(getText(editorInput));
        }

        setInput("");
      }, 0);
    }

    function onClickView(e) {
      if (e && view === e.target) {
        editorInput.focus(), onClickInput();
      }
    }

    function onFocusSource() {
      editorInput.focus();
    }

    function onBlurTag() {
      var t = this,
          tag = t.title,
          tags = $.tags;
      letClasses(view, ['focus', 'focus.tag']);
      fire$1('blur.tag', [tag, getKey(tag, tags)]);
    }

    function onClickTag() {
      var t = this,
          tag = t.title,
          tags = $.tags;
      fire$1('click.tag', [tag, getKey(tag, tags)]);
    }

    function onFocusTag() {
      var t = this,
          tag = t.title,
          tags = $.tags;
      setClasses(view, ['focus', 'focus.tag']);
      fire$1('focus.tag', [tag, getKey(tag, tags)]);
    }

    function onClickTagX(e) {
      if (!sourceIsDisabled() && !sourceIsReadOnly()) {
        var t = this,
            tag = getParent(t).title,
            _tags = $.tags,
            index = getKey(tag, _tags);
        letTagElement(tag), letTag(tag), setInput("", 1);
        fire$1('change', [tag, index]);
        fire$1('click.tag', [tag, index]);
        fire$1('let.tag', [tag, index]);
      }

      eventPreventDefault(e);
    }

    function onKeyDownTag(e) {
      var key = e.key,
          // Modern browser(s)
      keyCode = e.keyCode,
          // Legacy browser(s)
      keyIsCtrl = e.ctrlKey,
          keyIsShift = e.shiftKey,
          t = this,
          theTagNext = getNext(t),
          theTagPrev = getPrev(t);

      if (!keyIsCtrl && !keyIsShift) {
        // Focus to the previous tag
        if (!sourceIsReadOnly() && (KEY_ARROW_LEFT[0] === key || KEY_ARROW_LEFT[1] === keyCode)) {
          theTagPrev && (theTagPrev.focus(), eventPreventDefault(e)); // Focus to the next tag or to the tag input
        } else if (!sourceIsReadOnly() && (KEY_ARROW_RIGHT[0] === key || KEY_ARROW_RIGHT[1] === keyCode)) {
          theTagNext && theTagNext !== editor ? theTagNext.focus() : setInput("", 1);
          eventPreventDefault(e); // Remove tag with `Backspace` or `Delete` key
        } else if (KEY_DELETE_LEFT[0] === key || KEY_DELETE_LEFT[1] === keyCode || KEY_DELETE_RIGHT[0] === key || KEY_DELETE_RIGHT[1] === keyCode) {
          if (!sourceIsReadOnly()) {
            var tag = t.title,
                _tags2 = $.tags,
                index = getKey(tag, _tags2);
            letClass(view, 'focus.tag');
            letTagElement(tag), letTag(tag); // Focus to the previous tag or to the tag input after remove

            if (KEY_DELETE_LEFT[0] === key || KEY_DELETE_LEFT[1] === keyCode) {
              theTagPrev ? theTagPrev.focus() : setInput("", 1); // Focus to the next tag or to the tag input after remove
            } else
              /* if (
              KEY_DELETE_RIGHT[0] === key ||
              KEY_DELETE_RIGHT[1] === keyCode
              ) */
              {
                theTagNext && theTagNext !== editor ? theTagNext.focus() : setInput("", 1);
              }

            fire$1('change', [tag, index]);
            fire$1('let.tag', [tag, index]);
          }

          eventPreventDefault(e);
        }
      }
    }

    function setInput(value, fireFocus) {
      setText(editorInput, value);
      setText(editorInputPlaceholder, value ? "" : thePlaceholder);
      fireFocus && editorInput.focus();
    }

    setInput("");

    function getTag(tag, fireHook) {
      var tags = $.tags,
          index = getKey(tag, tags);
      fireHook && fire$1('get.tag', [tag, index]);
      return isNumber(index) ? tag : null;
    }

    function letTag(tag) {
      var tags = $.tags,
          index = getKey(tag, tags);

      if (isNumber(index) && index >= 0) {
        source.value = tags.join(state.join);
        return $.tags.splice(index, 1), true;
      }

      return false;
    }

    function setTag(tag, index) {
      if (isNumber(index)) {
        index = index < 0 ? 0 : index;
        $.tags.splice(index, 0, tag);
      } else {
        $.tags.push(tag);
      } // Update value


      source.value = $.tags.join(state.join);
    }

    function setTagElement(tag, index) {
      var element = setElement('span', {
        'class': 'tag',
        'tabindex': sourceIsDisabled() ? false : '0',
        'title': tag
      });

      if (state.x) {
        var x = setElement('a', {
          'href': "",
          'tabindex': '-1',
          'target': '_top'
        });
        on('click', x, onClickTagX);
        setChildLast(element, x);
      }

      on('blur', element, onBlurTag);
      on('click', element, onClickTag);
      on('focus', element, onFocusTag);
      on('keydown', element, onKeyDownTag);

      if (hasParent(tags)) {
        if (isNumber(index) && $.tags[index]) {
          setPrev(getChildren(tags, index), element);
        } else {
          setPrev(editor, element);
        }
      }
    }

    function letTagElement(tag) {
      var index = getKey(tag, $.tags),
          element;

      if (isNumber(index) && index >= 0 && (element = getChildren(tags, index))) {
        off('blur', element, onBlurTag);
        off('click', element, onClickTag);
        off('focus', element, onFocusTag);
        off('keydown', element, onKeyDownTag);

        if (state.x) {
          var x = getChildFirst(element);

          if (x) {
            off('click', x, onClickTagX);
            letElement(x);
          }
        }

        letElement(element);
      }
    }

    function doSubmitTry() {
      onSubmitForm() && form && form.submit();
    }

    setChildLast(view, tags);
    setChildLast(tags, editor);
    setChildLast(editor, editorInput);
    setChildLast(editor, editorInputPlaceholder);
    setClass(source, state['class'] + '-source');
    setNext(source, view);
    setElement(source, {
      'tabindex': '-1'
    });
    on('blur', editorInput, onBlurInput);
    on('click', editorInput, onClickInput);
    on('click', view, onClickView);
    on('focus', editorInput, onFocusInput);
    on('focus', source, onFocusSource);
    on('keydown', editorInput, onKeyDownInput);
    on('paste', editorInput, onPasteInput);
    form && on('submit', form, onSubmitForm);
    $.blur = function () {
      return !sourceIsDisabled() && (editorInput.blur(), onBlurInput());
    }, $;
    $.click = function () {
      return view.click();
    }, onClickView(), $; // Default filter for the tag name

    $.f = function (text) {
      return toCaseLower(text || "").replace(/[^ a-z\d-]/g, "");
    };

    $.fire = fire$1;

    $.focus = function () {
      if (!sourceIsDisabled()) {
        editorInput.focus();
        onFocusInput();
      }

      return $;
    };

    $.get = function (tag) {
      return sourceIsDisabled() ? null : getTag(tag, 1);
    };

    $.hooks = hooks;
    $.input = editorInput;

    $.let = function (tag) {
      if (!sourceIsDisabled() && !sourceIsReadOnly()) {
        var theTagsMin = state.min;
        onInput();

        if (theTagsMin > 0 && getCount($.tags) < theTagsMin) {
          fire$1('min.tags', [theTagsMin]);
          return $;
        }

        letTagElement(tag), letTag(tag);
      }

      return $;
    };

    $.off = off$2;
    $.on = on$2;

    $.pop = function () {
      if (!source[name]) {
        return $; // Already ejected!
      }

      delete source[name];
      var tags = $.tags;
      letClass(source, state['class'] + '-source');
      off('blur', editorInput, onBlurInput);
      off('click', editorInput, onClickInput);
      off('click', view, onClickView);
      off('focus', editorInput, onFocusInput);
      off('focus', source, onFocusSource);
      off('keydown', editorInput, onKeyDownInput);
      off('paste', editorInput, onPasteInput);
      form && off('submit', form, onSubmitForm);
      tags.forEach(letTagElement);
      setElement(source, {
        'tabindex': theTabIndex
      });
      return letElement(view), fire$1('pop', [tags]);
    };

    $.self = $.view = view;

    $.set = function (tag, index) {
      if (!sourceIsDisabled() && !sourceIsReadOnly()) {
        var _tags3 = $.tags,
            theTagsMax = state.max;

        if (!getTag(tag)) {
          if (getCount(_tags3) < theTagsMax) {
            setTagElement(tag, index), setTag(tag, index);
          } else {
            fire$1('max.tags', [theTagsMax]);
          }
        } else {
          fire$1('has.tag', [tag, getKey(tag, _tags3)]);
        }
      }

      return $;
    };

    $.source = $.output = source;
    $.state = state;
    $.tags = [];
    setTags(source.value); // Fill value(s)

    $.value = function (values) {
      return !sourceIsDisabled() && !sourceIsReadOnly() && setTags(values);
    }, $;
    return $;
  }

  TP.instances = {};
  TP.state = {
    'class': 'tag-picker',
    'escape': [',', 188],
    'join': ', ',
    'max': 9999,
    'min': 0,
    'x': false
  };
  TP.version = '3.1.3';
  return TP;
});
