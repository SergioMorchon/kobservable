export interface IObserver<T> {
    (value: T): void;
}
export interface IObservable<T> {
    /**
     * Sets the value.
     * @param value The value.
     */
    (value: T): any;
    /**
     * Gets the value.
     */
    (): T;
    /**
     * Subscribes an observer.
     * @param observer The observer.
     */
    subscribe(observer: IObserver<T>): any;
    /**
     * Unsubscribes an observer.
     * @param observer The observer.
     */
    unsubscribe(observer: IObserver<T>): any;
    /**
     * Unsubscribes all the observers subscribed to this observable.
     */
    unsubscribeAll(): any;
}
/**
 * Creates a new observable instance.
 * @param initialValue The initial value.
 */
export default function observable<T>(initialValue?: T): IObservable<T>;
