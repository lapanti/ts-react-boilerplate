# Common

We will begin with the simplest piece, common (or shared) code. This will also serve as a good introduction to [TypeScript](https://www.typescriptlang.org/).

### <a name="initialize">Initialize</a>

We will begin by creating the structure and installing the necessary dependencies (make sure you have [Yarn](https://yarnpkg.com/lang/en/) installed). Open up your console in the directory you want to build your application in and run the following commands:

1. Initialize the Yarn-project and answer the prompts according to your application:
```
yarn init
```
2. Add the necessary dependencies, [TypeScript](https://www.typescriptlang.org/) and [TSLint](https://palantir.github.io/tslint/) (for code quality checks, a.k.a. linting). When you add dependencies in **Yarn** they will be saved to your `package.json` and **Yarn** will create a `yarn.lock` file to manage the versions of those dependencies. The flag `-D` saves them as `devDependencies` which will not be utilized when running the system in production.
```
yarn add -D typescript tslint
```
3. Open your project in an editor like [Visual Studio Code](https://code.visualstudio.com/) or [Atom](https://atom.io/), though I recommend **Visual Studio Code** as it has [IntelliSense](https://en.wikipedia.org/wiki/Intelligent_code_completion).
4. Create the file `Todo.ts` inside a folder called `common` which will in turn be inside `src` that is located at the root of your application.

### Configuring TypeScript

Next we will configure **TypeScript** by creating a file in the root folder called [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html). `tsconfig.json` indicates to **TypeScript** that the folder is a **TypeScript** project. Start by writing the following content into your `tsconfig.json`:
```json
{
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es5",
        "moduleResolution": "node"
    },
    "files": [
        "src/**/*.ts"
    ]
}
```

On the first row
```json
    "compilerOptions": {
```
we start by defining the [compilerOptions](https://www.typescriptlang.org/docs/handbook/compiler-options.html).

The first rule we set
```json
        "noImplicitAny": true,
```
is `noImplicitAny` which will enforce the use of type declarations (more about those later) when the type would otherwise be inferred as `any`.

The second rule
```json
        "target": "es5",
```
defines the target ECMAScript version (in this case [ES5](https://kangax.github.io/compat-table/es5/)) for the compiled JavaScript files.

In the third line
```json
        "moduleResolution": "node"
```
we set the [moduleResolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html) mode for the **TypeScript** compiler as `node`, which allows the importing of dependencies from the folder `node_modules` (*where Yarn saves them by default*) by using non-relative imports. 

---

On the sixth line
```json
    "files": [
```
we set the files **TypeScript** will compile.

In this case we use a [glob pattern](https://en.wikipedia.org/wiki/Glob_(programming)) to indicate the **TypeScript** files on the seventh line.
```json
        "src/**/*.ts"
```
This glob will match all files in the `src` folder (recursively) with the extension `.ts`.

### Start coding

We will begin by creating a class that defines our Todo-items. A Todo should have an id (to differentiate between todos), a title (tha actual todo) and information on whether the todo has been completed or not. Here we see the benefit of using **TypeScript**, as it allows us to define the actual information contained in a Todo (in plain JavaScript and all other dynamically typed languages you as a developer have to keep track of such things). I'll first show you the class in its simplest form and then explain what each keyword means.

```typescript
export default class Todo {
    readonly id: number;
    readonly title: string;
    readonly done: boolean;
}
```

---

On the first line
```typescript
export default class Todo {
```
we first define that this `class` is the default export (`export default`) of our module, which means that in other files we can write
```typescript
import Todo from '../path/to/Todo.ts'
```
instead of (just writing `export`)
```typescript
import { Todo } from '../path/to/Todo.ts'
```
to get a hold of our new `Todo`-class.
> Remember that a module can only have one default export.

After the export-clause we define the `class Todo`. In **TypeScript** a [class](https://www.typescriptlang.org/docs/handbook/classes.html) is something you can instantiate (create an instance of), and that can inherit other classes (have their properties as well).

---

On the second line
```typescript
    readonly id: number;
```
we define our first property for the `class Todo`. The first word [readonly](https://basarat.gitbooks.io/typescript/docs/types/readonly.html) defines the property as something that is [immutable](https://en.wikipedia.org/wiki/Immutable_object) and from now on **TypeScript** a `class` will give you an error if you try to change the value of a `Todo`'s `number`-field. The second word `id` is the name of the property (so later on we can access it by calling `myInstanceOfTodo.id`). The last word here is the [type](https://www.typescriptlang.org/docs/handbook/basic-types.html) of the property, meaning what kind of information the property can hold, in this case a `number` (this particular type doesn't care if it is a whole number or a floating one).

---

The two following lines
```typescript
    readonly title: string;
    readonly done: boolean;
```
are otherwise the same as the first one, except the property `title` has a **type** of `string`, meaning it's an arbitrary sequence of letters and characters and the property `done` has a **type** of `boolean`, meaning that its value is either `true` or `false`.

---

Congratulations, you have now created your very first **TypeScript** `class`!

### Linting

It's time to start linting your code by using [TSLint](https://palantir.github.io/tslint/). Let's begin by creating a [Yarn script](https://yarnpkg.com/lang/en/docs/cli/run/) to run **TSLint**:
```json
// In package.json
"scripts": {
    "lint:ts": "tslint 'src/**/*.{ts,tsx}'"
}
```
The lint command can now be run with `yarn run lint:ts`. This will now run **TSLint** with its default settings. However, that might not always be enough for you and if you want to define the rules for your own codebase more accurately, you can create a `tslint.json` in the root folder and populate it with rules according to [TSLint rules](https://palantir.github.io/tslint/rules/). For example in the boilerplate the `tslint.json` looks like that:
```json
{
    "rules": {
        "no-any": false, // Allows use of any as a type declaration
        "no-magic-numbers": true, // Disallow magic numbers
        "only-arrow-functions": [true], // Enforces the use of arrow functions instead of the traditional syntax
        "curly": true, // Enforces curly braces in all ifs/fors/dos/whiles
        "no-var-keyword": true, // Enforces the use of the new keywords let and const instead of the old var
        "triple-equals": true, // Enforces the use of triple equals instead of double equals in conditionals
        "indent": ["spaces"], // Enforces indentation using spaces instead of tabs
        "prefer-const": true, // Enforces the use of const unless let is needed
        "semicolon": [true, "always"], // Enforces that all lines should end in a semicolon
        "eofline": true, // Enforces an empty line at the end of file
        "trailing-comma": [true, { "multiline": "always", "singleline": "never" }], // Enforces a comma at the end of all parameters that end in a new line
        "arrow-return-shorthand": [true], // Suggests one to use shorthand arrow functions when possible
        "class-name": true, // Enforces PascalCased class names
        "interface-name": [true, "always-prefix"], // Enforces all interfaces to follow PascalCasing and be prefixed with I
        "quotemark": [true, "single"] // Enforces the use of single quotation marks
    }
}
```

### Alternatives

Below you can find alternatives to TypeScript, if you don't fancy it as much as I do:
- [Flow](http://simplefocus.com/flowtype/)
- [PureScript](http://www.purescript.org/)
