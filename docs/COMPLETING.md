# Completing React

Now we finally get to build our **React**-application into something that can be run and will actually do something! Here we make the assumption that you are going to build a medium- to large-sized application and show how to do these things in a more modular way, but for smaller applications some of these parts can be merged with the `HNClientView` and some can be left out completely.

### Initialize

We begin by installing new dependencies called [React Router](https://reacttraining.com/react-router/) and [ReactDOM](https://facebook.github.io/react/docs/react-dom.html)
```
yarn add react-router-dom react-dom
```
which adds the capability to define which URL equals which view and to render our **React** application to the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction), respectively.

And of course the types for them
```
yarn add -D @types/react-router-dom @types/react-dom
```

### AppView

We begin by writing an `AppView.ts` file into the `src/modules`-folder
```typescript
import * as React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import HNClientContainer from './hnClient/HNClientContainer';
import PageNotFound from '../components/PageNotFound';

export type IAppViewProps = RouteComponentProps<undefined>;

const AppView: React.StatelessComponent<IAppViewProps> = () => (
    <div className="app-base">
        <Switch>
            <Route path="/" exact component={HNClientContainer} />
            <Route component={PageNotFound} />
        </Switch>
    </div>
);

export default AppView;
```
which is a fairly simple view, except for the `<Switch>`-clause and `RouteComponentProps`.
> All views that go through **React Router** get some extra properties, which are included in `RouteComponentProps<Params`, where `Params` can be used to define possible parameters for the URL.

The [`<Switch>`](https://reacttraining.com/react-router/web/api/Switch) element is used to render a single view out of all [`Route`s](https://reacttraining.com/react-router/web/api/Route) inside the `<Switch>`. `Route`s have three main properties you should remember:
1. `path` which indicates what URL the view matches to (*it can be used to define parameters as well*)
2. `exact` which indicates that the view should only match if the URL matches `path` exactly
3. `component` which defines the actual view to render

### AppContainer

Next we create a very simple **container** for `AppView` called `AppContainer`, which is situated in the same `src/modules`-folder
```typescript
import { connect } from 'react-redux';
import AppView, { IAppViewProps } from './AppView'; //tslint:disable-line:no-unused-variable

export default connect<{}, undefined, IAppViewProps>(() => ({}))(AppView);
```
which we use just to wrap `AppView` so that it can be used in routes.

### HNClientView

For `HNClientView` we also need to add `RouteComponentProps`, so just add the following
```typescript
import { RouteComponentProps } from 'react-router-dom';
// ...
export type IHNClientProps = IHNClientState & IHNClientDispatch & RouteComponentProps<undefined>;
```

### index

Finally we create a file `index.ts` inside `src`
```typescript
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { AppContainer as HotContainer } from 'react-hot-loader';
import createHistory from 'history/createBrowserHistory';
import configureStore from './redux/store';
import AppContainer from './modules/AppContainer';

const history = createHistory();

const render = (container: React.ComponentClass) => ReactDOM.render(
    <HotContainer>
        <Provider store={configureStore(history)}>
            <ConnectedRouter history={history}>
                <Route component={container} />
            </ConnectedRouter>
        </Provider>
    </HotContainer>,
    document.getElementById('app'),
);

render(AppContainer);

if ((module as any).hot) {
    (module as any).hot.accept('./modules/AppContainer', () => render(AppContainer));
}

```
which is the entry file to our application that ties everything together.

---

On the 14. line
```typescript
import * as ReactDOM from 'react-dom';

const render = (container: React.ComponentClass) => ReactDOM.render(
    // ...,
    document.getElementById('app'),
))
```
we [render](https://facebook.github.io/react/docs/react-dom.html#render) our **React**-application to the **DOM** inside a div with the id `app` (*we'll come back to this*).

---

On the 15. line
```typescript
import { AppContainer as HotContainer } from 'react-hot-loader';
// ...
    <HotContainer>
        // ...
    </HotContainer>,
```
we wrap our application into a container to enable **Hot Module Replacement** (more about it later in this section).

---

On the 16. line
```typescript
import * as React from 'react';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import configureStore from './redux/store';
const history = createHistory();
// ...
        <Provider store={configureStore(history)}>
            // ...
        </Provider>
```
which wraps our **React** application with **Redux** using [`Provider`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store) from **react-redux**, which takes a single parameter `store`, for which we provide our store as we defined it in [Redux](/REDUX.md#store). `history/createBrowserHistory` is used to create a wrapper around the browser history we can use.

---

On the 17. line
```typescript
import * as React from 'react';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import AppContainer from './modules/AppContainer';
// ...
        <ConnectedRouter history={history}>
            <Route component={AppContainer} />
        </ConnectedRouter>
// ...
```
we keep the UI in sync with the URL using a [`ConnectedRouter`](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux) from **react-router-redux**, which takes as argument a [`history`](https://github.com/ReactTraining/react-router/blob/v3/docs/API.md#histories), where we give `history` we created previously. Here we define a single `Route` which renders `AppContainer` for all URL routes.

---

Finally at the end
```typescript
if ((module as any).hot) {
    (module as any).hot.accept('./modules/AppContainer', () => render(AppContainer));
}
```
we do a little configuration to allow our container to be loaded by the **Hot Module Replacement**-system.

### HNClient.html

Finally we write an `index.html` in our root-folder
```html
<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>TS-React boilerplate</title>
    </head>
    <body>
        <div id="app"></div>
        <script src="/bundle.js"></script>
    </body>
</html>
```
which is just a very simple `HTML`-file, which imports our (*soon-to-be-bundled*) **JavaScript** from the current folder `/bundle.js` and contains a `div` with the id `app` so our `index.ts` works.
