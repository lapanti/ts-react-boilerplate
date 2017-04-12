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

For the actual content inside the brackets you can think of it as "HTML on steroids", beginning, as is semantically correct with a [`main`](https://developer.mozilla.org/en/docs/Web/HTML/Element/main) tag
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

Next up we define the title and a form to add a new `Todo`
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
where we first define the title (*in this case a static string `Todo app`*). Next we define a form to create new `Todos` which introduces us to a lot of nice features of **React**, but first we do a little *"hack"* as we want to enable the user to press the `enter`-key when submitting a new `Todo` but we don't want to send the form to a new page, we set the value of `onSubmit` (*the handler for a form's submit method in React*) as `e => e.preventDefault()` where `e` is the event received and it's function `.preventDefault()` will (*as its name implies*) prevent the default functionality (*in this case send the form data to the current url, causing a reload*).

Next we define a label for the `input`-field utilizing **React**'s `htmlFor`-value which is an alias for the [for](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)-attribute. Then we define the actual `input`-field for inputting a `Todo`, which is a simple text `input`, but we also make it [autofocus](https://developer.mozilla.org/en/docs/Web/HTML/Element/input) (*if you open the page, you can start typing into it directly*) and make it a [controlled component](https://facebook.github.io/react/docs/forms.html#controlled-components), meaning that whenever the value of `title` changes, the `input` will also update. We also add the `onChange`-listener to actually set the new `title` the user has typed in. Finally we create a simple `Button` (*we defined earlier in [components](/COMPONENTS.md#button)*) to submit the form.

---

Finally we want to of course show all the `Todo`s created
```typescript
    <main className="index">
        ...
        <section className="index__todo-container">
            {todos.map(t => <TodoComponent todo={t} setDone={setDone} key={t.id} />)}
        </section>
    </main>
```
where we first encapsulate it into a semantic tag called [`section`](https://developer.mozilla.org/en/docs/Web/HTML/Element/section). Then we want to create a new `TodoComponent` (*as we defined in [components](/COMPONENTS.md#todocomponent)*) for every `Todo` in our current state, which can be achieved by a simple [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) (*I highly recommend getting to know all the major Array-functions*). Here you want to also remember to add a property for our `TodoComponent` it isn't expecting to receive: [`key`](https://facebook.github.io/react/docs/lists-and-keys.html) which **React** uses to distinguish between tags in a list (*it has to be unique inside the list*).

### <a name="alternatives">Alternatives</a>

- If you want something a bit simpler you can try [Vue.js](https://vuejs.org/)
- Or the classic [jQuery](https://jquery.com/)
