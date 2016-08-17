import { IObservable } from './observable';
/**
 * Creates a new observable instance.
 * @param delay The delay time, in milliseconds.
 * @param initialValue The initial value.
 */
export default function throttled<T>(delay: number, initialValue?: T): IObservable<T>;
