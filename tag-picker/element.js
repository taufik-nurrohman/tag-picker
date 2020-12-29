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

(function () {
  'use strict';

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  const isArray = x => Array.isArray(x);
  const isDefined = x => 'undefined' !== typeof x;
  const isInstance = (x, of) => x && isSet(of) && x instanceof of;
  const isNull = x => null === x;
  const isNumeric = x => /^-?(?:\d*.)?\d+$/.test(x + "");
  const isObject = (x, isPlain = true) => {
      if ('object' !== typeof x) {
          return false;
      }
      return isPlain ? isInstance(x, Object) : true;
  };
  const isSet = x => isDefined(x) && !isNull(x);
  const isString = x => 'string' === typeof x;

  const fromValue = x => {
      if (isArray(x)) {
          return x.map(v => fromValue(x));
      }
      if (isObject(x)) {
          for (let k in x) {
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

  const toNumber = (x, base = 10) => parseInt(x, base);
  const toValue = x => {
      if (isArray(x)) {
          return x.map(v => toValue(v));
      }
      if (isNumeric(x)) {
          return toNumber(x);
      }
      if (isObject(x)) {
          for (let k in x) {
              x[k] = toValue(x[k]);
          }
          return x;
      }
      return ({
          'false': false,
          'null': null,
          'true': true
      })[x] || x;
  };

  const D = document;
  const W = window;

  const getAttribute = (node, attribute, parseValue = true) => {
      if (!hasAttribute(node, attribute)) {
          return null;
      }
      let value = node.getAttribute(attribute);
      return parseValue ? toValue(value) : value;
  };

  const getParent = node => {
      return node.parentNode || null;
  };

  const hasAttribute = (node, attribute) => {
      return node.hasAttribute(attribute);
  };

  const hasState = (node, state) => {
      return state in node;
  };

  const letAttribute = (node, attribute) => {
      return node.removeAttribute(attribute), node;
  };

  const setAttribute = (node, attribute, value) => {
      if (true === value) {
          value = attribute;
      }
      return node.setAttribute(attribute, fromValue(value)), node;
  };

  const setAttributes = (node, attributes) => {
      let value;
      for (let attribute in attributes) {
          value = attributes[attribute];
          if (value || "" === value || 0 === value) {
              setAttribute(node, attribute, value);
          } else {
              letAttribute(node, attribute);
          }
      }
      return node;
  };

  const setElement = (node, content, attributes) => {
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

  const setHTML = (node, content, trim = true) => {
      if (null === content) {
          return node;
      }
      let state = 'innerHTML';
      return hasState(node, state) && (node[state] = trim ? content.trim() : content), node;
  };

  const setPrev = (current, node) => {
      return getParent(current).insertBefore(node, current), node;
  };

  var HTMLTagPickerElement = /*#__PURE__*/function (_HTMLElement) {
    _inheritsLoose(HTMLTagPickerElement, _HTMLElement);

    function HTMLTagPickerElement() {
      var _this;

      // Always call `super()` first in constructor
      _this = _HTMLElement.call(this) || this; // Create a shadow root

      _this.attachShadow({
        mode: 'open'
      });

      return _this;
    }

    var _proto = HTMLTagPickerElement.prototype;

    _proto.connectedCallback = function connectedCallback() {
      var t = this,
          root = t.shadowRoot,
          source = setElement('input', {
        name: getAttribute(t, 'name'),
        placeholder: getAttribute(t, 'placeholder'),
        type: 'hidden',
        value: getAttribute(t, 'value')
      });
      setPrev(root.host, source); // Apply the tag picker widget

      var picker = new TP(source);
    };

    return HTMLTagPickerElement;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement)); // Define the new element


  W.customElements.define('tag-picker', HTMLTagPickerElement);

}());
