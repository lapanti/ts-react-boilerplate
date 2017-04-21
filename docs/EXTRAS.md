# Extras

Here we go through things you might not need, but might want to include in your project.

### Server-side rendering

Server-side rendering is the act of having a server render your **React**-application and sending it as an html file to the client, which can considerably reduce initial loading times. This is usually achieved by adding a [node](https://nodejs.org/en/)-server to your application and then hosting your code on a server.

For our needs, we'll use [Express](https://expressjs.com/), starting with installing the new, required dependencies
```
    yarn add express
    yarn add -D @types/express
```

---

Now the actual server we run will live in a file called `server.tsx` inside the `src`-folder
```typescript
import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import * as React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import reducer, { epics, State } from './redux/reducer';
import Routes from './modules/Routes';

const normalizePort = (val: number | string): number | string | boolean => {
    const base = 10;
    const port: number = typeof val === 'string' ? parseInt(val, base) : val;
    return isNaN(port) ? val : port >= 0 ? port : false;
};

const renderHtml = (html: string, preloadedState: State) => (
    `
    <!doctype html>
    <html>
        <head>
            <meta charset="utf-8" />
            <title>Todo app</title>
            <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
            <link rel="stylesheet" href="/styles/styles.css">
        </head>
        <body>
            <div id="app">${html}</div>
            <script>
                window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
            </script>
            <script src="/js/bundle.js"></script>
        </body>
    </html>
    `
);

const defaultPort = 8080;
const port = normalizePort(process.env.PORT || defaultPort);
const app = express();

app.use('/js', express.static(path.join('js'), { redirect: false }));
app.use('/styles', express.static(path.join('styles'), { redirect: false }));

app.use((req: express.Request, res: express.Response) => {
    match({ routes: Routes, location: req.url }, (err, redirect, props) => {
        const store = createStore<State>(reducer, applyMiddleware(createEpicMiddleware(epics)));
        const html = renderToString(
            <Provider store={store}>
                <RouterContext {...props} />
            </Provider>,
        );
        res.send(renderHtml(html, store.getState()));
    });
});

app.listen(port, () => console.log(`App is listening on ${port}`));
```
which will serve the **React**-application on all other routes except `ROOT/js` and `ROOT/styles`, where our assets are served on.

---

First we made a simple function to normalize an incoming `PORT`-parameter
```typescript
const normalizePort = (val: number | string): number | string | boolean => {
    const base = 10;
    const port: number = typeof val === 'string' ? parseInt(val, base) : val;
    return isNaN(port) ? val : port >= 0 ? port : false;
};
```
which tries to parse the incoming `val`-parameter.

---

Next we create a function to render our `html` based on the rendered **React** application
```typescript
const renderHtml = (html: string, preloadedState: State) => (
    `
    <!doctype html>
    <html>
        <head>
            <meta charset="utf-8" />
            <title>Todo app</title>
            <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
            <link rel="stylesheet" href="/styles/styles.css">
        </head>
        <body>
            <div id="app">${html}</div>
            <script>
                window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
            </script>
            <script src="/js/bundle.js"></script>
        </body>
    </html>
    `
);
```
where the biggest point is `window.__PRELOADED_STATE__` which lets us set the **state** of the application in the server, although it requires the following modification to our `store.ts``
```typescript
// Below is a necessary hack to access __PRELOADED_STATE__ on the global window object
const preloadedState: State = (<any>window).__PRELOADED_STATE__;
delete (<any>window).__PRELOADED_STATE__;
const configureStore = (): Store<State> => createStore(
    reducer,
    preloadedState,
    applyMiddleware(epicMiddleware),
);
```

---

Next we set some required variables and create our **Express**-application
```typescript
const defaultPort = 8080;
const port = normalizePort(process.env.PORT || defaultPort);
const app = express();
```
where we use our previously created `normalizePort` to normalize the (*possibly*) given `PORT` environment variable.

---

Next up we set up **Express** to serve our static assets
```typescript
app.use('/js', express.static(path.join('js'), { redirect: false }));
app.use('/styles', express.static(path.join('styles'), { redirect: false }));
```
with [`use`]()
