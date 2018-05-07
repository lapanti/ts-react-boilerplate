import { ActionsObservable } from 'redux-observable';
import Todo from '../../../common/Todo';
import HNClientReducer, {
  SET_TITLE,
  setTitle,
  SAVE_TODO,
  saveTodo,
  saveTodoEpic,
  SAVE_TODO_SUCCESS,
  saveTodoSuccess,
  SET_DONE,
  setDone,
  setDoneEpic,
  SET_DONE_SUCCESS,
  setDoneSuccess,
  HNClientState,
} from '../HNClientReducer';

describe('HNClientReducer', () => {
  it('should set the correct title as payload on setTitle', () => {
    const payload = 'THIS_IS_A_TEST_TITLE';
    const setTitleAction = setTitle(payload);
    expect(setTitleAction).toEqual({ type: SET_TITLE, payload });
    const newState: HNClientState = HNClientReducer(undefined, setTitleAction);
    expect(newState.title).toEqual(payload);
  });

  it('should set the correct values on saveTodo', () => {
    const saveTodoAction = saveTodo();
    expect(saveTodoAction).toEqual({ type: SAVE_TODO });
    const newState: HNClientState = HNClientReducer(undefined, saveTodoAction);
    expect(newState.loading).toBeTruthy();
  });

  it('should trigger the correct action on saveTodoEpic', async () =>
    await saveTodoEpic(
      ActionsObservable.of(saveTodo()),
      undefined,
      undefined,
    ).forEach(actionReceived =>
      expect(actionReceived).toEqual({ type: SAVE_TODO_SUCCESS }),
    ));

  it('should set the correct values on saveTodoSuccess', () => {
    /* tslint:disable:no-magic-numbers */
    const testT = new Todo(1, 'Doing', true);
    const initialState: HNClientState = {
      title: 'TEST',
      todos: [testT],
      loading: true,
    };
    const saveTodoSuccessAction = saveTodoSuccess();
    expect(saveTodoSuccessAction).toEqual({ type: SAVE_TODO_SUCCESS });
    const newState: HNClientState = HNClientReducer(
      initialState,
      saveTodoSuccessAction,
    );
    expect(newState.title).toEqual('');
    expect(newState.todos.length).toEqual(2);
    expect(newState.todos[1].done).toBeFalsy();
    expect(newState.todos[1].id).toEqual(2);
    expect(newState.todos[1].title).toEqual(initialState.title);
    expect(newState.loading).toBeFalsy();
    /* tslint:enable:no-magic-numbers */
  });

  it('should set the correct values on setDone', () => {
    const setDoneAction = setDone(0);
    expect(setDoneAction).toEqual({ type: SET_DONE, payload: 0 });
    const newState: HNClientState = HNClientReducer(undefined, setDoneAction);
    expect(newState.loading).toBeTruthy();
  });

  it('should trigger the correct action on setDoneEpic', async () =>
    await setDoneEpic(
      ActionsObservable.of(setDone(0)),
      undefined,
      undefined,
    ).forEach(actionReceived =>
      expect(actionReceived).toEqual({ type: SET_DONE_SUCCESS, payload: 0 }),
    ));

  it('should set the correct values on setDoneSuccess', () => {
    const initialState: HNClientState = {
      title: '',
      todos: [new Todo(0, '')],
      loading: true,
    };
    const setDoneSuccessAction = setDoneSuccess(0);
    expect(setDoneSuccessAction).toEqual({
      type: SET_DONE_SUCCESS,
      payload: 0,
    });
    const newState: HNClientState = HNClientReducer(
      initialState,
      setDoneSuccessAction,
    );
    expect(newState.loading).toBeFalsy();
    expect(newState.todos[0].done).toBeTruthy();
    expect(newState.todos[0].id).toEqual(initialState.todos[0].id);
    expect(newState.todos[0].title).toEqual(initialState.todos[0].title);
  });
});
