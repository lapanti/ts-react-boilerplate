import { createStore, applyMiddleware, Store } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import reducer, { epics, State } from './reducer';

// Below is a necessary hack to access __PRELOADED_STATE__ on the global window object
const preloadedState: State = (<any>window).__PRELOADED_STATE__;
delete (<any>window).__PRELOADED_STATE__;

const epicMiddleware = createEpicMiddleware(epics);

const configureStore = (): Store<State> => createStore(
    reducer,
    preloadedState,
    applyMiddleware(epicMiddleware),
);

export default configureStore;
