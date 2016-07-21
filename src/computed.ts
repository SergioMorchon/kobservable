import {ISubscribable, IObserver} from './subscribable';
import {IGetter} from './observable';

const empty = {};

export interface IComputed<Output> extends IGetter<Output>, ISubscribable<Output> {
}

export default function computed<T>(sources: (IGetter<any> & ISubscribable<any>)[], compute: (values: any[]) => T): IComputed<T> {

    let memoizedData = <T>empty;
    const subscriptions = new Set<IObserver<T>>();

    const updateData = () => {
        memoizedData = compute(sources.map(getter => getter()));
    };

    const computedContainer = <IComputed<T>>function (): T {
        if (memoizedData === empty) {
            updateData();
        }
        return memoizedData;
    };

    computedContainer.subscribe = subscription => {
        subscriptions.add(subscription);
    };
    computedContainer.unsubscribe = subscription => {
        subscriptions.delete(subscription);
    };
    computedContainer.unsubscribeAll = () => {
        subscriptions.clear();
    };

    sources.forEach(source => source.subscribe(() => {
        updateData();
        subscriptions.forEach(subscription => subscription(memoizedData));
    }));

    return computedContainer;
}