# Extras

Here we go through things you might not need, but might want to include in your project.

### Server-side rendering

Server-side rendering is the act of having a server render your **React**-application and sending it as an html file to the client, which can considerably reduce initial loading times. This is usually achieved by adding a [node](https://nodejs.org/en/)-server to your application and then hosting your code on a server.

For our needs, we'll use [Express](https://expressjs.com/), starting with installing the new, required dependencies (*[http-status-enum](https://github.com/KyleNeedham/http-status-enum) is just a simple enumeration of HTTP Status Codes for TypeScript*)
```
    yarn add express http-status-enum
    yarn add -D @types/express
```

---

Now the actual server we run will live in a file called `server.tsx` inside the `src`-folder
```typescript
import * as path from 'path';
import * as express from 'express';
import * as React from 'react';
import HttpStatus from 'http-status-enum';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Route } from 'react-router-dom';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createMemoryHistory';
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import reducer, { epics, State } from './redux/reducer';
import AppContainer from './modules/AppContainer';

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
    const store = createStore<State>(reducer, applyMiddleware(
        routerMiddleware(createHistory()),
        createEpicMiddleware(epics),
    ));
    const context: { url?: string } = {};
    const html = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
                <Route component={AppContainer} />
            </StaticRouter>
        </Provider>,
    );
    if (context.url) {
        res.redirect(HttpStatus.MOVED_PERMANENTLY, context.url);
    } else {
        res.send(renderHtml(html, store.getState()));
    }
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
const configureStore = (history: History) => createStore<State>(
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
with [`use`](https://expressjs.com/en/4x/api.html#app.use) you can set a middleware-function to a specific path, in this case [`express.static`](https://expressjs.com/en/4x/api.html#express.static), which will serve static files from a relative path.
> [`path.join`](https://nodejs.org/api/path.html#path_path_join_paths) will create a path using platform-specific separators.

---

Next is the beef of our server application, the actual server-side rendering
```typescript
app.use((req: express.Request, res: express.Response) => {
    const store = createStore<State>(reducer, applyMiddleware(
        routerMiddleware(createHistory()),
        createEpicMiddleware(epics),
    ));
    const context: { url?: string } = {};
    const html = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
                <Route component={AppContainer} />
            </StaticRouter>
        </Provider>,
    );
    if (context.url) {
        res.redirect(HttpStatus.MOVED_PERMANENTLY, context.url);
    } else {
        res.send(renderHtml(html, store.getState()));
    }
});
```
where we use **react-router** to match the current path to our client code, create a store and render the application as `html` (*if `context.url` is present, it means that our application returned a redirect and we'll redirect the user appropriately*) and finally send it to the client.

---

Finally we start the application itself
```typescript
app.listen(port, () => console.log(`App is listening on ${port}`));
```

---

Of course we need to also add the scripts to actually run our server, starting with the build-script
```json
    "scripts": {
        "build:server": "mkdir -p dist && browserify src/server.tsx --node -p tsify > dist/server.js",
        "build": "yarn run build:server && yarn run build:sass && yarn run build:client",
    }
```
where we first make the build script for our server, otherwise the same as our `build:client`, but adding the `node` flag to **browserify**. Secondly add the `build:server` as part of our original `build`-script.

---

Finally we create the actual `start`-script which will run our application
```json
    "scripts": {
        "start": "NODE_ENV=production node dist/server.js",
    }
```
which is very simple, just setting the `production`-flag for our `NODE_ENV` and starting the `server` with **node**.

That's it, you should now have fully working server-side rendered application!

### Docker

If you want to [dockerize](https://www.docker.com/) your application you need to add a `Dockerfile` to your application's root folder (*which is just a file named `Dockerfile`*)
```
FROM node:4-onbuild

LABEL maintainer "your.email.here@domain.com"

COPY dist/ /

ENV NODE_ENV=production

EXPOSE 8080

CMD node /server.js
```
which tells **Docker** how to build your container (*installation instructions for **Docker** can be found [here](https://docs.docker.com/engine/installation/)*).

To start your new **Docker**-container you can just run
```
docker build .
```
then take the image id given by the build command and use it here
````
docker run -d -p 8080:8080 IMAGEID
```
