# Redux

Next we will setup [redux](http://redux.js.org/) to handle the state for our application (*redux allows us to keep our components pure, helping testing and predictability*).
> You can think of **redux** as an implementation of the [Flux](https://facebook.github.io/flux/) pattern, where the main point is that data flows into a single direction.

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

### Redux guards

We will begin by creating a file called `guards.js` inside the folder `redux` in `src`. This file will contain some helper functions so that TypeScript will play nicely with **Redux**. The contents of the file are as follows:
```typescript
import { Action } from 'redux';

export type IActionType<X> = X & { __actionType: string };

const _devSet: { [key: string]: any } = {};

export const makeAction = <Z extends {}>(type: string, typePrefix = '') => {
    // Helpful check against copy-pasting duplicate type keys when creating
    // new actions.
    if (process.env.NODE_ENV === 'development') {
        if (_devSet[type]) {
            throw new Error(
                'Attempted creating an action with an existing type key. ' + 'This is almost cetainly an error.',
            );
        }
        _devSet[type] = type;
    }
    return <X extends (...args: any[]) => Z>(fn: X) => {
        const returnFn: IActionType<X> = ((...args: any[]) => ({ ...(fn as any)(...args), type })) as any;
        returnFn.__actionType = typePrefix + type;
        return returnFn;
    };
};

export const isAction = <T>(
    action: Action,
    actionCreator: IActionType<(...args: any[]) => T>,
): action is T & Action => {
    return action.type === actionCreator.__actionType;
};
```
[Actions](http://redux.js.org/docs/basics/Actions.html) are the only way to send new content to the **redux**-state, and are usually in the form of an object with the properties `type` (*a unique string*) and an optional `payload` (*something to pass to the reducer*). However as **redux** has defined the `type` key to be of the type `any`, we lose type safety and that is why we alias the actual string to `__actionType`, which allows **TypeScript** to infer the type of an action implicitly, which is where `makeAction` comes in. The `_devSet` variable and the things related to it inside `makeAction` are for development, to ensure we don't create duplicate actions. The `isAction`-function is a [type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html) which allows us to use the action creators (*more about them in [reducers](./REDUCERS.md)*) own return type as the actual type for the action, giving us implicit, but safe, typings. You can read more about  [redux guards](https://github.com/quicksnap/redux-guards) [here](https://medium.com/@danschuman/redux-guards-for-typescript-1b2dc2ed4790). Don't worry if this seems too complex as it uses a lot of advanced features of **TypeScript** to work.

### Reducer

Now we will define our root-reducer in a file called `reducer.ts` inside the folder `redux`:
```typescript
import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { routerReducer, RouterState } from 'react-router-redux';

const reducer = combineReducers<State>({
    router: routerReducer,
});

export class State {
    readonly router: RouterState = null;
}

export const epics = combineEpics(
);

export default reducer;
```
This file will allow us to export all of the following:
- Our root reducer (*all specific reducers will be combined into this one, as according to [redux documentation](http://redux.js.org/docs/basics/Reducers.html#handling-actions), allowing our reducers to only handle a slice of the entire `state`*) made with [combineReducers](http://redux.js.org/docs/api/combineReducers.html)
- The class of our entire `state` (*defined as a class to allow initialization in for example tests*)
- Our combined [epics](https://redux-observable.js.org/docs/basics/Epics.html) (*more about epics later*) made with [combineEpics](https://redux-observable.js.org/docs/api/combineEpics.html)

### Store

Now we will define our store creator. Having it as a separate function helps us in doing [server-side rendering](https://github.com/reactjs/redux/blob/master/docs/recipes/ServerRendering.md) but if you don't want to do it you can define this function later. The store creator goes in a file called `store.ts` inside the `redux`-folder:
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
