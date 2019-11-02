# slice-helpers

Slice helpers for common reducer types.

My philosophy when building a redux app is to have fat effects, skinny reducers.
Most of the logic of the app should live inside off effects (thunks, sagas)
because it is a central location to manage business rules. When reducers start
listening to actions outside of their own domain, it becomes difficult to
understand what happens when an action gets dispatched. When we think of
reducers as simple storage containers that do not contain any meaningful
business logic, a set of very common reducers emerge: maps, assigns, and
loaders. These three reducer types handle 90% of my reducers in any given
react/redux app.

This library created those reducer types for you so we can focus on business
logic instead of reducer boilerplate.

## Features

- Built on top of [redux-starter-kit](https://github.com/reduxjs/redux-starter-kit) `createSlice`
- Dramatically reduce boilerplate for action/reducer creation

## Requirements

- `redux-starter-kit` >= 1.0 is a peer dependency

## Install

```bash
yarn add slice-helpers
```

## Usage

### map slice

These are common operations when dealing with a slice that is a hash map.

params: { name, initialState?, extraReducers? }

```js
import { mapSlice } from 'slice-helpers';

interface SliceState {
  [key: string]: { name: string, email: string };
}

const name = 'test';
const { reducer, actions } = mapSlice<SliceState>({ name });
const state = {
  3: { name: 'three', email: 'three@three.com' }
};

store.dispatch(
  actions.add({
    1: { name: 'one', email: 'one@one.com' },
    2: { name: 'two', email: 'two@two.com' },
  })
);
/* {
  1: { name: 'one', email: 'one@one.com' },
  2: { name: 'two', email: 'two@two.com' },
  3: { name: 'three', email: 'three@three.com' },
} */

store.dispatch(
  actions.set({
    4: { name: 'four', email: 'four@four.com' },
    5: { name: 'five', email: 'five@five.com' },
    6: { name: 'six': email: 'six@six.com' },
  })
)
/* {
  4: { name: 'four', email: 'four@four.com' },
  5: { name: 'five', email: 'five@five.com' },
  6: { name: 'six': email: 'six@six.com' },
} */

store.dispatch(
  actions.remove(['5', '6'])
)
/* {
  4: { name: 'four', email: 'four@four.com' },
} */

// only update a part of the entity
store.dispatch(
  actions.patch({
    4: { name: 'five' }
  })
)
/* {
  4: { name: 'five', email: 'four@four.com' },
} */

store.dispatch(
  actions.reset()
)
// {}
```

### assign slice

These are common operations when dealing with a slice that simply needs to be
set or reset

params: { name, initialState, extraReducers? }

```js
import { assignSlice } from 'slice-helpers';

type SliceState = string;

const name = 'token';
const { reducer, actions } =
  assignSlice < SliceState > { name, initialState: '' };

store.dispatch(actions.set('some-token'));
/* redux state: { token: 'some-token' } */

store.dispatch(actions.set('another-token'));
/* redux state: { token: 'another-token' } */

store.dispatch(actions.reset());
// redux state: { token: '' }
```

### loading slice

Helper slice that will handle loading data

params: { name, extraReducers? }

```js
import { loadingSlice } from 'slice-helpers';

const { actions, reducer } = loadingSlice({ name: 'loading' });
store.dispatch(actions.loading('something loading'));
// redux state: { loading: { error: '', message: 'something loading', loading: true, success: false } }

store.dispatch(actions.success('great success'));
// redux state: { loading: { error: '', message: 'great success', loading: false, success: true } }

store.dispatch(actions.error('something happened'));
// redux state: { loading: { error: 'something happened', loading: false, success: false } }
```

## Test

```bash
yarn test
```

## Build

```bash
yarn build
```
