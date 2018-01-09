import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import configureStore from './redux/store';
import AppContainer from './modules/AppContainer';

const history = createHistory();

ReactDOM.render(
    <Provider store={configureStore(history)}>
        <ConnectedRouter history={history}>
            <Route component={AppContainer} />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('app'),
);
