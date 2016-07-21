import { ISubscribable } from './subscribable';
import { IGetter } from './observable';
export interface IComputed<Output> extends IGetter<Output>, ISubscribable<Output> {
}
export default function computed<T>(sources: (IGetter<any> & ISubscribable<any>)[], compute: (values: any[]) => T): IComputed<T>;
