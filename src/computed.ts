import {ISubscribable, IObserver} from './subscribable';
import {IGetter} from './observable';
import equals from './equals';

const empty = {};

export interface IComputed<Output> extends IGetter<Output>, ISubscribable<Output> {
}

export default function computed<T>(sources: (IGetter<any> & ISubscribable<any>)[], compute: (values: any[]) => T): IComputed<T> {

    let memoizedData = <T>empty;
    let attached = false;
    const subscriptions = new Set<IObserver<T>>();

    const updateData = () => {
        const computedData = compute(sources.map(getter => getter()));;
        if (!equals(computedData, memoizedData)) {
            memoizedData = computedData;
            return true;
        }
        return false;
    };

    const subscription = () => {
        if (updateData()) {
            subscriptions.forEach(subscription => subscription(memoizedData));
        }
    };

    const attach = () => {
        sources.forEach(source => source.subscribe(subscription));
        attached = true;
    };
    const detach = () => {
        sources.forEach(source => source.unsubscribe(subscription));
        attached = false;
    };
    const checkSubscriptions = () => {
        if (subscriptions.size && !attached) {
            attach();
        } else if (!subscriptions.size && attached) {
            detach();
        }
    };

    const computedContainer = <IComputed<T>>function (): T {
        if (memoizedData === empty) {
            updateData();
        }
        return memoizedData;
    };

    computedContainer.subscribe = s => {
        subscriptions.add(s);
        checkSubscriptions();
    };
    computedContainer.unsubscribe = s => {
        subscriptions.delete(s);
        checkSubscriptions();
    };
    computedContainer.unsubscribeAll = () => {
        subscriptions.clear();
        checkSubscriptions();
    };

    return computedContainer;
}