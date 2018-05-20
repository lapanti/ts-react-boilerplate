import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import styled, { withProps } from '../../theme/styled';
import { State } from '../../redux/reducer';
import StoryType from '../../common/StoryType';
import Story from '../../common/Story';
import Loader from '../../components/Loader';
import Header from './header/Header';

const ClientContainer = withProps<{ rows: number }>(styled.main)`
  display: grid;
  font-family: 'Roboto', arial;
  grid-template-rows: 40px repeat(${props => props.rows}, 60px);
  width: 100%;
`;

export interface HNClientState {
  readonly storyType: StoryType;
  readonly stories: Story[];
  readonly loading: boolean;
}

export interface HNClientDispatch {}

export type HNClientProps = HNClientState &
  HNClientDispatch &
  RouteComponentProps<never>;

export const HNClient: React.StatelessComponent<HNClientProps> = ({
  storyType,
  stories,
  loading,
}) => (
  <ClientContainer rows={stories.length}>
    {loading && <Loader />}
    <Header />
    {stories.map(story => <p key={story.id}>{story.title}</p>)}
  </ClientContainer>
);

export default connect<HNClientState, HNClientDispatch, {}, State>(
  state => ({
    storyType: state.hnClient.storyType,
    stories: state.hnClient.stories,
    loading: state.hnClient.loading,
  }),
  {},
)(HNClient);
