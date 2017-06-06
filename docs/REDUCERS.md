# Reducers

Now we build our business logic, also known as **reducers**. Stay calm, this will be a bit more complicated than anything before.

### IndexReducer

We begin by creating a file called `IndexReducer.ts` in the `src/modules/index`-folder
> Our **reducers** follow the naming pattern of `[Foldername]Reducer`

```typescript
import { MiddlewareAPI } from 'redux';
import { Observable } from 'rxjs/Observable';
import { ajax } from 'rxjs/observable/dom/ajax';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import { Epic, combineEpics, ActionsObservable } from 'redux-observable';
import { DefaultAction } from '../../redux/utils';
import Todo from '../../common/Todo';

export class IndexState {
    readonly title: string = '';
    readonly todos: Todo[] = [];
    readonly loading: boolean = false;
}

type SET_TITLE = 'boilerplate/Index/SET_TITLE';
const SET_TITLE: SET_TITLE = 'boilerplate/Index/SET_TITLE';
type SAVE_TODO = 'boilerplate/Index/SAVE_TODO';
const SAVE_TODO: SAVE_TODO = 'boilerplate/Index/SAVE_TODO';
type SAVE_TODO_SUCCESS = 'boilerplate/Index/SAVE_TODO_SUCCESS';
const SAVE_TODO_SUCCESS: SAVE_TODO_SUCCESS = 'boilerplate/Index/SAVE_TODO_SUCCESS';
type SET_DONE = 'boilerplate/Index/SET_DONE';
const SET_DONE: SET_DONE = 'boilerplate/Index/SET_DONE';
type SET_DONE_SUCCESS = 'boilerplate/Index/SET_DONE_SUCCESS';
const SET_DONE_SUCCESS: SET_DONE_SUCCESS = 'boilerplate/Index/SET_DONE_SUCCESS';

type SetTitleAction = { type: SET_TITLE, payload: string };
export const setTitle = (title: string): SetTitleAction => ({ type: SET_TITLE, payload: title });
type SaveTodoAction = { type: SAVE_TODO };
export const saveTodo = (): SaveTodoAction => ({ type: SAVE_TODO });
type SaveTodoSuccessAction = { type: SAVE_TODO_SUCCESS };
const saveTodoSuccess = (): SaveTodoSuccessAction => ({ type: SAVE_TODO_SUCCESS });
type SetDoneAction = { type: SET_DONE, payload: number };
export const setDone = (i: number) => ({ type: SET_DONE, payload: i });
type SetDoneSuccessAction = { type: SET_DONE_SUCCESS, payload: number };
const setDoneSuccess = (i: number): SetDoneSuccessAction => ({ type: SET_DONE_SUCCESS, payload: i });

export type IndexActions = SetTitleAction | SaveTodoAction | SaveTodoSuccessAction | SetDoneAction | SetDoneSuccessAction | DefaultAction;

const saveTodoEpic: Epic<IndexActions, undefined> = (action$: ActionsObservable<IndexActions>): Observable<IndexActions> =>
    action$.ofType(SAVE_TODO)
        .delay(1000)
        .mapTo(saveTodoSuccess());

const setDoneEpic: Epic<IndexActions, undefined> = (action$: ActionsObservable<IndexActions>): Observable<IndexActions> =>
    action$.ofType(SET_DONE)
        .delay(1000)
        .map((action: SetDoneAction) => setDoneSuccess(action.payload));

export const IndexEpics = combineEpics(saveTodoEpic, setDoneEpic);

const IndexReducer = (state: IndexState = new IndexState(), action: IndexActions = DefaultAction): IndexState => {
    switch (action.type) {
        case SET_TITLE:
            return { ...state, title: action.payload };
        case SAVE_TODO:
            return { ...state, loading: true };
        case SAVE_TODO_SUCCESS:
            return {
                ...state,
                title: '',
                todos: state.todos.concat(new Todo(state.todos.length + 1, state.title)),
                loading: false,
            };
        case SET_DONE:
            return { ...state, loading: true };
        case SET_DONE_SUCCESS:
            return {
                ...state,
                todos: state.todos.map(t => t.id === action.payload ? t.setDone() : t),
                loading: false,
            };
        default:
            return state;
    }
};

export default IndexReducer;
```

---

First we define the **state** for our `IndexReducer`
> **Reducers** usually define their own **state** and we'll show you [later](#connecting) how to connect it to the main **reducer** and **state**

```typescript
import Todo from '../../common/Todo';

export class IndexState {
    readonly title: string = '';
    readonly todos: Todo[] = [];
    readonly loading: boolean = false;
}
```
which is fairly simple. Here we define the `IndexState` as a class, with the given properties (*make sure you add default values for required properties so you can instantiate it!*), with the `title` for the current `Todo` the user is creating, `todos` for the list of current `Todo`s and `loading` to show the user whether the application is performing an async call or not.

---

Next up we define our [action types](http://redux.js.org/docs/basics/Actions.html)
```typescript
type SET_TITLE = 'boilerplate/Index/SET_TITLE';
const SET_TITLE: SET_TITLE = 'boilerplate/Index/SET_TITLE';
type SAVE_TODO = 'boilerplate/Index/SAVE_TODO';
const SAVE_TODO: SAVE_TODO = 'boilerplate/Index/SAVE_TODO';
type SAVE_TODO_SUCCESS = 'boilerplate/Index/SAVE_TODO_SUCCESS';
const SAVE_TODO_SUCCESS: SAVE_TODO_SUCCESS = 'boilerplate/Index/SAVE_TODO_SUCCESS';
type SET_DONE = 'boilerplate/Index/SET_DONE';
const SET_DONE: SET_DONE = 'boilerplate/Index/SET_DONE';
type SET_DONE_SUCCESS = 'boilerplate/Index/SET_DONE_SUCCESS';
const SET_DONE_SUCCESS: SET_DONE_SUCCESS = 'boilerplate/Index/SET_DONE_SUCCESS';
```
which **redux** recommends to be constant `string`s. The reason we first define a `type` for the action type is to get **TypeScript** to do [some of the work for us](https://spin.atomicobject.com/2016/09/27/typed-redux-reducers-typescript-2-0/), by ensuring that each instance of the action type has the same value, so for example a constant of `SET_TITLE: SET_TITLE = 'notcorrect'` would raise a compiler error from **TypeScript** as it is not equal to `boilerplate/Index/SET_TITLE`.
> Here we follow the [redux-ducks](https://github.com/erikras/ducks-modular-redux) naming pattern of the format `applicationName/ViewName/ACTION_TYPE`

---

Next we define our **action creators** which are functions that return an **action**
```typescript
type SetTitleAction = { type: SET_TITLE, payload: string };
export const setTitle = (title: string): SetTitleAction => ({ type: SET_TITLE, payload: title });
type SaveTodoAction = { type: SAVE_TODO };
export const saveTodo = (): SaveTodoAction => ({ type: SAVE_TODO });
type SaveTodoSuccessAction = { type: SAVE_TODO_SUCCESS };
const saveTodoSuccess = (): SaveTodoSuccessAction => ({ type: SAVE_TODO_SUCCESS });
type SetDoneAction = { type: SET_DONE, payload: number };
export const setDone = (i: number) => ({ type: SET_DONE, payload: i });
type SetDoneSuccessAction = { type: SET_DONE_SUCCESS, payload: number };
const setDoneSuccess = (i: number): SetDoneSuccessAction => ({ type: SET_DONE_SUCCESS, payload: i });
```
of a specific type with a specific `payload` (*which is the way to pass new information to the **reducer***). In this case we also first define the `type` for each of the possible **actions** at the same time as the **action creator**.

---

After defining our **actions** and **action creators** we also create a combined type of all of them
```typescript
import { DefaultAction } from '../../redux/utils';

export type IndexActions = SetTitleAction | SaveTodoAction | SaveTodoSuccessAction | SetDoneAction | SetDoneSuccessAction | DefaultAction;
```
to allow us to later define when we want to receive an **action** for our `Index`-page and later combine them to create a shared type for all the **actions** in our application.

---

Next we define our [Epics](https://redux-observable.js.org/docs/basics/Epics.html)
```typescript
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import { Epic, combineEpics, ActionsObservable } from 'redux-observable';

const saveTodoEpic: Epic<IndexActions, undefined> = (action$: ActionsObservable<IndexActions>): Observable<IndexActions> =>
    action$.ofType(SAVE_TODO)
        .delay(1000)
        .mapTo(saveTodoSuccess());

const setDoneEpic: Epic<IndexActions, undefined> = (action$: ActionsObservable<IndexActions>): Observable<IndexActions> =>
    action$.ofType(SET_DONE)
        .delay(1000)
        .map((action: SetDoneAction) => setDoneSuccess(action.payload));

export const IndexEpics = combineEpics(saveTodoEpic, setDoneEpic);
```
which are [redux-observable's](https://redux-observable.js.org) way of handling side-effects in **Redux** (*like AJAX calls etc.*). At the end we combine all our **Epics** in this file to a single exportable **Epic** called `IndexEpics` (*so we only need to import one variable when we want access to these later*).
> The importing part may look a little weird, but it's because [RxJS](http://reactivex.io/rxjs/) is a rather large library, we can either import everything using `import * as RxJS from 'rxjs'` or import only the parts we need as shown above, which will allow any proper [minifier](https://developers.google.com/speed/docs/insights/MinifyResources) like [UglifyJS](https://github.com/mishoo/UglifyJS) to include only the needed parts from **RxJS**

The first line
```typescript
const saveTodoEpic: Epic<IndexActions, undefined> = (action$: ActionsObservable<IndexActions>): Observable<IndexActions> =>
```
defines an **Epic** which takes in as the first type argument the `type` for the `Actions` the epic takes in (*and returns*), in this case `IndexActions` which we defined earlier, and as the second argument the type of the **State** it takes in (*which isn't needed this time, so undefined will do*). An **Epic** is a function that takes in a [stream](https://en.wikipedia.org/wiki/Stream_(computing)) (*in this case of the type `ActionsObservable`*) which includes items of the `type` given as the first type argument and returns another stream (*in this case an [`Observable`](http://reactivex.io/documentation/observable.html), which `ActionsObservable` is based on*) which includes items of the same `type` as the input stream.
> In JavaScript the convention is to append a `$` to all variables names that are **streams**, to let the developer know that they are dealing with one

The second line
```typescript
    action$.ofType(SET_DONE)
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
include the actual functionality of our **Epic**. In this case **after** we receive an **action** of the type `SET_DONE` we wait for 1 second (*`delay`takes milliseconds as argument*) and then we return an **action** of the type `SAVE_TODO_SUCCESS` (*in this case using [`mapTo`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-mapTo) as we just want to return a new **Action***).
> If you wanted to return multiple actions, say `SET_DONE_SUCCESS` and an imaginary `SEND_PUSH_NOTIFICATION` you could do it using [`mergeMap`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-mergeMap), which is kind of like `flatMap`, like so:
```typescript
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/mergeMap';
...
    action$.ofType(SET_DONE)
        .mergeMap((action: SetDoneAction) => Observable.from([
            setDoneSuccess(action.payload),
            // SEND_PUSH_NOTIFICATION,
            // OTHER ACTIONS,
        ]));
```

The other **Epic** is otherwirse similar, but it uses [`map`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-map)
```typescript
        .delay(1000)
        .map((action: SetDoneAction) => setDoneSuccess(action.payload));
```
to return an action of the type `SET_DONE_SUCCESS`, using the payload of the incoming action.

> If you wanted to do an AJAX call, you would go about it like this:
```typescript
import { ajax } from 'rxjs/observable/dom/ajax';
...
    action$.ofType(AJAX_CALL).mergeMap((action: AjaxCallAction) => {
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
const IndexReducer = (state: IndexState = new IndexState(), action: IndexActions = DefaultAction): IndexState => {
    switch (action.type) {
        case SET_TITLE:
            return { ...state, title: action.payload };
        case SAVE_TODO:
            return { ...state, loading: true };
        case SAVE_TODO_SUCCESS:
            return {
                ...state,
                title: '',
                todos: state.todos.concat(new Todo(state.todos.length + 1, state.title)),
                loading: false,
            };
        case SET_DONE:
            return { ...state, loading: true };
        case SET_DONE_SUCCESS:
            return {
                ...state,
                todos: state.todos.map(t => t.id === action.payload ? t.setDone() : t),
                loading: false,
            };
        default:
            return state;
    }
};
```
for which I suggest to break from the **redux-ducks** pattern by using the naming convention of `[Pagename]Reducer`. The important thing to remember with **reducers** is that they have to be [functional](https://en.wikipedia.org/wiki/Functional_programming), a.k.a. they are not allowed to mutate the incoming information or have side-effects.

On the first line we define the signature of our `IndexReducer`
```typescript
const IndexReducer = (state: IndexState = new IndexState(), action: IndexActions = DefaultAction): IndexState =>
```
where we define it to take to parameters (*as all **reducers***), our `IndexState` (*with a default for the empty state*) and an action. `IndexReducer` will also return an `IndexState` (*as all **reducers***).

Next we do the actual logic which all **reducers** are built upon
```typescript
    switch (action.type) {
        case SET_TITLE:
            return { ...state, title: action.payload };
        case SAVE_TODO:
            return { ...state, loading: true };
        case SAVE_TODO_SUCCESS:
            return {
                ...state,
                title: '',
                todos: state.todos.concat(new Todo(state.todos.length + 1, state.title)),
                loading: false,
            };
        case SET_DONE:
            return { ...state, loading: true };
        case SET_DONE_SUCCESS:
            return {
                ...state,
                todos: state.todos.map(t => t.id === action.payload ? t.setDone() : t),
                loading: false,
            };
        default:
            return state;
    }
```
which is a [`switch`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/switch)-statement over the type-property of the incoming **action**. In each `case` we do something (*except the `default`-one, where you traditionally just return the incoming **state***) to add value to that **action**, such as setting the `title` to the `payload` in the **action** in case the **action** is a `SET_TITLE`-action. Notice how we are using the [spread syntax](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator) to immutably create a new version of the state, thus holding true to the immutability of **reducers**.
> Other options are to use [`Object.assign({}, ...)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) or [Immutable](https://facebook.github.io/immutable-js/)

### Connecting the reducer

Remember our [root-reducer](/REDUX.md#reducer)? Now we connect our `IndexReducer` to it.

First the **reducer** itself
```typescript
import { combineReducers } from 'redux';
import IndexReducer from '../modulex/index/IndexReducer';

const reducer = combineReducers({
    index: IndexReducer,
});
```
where we add the `IndexReducer` under the key `index`, which is very important, as when `combineReducers` combines included **reducers** it will put their specific state under the key given, in the global **state**-object.

Next we add the `IndexState` to our global `State`-class (*this is just to allow us to define the type and initialize it for tests later on*)
```typescript
import { IndexState } from '../modules/index/IndexReducer';

export class State {
    readonly index: IndexState = new IndexState();
}
```
where we define that the global `State`-object has a property `index` of the type `IndexState` (*as our `combineReducer` already says, but we want to be explicit here*).

Then we want to add our **Epics** into the global `epics` constant
```typescript
import { combineEpics } from 'redux-observable';
import { IndexEpics } from '../modules/index/IndexReducer';

export const epics = combineEpics(IndexEpics);
```
by including it as a parameter to `combineEpics`.

Finally we add our `IndexActions` to the global `Actions`-type
```typescript
import { DefaultAction } from './utils';
import { IndexActions } from '../modules/index/IndexReducer';

export type Actions = DefaultAction | IndexActions;
```
where we say that `Actions` is a type where the value is either of a type of `DefaultAction` or one of the `IndexActions`.
