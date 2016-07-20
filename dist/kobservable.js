"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = observable;
/**
 * Creates a new observable instance.
 * @param initialValue The initial value.
 */
function observable(initialValue) {
    var data = initialValue;
    var subscriptions = new Set();
    var observableContainer = function observableContainer(value) {
        if (arguments.length) {
            if (value !== data) {
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
        subscription(data);
    };
    observableContainer.unsubscribe = function (subscription) {
        subscriptions.delete(subscription);
    };
    observableContainer.unsubscribeAll = function () {
        subscriptions.clear();
    };
    return observableContainer;
}
