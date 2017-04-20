import { ActionsObservable } from 'redux-observable';
import Todo from '../../../common/Todo';
import IndexReducer, {
    SET_TITLE,
    setTitle,
    SetTitleAction,
    SAVE_TODO,
    saveTodo,
    SaveTodoAction,
    saveTodoEpic,
    SAVE_TODO_SUCCESS,
    saveTodoSuccess,
    SaveTodoSuccessAction,
    SET_DONE,
    setDone,
    SetDoneAction,
    setDoneEpic,
    SET_DONE_SUCCESS,
    setDoneSuccess,
    SetDoneSuccessAction,
    IndexState,
} from '../IndexReducer';

describe('IndexReducer', () => {
    it('should set the correct title as payload on setTitle', () => {
        const payload = 'THIS_IS_A_TEST_TITLE';
        const setTitleAction: SetTitleAction = setTitle(payload);
        expect(setTitleAction).toEqual({ type: SET_TITLE, payload });
        const newState: IndexState = IndexReducer(undefined, setTitleAction);
        expect(newState.title).toEqual(payload);
    });

    it('should set the correct values on saveTodo', () => {
        const saveTodoAction: SaveTodoAction = saveTodo();
        expect(saveTodoAction).toEqual({ type: SAVE_TODO });
        const newState: IndexState = IndexReducer(undefined, saveTodoAction);
        expect(newState.loading).toBeTruthy();
    });

    it('should trigger the correct action on saveTodoEpic', async () => (
        await saveTodoEpic(ActionsObservable.of(saveTodo()), undefined)
            .subscribe(actionReceived => expect(actionReceived).toEqual([{ type: SAVE_TODO_SUCCESS }]))
    ));

    it('should set the correct values on saveTodoSuccess', () => {
        const initialState: IndexState = { title: 'TEST', todos: [], loading: true };
        const saveTodoSuccessAction: SaveTodoSuccessAction = saveTodoSuccess();
        expect(saveTodoSuccessAction).toEqual({ type: SAVE_TODO_SUCCESS });
        const newState: IndexState = IndexReducer(initialState, saveTodoSuccessAction);
        expect(newState.title).toEqual('');
        expect(newState.todos[0].done).toBeFalsy();
        expect(newState.todos[0].id).toEqual(1);
        expect(newState.todos[0].title).toEqual(initialState.title);
        expect(newState.loading).toBeFalsy();
    });

    it('should set the correct values on setDone', () => {
        const setDoneAction: SetDoneAction = setDone(0);
        expect(setDoneAction).toEqual({ type: SET_DONE, payload: 0 });
        const newState: IndexState = IndexReducer(undefined, setDoneAction);
        expect(newState.loading).toBeTruthy();
    });

    it('should trigger the correct action on setDoneEpic', async () => (
        await setDoneEpic(ActionsObservable.of(setDone(0)), undefined)
            .subscribe(actionReceived => expect(actionReceived).toEqual([{
                type: SET_DONE_SUCCESS,
                payload: 0,
            }]))
    ));

    it('should set the correct values on setDoneSuccess', () => {
        const initialState: IndexState = { title: '', todos: [new Todo(0, '')], loading: true };
        const setDoneSuccessAction: SetDoneSuccessAction = setDoneSuccess(0);
        expect(setDoneSuccessAction).toEqual({ type: SET_DONE_SUCCESS, payload: 0 });
        const newState: IndexState = IndexReducer(initialState, setDoneSuccessAction);
        expect(newState.loading).toBeFalsy();
        expect(newState.todos[0].done).toBeTruthy();
        expect(newState.todos[0].id).toEqual(initialState.todos[0].id);
        expect(newState.todos[0].title).toEqual(initialState.todos[0].title);
    });
});
