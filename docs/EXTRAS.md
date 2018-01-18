# Extras

Here we go through things you might not need, but might want to include in your project.

### Favicon

A recommended feature of all websites, especially now with so many mobile devices browsing the internet, is to have a [favicon](https://en.wikipedia.org/wiki/Favicon) in your website. A favicon is usually the logo of your company or website. In our case you can either use the ones you can find [here](https://github.com/Lapanti/ts-react-boilerplate/tree/master/src/icons) or make your own. If you want to make your own, I suggest creating a 260 x 260 pixel image, which you then generate into all the useful formats using [RealFaviconGenerator](https://realfavicongenerator.net/).

If you used *RealFaviconGenerator* you should now have the following files:
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `apple-touch-icon.png`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `favicon.ico`
- `mstile-150x150.png`
- `safari-pinned-tab.svg`
- `manifest.json`
- `browserconfig.xml`
Now move `manifest.json` and `browserconfig.xml` to your root folder and the rest to `src/icons`.

Now that we have everything in place, let's first update our `index.html` by adding the following parts to inside the `head` tag:
```html
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png" />
        <link rel="manifest" href="/assets/manifest.json" />
        <link rel="mask-icon" href="/assets/icons/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="/assets/icons/favicon.ico" />
        <meta name="msapplication-config" content="/assets/browserconfig.xml" />
        <meta name="theme-color" content="#FF8041" />
```
where the first line is to have an icon present if an iPhone user [saves your website](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html) to their Home screen. The second, third and sixth line are for different sizes of the traditional browser favicon. The fourth line is for a [manifest.json](https://developer.mozilla.org/en-US/docs/Web/Manifest) which does the same thing as the first line for Android users. The fifth line is an icon for Safari users when they [pin your website](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariWebContent/pinnedTabs/pinnedTabs.html). The seventh line is to define a tile for Microsoft users when they [pin your website](https://msdn.microsoft.com/en-us/library/dn320426(v=vs.85).aspx). The final line is a theme color for your website which is used for example by [mobile browsers](https://developers.google.com/web/fundamentals/design-and-ux/browser-customization/).

The contents of you `manifest.json` should look something like this:
```json
{
    "name": "",
    "icons": [
        {
            "src": "/assets/icons/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/assets/icons/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "theme_color": "#FF8041", // Change this and the following line to match your website
    "background_color": "#FFFFFF",
    "display": "standalone"
}
```

And the contents of your `browserconfig.xml` should look something like this:
```xml
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/assets/icons/mstile-150x150.png"/>
            <TileColor>#FF8041</TileColor>
        </tile>
    </msapplication>
</browserconfig>
```
where you should change the `TileColor` to match your icon's background.

---

Now we also need to update our **webpack** configurations to include our new icons and manifests into the project, so add the following to your `webpack.dev.js`:
```javascript
    plugins: [
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, 'index.html') },
            { from: path.resolve(__dirname, 'manifest.json'), to: 'assets' },
            { from: path.resolve(__dirname, 'browserconfig.xml'), to: 'assets' },
            { from: path.resolve(__dirname, 'src/icons'), to: 'assets/icons' }
        ]),
        // ...
    ]
```

And then add the following to your `webpack.prod.js`:
```javascript
var CopyWebpackPlugin = require('copy-webpack-plugin');
// ...
    plugins: [
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, 'manifest.json') },
            { from: path.resolve(__dirname, 'browserconfig.xml') },
            { from: path.resolve(__dirname, 'src/icons'), to: 'icons' }
        ]),
        // ...
    ]
```

### Server-side rendering

Server-side rendering is the act of having a server render your **React**-application and sending it as an html file to the client, which can considerably reduce initial loading times and enables a lot of SEO. This is usually achieved by adding a [node](https://nodejs.org/en/)-server to your application and then hosting your code on a server.

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

const renderHtml = (html: string, preloadedState: State) =>
    `
    <!doctype html>
    <html>
        <head>
            <meta charset="utf-8" />
            <title>Todo app</title>
            <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
            <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png" />
            <link rel="manifest" href="/assets/manifest.json" />
            <link rel="mask-icon" href="/assets/icons/safari-pinned-tab.svg" color="#5bbad5" />
            <link rel="shortcut icon" href="/assets/icons/favicon.ico" />
            <meta name="msapplication-config" content="/assets/browserconfig.xml" />
            <meta name="theme-color" content="#FF8041" />
            <link rel="stylesheet" href="/assets/styles.css">
        </head>
        <body>
            <div id="app">${html}</div>
            <script>
                window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
            </script>
            <script src="/assets/bundle.js"></script>
        </body>
    </html>
    `;

const defaultPort = 8080;
const port = normalizePort(process.env.PORT || defaultPort);
const app = express();

app.use('/assets', express.static(path.join('assets'), { redirect: false }));

app.use((req: express.Request, res: express.Response) => {
    const store = createStore<State>(
        reducer,
        applyMiddleware(routerMiddleware(createHistory()), createEpicMiddleware(epics)),
    );
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
which will serve the **React**-application on all other routes except `ROOT/assets`, where our assets are served from.

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
            <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png" />
            <link rel="manifest" href="/assets/manifest.json" />
            <link rel="mask-icon" href="/assets/icons/safari-pinned-tab.svg" color="#5bbad5" />
            <link rel="shortcut icon" href="/assets/icons/favicon.ico" />
            <meta name="msapplication-config" content="/assets/browserconfig.xml" />
            <meta name="theme-color" content="#FF8041" />
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

where we use **react-router** to match the current path to our client code, where the [`match`](http://knowbody.github.io/react-router-docs/api/match.html)-function matches the current route without rendering. Afterwards we create a store and render the application as `html` and finally send it to the client.

---

Finally we start the application itself
```typescript
app.listen(port, () => console.log(`App is listening on ${port}`));
```

---

Of course we need to again make some changes to our **webpack** configurations, but this time only to the production configuration and then we need to create a configuration for the server code itself.

For the production configuration we want to remove our `index.html` creation plugin as the server itself serves the index file, so remove the following lines:
```javascript
var HtmlWebpackPlugin = require('html-webpack-plugin');
// ...
        new HtmlWebpackPlugin(),
```
after which, we can remove the plugin itself, by running
```
yarn remove html-webpack-plugin
```

---

For the building of the server side code, we need to create another **webpack** configuration file, this time called `webpack.server.js`, which will have the following content:
```javascript
var path = require('path');
var webpack = require('webpack');

module.exports = {
    target: 'node',
    entry: path.resolve(__dirname, 'src', 'server.tsx'),
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: ['babel-loader', 'awesome-typescript-loader'],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};
```
where we simply define the `entry` to be `server.tsx`, the output folder to be `dist` (*with the output file being `server.js`*) and make it process **TypeScript**.

Then we also need to update our build scripts to include our server, so we change the old `build`-script into the following three scripts:
```json
"scripts": {
    "build:server": "webpack -d --env=server -p --colors",
    "build:client": "webpack -d --env=prod --colors",
    "build": "yarn clean && concurrently --kill-others-on-fail -p \"{name}\" -n \"SERVER,CLIENT\" -c \"bgBlue,bgMagenta\" \"yarn build:server\" \"yarn build:client\"",
}
```
where the `build:client`-script is the same as before, `build:server` calls **webpack** with our new server configuration and `build` runs both of these at the same time using **concurrecntly**.

---

Finally we create the actual `start`-script which will run our application
```json
    "scripts": {
        "start": "cd dist && NODE_ENV=production node server.js",
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
