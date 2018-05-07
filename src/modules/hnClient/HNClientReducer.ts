import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import { ajax } from 'rxjs/observable/dom/ajax';
import { Epic, combineEpics } from 'redux-observable';
import { Store } from 'redux';

import { State, Actions } from '../../redux/reducer';
import Todo from '../../common/Todo';
import StoryType from '../../common/StoryType';
import Story from '../../common/Story';
import { BASE_URL } from '../../constants/api';

export class HNClientState {
  readonly storyType: StoryType = StoryType.NEW;
  readonly stories: Story[] = [];
  readonly loading: boolean = false;
}

export enum HNClientTypeKeys {
  SET_STORY_TYPE = 'boilerplate/HNClient/SET_STORY_TYPE',
  GET_STORIES = 'boilerplate/HNClient/GET_STORIES',
  GET_STORY_IDS_SUCCESS = 'boilerplate/HNClient/GET_STORY_IDS_SUCCESS',
  GET_STORIES_SUCCESS = 'boilerplate/HNClient/GET_STORIES_SUCCESS',
}

export const setStoryType = (payload: StoryType) => ({
  type: HNClientTypeKeys.SET_STORY_TYPE,
  payload,
});
export type SetStoryType = ReturnType<typeof setStoryType>;

export const getStories = (payload: StoryType) => ({
  type: HNClientTypeKeys.GET_STORIES,
  payload,
});
export type GetStories = ReturnType<typeof getStories>;

export const getStoryIdsSuccess = (payload: number[]) => ({
  type: HNClientTypeKeys.GET_STORY_IDS_SUCCESS,
  payload,
});
export type GetStoryIdsSuccess = ReturnType<typeof getStoryIdsSuccess>;

export const getStoriesSuccess = (payload: Story[]) => ({
  type: HNClientTypeKeys.GET_STORIES_SUCCESS,
  payload,
});
export type GetStoriesSuccess = ReturnType<typeof getStoriesSuccess>;

export type HNClientActions =
  | SetStoryType
  | GetStories
  | GetStoryIdsSuccess
  | GetStoriesSuccess;

export const getStoryIdsEpic: Epic<Actions, undefined> = action$ =>
  action$
    .ofType(HNClientTypeKeys.GET_STORIES)
    .mergeMap(({ payload }: GetStories) =>
      ajax
        .getJSON(`${BASE_URL}/${payload}stories.json`)
        .map((storyIds: number[]) => getStoryIdsSuccess(storyIds)),
    );

export const HNClientEpics = combineEpics(getStoryIdsEpic);

const HNClientReducer = (
  state: HNClientState = new HNClientState(),
  action: Actions,
): HNClientState => {
  switch (action.type) {
    case HNClientTypeKeys.GET_STORIES:
      return { ...state, loading: true };
    case HNClientTypeKeys.GET_STORIES_SUCCESS:
      return { ...state, stories: action.payload, loading: false };
    default:
      return state;
  }
};

export default HNClientReducer;
