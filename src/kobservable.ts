export interface IObserver<T> {
    (value: T): void;
}

export interface IObservable<T> {
    /**
     * Sets the value.
     * @param value The value.
     */
    (value: T);
    /**
     * Gets the value.
     */
    (): T;
    /**
     * Subscribes an observer.
     * @param observer The observer.
     */
    subscribe(observer: IObserver<T>);
    /**
     * Unsubscribes an observer.
     * @param observer The observer.
     */
    unsubscribe(observer: IObserver<T>);
    /**
     * Unsubscribes all the observers subscribed to this observable.
     */
    unsubscribeAll();
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
            if (value !== data) {
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
        subscription(data);
    };
    observableContainer.unsubscribe = subscription => {
        subscriptions.delete(subscription);
    };
    observableContainer.unsubscribeAll = () => {
        subscriptions.clear();
    };

    return observableContainer;
}
