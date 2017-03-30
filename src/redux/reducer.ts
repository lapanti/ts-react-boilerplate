import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { DefaultAction } from './utils';
import IndexReducer, { IndexEpics, IndexState, IndexActions } from '../modules/index/IndexReducer';

const reducer = combineReducers<State>({
    index: IndexReducer,
});

export class State {
    readonly index: IndexState = new IndexState();
}

export const epics = combineEpics(
    IndexEpics,
);

export type Actions = DefaultAction | IndexActions;

export default reducer;
