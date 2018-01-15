# Testing

Even though this part was left as the last one, it is one of the most important parts of a software project and this will only be one way of doing tests.

### Initialize

For our testing framework we are going to use [Jest](https://facebook.github.io/jest/), with [Enzyme](https://github.com/airbnb/enzyme) for [BDD testing](https://en.wikipedia.org/wiki/Behavior-driven_development), [enzyme-to-json](https://github.com/adriantoine/enzyme-to-json) for [snapshot testing](https://facebook.github.io/jest/docs/snapshot-testing.html), [ts-jest](https://github.com/kulshekhar/ts-jest) so **Jest** plays nice with **TypeScript** and [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) for rendering **React**-components. Because of the new adapters in **Enzyme** we also need to add the appropriate [adapter](https://github.com/airbnb/enzyme/tree/master/packages/enzyme-adapter-react-16#upgrading-from-enzyme-2x-or-react--16) (in our case for **React** version 16) and finally we also add a little tool called [concurrently](https://github.com/kimmobrunfeldt/concurrently) to allow the simultaneous running of multiple **NPM** or **Yarn** scripts at the same time
```
    yarn add -D jest ts-jest enzyme enzyme-to-json react-test-renderer enzyme-adapter-react-16 concurrently
```

### setup.js

As **Enzyme** requires the adapter for **React** and on top of that error messages related to HTTP-calls can sometimes be incomprehensible, we need to create a small setup file to fix these things, so create a file called `setup.js` in `src/jest`-folder and fill it as follows:
```javascript
// Import adapter for enzyme
var enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');
enzyme.configure({ adapter: new Adapter() })

// Log all jsDomErrors when using jsdom testEnvironment
window._virtualConsole && window._virtualConsole.on('jsdomError', function (error) {
  console.error('jsDomError', error.stack, error.detail);
});
```

After that we need to register it for **Jest** so open up your `package.json` and add the following:
```json
    "jest": {
        // Other content in the "jest"-object
        "setupTestFrameworkScriptFile": "<rootDir>/src/jest/setup.js"
    }
```

### Linting

Let's start with the easiest part, linting our codebase. For the **TypeScript** code we already have our linting script setup under `lint:ts`.

For our **Sass** files it will be simply
```json
    "scripts": {
        "lint:sass": "sass-lint src/**/*.scss -v --max-warnings 1",
    }
```
by running **sass-lint** on the files mathing our **glob pattern**, adding the `v`-flag for verbose output and `max-warnings` to only allow for one warning (*you can omit it if you dare*).

### TS-Jest and enzyme-to-json

We will also need to make some setting for **Jest** in our `package.json` to use **ts-jest** and **enzyme-to-json** with our code
```json
    "jest": {
        "snapshotSerializers": ["<rootDir>/node_modules/enzyme-to-json/serializer"],
        "transform": {
            ".(ts|tsx)": "<rootDir>/node_modules/ts-jest/preprocessor.js"
        },
        "testRegex": "(/__specs__/.*|\\.(spec))\\.(ts|tsx)$",
        "moduleFileExtensions": ["ts", "tsx", "js"]
    }
```
where the first setting `snapshotSerializers` sets **Jest** to use **enzyme-to-json** for serializing, `testRegex` makes it so that **Jest** looks for tests in folders named `__specs__` with the extension `spec.ts` or `spec.tsx` and the rest are there so that it uses **TS-Jest** to build the code.

### Button

We will start with one of the simple components, in this case the `Button`. With all our tests we will follow the convention of having the tests in a folder next to the testable code called `__specs__` named `[TestableCode].spec.ts` or `*.tsx` if it includes **JSX** like this
```
src/
-- components/
-- -- __specs__/
-- -- -- Button.spec.tsx
-- -- Button.tsx
```

Now the actual content of `Button.spec.tsx` will look like this
```typescript
import * as React from 'react';
import { shallow } from 'enzyme';
import Button from '../Button';

describe('Button', () => {
    const click = jest.fn();
    const wrapper = shallow(<Button click={click} text="" />);

    it('should render correctly', () => (
        expect(wrapper).toMatchSnapshot()
    ));

    it('should call the correct function on click', () => {
        const testTimes = 5;
        for (let i = 0; i < testTimes; i++) {
            wrapper.find('.btn').simulate('click');
        }
        expect(click).toHaveBeenCalledTimes(testTimes); 
    });
});
```

---

Going through it line by line, the first line of importance is creating a `describe`-block
```typescript
describe('Button', () => {});
```
which **Jest** uses to group tests together (*in this case all tests related to 'Button'*).

---

After that we create a [mocked function](https://facebook.github.io/jest/docs/mock-functions.html) that will allow us to test how many times the function has been called, what values it was called with etc.
```typescript
    const click = jest.fn();
```

---

Next we create a [shallow render](https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md) of the `Button`
```typescript
import * as React from 'react';
import { shallow } from 'enzyme';
import Button from '../Button';
// ...
    const button = shallow(<Button click={click} text="" />);
```
which will allow us to do snapshot testing and to simulate user interaction.

---

First we test our `Button`'s snapshot (*to ensure we don't accidentally change the way it looks like*)
```typescript
    it('should render correctly', () => (
        expect(wrapper).toMatchSnapshot()
    ));
```
which will create a snapshot-file inside a folder `__snapshots__` which you should include in your version control, as it will compare the render to the file if it exists.
> `it`-clauses are **Jest**'s tests and `expect` defines something to test

---

Finally we simulate user interaction and ensure it has the correct result
```typescript
    it('should call the correct function on click', () => {
        const testTimes = 5;
        for (let i = 0; i < testTimes; i++) {
            wrapper.find('.btn').simulate('click');
        }
        expect(click).toHaveBeenCalledTimes(testTimes); 
    });
```
where we first define the number of times we want to simulate a click, then using `find` (*which takes a CSS-selector to find the correct HTML-element*) we simulate a `click`-event and test that the mock function was called the correct amount of times.

### Loader

Next up we create a simple snapshot test for our `Loader`-component
```typescript
import * as React from 'react';
import { shallow } from 'enzyme';
import Loader from '../Loader';

describe('Loader', () => (
    it('should render correctly', () => (
        expect(shallow(<Loader />)).toMatchSnapshot()
    ))
));
```
where everything is very similar to the `Button`-tests.

### TodoComponent

Then for our last component `TodoComponent` we do, once again, similar tests
```typescript
import * as React from 'react';
import { shallow } from 'enzyme';
import TodoComponent from '../TodoComponent';
import Todo from '../../common/Todo';

describe('TodoComponent', () => {
    const testTodo1 = new Todo(1, 'Title');
    const testTodo2 = new Todo(0, 'Testing', true);
    const setDone = jest.fn();
    const wrapper1 = shallow(<TodoComponent todo={testTodo1} setDone={setDone} />);
    const wrapper2 = shallow(<TodoComponent todo={testTodo2} setDone={setDone} />);

    it('should render correctly', () => {
        expect(wrapper1).toMatchSnapshot();
        expect(wrapper2).toMatchSnapshot();
    });

    it('should call setDone correctly', () => {
        wrapper1.find('.todo__checkbox').simulate('change');
        expect(setDone).toBeCalledWith(testTodo1.id);
        expect(setDone).toHaveBeenCalledTimes(1);
        wrapper2.find('.todo__checkbox').simulate('change');
        expect(setDone).toBeCalledWith(testTodo2.id);
        expect(setDone).toHaveBeenCalledTimes(1);
    });
});
```
where the only difference is that we create two renders and as the `setDone` function shouldn't be called when the **Todo** is already done we ensure that it behaves as such.

### PageNotFound

For `PageNotFound` we only need to make a simple snapshot-test
```typescript
import * as React from 'react';
import { shallow } from 'enzyme';
import PageNotFound from '../PageNotFound';

describe('PageNotFound', () => (
    it('should render correctly', () => (
        expect(shallow(<PageNotFound />)).toMatchSnapshot()
    ))
));
```

### IndexView

Next up we create tests for our `IndexView`
```typescript
import * as React from 'react';
import { shallow } from 'enzyme';
import IndexView from '../IndexView';
import Todo from '../../../common/Todo';

describe('IndexView', () => {
    const testTodo1 = new Todo(0, 'title');
    const testTodo2 = new Todo(1, 'testing', true);
    const testTitle = 'A title';
    const testSetTitle = jest.fn();
    const testSaveTodo = jest.fn();
    const testSetDone = jest.fn();
    const wrapperMinimalProps = shallow((
        <IndexView
            title=""
            todos={[]}
            loading={false}
            setTitle={testSetTitle}
            saveTodo={testSaveTodo}
            setDone={testSetDone}
            match={{ params: undefined, isExact: true, path: '', url: '' }}
            location={{ pathname: '', search: '', state: {}, hash: '', key: '' }}
            history={createHistory()}
        />
    ));
    const wrapperMaximumProps = shallow((
        <IndexView
            title={testTitle}
            todos={[testTodo1, testTodo2]}
            loading
            setTitle={testSetTitle}
            saveTodo={testSaveTodo}
            setDone={testSetDone}
            match={{ params: undefined, isExact: true, path: '', url: '' }}
            location={{ pathname: '', search: '', state: {}, hash: '', key: '' }}
            history={createHistory()}
        />
    ));

    it('should render with correct props', () => {
        expect(wrapperMinimalProps).toMatchSnapshot();
        expect(wrapperMaximumProps).toMatchSnapshot();
    });

    it('should call the correct functions when typing to input field', () => {
        const testValue = 'A_TEST_VALUE';
        wrapperMinimalProps.find('[type="text"]').simulate('change', { target: { value: testValue }});
        expect(testSetTitle).toBeCalledWith(testValue);
    });
});
```
which is a bit more complex, but in essence built on the same things our previous tests were.

---

The biggest difference here is that for the simulation function
```typescript
    it('should call the correct functions when typing to input field', () => {
        const testValue = 'A_TEST_VALUE';
        wrapperMinimalProps.find('[type="text"]').simulate('change', { target: { value: testValue }});
        expect(testSetTitle).toBeCalledWith(testValue);
    });
```
where we give the `change` function a value to send with the event and test that it goes to the correct function.

### IndexReducer

For the `IndexReducer` we are not going to use **enzyme**, but rather normal **Jest** functions
```typescript
import { ActionsObservable } from 'redux-observable';
import Todo from '../../../common/Todo';
import IndexReducer, {
    SET_TITLE,
    setTitle,
    SetTitleAction,
    SAVE_TODO,
    saveTodo,
    SaveTodoAction,
    saveTodoEpic,
    SAVE_TODO_SUCCESS,
    saveTodoSuccess,
    SaveTodoSuccessAction,
    SET_DONE,
    setDone,
    SetDoneAction,
    setDoneEpic,
    SET_DONE_SUCCESS,
    setDoneSuccess,
    SetDoneSuccessAction,
    IndexState,
} from '../IndexReducer';

describe('IndexReducer', () => {
    it('should set the correct title as payload on setTitle', () => {
        const payload = 'THIS_IS_A_TEST_TITLE';
        const setTitleAction: SetTitleAction = setTitle(payload);
        expect(setTitleAction).toEqual({ type: SET_TITLE, payload });
        const newState: IndexState = IndexReducer(undefined, setTitleAction);
        expect(newState.title).toEqual(payload);
    });

    it('should set the correct values on saveTodo', () => {
        const saveTodoAction: SaveTodoAction = saveTodo();
        expect(saveTodoAction).toEqual({ type: SAVE_TODO });
        const newState: IndexState = IndexReducer(undefined, saveTodoAction);
        expect(newState.loading).toBeTruthy();
    });

    it('should trigger the correct action on saveTodoEpic', async () => (
        await saveTodoEpic(ActionsObservable.of(saveTodo()), undefined)
            .forEach(actionReceived => expect(actionReceived).toEqual({ type: SAVE_TODO_SUCCESS }))
    ));

    it('should set the correct values on saveTodoSuccess', () => {
        /* tslint:disable:no-magic-numbers */
        const testT = new Todo(1, 'Doing', true);
        const initialState: IndexState = { title: 'TEST', todos: [testT], loading: true };
        const saveTodoSuccessAction: SaveTodoSuccessAction = saveTodoSuccess();
        expect(saveTodoSuccessAction).toEqual({ type: SAVE_TODO_SUCCESS });
        const newState: IndexState = IndexReducer(initialState, saveTodoSuccessAction);
        expect(newState.title).toEqual('');
        expect(newState.todos.length).toEqual(2);
        expect(newState.todos[1].done).toBeFalsy();
        expect(newState.todos[1].id).toEqual(2);
        expect(newState.todos[1].title).toEqual(initialState.title);
        expect(newState.loading).toBeFalsy();
        /* tslint:enable:no-magic-numbers */
    });

    it('should set the correct values on setDone', () => {
        const setDoneAction: SetDoneAction = setDone(0);
        expect(setDoneAction).toEqual({ type: SET_DONE, payload: 0 });
        const newState: IndexState = IndexReducer(undefined, setDoneAction);
        expect(newState.loading).toBeTruthy();
    });

    it('should trigger the correct action on setDoneEpic', async () => (
        await setDoneEpic(ActionsObservable.of(setDone(0)), undefined)
            .forEach(actionReceived => expect(actionReceived).toEqual({ type: SET_DONE_SUCCESS, payload: 0 }))
    ));

    it('should set the correct values on setDoneSuccess', () => {
        const initialState: IndexState = { title: '', todos: [new Todo(0, '')], loading: true };
        const setDoneSuccessAction: SetDoneSuccessAction = setDoneSuccess(0);
        expect(setDoneSuccessAction).toEqual({ type: SET_DONE_SUCCESS, payload: 0 });
        const newState: IndexState = IndexReducer(initialState, setDoneSuccessAction);
        expect(newState.loading).toBeFalsy();
        expect(newState.todos[0].done).toBeTruthy();
        expect(newState.todos[0].id).toEqual(initialState.todos[0].id);
        expect(newState.todos[0].title).toEqual(initialState.todos[0].title);
    });
});
```
where we test each of our **action creator**-functions and **epics** (*we validate our `reducer` itself via the **action creators***).
> I also highly recommend always explicitly setting the type of values in your tests, as accidentally changing the values in your code will result in a compiler error then.

---

For the first **action creator** `setTitle` we do it as follows
```typescript
import IndexReducer, { SET_TITLE, setTitle, SetTitleAction } from '../IndexReducer';
// ...
    it('should set the correct title as payload on setTitle', () => {
        const payload = 'THIS_IS_A_TEST_TITLE';
        const setTitleAction: SetTitleAction = setTitle(payload);
        expect(setTitleAction).toEqual({ type: SET_TITLE, payload });
        const newState = IndexReducer(undefined, setTitleAction);
        expect(newState.title).toEqual(payload);
    });
```
where we first check that it has the correct return values and types and then test that running it through our `IndexReducer` has the desired effects. The same is done for `saveTodo`, `saveTodoSuccess`, `setDone` and `setDoneSuccess`.

---

Possibly the most important part of our testing is testing our **epics**, for example in the case of our `saveTodoEpic`
```typescript
import { ActionsObservable } from 'redux-observable';
import { SAVE_TODO_SUCCESS, saveTodo } from '../IndexReducer';
// ...
    it('should trigger the correct action on saveTodoEpic', async () => (
        await saveTodoEpic(ActionsObservable.of(saveTodo()), undefined)
            .forEach(actionReceived => expect(actionReceived).toEqual({ type: SAVE_TODO_SUCCESS }));
    ));
```
where we have to use an [`async`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) function, as **Observables** are not synchronous. We use `ActionsObservable.of` to create an **Observable** out of our **action creator** and give our **epic** an `undefined` as the second argument (*which, if you remember is defined as a type of `undefined` in `IndexReducer`*). After that we [`subscribe`](http://reactivex.io/documentation/operators/subscribe.html) to our new **Observable** returned by `saveTodoEpic` and check that the action received matches what we expect.

---

In our case we don't have any AJAX calls, but most likely you will require them, so to test them you would do something like this
```typescript
import * as nock from 'nock';
import { ActionsObservable } from 'redux-observable';
import { State } '../../../redux/reducer';
import IndexReducer, {
    fetchTodo,
    fetchTodoSuccess,
    fetchTodoFail,
    fetchTodoEpic,
} from '../IndexReducer';

describe('fetchTodoEpic', () => {
    afterEach(() => {
        nock.cleanAll();
    });
    it('should return the correct effects', async () => {
        const payload = 'Todo';
        nock('path/to/endpoint')
            .get('/lastparam')
            .reply(200, payload, { 'Content-Type': 'application/json' });
        return await fetchTagsEpic(ActionsObservable.of(fetchTodo()), { getState: () => new State(), dispatch: () => {} })
            .forEach(actionReceived => expect(actionReceived).toEqual(fetchTodoSuccess(payload)));
    });
    it('should fail correctly', async () => {
        const payload = 'ERROR';
        nock('path/to/endpoint')
            .get('/lastparam')
            .replyWithError(payload);
        return await fetchTagsEpic(ActionsObservable.of(fetchTodo()), { getState: () => new State(), dispatch: () => {} })
            .forEach(actionReceived => expect(actionReceived).toEqual(fetchTodoFail(payload)));
    });
});
```
where we use [nock](https://github.com/node-nock/nock) to mock the API responses.

### AppView

We also add simple snapshot tests for our `AppView`
```typescript
import * as React from 'react';
import { shallow } from 'enzyme';
import createHistory from 'history/createBrowserHistory';
import AppView from '../AppView';

describe('AppView', () => {
    const index = (
        <AppView
            match={{ params: undefined, isExact: true, path: '', url: '' }}
            location={{ pathname: '', search: '', state: {}, hash: '', key: '' }}
            history={createHistory()}
        />
    );
    const notFound = (
        <AppView
            match={{ params: undefined, isExact: false, path: '', url: '' }}
            location={{ pathname: '', search: '', state: {}, hash: '', key: '' }}
            history={createHistory()}
        />
    );

    it('should render correctly', () => {
        expect(shallow(index)).toMatchSnapshot();
        expect(shallow(notFound)).toMatchSnapshot();
    });
});
```

### Scripts

Finally we also want to run our tests! So back into our `package.json`
```json
    "scripts": {
        "test": "concurrently --kill-others-on-fail -p \"{name}\" -n \"SASS-LINT,TS-LINT,JEST\" -c \"bgBlue,bgMagenta,bgCyan\" \"yarn lint:sass\" \"yarn lint:ts\" \"jest\"",
        "test:watch": "jest --watch",
        "test:ci": "yarn run lint:sass && yarn run lint:ts && jest --runInBand --forceExit",
    }
```
where the first command `test` will run our `lint`-scripts and **Jest** with its default configuration (*`--kill-others-on-fail` will kill all three running processes if one test process fails*). `test:watch` will run **Jest** in watch mode, so when you're working on your tests, it will only run the ones your changes affect, saving time. The last one `test:ci` adds a couple of flags to the **Jest** command, `--runInBand` which will run all tests in a single process (*easier to spot errors*) and `--forceExit` to ensure **Jest** will shut down after tests (*[Travis](https://travis-ci.org) can freeze without this sometimes*).

### Alternatives

- Possibly the best known alternative to **Jest** is [Mocha](https://mochajs.org/)
    - [Jasmine](https://jasmine.github.io/) is one of the tools often used to extend **Mocha**
    - [Chai](http://chaijs.com/) is another one of them
    - And so is [Sinon](http://sinonjs.org/)
