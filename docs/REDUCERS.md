# Reducers

Now we build our business logic, also known as **reducers**. Stay calm, this will be a bit more complicated than anything before.

### HNClientReducer

We begin by creating a file called `HNClientReducer.ts` in the `src/modules/index`-folder
> Our **reducers** follow the naming pattern of `[Foldername]Reducer`

```typescript
import { Action } from 'redux';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import { Epic, combineEpics, ActionsObservable } from 'redux-observable';
import { makeAction, isAction } from '../../redux/guards';
import Todo from '../../common/Todo';

const testDelay = 1000;

export class HNClientState {
    readonly title: string = '';
    readonly todos: Todo[] = [];
    readonly loading: boolean = false;
}

export const SET_TITLE = 'boilerplate/HNClient/SET_TITLE';
export const SAVE_TODO = 'boilerplate/HNClient/SAVE_TODO';
export const SAVE_TODO_SUCCESS = 'boilerplate/HNClient/SAVE_TODO_SUCCESS';
export const SET_DONE = 'boilerplate/HNClient/SET_DONE';
export const SET_DONE_SUCCESS = 'boilerplate/HNClient/SET_DONE_SUCCESS';

export const setTitle = makeAction(SET_TITLE)((title: string) => ({ type: SET_TITLE, payload: title }));
export const saveTodo = makeAction(SAVE_TODO)(() => ({ type: SAVE_TODO }));
export const saveTodoSuccess = makeAction(SAVE_TODO_SUCCESS)(() => ({ type: SAVE_TODO_SUCCESS }));
export const setDone = makeAction(SET_DONE)((i: number) => ({ type: SET_DONE, payload: i }));
export const setDoneSuccess = makeAction(SET_DONE_SUCCESS)((i: number) => ({ type: SET_DONE_SUCCESS, payload: i }));

export const saveTodoEpic: Epic<Action, undefined> = action$ =>
    action$
        .ofType(SAVE_TODO)
        .delay(testDelay)
        .mapTo(saveTodoSuccess());

export const setDoneEpic: Epic<Action, undefined> = action$ =>
    action$
        .ofType(SET_DONE)
        .delay(testDelay)
        .map(action => isAction(action, setDone) && setDoneSuccess(action.payload));

export const HNClientEpics = combineEpics(saveTodoEpic, setDoneEpic);

const HNClientReducer = (state: HNClientState = new HNClientState(), action: Action): HNClientState => {
    if (isAction(action, setTitle)) {
        return { ...state, title: action.payload };
    } else if (isAction(action, saveTodo)) {
        return { ...state, loading: true };
    } else if (isAction(action, saveTodoSuccess)) {
        return {
            ...state,
            title: '',
            todos: state.todos.concat(new Todo(state.todos.length + 1, state.title)),
            loading: false,
        };
    } else if (isAction(action, setDone)) {
        return { ...state, loading: true };
    } else if (isAction(action, setDoneSuccess)) {
        return {
            ...state,
            todos: state.todos.map(t => (t.id === action.payload ? t.setDone() : t)),
            loading: false,
        };
    } else {
        return state;
    }
};

export default HNClientReducer;
```

---

First we define the **state** for our `HNClientReducer`
> **Reducers** usually define their own **state** and we'll show you [later](#connecting) how to connect it to the main **reducer** and **state**

```typescript
import Todo from '../../common/Todo';

export class HNClientState {
    readonly title: string = '';
    readonly todos: Todo[] = [];
    readonly loading: boolean = false;
}
```
which is fairly simple. Here we define the `HNClientState` as a class, with the given properties (*make sure you add default values for required properties so you can instantiate it!*), with the `title` for the current `Todo` the user is creating, `todos` for the list of current `Todo`s and `loading` to show the user whether the application is performing an async call or not.

---

Next up we define our [action types](http://redux.js.org/docs/basics/Actions.html)
```typescript
const SET_TITLE = 'boilerplate/HNClient/SET_TITLE';
const SAVE_TODO = 'boilerplate/HNClient/SAVE_TODO';
const SAVE_TODO_SUCCESS = 'boilerplate/HNClient/SAVE_TODO_SUCCESS';
const SET_DONE = 'boilerplate/HNClient/SET_DONE';
const SET_DONE_SUCCESS = 'boilerplate/HNClient/SET_DONE_SUCCESS';
```
which **redux** recommends to be constant `string`s, but can be of the type `any`. In our case, as we are using **redux-guards** to facilitate the way **TypeScript** works with **redux** we have to make them `string`s.
> Here we follow the [redux-ducks](https://github.com/erikras/ducks-modular-redux) naming pattern of the format `applicationName/ViewName/ACTION_TYPE`

---

Next we define our **action creators** which are functions that return an **action**
```typescript
import { makeAction } from '../../redux/guards';

export const setTitle = makeAction(SET_TITLE)((title: string) => ({ type: SET_TITLE, payload: title }));
export const saveTodo = makeAction(SAVE_TODO)(() => ({ type: SAVE_TODO }));
export const saveTodoSuccess = makeAction(SAVE_TODO_SUCCESS)(() => ({ type: SAVE_TODO_SUCCESS }));
export const setDone = makeAction(SET_DONE)((i: number) => ({ type: SET_DONE, payload: i }));
export const setDoneSuccess = makeAction(SET_DONE_SUCCESS)((i: number) => ({ type: SET_DONE_SUCCESS, payload: i }));
```
of a specific type with a specific `payload` (*which is the way to pass new information to the **reducer***). In this case we use `makeAction` as defined by **redux-guards** to ensure we get proper typings.
> If you want to avoid having to type `type: ACTION_TYPE` you can override the **redux** interface according to [this article](https://medium.com/@danschuman/redux-guards-for-typescript-1b2dc2ed4790), but I personally I dislike overriding libraries so I prefer the duplicity here instead.

---

Next we define our [Epics](https://redux-observable.js.org/docs/basics/Epics.html)
```typescript
import { Action } from 'redux';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import { Epic, combineEpics, ActionsObservable } from 'redux-observable';
import { isAction } from '../../redux/guards';

const saveTodoEpic: Epic<Action, undefined> = action$ =>
    action$
        .ofType(SAVE_TODO)
        .delay(testDelay)
        .mapTo(saveTodoSuccess());

const setDoneEpic: Epic<Action, undefined> = action$ =>
    action$
        .ofType(SET_DONE)
        .delay(testDelay)
        .map(action => isAction(action, setDone) && setDoneSuccess(action.payload));

export const HNClientEpics = combineEpics(saveTodoEpic, setDoneEpic);
```
which are [redux-observable's](https://redux-observable.js.org) way of handling side-effects in **Redux** (*like AJAX calls etc.*). At the end we combine all our **Epics** in this file to a single exportable **Epic** called `HNClientEpics` (*so we only need to import one variable when we want access to these later*).
> The importing part may look a little weird, but it's because [RxJS](http://reactivex.io/rxjs/) is a rather large library, we can either import everything using `import * as RxJS from 'rxjs'` or import only the parts we need as shown above, which will allow any proper [minifier](https://developers.google.com/speed/docs/insights/MinifyResources) like [UglifyJS](https://github.com/mishoo/UglifyJS) to include only the needed parts from **RxJS**

The first line
```typescript
const saveTodoEpic: Epic<Action, undefined> = action$ =>
```
defines an **Epic** which takes in as the first type argument the `type` for the `Actions` the epic takes in (*and returns*), in this case `Action` from **redux**, and as the second argument the type of the **State** it takes in (*which isn't needed this time, so undefined will do*). An **Epic** is a function that takes in a [stream](https://en.wikipedia.org/wiki/Stream_(computing)) (*in this case of the type `ActionsObservable<Action>`*) which includes items of the `type` given as the first type argument and returns another stream (*in this case an [`Observable<Action>`](http://reactivex.io/documentation/observable.html), which `ActionsObservable` is based on*) which includes items of the same `type` as the input stream.
> In JavaScript the convention is to append a `$` to all variables names that are **streams**, to let the developer know that they are dealing with one

The second and third line
```typescript
    action$
        .ofType(SET_DONE)
```
utilizes the inbuilt function `ofType(key: string)` of `ActionsObservable`, which basically filters out all **actions** that do not have the `type`-property of the given argument.
> A more verbose, but maybe a simpler to understand version would be to write
```typescript
action$.filter(action => action.type === SET_DONE)
```
> If you find yourself needing to understand the types of the components provided by **redux-observable** I suggest reading [this](https://github.com/redux-observable/redux-observable/blob/master/index.d.ts)

The third and fourth line
```typescript
        .delay(1000)
        .mapTo(saveTodoSuccess());
```
include the actual functionality of our **Epic**. In this case **after** we receive an **action** of the type `SET_DONE` we wait for 1 second (*`delay` takes milliseconds as argument*) and then we return an **action** of the type `SAVE_TODO_SUCCESS` (*in this case using [`mapTo`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-mapTo) as we just want to return a new **Action***).
> If you wanted to return multiple actions, say `SET_DONE_SUCCESS` and an imaginary `SEND_PUSH_NOTIFICATION` you could do it using [`mergeMap`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-mergeMap), which is kind of like `flatMap`, like so:
```typescript
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/mergeMap';
...
    action$.ofType(SET_DONE)
        .mergeMap(action => Observable.from([
            setDoneSuccess(action.payload),
            // SEND_PUSH_NOTIFICATION,
            // OTHER ACTIONS,
        ]));
```

The other **Epic** is otherwirse similar, but it uses [`map`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-map)
```typescript
        .delay(1000)
        .map(action => isAction(action, setDone) && setDoneSuccess(action.payload));
```
to return an action of the type `SET_DONE_SUCCESS`, using the payload of the incoming action. We use `isAction` defined by **redux-guards** here to ensure **TypeScript** understands the type of our action, otherwise it would complain that `Action does not have key payload`.

> If you wanted to do an AJAX call, you would go about it like this:
```typescript
import { ajax } from 'rxjs/observable/dom/ajax';
...
    action$.ofType(AJAX_CALL).mergeMap(action => {
        // For a get JSON call
        ajax.getJSON('url', { headers: 'go here' })
            .map(response => someAction(response))
            .catch(err => errorAction(err));
        // For all other calls, just select the correct verb
        ajax.post('url', payload, { headers: 'go here' })
            .map(response => someAction(response))
            .catch(err => errorAction(err));
    });
```
> **Redux-observable** is built upon [RxJS](http://reactivex.io/), the JavaScript implemention of **ReactiveX** and most issues you will run into will be **RxJS** issues

---

Finally we define the rest of our business logic, a.k.a. the **reducer** itself
```typescript
const HNClientReducer = (state: HNClientState = new HNClientState(), action: Action): HNClientState => {
    if (isAction(action, setTitle)) {
        return { ...state, title: action.payload };
    } else if (isAction(action, saveTodo)) {
        return { ...state, loading: true };
    } else if (isAction(action, saveTodoSuccess)) {
        return {
            ...state,
            title: '',
            todos: state.todos.concat(new Todo(state.todos.length + 1, state.title)),
            loading: false,
        };
    } else if (isAction(action, setDone)) {
        return { ...state, loading: true };
    } else if (isAction(action, setDoneSuccess)) {
        return {
            ...state,
            todos: state.todos.map(t => (t.id === action.payload ? t.setDone() : t)),
            loading: false,
        };
    } else {
        return state;
    }
};
```
for which I suggest to break from the **redux-ducks** pattern by using the naming convention of `[Pagename]Reducer`. The important thing to remember with **reducers** is that they have to be [functional](https://en.wikipedia.org/wiki/Functional_programming), a.k.a. they are not allowed to mutate the incoming information or have side-effects.

On the first line we define the signature of our `HNClientReducer`
```typescript
const HNClientReducer = (state: HNClientState = new HNClientState(), action: Action): HNClientState => {
```
where we define it to take to parameters (*as all **reducers***), our `HNClientState` (*with a default for the empty state*) and an action. `HNClientReducer` will also return an `HNClientState` (*as all **reducers***).

Next we do the actual logic which all **reducers** are built upon
```typescript
    if (isAction(action, setTitle)) {
        return { ...state, title: action.payload };
    } else if (isAction(action, saveTodo)) {
        return { ...state, loading: true };
    } else if (isAction(action, saveTodoSuccess)) {
        return {
            ...state,
            title: '',
            todos: state.todos.concat(new Todo(state.todos.length + 1, state.title)),
            loading: false,
        };
    } else if (isAction(action, setDone)) {
        return { ...state, loading: true };
    } else if (isAction(action, setDoneSuccess)) {
        return {
            ...state,
            todos: state.todos.map(t => (t.id === action.payload ? t.setDone() : t)),
            loading: false,
        };
    } else {
        return state;
    }
```
which is usually a [`switch`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/switch)-statement, but due to the way we use **redux-guards** we use an `if-else-if-else`-block instead, where we use `isAction` to check the function's type (*and give **TypeScript** the type information*). In each `block` we do something (*except the `default`-one, where you traditionally just return the incoming **state***) to add value to that **action**, such as setting the `title` to the `payload` in the **action** in case the **action** is a `SET_TITLE`-action. Notice how we are using the [spread syntax](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator) to immutably create a new version of the state, thus holding true to the immutability of **reducers**.
> Other options are to use [`Object.assign({}, ...)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) or [Immutable](https://facebook.github.io/immutable-js/)

### Connecting the reducer

Remember our [root-reducer](/REDUX.md#reducer)? Now we connect our `HNClientReducer` to it.

First the **reducer** itself
```typescript
import { combineReducers } from 'redux';
import HNClientReducer from '../modulex/hnClient/HNClientReducer';

const reducer = combineReducers({
    index: HNClientReducer,
});
```
where we add the `HNClientReducer` under the key `index`, which is very important, as when `combineReducers` combines included **reducers** it will put their specific state under the key given, in the global **state**-object.

Next we add the `HNClientState` to our global `State`-class (*this is just to allow us to define the type and initialize it for tests later on*)
```typescript
import { HNClientState } from '../modules/hnClient/HNClientReducer';

export class State {
    readonly index: HNClientState = new HNClientState();
}
```
where we define that the global `State`-object has a property `index` of the type `HNClientState` (*as our `combineReducer` already says, but we want to be explicit here*).

Then we want to add our **Epics** into the global `epics` constant
```typescript
import { combineEpics } from 'redux-observable';
import { HNClientEpics } from '../modules/hnClient/HNClientReducer';

export const epics = combineEpics(HNClientEpics);
```
by including it as a parameter to `combineEpics`.
