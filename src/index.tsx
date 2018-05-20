import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import createHistory from 'history/createBrowserHistory';
import { ThemeProvider } from 'styled-components';
import 'typeface-roboto';

import configureStore from './redux/store';
import { theme, injectGlobal } from './theme/styled';
import App from './modules/App';

// tslint:disable:no-unused-expression
injectGlobal`
  html {
    font-size: 10px;
  }

  body {
    margin: 0;
  }
`;
// tslint:enable:no-unused-expression

const history = createHistory();

const render = (container: React.ComponentClass<any>) =>
  ReactDOM.render(
    <AppContainer>
      <Provider store={configureStore(history)}>
        <ThemeProvider theme={theme}>
          <ConnectedRouter history={history}>
            <Route component={container} />
          </ConnectedRouter>
        </ThemeProvider>
      </Provider>
    </AppContainer>,
    document.getElementById('app'),
  );

render(App);

if ((module as any).hot) {
  (module as any).hot.accept('./modules/App', () => render(App));
}
