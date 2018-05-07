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

### HNClientContainer

We begin by creating a file called `HNClientContainer.ts` inside our `index`-folder inside `src/modules`
> All containers will have the same "prefix" as their accompanied **views**, a.k.a. `[Pagename]Container.ts`

```typescript
import { connect } from 'react-redux';
import { State } from '../../redux/reducer';
import { setTitle, saveTodo, setDone } from './HNClientReducer';
import HNClientView, { IHNClientState, IHNClientDispatch, IHNClientProps } from './HNClientView';

const stateToProps = (state: State): IHNClientState => ({
    title: state.index.title,
    todos: state.index.todos,
    loading: state.index.loading,
});

export default connect<IHNClientState, IHNClientDispatch, IHNClientProps>(stateToProps, {
    setTitle,
    saveTodo,
    setDone,
})(HNClientView);
```

---

First we define a function to transform our [`State`](/REDUX.md#reducer) into the `IHNClientState` required by our `HNClientView`
```typescript
import { State } from '../../redux/reducer';
import { IHNClientState } from './HNClientView';

const stateToProps = (state: State): IHNClientState => ({
    title: state.index.title,
    todos: state.index.todos,
    loading: state.index.loading,
});
```
where we get the required information from the `State` and return it with the correct key.

---

Thanks to a shorthand in `react-redux` we can just define the actions we need in the component by putting them in an object as the second argument for `connect`
```typescript
import { connect } from 'react-redux';
import { setTitle, saveTodo, setDone } from './HNClientReducer';
import { IHNClientState, IHNClientDispatch, IHNClientProps } from './HNClientView';

export default connect<IHNClientState, IHNClientDispatch, IHNClientProps>(stateToProps, {
    setTitle,
    saveTodo,
    setDone,
})
```
where `connect` uses internally the function [`bindActionCreators`](http://redux.js.org/docs/api/bindActionCreators.html) for each action in the object and passes them on as functions that dispatch automatically. They will be named the same as they are in the object, so for example `setTitle` will be accessible as `this.props.setTitle` in the component.

---

Finally we bind it all using **react-redux's** [`connect`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
```typescript
import { connect } from 'react-redux';
import { setTitle, saveTodo, setDone } from './HNClientReducer';
import HNClientView, { IHNClientState, IHNClientDispatch, IHNClientProps } from './HNClientView';

const stateToProps = ...

export default connect<IHNClientState, IHNClientDispatch, IHNClientProps>(stateToProps, {
    setTitle,
    saveTodo,
    setDone,
})(HNClientView);
```
where the first type argument is the type for the format we want to transform our **state** to (*in this case our `IHNClientState`*), the second type argument is the format we want to transform the `dispatch`-function to (*in this case our `IHNClientDispatch`*) and the last type argument is the type for the **props** our **view** expects. The first argument `connect` takes is a function to transform our **state** into the type of the first type argument and the second argument is a function to transform the `dispatch`-function into the second type argument (*here we also see for the first time a [curried function](https://en.wikipedia.org/wiki/Currying)*). The last argument is our **view** itself, which should be expecting **props** of the type of the third type argument.
