# Containers

Next up we want to bind our [Views](/VIEWS.md) to our [Reducers](/REDUCERS.md), a.k.a. define how we get the **props** from our [state](http://redux.js.org/docs/basics/Reducers.html).

### Initialize

First up we need to add a new dependency, [react-redux](https://github.com/reactjs/react-redux) to connect our **React** views to our **state**
```
yarn add react-redux
```
and the type definitions for it
```
yarn add -D @types/react-redux
```

### IndexContainer

We begin by creating a file called `IndexContainer.ts` inside our `index`-folder inside `src/modules`
> All containers will have the same "prefix" as their accompanied **views**, a.k.a. `[Pagename]Container.ts`

```typescript
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { State, Actions } from '../../redux/reducer';
import { setTitle, saveTodo, setDone } from './IndexReducer';
import IndexView, { IIndexState, IIndexDispatch, IIndexProps } from './IndexView';

const stateToProps = (state: State): IIndexState => ({
    title: state.index.title,
    todos: state.index.todos,
    loading: state.index.loading,
});

const dispatchToProps = (dispatch: Dispatch<Actions>): IIndexDispatch => ({
    setTitle: bindActionCreators(setTitle, dispatch),
    saveTodo: bindActionCreators(saveTodo, dispatch),
    setDone: bindActionCreators(setDone, dispatch),
});

export default connect<IIndexState, IIndexDispatch, IIndexProps>(stateToProps, dispatchToProps)(IndexView);
```

---

First we define a function to transform our [`State`](/REDUX.md#reducer) into the `IIndexState` required by our `IndexView`
```typescript
import { State } from '../../redux/reducer';
import { IIndexState } from './IndexView';

const stateToProps = (state: State): IIndexState => ({
    title: state.index.title,
    todos: state.index.todos,
    loading: state.index.loading,
});
```
where we get the required information from the `State` and return it with the correct key.

---

Next up we define a function to get the correct functions require by our `IndexView` e.g. `IIndexDispatch`
```typescript
import { bindActionCreators, Dispatch } from 'redux';
import { Actions } from '../../redux/reducer';
import { setTitle, saveTodo, setDone } from './IndexReducer';
import { IIndexDispatch } from './IndexView';

const dispatchToProps = (dispatch: Dispatch<Actions>): IIndexDispatch => ({
    setTitle: bindActionCreators(setTitle, dispatch),
    saveTodo: bindActionCreators(saveTodo, dispatch),
    setDone: bindActionCreators(setDone, dispatch),
});
```
where use the function [`bindActionCreator`](http://redux.js.org/docs/api/bindActionCreators.html) which allows us to simply call the bound function to create an `Action` and `dispatch` them to the `store`. Defining `dispatch` as type of `Dispatch<Actions>` allows us to specify that our `dispatch`-function will only dispatch actions of type `Actions` (*a.k.a. our own actions*).

---

Finally we bind it all using **react-redux's** [`connect`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
```typescript
import { connect } from 'react-redux';
import IndexView, { IIndexState, IIndexDispatch, IIndexProps } from './IndexView';

const stateToProps = ...
const dispatchToProps = ...

export default connect<IIndexState, IIndexDispatch, IIndexProps>(stateToProps, dispatchToProps)(IndexView);
```
where the first type argument is the type for the format we want to transform our **state** to (*in this case our `IIndexState`*), the second type argument is the format we want to transform the `dispatch`-function to (*in this case our `IIndexDispatch`*) and the last type argument is the type for the **props** our **view** expects. The first argument `connect` takes is a function to transform our **state** into the type of the first type argument and the second argument is a function to transform the `dispatch`-function into the second type argument (*here we also see for the first time a [curried function](https://en.wikipedia.org/wiki/Currying)*). The last argument is our **view** itself, which should be expecting **props** of the type of the third type argument.
