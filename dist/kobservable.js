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
        return observableContainer;
    }

    var empty = {};
    function computed(sources, compute) {
        var memoizedData = empty;
        var attached = false;
        var subscriptions = new Set();
        var updateData = function updateData() {
            memoizedData = compute(sources.map(function (getter) {
                return getter();
            }));
        };
        var subscription = function subscription() {
            updateData();
            subscriptions.forEach(function (subscription) {
                return subscription(memoizedData);
            });
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
        return computedContainer;
    }

    exports['default'] = observable;
    exports.computed = computed;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=kobservable.js.map