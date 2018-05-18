import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { ajax } from 'rxjs/observable/dom/ajax';
import { Epic, combineEpics } from 'redux-observable';
import { createAction, ActionType, getType } from 'typesafe-actions';

import { DefaultAction } from '../../redux/utils';
import StoryType from '../../common/StoryType';
import Story from '../../common/Story';
import { BASE_URL } from '../../constants/api';
import { State } from '../../redux/reducer';

export class HNClientState {
  readonly storyLimit = 25;
  readonly storyType: StoryType = StoryType.NEW;
  readonly storyIds: number[] = [];
  readonly stories: Story[] = [];
  readonly loading: boolean = false;
}

export enum HNClientTypes {
  SET_STORY_TYPE = 'boilerplate/HNClient/SET_STORY_TYPE',
  GET_STORIES = 'boilerplate/HNClient/GET_STORIES',
  GET_STORY_ID_SUCCESS = 'boilerplate/HNClient/GET_STORY_ID_SUCCESS',
  GET_STORY_SUCCESS = 'boilerplate/HNClient/GET_STORY_SUCCESS',
}

export const setStoryType = createAction(
  HNClientTypes.SET_STORY_TYPE,
  resolve => (payload: StoryType) => resolve(payload),
);
export const getStories = createAction(
  HNClientTypes.GET_STORIES,
  resolve => (payload: StoryType) => resolve(payload),
);
export const getStoryIdSuccess = createAction(
  HNClientTypes.GET_STORY_ID_SUCCESS,
  resolve => (storyId: number) => resolve(storyId),
);
export const getStorySuccess = createAction(
  HNClientTypes.GET_STORY_SUCCESS,
  resolve => (payload: Story) => resolve(payload),
);

export const HNClientActions = {
  setStoryType,
  getStories,
  getStoryIdSuccess,
  getStorySuccess,
};
export type HNClientActions =
  | ActionType<typeof HNClientActions>
  | DefaultAction;

export const getStoryIdsEpic: Epic<HNClientActions, never> = action$ =>
  action$
    .ofType<ActionType<typeof getStories>>(getType(getStories))
    .switchMap(action =>
      ajax
        .getJSON<number[]>(`${BASE_URL}/${action.payload}stories.json`)
        .mergeMap(ids => ids.map(storyId => getStoryIdSuccess(storyId))),
    );

export const getStoryEpic: Epic<HNClientActions, State> = (action$, store) =>
  action$
    .ofType<ActionType<typeof getStoryIdSuccess>>(getType(getStoryIdSuccess))
    .take(store.getState().hnClient.storyLimit)
    .mergeMap(action =>
      ajax.getJSON<Story>(`${BASE_URL}/item/${action.payload}.json`),
    )
    .map(story => getStorySuccess(story));

export const HNClientEpics = combineEpics(getStoryIdsEpic, getStoryEpic);

const HNClientReducer = (
  state: HNClientState = new HNClientState(),
  action: HNClientActions,
): HNClientState => {
  switch (action.type) {
    case getType(getStories):
      return { ...state, loading: true };
    case getType(getStoryIdSuccess):
      return { ...state, storyIds: [...state.storyIds, action.payload] };
    case getType(getStorySuccess):
      return {
        ...state,
        storyIds: state.storyIds.filter(
          storyId => storyId !== action.payload.id,
        ),
        stories: [...state.stories, action.payload],
        loading: false,
      };
    default:
      return state;
  }
};

export default HNClientReducer;
