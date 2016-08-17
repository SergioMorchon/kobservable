(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.kobservable = global.kobservable || {})));
}(this, function (exports) { 'use strict';

  var equals = function equals(v1, v2) {
      return Number.isNaN(v1) && Number.isNaN(v2) ? true : v1 === v2;
  };

  /**
   * Creates a new observable instance.
   * @param initialValue The initial value.
   */
  function observable(initialValue) {
      var data = initialValue;
      var subscriptions = new Set();
      var observableContainer = function observableContainer(value) {
          if (arguments.length) {
              if (!equals(data, value)) {
                  data = value;
                  subscriptions.forEach(function (subscription) {
                      return subscription(data);
                  });
              }
              return this;
          } else {
              return data;
          }
      };
      observableContainer.subscribe = function (subscription) {
          subscriptions.add(subscription);
      };
      observableContainer.unsubscribe = function (subscription) {
          subscriptions.delete(subscription);
      };
      observableContainer.unsubscribeAll = function () {
          subscriptions.clear();
      };
      observableContainer.subscriptionsCount = function () {
          return subscriptions.size;
      };
      return observableContainer;
  }

  var empty = {};
  function computed(sources, compute) {
      var memoizedData = empty;
      var attached = false;
      var subscriptions = new Set();
      var updateData = function updateData() {
          var computedData = compute(sources.map(function (getter) {
              return getter();
          }));
          if (!equals(computedData, memoizedData)) {
              memoizedData = computedData;
              return true;
          }
          return false;
      };
      var subscription = function subscription() {
          if (updateData()) {
              subscriptions.forEach(function (subscription) {
                  return subscription(memoizedData);
              });
          }
      };
      var attach = function attach() {
          sources.forEach(function (source) {
              return source.subscribe(subscription);
          });
          attached = true;
      };
      var detach = function detach() {
          sources.forEach(function (source) {
              return source.unsubscribe(subscription);
          });
          attached = false;
      };
      var checkSubscriptions = function checkSubscriptions() {
          if (subscriptions.size && !attached) {
              attach();
          } else if (!subscriptions.size && attached) {
              detach();
          }
      };
      var computedContainer = function computedContainer() {
          if (memoizedData === empty) {
              updateData();
          }
          return memoizedData;
      };
      computedContainer.subscribe = function (s) {
          subscriptions.add(s);
          checkSubscriptions();
      };
      computedContainer.unsubscribe = function (s) {
          subscriptions.delete(s);
          checkSubscriptions();
      };
      computedContainer.unsubscribeAll = function () {
          subscriptions.clear();
          checkSubscriptions();
      };
      computedContainer.subscriptionsCount = function () {
          return subscriptions.size;
      };
      return computedContainer;
  }

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function throttled(source, delay) {
      var timeout = void 0;
      var inner = observable(source());
      var subscription = function subscription(value) {
          clearTimeout(timeout);
          timeout = setTimeout(function () {
              inner(value);
          }, delay);
      };
      source.subscribe(subscription);
      var result = computed([inner], function (_ref) {
          var _ref2 = slicedToArray(_ref, 1);

          var innerValue = _ref2[0];
          return innerValue;
      });
      var innerUnsubscribe = result.unsubscribe;
      result.unsubscribe = function (observer) {
          innerUnsubscribe(observer);
          if (!result.subscriptionsCount()) {
              source.unsubscribe(subscription);
          }
      };
      var innerSubscribe = result.subscribe;
      result.subscribe = function (observer) {
          if (!result.subscriptionsCount()) {
              source.subscribe(subscription);
          }
          innerSubscribe(observer);
      };
      return result;
  }

  exports['default'] = observable;
  exports.computed = computed;
  exports.throttled = throttled;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=kobservable.js.map