import * as React from 'react';
import { shallow } from 'enzyme';
import createHistory from 'history/createBrowserHistory';
import * as moment from 'moment';

import StoryItem from '../StoryItem';
import Story from '../../../../common/Story';
import ItemType from '../../../../common/ItemType';

describe('<StoryItem />', () => {
  const hour = 3600;
  const year = 31556926;
  const story1: Story = {
    by: 'test',
    descendants: 10293,
    id: 1,
    kids: [],
    score: 1283,
    time: moment().unix() - hour,
    title: 'Test',
    type: ItemType.STORY,
    url: '',
  };

  const story2: Story = {
    by: 'test2',
    descendants: 10,
    id: 2,
    kids: [],
    score: 12,
    time: moment().unix() - year,
    title: 'Test 2',
    type: ItemType.STORY,
    url: '',
  };

  it('should render with correct props', () => {
    expect(shallow(<StoryItem story={story1} index={0} />)).toMatchSnapshot();
    expect(shallow(<StoryItem story={story2} index={1} />)).toMatchSnapshot();
  });
});
