import * as React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App';
import IndexContainer from './index/IndexContainer';
import PageNotFound from '../components/PageNotFound';

const Routes = (
    <Route path="/" component={App}>
        <IndexRoute component={IndexContainer} />
        <Route path="*" component={PageNotFound} />
    </Route>
);

export default Routes;
