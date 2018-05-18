import 'rxjs/add/operator/toArray';
import { ActionsObservable } from 'redux-observable';
import * as nock from 'nock';
import { OK } from 'http-status-codes';

import Story from '../../../common/Story';
import HNClientReducer, {
  HNClientTypes,
  HNClientActions,
  getStoryIdsEpic,
  getStoryEpic,
  HNClientState,
} from '../HNClientReducer';
import StoryType from '../../../common/StoryType';
import ItemType from '../../../common/ItemType';
import { BASE_URL } from '../../../constants/api';

describe('HNClientReducer', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('getStoryIds should set the state as loading', () => {
    const payload = StoryType.NEW;
    const getStoryIdsAction = HNClientActions.getStoryIds(payload);
    expect(getStoryIdsAction).toEqual({
      type: HNClientTypes.GET_STORY_IDS,
      payload,
    });
    const newState: HNClientState = HNClientReducer(
      undefined,
      getStoryIdsAction,
    );
    expect(newState.loading).toBeTruthy();
  });

  it('getStoryIdsEpic should call the correct endpoint on getStoryIds', async () => {
    const st = StoryType.NEW;
    const storyId1 = 123456;
    const storyId2 = 234567;
    const payload = [storyId1, storyId2];
    nock(BASE_URL)
      .get(`/${st}stories.json`)
      .reply(200, payload, { 'Content-Type': 'application/json' });
    return await getStoryIdsEpic(
      ActionsObservable.of(HNClientActions.getStoryIds(st)),
      undefined,
      undefined,
    )
      .toArray()
      .subscribe(actionsReceived =>
        expect(actionsReceived).toEqual([
          HNClientActions.getStoryIdSuccess(storyId1),
          HNClientActions.getStory(storyId1),
          HNClientActions.getStoryIdSuccess(storyId2),
          HNClientActions.getStory(storyId2),
        ]),
      );
  });

  it('getStoryIdSuccess should add the correct id to state', () => {
    const payload = 123456;
    const getStoryIdSuccessAction = HNClientActions.getStoryIdSuccess(payload);
    expect(getStoryIdSuccessAction).toEqual({
      type: HNClientTypes.GET_STORY_ID_SUCCESS,
      payload,
    });
    const newState: HNClientState = HNClientReducer(
      undefined,
      getStoryIdSuccessAction,
    );
    expect(newState.storyIds).toEqual([payload]);
  });

  it('getStorySuccess should set loading to false and add the correct story to state and remove the given story from id list', () => {
    const storyId = 123456;
    const nonExistentId = 654321;
    const payload: Story = {
      by: 'me',
      descendants: 0,
      id: storyId,
      kids: [],
      score: 0,
      time: 1,
      title: 'Test',
      type: ItemType.STORY,
      url: '',
    };
    const getStorySuccessAction = HNClientActions.getStorySuccess(payload);
    expect(getStorySuccessAction).toEqual({
      type: HNClientTypes.GET_STORY_SUCCESS,
      payload,
    });
    const newState: HNClientState = HNClientReducer(
      { ...new HNClientState(), storyIds: [storyId, nonExistentId] },
      getStorySuccessAction,
    );
    expect(newState.stories).toEqual([payload]);
    expect(newState.loading).toBeFalsy();
    expect(newState.storyIds).toEqual([nonExistentId]);
  });

  it('getStoryEpic should call the correct endpoint on getStoryIdSuccess', async () => {
    const storyId = 123456;
    const payload: Story = {
      by: 'me',
      descendants: 0,
      id: storyId,
      kids: [],
      score: 0,
      time: 1,
      title: 'Test',
      type: ItemType.STORY,
      url: '',
    };
    nock(`${BASE_URL}/item`)
      .get(`/${storyId}.json`)
      .reply(200, payload, { 'Content-Type': 'application/json' });
    return await getStoryIdsEpic(
      ActionsObservable.of(HNClientActions.getStory(storyId)),
      undefined,
      undefined,
    ).subscribe(actionReceived =>
      expect(actionReceived).toEqual(HNClientActions.getStorySuccess(payload)),
    );
  });
});
