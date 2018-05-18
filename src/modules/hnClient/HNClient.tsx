import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { State } from '../../redux/reducer';
import StoryType from '../../common/StoryType';
import Story from '../../common/Story';
import Loader from '../../components/Loader';

const ClientContainer = styled.main`
  display: grid;
  grid-template-rows: 100px repeat(200px);
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
  RouteComponentProps<undefined>;

export const HNClient: React.StatelessComponent<HNClientProps> = ({
  storyType,
  stories,
  loading,
}) => (
  <ClientContainer>
    {loading && <Loader />}
    <h1 className="index__header">Stories</h1>
    <br />
    {stories.map(story => <p key={story.id}>{story.title}</p>)}
  </ClientContainer>
);

export default connect<HNClientState, HNClientDispatch, HNClientProps, State>(
  (state): HNClientState => ({
    storyType: state.hnClient.storyType,
    stories: state.hnClient.stories,
    loading: state.hnClient.loading,
  }),
  {},
)(HNClient);
