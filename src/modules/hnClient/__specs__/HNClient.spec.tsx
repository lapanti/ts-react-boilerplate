import * as React from 'react';
import { shallow } from 'enzyme';
import createHistory from 'history/createBrowserHistory';

import { HNClient } from '../HNClient';
import Story from '../../../common/Story';
import StoryType from '../../../common/StoryType';
import ItemType from '../../../common/ItemType';

describe('<HNClient />', () => {
  const testStory1: Story = {
    by: 'me',
    descendants: 0,
    id: 123456,
    kids: [],
    score: 0,
    time: 1,
    title: 'Test',
    type: ItemType.STORY,
    url: '',
  };
  const testStory2: Story = {
    by: 'me',
    descendants: 0,
    id: 234567,
    kids: [],
    score: 1,
    time: 1,
    title: 'Test 2',
    type: ItemType.STORY,
    url: '',
  };
  const wrapperMinimalProps = shallow(
    <HNClient
      storyType={StoryType.NEW}
      stories={[]}
      loading={false}
      match={{ params: undefined, isExact: true, path: '', url: '' }}
      location={{ pathname: '', search: '', state: {}, hash: '', key: '' }}
      history={createHistory()}
    />,
  );
  const wrapperMaximumProps = shallow(
    <HNClient
      storyType={StoryType.NEW}
      stories={[testStory1, testStory2]}
      loading={false}
      match={{ params: undefined, isExact: true, path: '', url: '' }}
      location={{ pathname: '', search: '', state: {}, hash: '', key: '' }}
      history={createHistory()}
    />,
  );

  it('should render with correct props', () => {
    expect(wrapperMinimalProps).toMatchSnapshot();
    expect(wrapperMaximumProps).toMatchSnapshot();
  });
});
