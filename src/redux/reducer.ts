import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { routerReducer, RouterState } from 'react-router-redux';
import IndexReducer, {
  IndexEpics,
  IndexState,
} from '../modules/index/IndexReducer';

const reducer = combineReducers<State>({
  router: routerReducer,
  index: IndexReducer,
});

export class State {
  readonly router: RouterState = { location: null };
  readonly index: IndexState = new IndexState();
}

export const epics = combineEpics(IndexEpics);

export default reducer;
