import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { History } from 'history';
import { routerMiddleware } from 'react-router-redux';
import reducer, { epics, State } from './reducer';

// Below is a necessary hack to access __PRELOADED_STATE__ on the global window object
const preloadedState: State = (<any>window).__PRELOADED_STATE__;
delete (<any>window).__PRELOADED_STATE__;

const composeEnhancers =
  (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware(epics);

const configureStore = (history: History) => {
  const store = createStore<State>(
    reducer,
    preloadedState,
    composeEnhancers(
      applyMiddleware(routerMiddleware(history), epicMiddleware),
    ),
  );

  if ((module as any).hot) {
    // Enable Webpack hot module replacement for reducers
    (module as any).hot.accept('./reducer', () => {
      const nextRootReducer = require('./reducer');
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
};

export default configureStore;
