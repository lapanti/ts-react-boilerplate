# Components

Next we will start writing out our components. This will serve as a good introduction to [React](https://facebook.github.io/react/).

### Initialize

1. First we will add the needed dependencies for developing a **React** application:
```
yarn add react
```
2. And the needed developer dependencies for **React** development (with [TypeScript](https://www.typescriptlang.org/)):
```
yarn add -D @types/react tslint-react
```
The package `@types/react` gives us type definitions for **React** and [tslint-react](https://github.com/palantir/tslint-react) allows us to use [TSLint](https://palantir.github.io/tslint/) to lint our **React** components.

### Configuring for React

First we will configure **TypeScript** to work with [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html) by adding the following line to our [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html):
```json
{
    "compilerOptions": {
        "jsx": "react",
        // Rest of the compiler options
    }
    // Rest of the config file
}
```
As we are not using another transformation step setting [jsx](https://www.typescriptlang.org/docs/handbook/jsx.html) to the value of `react` will emit the actual JavaScript after compilation.

---

To use **tslint-react** we add the following lines to the file `tslint.json`:
```json
{
    "extends": ["tslint-react"], // This will allow us to use tslint-react-specific rules
    "rules": {
        "jsx-no-lambda": false, // This disallows the definition of functions inside a React Component's render-function
        // The rest of the rules
        "quotemark": [true, "single", "jsx-double"] // We added "jsx-double" here to denote that in JSX one should use double quotation marks.
    }
}
```

### Button

We will start with the simplest component that utilizes all the tools we need for most components, a `Button`, so go ahead and create a file `Button.tsx` (*the extension defines the file as a TypeScript-file that has JSX in it*) in the folder `components`:

```typescript
import * as React from 'react';

interface IButtonProps {
    click(): void;
    readonly text: string;
}

const Button: React.StatelessComponent<IButtonProps> = ({ click, text }) => (
    <input className="btn" type="submit" onClick={() => click()} value={text} />
);

export default Button;
```

In the first row
```typescript
import * as React from 'react';
```
we import all the functionalities provided by **React** under the name `React` (`* as React`), including the ability to write JSX (*those things that look like HTML*).

---

On the third to sixth rows
```typescript
interface IButtonProps {
    click(): void;
    readonly text: string;
}
```
we define an [interface](https://www.typescriptlang.org/docs/handbook/interfaces.html) to denote the [properties](https://facebook.github.io/react/docs/components-and-props.html) (*or props for short*) our **component** accepts (*and in this case needs*). `click()` defines a function, which will be known as `click` inside our `Button` and as we have only defined that it takes no arguments, we also tell the compiler that we don't care if it returns anything, just that it can be called, using the return type of `void`. `readonly text: string` on the other hand defines a [readonly](https://basarat.gitbooks.io/typescript/docs/types/readonly.html) (*an immutable property*) called `text` inside our `Button`, that is of the type [string](https://www.typescriptlang.org/docs/handbook/basic-types.html).
> **Interfaces** are shapes we define, meaning that we do not care what the actual implementation is, just that it has those types of values with those names. They cannot be instantiated as such and thus cannot contain default values like [classes](https://www.typescriptlang.org/docs/handbook/classes.html).

---

On the eighth to tenth rows
```typescript
const Button: React.StatelessComponent<IButtonProps> = ({ click, text }) => (
    <input className="btn" type="submit" onClick={() => click()} value={text} />
);
```
we define a [constant](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) (an immutable variable) called `Button` which is of the type [React.StatelessComponent<IButtonProps>](https://hackernoon.com/react-stateless-functional-components-nine-wins-you-might-have-overlooked-997b0d933dbc), meaning it is a [React component](https://facebook.github.io/react/docs/react-component.html), which does not have an internal [state](https://facebook.github.io/react-native/docs/state.html), but only **props** of type `IButtonProps`. [Stateless components](https://hackernoon.com/react-stateless-functional-components-nine-wins-you-might-have-overlooked-997b0d933dbc) in **React** only need to define their [render](https://facebook.github.io/react/docs/react-api.html)-method and using an [ES6 arrow function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) and a [destructuring assignment](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) we can return JSX with our **props** already defined as simple variables (*in this case "click" and "text"*). The actual return here is a simple HTML [input](https://facebook.github.io/react/docs/forms.html) element with a class of `btn` (*in React you define classes with the property "className"*), a type of `submit`, an [`onClick`-handler](https://facebook.github.io/react/docs/handling-events.html) that will simply call the `click`-property and a value of `text` (*in submit buttons the value is the text in the button*).
> You need to surround JSX with normal braces.

---

And finally on the twelfth row
```typescript
export default Button;
```
we export our `Button` as the default export of the module.

### TodoComponent

Next we will define a component to visualize our `Todo`-class from the previous section, creating a file called `TodoComponent.tsx` in the `components`-folder:
```typescript
import * as React from 'react';
import Todo from '../common/Todo';

export interface ITodoComponent {
    readonly todo: Todo;
    setDone(i: number): void;
}

const TodoComponent: React.StatelessComponent<ITodoComponent> = ({ todo, setDone }) => (
    <div className="todo">
        <input
            className="todo__checkbox"
            type="checkbox"
            checked={todo.done}
            onChange={() => !todo.done && setDone(todo.id)}
        />
        <span className="todo__number">{todo.id}:</span>
        <span className="todo__title">{todo.title}</span>
    </div>
);

export default TodoComponent;
```
which is mostly very similar to our `Button`. The biggest differences here are the second import
```typescript
import Todo from '../common/Todo';
```
which imports our `Todo`-class using a relative path (*the compiler will look for the file relative to the current file*) and the second property in our `interface`
```typescript
    setDone(i: number): void;
```
which defines a function called `setDone` that takes one argument, which is a `number`.

### Loader

Lastly we implement our third and simplest component, called a `Loader`, in a file called `Loader.tsx` in the `components`-directory
```typescript
import * as React from 'react';

const Loader: React.StatelessComponent<undefined> = () => (
    <div className="loader">
        <div className="loader__spinner" />
    </div>
);

export default Loader;
```
which uses all previously introduced tools, except this time we have defined the **props** it receives as [undefined](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html), meaning that it does not take any **props** at all.

### Alternatives

Below you can find alternatives to **React**, although I would suggest **React** unless you have specific needs, which other frameworks solve better, as it also allows for [mobile development with React Native](https://facebook.github.io/react-native/).
- [AngularJS](https://angularjs.org/), possibly the most popular framework after [React](https://facebook.github.io/react/)
- [elm](http://elm-lang.org/), a functional alternative
- [Cycle.js](https://cycle.js.org/), a functional reactive alternative
