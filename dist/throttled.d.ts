import { ISubscribable } from './subscribable';
import { IGetter } from './observable';
export interface IThrottled<T> extends IGetter<T>, ISubscribable<T> {
}
export default function throttled<T>(source: IGetter<T> & ISubscribable<T>, delay: number): IThrottled<T>;
