import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { History } from 'history';
import { routerMiddleware } from 'react-router-redux';
import reducer, { epics, State } from './reducer';

// Below is a necessary hack to access __PRELOADED_STATE__ on the global window object
const preloadedState: State = (<any>window).__PRELOADED_STATE__;
delete (<any>window).__PRELOADED_STATE__;

const composeEnhancers = (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware(epics);

const configureStore = (history: History) => createStore<State>(
    reducer,
    preloadedState,
    composeEnhancers(applyMiddleware(routerMiddleware(history), epicMiddleware)),
);

export default configureStore;
