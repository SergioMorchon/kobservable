import {ISubscribable, IObserver} from './subscribable';
import {IObservable} from './observable';
import equals from './equals';

/**
 * Creates a new observable instance.
 * @param delay The delay time, in milliseconds.
 * @param initialValue The initial value.
 */
export default function throttled<T>(delay: number, initialValue?: T): IObservable<T> {

    let timeout;
    let data = initialValue;
    const subscriptions = new Set<IObserver<T>>();

    const updateValue = value => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            data = value;
        }, delay);
    };

    const observableContainer = <IObservable<T>>function (value?: T) {
        if (arguments.length) {
            if (!equals(data, value)) {
                updateValue(value);
            }
            return this;
        } else {
            return data;
        }
    };

    observableContainer.subscribe = subscription => {
        subscriptions.add(subscription);
    };
    observableContainer.unsubscribe = subscription => {
        subscriptions.delete(subscription);
    };
    observableContainer.unsubscribeAll = () => {
        subscriptions.clear();
    };

    observableContainer.subscriptionsCount = () => subscriptions.size;

    return observableContainer;
}