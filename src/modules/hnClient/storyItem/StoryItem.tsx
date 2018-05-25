import * as React from 'react';
import * as moment from 'moment';

import styled from '../../../theme/styled';
import Story from '../../../common/Story';

const StoryContainer = styled.div`
  align-items: flex-start;
  display: flex;
  font-size: 1.4rem;
  height: 100%;
  margin-top: 1rem;
`;

const InfoContainer = StoryContainer.extend`
  flex-direction: column;
  margin-left: 1rem;
  margin-top: 0;
`;

const StoryLink = styled.a`
  color: black;
  text-decoration: none;
`;

const MetaContainer = StoryContainer.extend`
  align-items: center;
  font-size: 1.2rem;
  margin-top: 0;
`;

export interface StoryItemProps {
  readonly story: Story;
  readonly index: number;
}

const StoryItem: React.StatelessComponent<StoryItemProps> = ({
  story,
  index,
}) => (
  <StoryContainer>
    {index + 1}.
    <InfoContainer>
      <StoryLink href={story.url} target="_blank">
        {story.title}
      </StoryLink>
      <MetaContainer>
        {story.score} points by {story.by} {moment.unix(story.time).fromNow()} |{' '}
        {story.descendants} comments
      </MetaContainer>
    </InfoContainer>
  </StoryContainer>
);

export default StoryItem;
