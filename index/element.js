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

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

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

  var getParent = function getParent(node) {
    return node.parentNode || null;
  };

  var hasAttribute = function hasAttribute(node, attribute) {
    return node.hasAttribute(attribute);
  };

  var hasState = function hasState(node, state) {
    return state in node;
  };

  var letAttribute = function letAttribute(node, attribute) {
    return node.removeAttribute(attribute), node;
  };

  var letState = function letState(node, state) {
    return delete node[state], node;
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

  var setPrev = function setPrev(current, node) {
    return getParent(current).insertBefore(node, current), node;
  };

  var setState = function setState(node, key, value) {
    return node[key] = value, node;
  };

  var setStates = function setStates(node, states) {
    var value;

    for (var state in states) {
      value = states[state];

      if (value || "" === value || 0 === value) {
        setState(node, state, states[state]);
      } else {
        letState(node, state);
      }
    }

    return node;
  };

  var HTMLTagPickerElement = /*#__PURE__*/function (_HTMLElement) {
    _inheritsLoose(HTMLTagPickerElement, _HTMLElement);

    function HTMLTagPickerElement() {
      var _this; // Always call `super()` first in constructor


      _this = _HTMLElement.call(this) || this; // Create a shadow root

      _this.attachShadow({
        mode: 'open'
      });

      _this.source = setElement('input');
      return _this;
    }

    var _proto = HTMLTagPickerElement.prototype;

    _proto.connectedCallback = function connectedCallback() {
      var _getAttribute, _getAttribute2;

      var t = this,
          root = t.shadowRoot;
      setElement(t.source, {
        name: getAttribute(t, 'name'),
        placeholder: getAttribute(t, 'placeholder'),
        type: 'hidden',
        value: getAttribute(t, 'value')
      });
      setStates(t.source, {
        disabled: hasAttribute(t, 'disabled'),
        readOnly: hasAttribute(t, 'readonly')
      });
      setPrev(root.host, t.source); // Apply the tag picker widget

      t.picker = new TP(t.source, {
        max: (_getAttribute = getAttribute(t, 'max')) != null ? _getAttribute : TP.state.max,
        min: (_getAttribute2 = getAttribute(t, 'min')) != null ? _getAttribute2 : TP.state.min
      });
    };

    _proto.blur = function blur() {
      return this.picker.blur();
    };

    _proto.click = function click() {
      return this.picker.click();
    };

    _proto.focus = function focus() {
      return this.picker.focus();
    };

    _createClass(HTMLTagPickerElement, [{
      key: "disabled",
      get: function get() {
        return this.source.disabled;
      },
      set: function set(value) {
        return this.source.disabled = value, this.picker;
      }
    }, {
      key: "readOnly",
      get: function get() {
        return this.source.readOnly;
      },
      set: function set(value) {
        return this.source.readOnly = value, this.picker;
      }
    }, {
      key: "value",
      get: function get() {
        return this.source.value;
      },
      set: function set(value) {
        return this.picker.value(value);
      }
    }]);

    return HTMLTagPickerElement;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement)); // Define the new element


  W.customElements.define('tag-picker', HTMLTagPickerElement);
})();
