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
  GET_STORY_IDS = 'boilerplate/HNClient/GET_STORY_IDS',
  GET_STORY_ID_SUCCESS = 'boilerplate/HNClient/GET_STORY_ID_SUCCESS',
  GET_STORY = 'boilerplate/HNClient/GET_STORY',
  GET_STORY_SUCCESS = 'boilerplate/HNClient/GET_STORY_SUCCESS',
}

export const setStoryType = createAction(
  HNClientTypes.SET_STORY_TYPE,
  resolve => (st: StoryType) => resolve(st),
);
export const getStoryIds = createAction(
  HNClientTypes.GET_STORY_IDS,
  resolve => (st: StoryType) => resolve(st),
);
export const getStoryIdSuccess = createAction(
  HNClientTypes.GET_STORY_ID_SUCCESS,
  resolve => (storyId: number) => resolve(storyId),
);
export const getStory = createAction(
  HNClientTypes.GET_STORY,
  resolve => (storyId: number) => resolve(storyId),
);
export const getStorySuccess = createAction(
  HNClientTypes.GET_STORY_SUCCESS,
  resolve => (s: Story) => resolve(s),
);

export const HNClientActions = {
  setStoryType,
  getStoryIds,
  getStoryIdSuccess,
  getStory,
  getStorySuccess,
};
export type HNClientActions =
  | ActionType<typeof HNClientActions>
  | DefaultAction;

export const getStoryIdsEpic: Epic<HNClientActions, never> = action$ =>
  action$
    .ofType<ActionType<typeof getStoryIds>>(getType(getStoryIds))
    .mergeMap(action =>
      ajax
        .getJSON<number[]>(`${BASE_URL}/${action.payload}stories.json`)
        .mergeMap(ids =>
          [].concat.apply(
            [],
            ids.map(storyId => [getStoryIdSuccess(storyId), getStory(storyId)]),
          ),
        ),
    );

export const getStoryEpic: Epic<HNClientActions, State> = (action$, store) =>
  action$
    .ofType<ActionType<typeof getStory>>(getType(getStory))
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
    case getType(getStoryIds):
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
