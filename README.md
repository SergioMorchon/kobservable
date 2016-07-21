# K-Observable

[![Build Status](https://travis-ci.org/SergioMorchon/kobservable.svg?branch=master)](https://travis-ci.org/SergioMorchon/kobservable)

This is a basic observable implementation to hold data and get notified whenever it changes.
Inspired by the well-known KnockoutJS observable objects, but without any other magic (like bindings or dependency tracking). Just observables and subscriptions.

## Observable

The most basic unit: you can store and retrieve data from them.

``` typescript
import observable from 'kobservable';

const name = observable('');
name.subscribe(newName => console.log(`The new name is '${newName)}'`);
name('foo');// sets the name
//The new name is foo
name();// gets the name
```

## Computed

Given a number of observables, you can perform some aggregation conversion and get it like another read-only observable.

``` typescript
import observable, {computed} from 'kobservable';

const user = observable('me');
const password = observable('me too');
const canSubmit = computed([user, password], ([user, password]) => Boolean(user && password));

const mySubmitButton = document.querySelector('#submit');
canSubmit.subscribe(can => mySubmitButton.disabled = !can);

user('');// disables the button
password('');// the button remains disabled
user('me');// the button remains disabled
password('me again');// enables the button
```

## Powered by TypeScript

If your IDE has TypeScript running (with a plugin, see more at https://www.typescriptlang.org/), you can:

- Code in JavaScript and see how your IDE autocompletes all the K-Observable usages, with type inferences and so on. You can see an example under the test folder.
- Code in TypeScript and... you know, TypeScript! 

## Compile

`npm install`

## Test

`npm test`
