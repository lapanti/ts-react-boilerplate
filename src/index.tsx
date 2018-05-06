import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import createHistory from 'history/createBrowserHistory';
import configureStore from './redux/store';
import App from './modules/App';

const history = createHistory();

const render = (container: React.ComponentClass<any>) =>
  ReactDOM.render(
    <AppContainer>
      <Provider store={configureStore(history)}>
        <ConnectedRouter history={history}>
          <Route component={container} />
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('app'),
  );

render(App);

if ((module as any).hot) {
  (module as any).hot.accept('./modules/App', () => render(App));
}
