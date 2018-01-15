import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { AppContainer as HotContainer } from 'react-hot-loader';
import createHistory from 'history/createBrowserHistory';
import configureStore from './redux/store';
import AppContainer from './modules/AppContainer';
import './styles/styles.scss';

const history = createHistory();

const render = (container: React.ComponentClass) =>
    ReactDOM.render(
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
