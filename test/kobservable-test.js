import observable from '../dist/kobservable';
import test from 'ava';

test('observable initial value', t => {
    const initialValue = Math.random();
    const property = observable(initialValue);
    t.is(property(), initialValue);
    t.is(observable()(), undefined);
});

test('sets and gets', t => {
    const property = observable();
    property(true);
    t.true(property());
});

test('observer can subscribe to an observable', t=> {
    const property = observable('');
    let observedValue;
    property.subscribe(value => observedValue = value);
    const expectedValue = 'wololoooo';
    property(expectedValue);
    t.is(expectedValue, observedValue);
});

test('observer can unsubscribe from an observable', t=> {
    const property = observable(0);
    let lastValue = ':)';
    const subscription = value => lastValue = value;
    property.subscribe(subscription);
    property.unsubscribe(subscription);
    property('anotherValue');
    t.is(lastValue, ':)');
});

test('observable updates when different values are given', t => {
    const property = observable();
    let notificationCount = 0;
    property.subscribe(() => notificationCount++);
    t.is(0, notificationCount);
    property(true);
    t.is(1, notificationCount);
    property("true");
    t.is(2, notificationCount);
    property(NaN);
    t.is(3, notificationCount);
    property(NaN);
    t.is(3, notificationCount, 'NaN twice should not update subscribers');
});
