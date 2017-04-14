# Completing React

Now we finally get to build our **React**-application into something that can be run and will actually do something! Here we make the assumption that you are going to build a medium- to large-sized application and show how to do these things in a more modular way, but for smaller applications some of these parts can be merged with the `IndexView` and some can be left out completely.

### <a name="initialize">Initialize</a>

We begin by installing new dependencies called [React Router](https://github.com/ReactTraining/react-router) and [ReactDOM](https://facebook.github.io/react/docs/react-dom.html)
```
yarn add react-router react-dom
```
which adds the capability to define which URL equals which view and to render our **React** application to the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction), respectively.

And of course the types for them
```
yarn add -D @types/react-router @types/react-dom
```
> If you want to include your **route-state** in **Redux** you might want to look at [react-router-redux](https://github.com/reactjs/react-router-redux)

### <a name="app">App</a>

We begin by writing an `App.ts` file into the `src/modules`-folder
```typescript
import * as React from 'react';

/* tslint:disable:no-any */
const App: React.StatelessComponent<any> = props => (
    /* tslint:enable:no-any */
    <div className="app-base">
        {props.children}
    </div>
);

export default App;
```
which is just a simple **view** that will contain all the common styles and elements for all pages. The line of importance is the seventh one `{props.children}` which tells **React** to render the children property as **React views** inside the `div`.

### <a name="routes">Routes</a>

Next we define our **React Router** routes in a file called `Routes.tsx` inside `src/modules`
```typescript
import * as React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App';
import IndexContainer from './index/IndexContainer';

const Routes = (
    <Route path="/" component={App}>
        <IndexRoute component={IndexContainer} />
    </Route>
);

export default Routes;
```

---

On the seventh line we define that the root URL matches our previously made `App`
```typescript
import * as React from 'react';
import { Route } from 'react-router';
import App from './App';
// ...
    <Route path="/" component={App}>
        // ...
    </Route>
```
using [`Route`](https://github.com/ReactTraining/react-router/blob/v3/docs/API.md#route) which takes as the first argument `path` the URL this `Route` should match to (*relative URL*) and as the second argument `component` the component to render.

---

On the eighth line we define our [`IndexRoute`](https://github.com/ReactTraining/react-router/blob/v3/docs/API.md#indexroute-1) for the root path to be `IndexContainer`
```typescript
import * as React from 'react';
import { IndexRoute } from 'react-router';
import IndexContainer from './index/IndexContainer';
// ...
        <IndexRoute component={IndexContainer} />
```
which is a special type of `Route` as it defines the `component` it received as the child for it's parent's route (*meaning that for the parent's path, this is the innermost component to show*). Notice that we are setting the `Container` as the `component` instead of the `View`. This is what allows us to connect **Redux** to our **React**-components in the next phase.

### <a name="index">index</a>

Finally we create a file `index.ts` inside `src`
```typescript
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import configureStore from './redux/store';
import Routes from './modules/Routes';

ReactDOM.render((
    <Provider store={configureStore()}>
        <Router history={browserHistory} routes={Routes} />
    </Provider>
    ), document.getElementById('app'),
);
```
which is the entry file to our application that ties everything together.

---

On the eighth line
```typescript
import * as ReactDOM from 'react-dom';

ReactDOM.render((
    // ...
    ), document.getElementById('app'),
))
```
we [render](https://facebook.github.io/react/docs/react-dom.html#render) our **React**-application to the **DOM** inside a div with the id `app` (*we'll come back to this*).

---

On the ninth line
```typescript
import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from './redux/store';
// ...
    <Provider store={configureStore()}>
        // ...
    </Provider>
```
which wraps our **React** application with **Redux** using [`Provider`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store) from **react-redux**, which takes a single parameter `store`, for which we provide our store as we defined it in [Redux](/REDUX.md#store).

---

On the tenth line
```typescript
import * as React from 'react';
import { Router, browserHistory } from 'react-router';
import Routes from './modules/Routes';
// ...
        <Router history={browserHistory} routes={Routes} />
// ...
```
we keep the UI in sync with the URL using a [`Router`](https://github.com/ReactTraining/react-router/blob/v3/docs/API.md#router) from **React Router**, which takes as the first argument [`history`](https://github.com/ReactTraining/react-router/blob/v3/docs/API.md#histories), where we give `browserHistory` as it most closely mimics the way a browser's history works and as the second argument `routes` we give our `Routes` component from before.

###<a name="scripts">Scripts</a>
