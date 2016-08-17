import observable, {computed} from '../dist/kobservable';
import test from 'ava';

test('computed reacts to source changes', t => {
    const sourceA = observable('a');
    const sourceB = observable('b');
    const comp = computed([sourceA, sourceB], ([a, b]) => a + b);
    t.is(comp(), 'ab');

    let result;
    let times = 0;
    comp.subscribe(value => {
        result = value;
        times++;
    });
    t.is(times, 0);
    sourceA('c');
    t.is(result, 'cb');
    t.is(comp(), 'cb');
    t.is(times, 1);

    sourceB('d');
    t.is(result, 'cd');
    t.is(comp(), 'cd');
    t.is(times, 2);
});

test('computed subscriptions', t => {
    let sourceCount = 0;
    const source = observable(1);
    const incSourceCount = () => sourceCount++;
    source.subscribe(incSourceCount);
    t.is(source.subscriptionsCount(), 1);

    let middleCount = 0;
    const middle = computed([source], ([value]) => value * 2);
    const incMiddleCount = () => middleCount++;
    middle.subscribe(incMiddleCount);
    t.is(source.subscriptionsCount(), 2);
    t.is(middle.subscriptionsCount(), 1);

    let endCount = 0;
    const end = computed([middle], ([value]) => value + 1);
    const incEndCount = () => endCount++;
    end.subscribe(incEndCount);
    t.is(source.subscriptionsCount(), 2);
    t.is(middle.subscriptionsCount(), 2);
    t.is(end.subscriptionsCount(), 1);

    t.is(sourceCount, 0);
    t.is(middleCount, 0);
    t.is(endCount, 0);

    t.is(middle(), 2);
    t.is(end(), 3);

    source(2);

    t.is(source(), 2);
    t.is(sourceCount, 1);

    t.is(middle(), 4);
    t.is(middleCount, 1);

    t.is(end(), 5);
    t.is(endCount, 1);

    t.is(source.subscriptionsCount(), 2);
    t.is(middle.subscriptionsCount(), 2);
    t.is(end.subscriptionsCount(), 1);

    end.unsubscribe(incEndCount);

    t.is(source.subscriptionsCount(), 2);
    t.is(middle.subscriptionsCount(), 1);
    t.is(end.subscriptionsCount(), 0);

    source(3);

    t.is(source(), 3);
    t.is(sourceCount, 2);
    t.is(middleCount, 2);
    t.is(endCount, 1);

    source.unsubscribe(incSourceCount);

    t.is(source.subscriptionsCount(), 1);
    t.is(middle.subscriptionsCount(), 1);
    t.is(end.subscriptionsCount(), 0);

    middle.unsubscribe(incMiddleCount);

    t.is(source.subscriptionsCount(), 0);
    t.is(middle.subscriptionsCount(), 0);
    t.is(end.subscriptionsCount(), 0);
});


test('computed notifies only if changes', t => {
    const source = observable('');
    let changesCount = 0;
    const truthy = computed([source], ([value]) => Boolean(value));
    truthy.subscribe(() => changesCount++);

    t.false(truthy());
    t.is(changesCount, 0);

    source(false);
    t.false(truthy());
    t.is(changesCount, 0);

    source(8);
    t.is(changesCount, 1);
    t.true(truthy());
    t.is(changesCount, 1);
});