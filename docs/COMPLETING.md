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

###<a name="indexhtml">Index.html</a>

Finally we write an `index.html` in our root-folder
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Todo app</title>
    </head>
    <body>
        <div id="app"></div>
        <script src="js/bundle.js"></script>
    </body>
</html>
```
which is just a very simple `HTML`-file, which imports our (*soon-to-be-bundled*) **JavaScript** from the path `/js/bundle.js` and contains a `div` with the id `app` so our `index.ts` works.

###<a name="scripts">Scripts</a>

Now as we have everything necessary for our application, it's time to get it working!

We'll begin by installing a couple of new dependencies
```
yarn add -D browserify budo tsify
```
from which [browserify](http://browserify.org/) allows us to do `import`-statements in client code, [budō](https://github.com/mattdesl/budo) is a lightweight server to host client code (*it uses browserify under the hood*) and [tsify](https://www.npmjs.com/package/tsify) is a **browserify**-plugin to use it with **TypeScript**.

---

First it's time to write our development script, so head on over to your `package.json` and add the following
```json
    // ...
    "scripts": {
        "develop": "budo src/index.tsx:js/bundle.js --live --verbose -- -p tsify"
    }
```
which allows you to start the **budō** server by entering `yarn run develop` into your console (*inside the root folder of your app*). It will run until it faces an error it can't recover from or you press `ctrl+c`. The arguments given to **budō** are firstly, the name of you application entry file (*with a relative path*), followed by the double colon with the path and name your `index.html` (*budō expects to find it in your root folder*) expects to find your application code. `--live` enables [LiveReload](http://livereload.com/) (*you can install a plugin to [Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) or [Firefox](https://addons.mozilla.org/en-gb/firefox/addon/livereload/) to take full advantage of it*), which automatically refreshes your browser when the source code changes. `--verbose` enables verbose output from **budō** and then all arguments after the ` -- ` will go to the **browserify** **budō** is running, in this case a plugin **tsify** to compile our **TypeScript** files.

---

Now it's time to build our application to be hosted on the Internet, so add the following line to your `scripts` inside `package.json`
```json
    // ...
    "scripts": {
        // ...
        "build": "mkdir -p dist/js && browserify src/index.tsx -p tsify > dist/js/bundle.js"
    }
```
which will first make sure that the folder `dist/js` is there and then build your application with **browserify**. For **browserify** we give as first argument the entry file, then a plugin (*again, **tsify** to use **TypeScript** with **browserify***) and finally after the `>` the output file name (*with it's relative path*). Apart from this script (*run by `yarn run build`*) you only need to copy your `index.html` file to the `dist`-folder and your application is complete!

### <a name="alternatives">Alternatives</a>

- An alternative for **browserify** is [webpack](https://webpack.github.io/), which is maybe a bit more popular these days, but I personally dislike the amount of configuration (*and the way the configuration is achieved*) it requires
