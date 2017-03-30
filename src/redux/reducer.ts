import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import IndexReducer, { IndexEpics, IndexState } from '../modules/index/IndexReducer';

const reducer = combineReducers<State>({
    index: IndexReducer,
});

export class State {
    readonly index: IndexState = new IndexState();
};

export const epics = combineEpics(
    IndexEpics,
);

export default reducer;
