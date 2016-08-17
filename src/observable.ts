import {ISubscribable, IObserver} from './subscribable';
import equals from './equals';

export interface IGetter<T> {
    /**
     * Gets the value.
     */
    (): T;
}

export interface ISetter<T> {
    /**
     * Sets the value.
     * @param value The value.
     */
    (value: T): void;
}

export interface IObservable<T> extends
    IGetter<T>,
    ISetter<T>,
    ISubscribable<T> {
}

/**
 * Creates a new observable instance.
 * @param initialValue The initial value.
 */
export default function observable<T>(initialValue?: T): IObservable<T> {

    let data = initialValue;
    const subscriptions = new Set<IObserver<T>>();

    const observableContainer = <IObservable<T>>function (value?: T) {
        if (arguments.length) {
            if (!equals(data, value)) {
                data = value;
                subscriptions.forEach(subscription => subscription(data));
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
