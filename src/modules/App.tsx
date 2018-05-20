import * as React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import styled from 'styled-components';

import routeEnter from '../components/HOC/routeEnter';
import HNClient from './hnClient/HNClient';
import { setStoryType } from './hnClient/HNClientReducer';
import PageNotFound from '../components/PageNotFound';
import StoryType from '../common/StoryType';

const MainContainer = styled.div`
  margin: 0 auto;
  max-width: 900px;
`;

export type AppProps = RouteComponentProps<undefined>;

export const App: React.StatelessComponent<AppProps> = () => (
  <MainContainer>
    <Switch>
      <Route path="/" exact component={routeEnter(HNClient, push('/new'))} />
      <Route
        path="/new"
        exact
        component={routeEnter(HNClient, setStoryType(StoryType.NEW))}
      />
      <Route
        path="/top"
        exact
        component={routeEnter(HNClient, setStoryType(StoryType.TOP))}
      />
      <Route
        path="/best"
        exact
        component={routeEnter(HNClient, setStoryType(StoryType.BEST))}
      />
      <Route component={PageNotFound} />
    </Switch>
  </MainContainer>
);

export default connect<{}, undefined, AppProps>(() => ({}))(App);
