import {throttled} from '../dist/kobservable';
import test from 'ava';

test('throttled initial value', async t => {
    const initialValue = Math.random();
    const property = throttled(0, initialValue);
    await new Promise(resolve => {
        setTimeout(() => {
            t.is(property(), initialValue);
            t.is(throttled()(0), undefined);
            resolve();
        }, 1);
    });
});

test('sets and gets throttled', async t => {
    const property = throttled(200, false);
    property(true);
    t.false(property());
    await new Promise(resolve => {
        setTimeout(() => {
            t.true(property());
            resolve();
        }, 300);
    });
});
