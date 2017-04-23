import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import configureStore from './redux/store';
import Routes from './modules/Routes';

ReactDOM.render((
    <Provider store={configureStore()}>
        <Router history={browserHistory} routes={Routes} />
    </Provider>
    ), document.getElementById('app'),
);
