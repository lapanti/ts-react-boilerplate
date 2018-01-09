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
    `;

const defaultPort = 8080;
const port = normalizePort(process.env.PORT || defaultPort);
const app = express();

app.use('/js', express.static(path.join('js'), { redirect: false }));
app.use('/styles', express.static(path.join('styles'), { redirect: false }));

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
