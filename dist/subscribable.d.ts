export interface IObserver<T> {
    (value: T): void;
}
export interface ISubscribable<T> {
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
