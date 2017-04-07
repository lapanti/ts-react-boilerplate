# Redux

Next we will setup [redux](http://redux.js.org/) to handle the state for our application (*redux allows us to keep our components pure, helping testing and predictability*).
> You can think of **redux** as an implementation of the [Flux](https://facebook.github.io/flux/) pattern.

### <a name="initialize">Initialize</a>

1. This time we will only need to add the necessary dependencies to allow development with **redux**:
```
yarn add redux redux-observable rxjs
```
*This time we don't need to add type-packages, as all of the added dependencies are either built with [TypeScript](https://www.typescriptlang.org/) or contain type definitions for it.*
> [Redux-observable](https://redux-observable.js.org/) is our choice for allowing side effects, such as [AJAX](https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started)-calls in **redux**. [RxJS](http://reactivex.io/) is a peer dependency for **redux-observable**. If you want something else you can check the [alternatives](#alternatives).

### <a name="utils">Creating utilities</a>

We will begin by creating a file called `utils.js` inside the folder `redux` in `src`. This file will contain helpers for our **redux** functionalities and will serve as good introduction into one of its most basic building blocks. The file will initially look like this:
```typescript
export type DefaultAction = { type: '' };
export const DefaultAction: DefaultAction = { type: '' };
```
[Actions](http://redux.js.org/docs/basics/Actions.html) are the only way to send new content to the **redux**-state, and are usually in the form of an object with the properties `type` (*a unique string*) and an optional `payload` (*something to pass to the state*). Here we have defined a `DefaultAction` which will allow our reducers to pass unnecessary actions forward [without losing type-safety](https://spin.atomicobject.com/2016/09/27/typed-redux-reducers-typescript-2-0/). The empty string as a `type` ensures that it doesn't intersect with any of our own actions.

### <a name="reducer">Reducer</a>

Now we will define our root-reducer in a file called `store.ts` inside the folder `redux`:
```typescript
import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { DefaultAction } from './utils';

const reducer = combineReducers<State>({
});

export class State {
}

export const epics = combineEpics(
);

export type Actions = DefaultAction;

export default reducer;
```
This file will allow us to export all of the following:
- Our root reducer (*all specific reducers will be combined into this done, as according to [redux documentation](http://redux.js.org/docs/basics/Reducers.html#handling-actions), allowing our reducers to only handle a slice of the entire `state`*) made with [combineReducers](http://redux.js.org/docs/api/combineReducers.html)
- The class of our entire `state` (*defined as a class to allow initialization in for example tests*)
- Our combined [epics](https://redux-observable.js.org/docs/basics/Epics.html) (*more about epics later*) made with [combineEpics](https://redux-observable.js.org/docs/api/combineEpics.html)
- The type of all of our actions

### <a name="store">Store</a>

Now we will define our store creator (*having it as a separate function helps us in doing [server-side rendering](https://github.com/reactjs/redux/blob/master/docs/recipes/ServerRendering.md), but if you don't want to do it you can define this function later*) in a file called `store.ts` inside the `redux`-folder:
```typescript
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import reducer, { epics, State } from './reducer';

const epicMiddleware = createEpicMiddleware(epics);

const configureStore = (): Store<State> => createStore(
    reducer,
    applyMiddleware(epicMiddleware),
);

export default configureStore;
```

---

On the fifth line we create a [middleware](http://redux.js.org/docs/advanced/Middleware.html) for our **store** to handle our epics, using [createEpicMiddleware](https://redux-observable.js.org/docs/api/createEpicMiddleware.html) (*and here you see why we combined all our epics into one*):
```typescript
import { createEpicMiddleware } from 'redux-observable';
import { epics } from './reducer';
const epicMiddleware = createEpicMiddleware(epics);
```

---

And then on the seventh line we define our store creator method (*which is exported on the 14th line*):
```typescript
import { createStore, applyMiddleware, Store } from 'redux';
import reducer, { State } from './reducer';
const configureStore = (): Store<State> => createStore(
    reducer,
    applyMiddleware(epicMiddleware),
);
export default configureStore;
```
[createStore](http://redux.js.org/docs/api/createStore.html) is the function that creates a **Store** for **redux** and as it's first argument it takes the root-reducer and as the second one all the applicable middleware (*combined with [applyMiddleware](http://redux.js.org/docs/api/applyMiddleware.html)*), in this case our **epicMiddleware**.

---

Now we have everything set up to start doing the beef of the application, a.k.a. the views!

### <a name="alternatives">Alternatives</a>

If **redux** doesn't float your boat, you can always try [MobX](https://github.com/mobxjs/mobx), but **redux** is maybe the more used one at this point.

For **redux-observable** you have multiple alternatives, namely:
- [redux-loop](https://github.com/redux-loop/redux-loop), which is inspired by [elm](http://elm-lang.org/)'s effect system
- [redux-thunk](https://github.com/gaearon/redux-thunk)
- [redux-saga](https://github.com/redux-saga/redux-saga)
