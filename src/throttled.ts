import {ISubscribable, IObserver} from './subscribable';
import observable, {IGetter} from './observable';
import computed from './computed';

export interface IThrottled<T> extends IGetter<T>, ISubscribable<T> {
}

export default function throttled<T>(source: IGetter<T> & ISubscribable<T>, delay: number): IThrottled<T> {
    let timeout;

    const inner = observable(source());
    const subscription = value => {
        clearTimeout(timeout);
         timeout = setTimeout(() => {
             inner(value);
         }, delay);
    };
    source.subscribe(subscription);

    const result = computed<T>([inner], ([innerValue]) => innerValue);

    const innerUnsubscribe = result.unsubscribe;
    result.unsubscribe = (observer: IObserver<T>) => {
        innerUnsubscribe(observer);
        if (!result.subscriptionsCount()) {
            source.unsubscribe(subscription);
        }
    };

    const innerSubscribe = result.subscribe;
    result.subscribe = (observer: IObserver<T>) => {
        if (!result.subscriptionsCount()) {
            source.subscribe(subscription);
        }
        innerSubscribe(observer);
    };

    return result;
}