import * as React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import Index from './index/Index';
import PageNotFound from '../components/PageNotFound';

export type AppProps = RouteComponentProps<undefined>;

export const App: React.StatelessComponent<AppProps> = () => (
  <div className="app-base">
    <Switch>
      <Route path="/" exact component={Index} />
      <Route component={PageNotFound} />
    </Switch>
  </div>
);

export default connect<{}, undefined, AppProps>(() => ({}))(App);
