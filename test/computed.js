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