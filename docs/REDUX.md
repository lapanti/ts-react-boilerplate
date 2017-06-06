# Redux

Next we will setup [redux](http://redux.js.org/) to handle the state for our application (*redux allows us to keep our components pure, helping testing and predictability*).
> You can think of **redux** as an implementation of the [Flux](https://facebook.github.io/flux/) pattern.

### Initialize

1. This time we will only need to add the necessary dependencies to allow development with **redux**:
```
yarn add redux redux-observable rxjs react-router-redux@next history
```
2. Add the necessary type definitions (*redux, redux-observable and rxjs contain type definitions*):
```
yarn add -D @types/react-router-redux @types/history
```
> [Redux-observable](https://redux-observable.js.org/) is our choice for allowing side effects, such as [AJAX](https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started)-calls in **redux**. [RxJS](http://reactivex.io/) is a peer dependency for **redux-observable**. If you want something else you can check the [alternatives](#alternatives). [React-router-redux](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux) is used to tie navigation events and browser history into **redux** when using [React Router](https://reacttraining.com/react-router/) (*which well setup later*), and [history](https://github.com/reacttraining/history) is needed to use **react-router-redux**.

### Creating utilities

We will begin by creating a file called `utils.js` inside the folder `redux` in `src`. This file will contain helpers for our **redux** functionalities and will serve as good introduction into one of its most basic building blocks. The file will initially look like this:
```typescript
export type DefaultAction = { type: '' };
export const DefaultAction: DefaultAction = { type: '' };
```
[Actions](http://redux.js.org/docs/basics/Actions.html) are the only way to send new content to the **redux**-state, and are usually in the form of an object with the properties `type` (*a unique string*) and an optional `payload` (*something to pass to the state*). Here we have defined a `DefaultAction` which will allow our reducers to pass unnecessary actions forward [without losing type-safety](https://spin.atomicobject.com/2016/09/27/typed-redux-reducers-typescript-2-0/). The empty string as a `type` ensures that it doesn't intersect with any of our own actions.

### Reducer

Now we will define our root-reducer in a file called `reducer.ts` inside the folder `redux`:
```typescript
import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { routerReducer, RouterState, RouterAction, LocationChangeAction } from 'react-router-redux';
import { DefaultAction } from './utils';

const reducer = combineReducers<State>({
    router: routerReducer,
});

export class State {
    readonly router: RouterState = null;
}

export const epics = combineEpics(
);

export type Actions = DefaultAction | LocationChangeAction | RouterAction;

export default reducer;
```
This file will allow us to export all of the following:
- Our root reducer (*all specific reducers will be combined into this one, as according to [redux documentation](http://redux.js.org/docs/basics/Reducers.html#handling-actions), allowing our reducers to only handle a slice of the entire `state`*) made with [combineReducers](http://redux.js.org/docs/api/combineReducers.html)
- The class of our entire `state` (*defined as a class to allow initialization in for example tests*)
- Our combined [epics](https://redux-observable.js.org/docs/basics/Epics.html) (*more about epics later*) made with [combineEpics](https://redux-observable.js.org/docs/api/combineEpics.html)
- The type of all of our actions
> We add the types of react-router-redux as well so type-checking knows to look for them if we need them (*this is only necessary if you use them somewhere*)

### Store

Now we will define our store creator (*having it as a separate function helps us in doing [server-side rendering](https://github.com/reactjs/redux/blob/master/docs/recipes/ServerRendering.md), but if you don't want to do it you can define this function later*) in a file called `store.ts` inside the `redux`-folder:
```typescript
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { History } from 'history';
import { routerMiddleware } from 'react-router-redux';
import reducer, { epics, State } from './reducer';

const epicMiddleware = createEpicMiddleware(epics);

const configureStore = (history: History) => createStore<State>(
    reducer,
    applyMiddleware(routerMiddleware(history), epicMiddleware),
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
import { History } from 'history';
import { routerMiddleware } from 'react-router-redux';
import reducer, { State } from './reducer';
const configureStore = (history: History) => createStore<State>(
    reducer,
    applyMiddleware(routerMiddleware(history), epicMiddleware),
);
export default configureStore;
```
[createStore](http://redux.js.org/docs/api/createStore.html) is the function that creates a **Store** for **redux** and as it's first argument it takes the root-reducer and as the second one all the applicable middleware (*combined with [applyMiddleware](http://redux.js.org/docs/api/applyMiddleware.html)*), in this case our **epicMiddleware** and **routerMiddleware**. The function `configureStore` takes a `History` as an argument, to allow us to call it with different types of histories.

---

Now we have everything set up to start doing the beef of the application, a.k.a. the views!

### Alternatives

If **redux** doesn't float your boat, you can always try [MobX](https://github.com/mobxjs/mobx), but **redux** is maybe the more used one at this point.

For **redux-observable** you have multiple alternatives, namely:
- [redux-loop](https://github.com/redux-loop/redux-loop), which is inspired by [elm](http://elm-lang.org/)'s effect system
- [redux-thunk](https://github.com/gaearon/redux-thunk)
- [redux-saga](https://github.com/redux-saga/redux-saga)
