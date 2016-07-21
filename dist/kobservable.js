"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = observable;
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
