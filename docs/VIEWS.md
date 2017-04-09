# Views

Now we are ready to start working towards the beef of the application: different pages (or views).

### <a name="begin">Begin</a>

We will begin by creating a file called `IndexView.tsx` (*remember that 'x' in the end of the file type means that it contains [jsx](https://facebook.github.io/react/docs/jsx-in-depth.html)*) inside a folder called `index` inside the `components`-folder:
> All of our pages will be inside folders named after the view, in this case **Index**

```typescript
import * as React from 'react';
import Todo from '../../common/Todo';
import TodoComponent from '../../components/TodoComponent';
import Button from '../../components/Button';
import Loader from '../../components/Loader';

interface IIndexState {
    title: string;
    todos: Todo[];
    loading: boolean;
}

interface IIndexDispatch {
    setTitle(n: string);
    saveTodo();
    setDone(i: number);
}

type IIndexProps = IIndexState & IIndexDispatch;

const IndexView: React.StatelessComponent<IIndexProps> = ({ title, todos, loading, setTitle, saveTodo, setDone }) => (
    <main className="index">
        {loading && <Loader />}
        <h1 className="index__header">Todo app</h1>
        <form className="index__form" onSubmit={e => e.preventDefault()}>
            <label className="index__form__label" htmlFor="newtodo">Add a new todo:</label>
            <input
                className="index__form__input"
                name="newtodo"
                type="text"
                autoFocus={true}
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <Button click={saveTodo} text="Add" />
        </form>
        <br />
        <section className="index__todo-container">
            {todos.map(t => <TodoComponent todo={t} setDone={setDone} key={t.id} />)}
        </section>
    </main>
);

export default IndexView;
```

---

The first [interface](https://www.typescriptlang.org/docs/handbook/interfaces.html) we declare, called `IIndexState`
```typescript
import Todo from '../../common/Todo';
interface IIndexState {
    title: string;
    todos: Todo[];
    loading: boolean;
}
```
is an `interface` that holds the "state"-values for our `View`, e.g. the stuff that defines what is shown to the user, in this case a title (*the title of the current `Todo` being created*), a list of `Todo`s (*the current `Todo`s*) and a boolean that indicates whether or not some kind of [AJAX](https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started)-call is currently running.

---

The second `interface` we declare, called `IIndexDispatch`
```typescript
interface IIndexDispatch {
    setTitle(n: string);
    saveTodo();
    setDone(i: number);
}
```
is an `interface` that holds all the "dispatch"-functions for our `View`, e.g. all the functionality that our users can trigger, in this case a function (`setTitle(n: string)`) to change the current `title` (*that takes a string as an argument*), a function (`saveTodo()`) to save the new `Todo` and a function (`setDone(i: number)`) to set an existing `Todo` as done (*that takes the number of the `Todo` as argument*).

---

Together `IIndexState` and `IIndexDispatch` form the type `IIndexProps`
```typescript
type IIndexProps = IIndexState & IIndexDispatch;
```
which is the definition of all the [props](https://facebook.github.io/react/docs/components-and-props.html) our `IndexView` will need to function.
> The `IIndexState & IIndexDispatch` part defines that the type called `IIndexProps` is an [intersection](https://www.typescriptlang.org/docs/handbook/advanced-types.html) of those two interfaces, meaning that to fulfill the type, the object needs to have all values present in both of the aforementioned interfaces.

---

And now we get to the beef of it all, starting with declaring the actual `IndexView`
```typescript
import * as React from 'react';
const IndexView: React.StatelessComponent<IIndexProps> = ({ title, todos, loading, setTitle, saveTodo, setDone }) => (
);
```
in which we declare a [constant](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) called `IndexView` which is of the type [`React.StatelessComponent<IIndexProps>`](https://hackernoon.com/react-stateless-functional-components-nine-wins-you-might-have-overlooked-997b0d933dbc). `React.StatelessComponent<T>` is a type of **React Component** that does not have an internal state, only **props** and can be declared as a function that returns `jsx`, where the type of **props** received is put inside the angle brackets (*where `T` is now*).
> These kinds of declarations are called [type arguments or generics](https://www.typescriptlang.org/docs/handbook/generics.html), which allow you to define a function without knowing beforehand what the type of the argument or return value is.

After declaring the **const** we define `IndexView` to be a function, that fulfills the [render](https://facebook.github.io/react/docs/react-api.html) function, i.e. takes in an object containing the declared properties (*using [object destructuring](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) so we don't have to write `something.title`, instead of `title`*) and returns `jsx` encapsulated in the brackets.

---

For the actual content inside the brackets you can think of it as "HTML on steroids", beginning, as is semantically correct with a `main` tag
```typescript
    <main className="index">
    </main>
```
which will hold all the content of our `IndexView` (*and here we begin the introduction of [BEM](http://getbem.com/naming/)-naming*).

---

Next is our first tag that is different with different props
```typescript
import Loader from '../../components/Loader';
...
    <main className="index">
        {loading && <Loader />}
    </main>
```
which means, that depending if the **prop** `loading` is true (*using [logical operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators)-shorthand that returns the right hand-side if the both sides evaluate as true*), we want to **render** the `Loader`-component we defined earlier in the [Components](/COMPONENTS.md) section.

---


```typescript
    <main className="index">
    ...

        <h1 className="index__header">Todo app</h1>
        <form className="index__form" onSubmit={e => e.preventDefault()}>
            <label className="index__form__label" htmlFor="newtodo">Add a new todo:</label>
            <input
                className="index__form__input"
                name="newtodo"
                type="text"
                autoFocus={true}
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <Button click={saveTodo} text="Add" />
        </form>
    </main>
```
