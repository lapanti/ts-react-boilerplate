import * as React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import IndexContainer from './index/IndexContainer';

const Routes = (
    <Route path="/" component={App}>
        <IndexRoute component={IndexContainer} />
    </Route>
);

export default Routes;
