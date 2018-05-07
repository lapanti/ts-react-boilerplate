import * as React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import HNClient from './hnClient/HNClient';
import PageNotFound from '../components/PageNotFound';

const MainContainer = styled.div`
  margin: 0 auto;
  max-width: 700px;
`;

export type AppProps = RouteComponentProps<undefined>;

export const App: React.StatelessComponent<AppProps> = () => (
  <MainContainer>
    <Switch>
      <Route path="/" exact component={HNClient} />
      <Route component={PageNotFound} />
    </Switch>
  </MainContainer>
);

export default connect<{}, undefined, AppProps>(() => ({}))(App);
