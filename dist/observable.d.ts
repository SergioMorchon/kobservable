import { ISubscribable } from './subscribable';
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
export interface IObservable<T> extends IGetter<T>, ISetter<T>, ISubscribable<T> {
}
/**
 * Creates a new observable instance.
 * @param initialValue The initial value.
 */
export default function observable<T>(initialValue?: T): IObservable<T>;
