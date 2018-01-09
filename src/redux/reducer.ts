import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { routerReducer, RouterState, RouterAction, LocationChangeAction } from 'react-router-redux';
import { DefaultAction } from './utils';
import IndexReducer, { IndexEpics, IndexState, IndexActions } from '../modules/index/IndexReducer';

const reducer = combineReducers<State>({
    router: routerReducer,
    index: IndexReducer,
});

export class State {
    readonly router: RouterState = null;
    readonly index: IndexState = new IndexState();
}

export const epics = combineEpics(IndexEpics);

export type Actions = DefaultAction | LocationChangeAction | RouterAction | IndexActions;

export default reducer;
