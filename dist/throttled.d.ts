import { IObservable } from './observable';
/**
 * Creates a new throttled observable instance.
 * You can set & get the value synchronously, but the observers will be notified with a delay from the last change.
 * @param delay The delay time, in milliseconds.
 * @param initialValue The initial value.
 */
export default function throttled<T>(delay: number, initialValue?: T): IObservable<T>;
