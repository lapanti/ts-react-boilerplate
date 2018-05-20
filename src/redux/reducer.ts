import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { routerReducer, RouterState, RouterAction } from 'react-router-redux';
import { DefaultAction } from './utils';
import HNClientReducer, {
  HNClientEpics,
  HNClientState,
  HNClientActions,
} from '../modules/hnClient/HNClientReducer';

const reducer = combineReducers<State>({
  router: routerReducer,
  hnClient: HNClientReducer,
});

export class State {
  readonly router: RouterState = { location: null };
  readonly hnClient: HNClientState = new HNClientState();
}

export type Actions = HNClientActions | RouterAction | DefaultAction;

export const epics = combineEpics(HNClientEpics);

export default reducer;
