import * as path from 'path';
import * as express from 'express';
import * as React from 'react';
import { MOVED_PERMANENTLY } from 'http-status-codes';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Route } from 'react-router-dom';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createMemoryHistory';
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import reducer, { epics, State } from './redux/reducer';
import App from './modules/App';

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
      <title>HN PWA</title>
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
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
          /</g,
          '\\u003c',
        )}
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
    applyMiddleware(
      routerMiddleware(createHistory()),
      createEpicMiddleware(epics),
    ),
  );
  const context: { url?: string } = {};
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <Route component={App} />
      </StaticRouter>
    </Provider>,
  );
  if (context.url) {
    res.redirect(MOVED_PERMANENTLY, context.url);
  } else {
    res.send(renderHtml(html, store.getState()));
  }
});

app.listen(port, () => console.log(`App is listening on ${port}`));
