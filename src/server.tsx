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
