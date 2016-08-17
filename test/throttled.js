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
    let notified = false;

    property.subscribe(() => notified = true);
    property(true);
    t.true(property());
    t.false(notified);

    await new Promise(resolve => {
        setTimeout(() => {
            t.true(property());
            t.true(notified);
            resolve();
        }, 300);
    });
});
