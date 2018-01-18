import { Action } from 'redux';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import { Epic, combineEpics } from 'redux-observable';
import { makeAction, isAction } from '../../redux/guards';
import Todo from '../../common/Todo';

const testDelay = 1000;

export class IndexState {
    readonly title: string = '';
    readonly todos: Todo[] = [];
    readonly loading: boolean = false;
}

export const SET_TITLE = 'boilerplate/Index/SET_TITLE';
export const SAVE_TODO = 'boilerplate/Index/SAVE_TODO';
export const SAVE_TODO_SUCCESS = 'boilerplate/Index/SAVE_TODO_SUCCESS';
export const SET_DONE = 'boilerplate/Index/SET_DONE';
export const SET_DONE_SUCCESS = 'boilerplate/Index/SET_DONE_SUCCESS';

export const setTitle = makeAction(SET_TITLE)((title: string) => ({ type: SET_TITLE, payload: title }));
export const saveTodo = makeAction(SAVE_TODO)(() => ({ type: SAVE_TODO }));
export const saveTodoSuccess = makeAction(SAVE_TODO_SUCCESS)(() => ({ type: SAVE_TODO_SUCCESS }));
export const setDone = makeAction(SET_DONE)((i: number) => ({ type: SET_DONE, payload: i }));
export const setDoneSuccess = makeAction(SET_DONE_SUCCESS)((i: number) => ({ type: SET_DONE_SUCCESS, payload: i }));

export const saveTodoEpic: Epic<Action, undefined> = action$ =>
    action$
        .ofType(SAVE_TODO)
        .delay(testDelay)
        .mapTo(saveTodoSuccess());

export const setDoneEpic: Epic<Action, undefined> = action$ =>
    action$
        .ofType(SET_DONE)
        .delay(testDelay)
        .map(action => isAction(action, setDone) && setDoneSuccess(action.payload));

export const IndexEpics = combineEpics(saveTodoEpic, setDoneEpic);

const IndexReducer = (state: IndexState = new IndexState(), action: Action): IndexState => {
    if (isAction(action, setTitle)) {
        return { ...state, title: action.payload };
    } else if (isAction(action, saveTodo)) {
        return { ...state, loading: true };
    } else if (isAction(action, saveTodoSuccess)) {
        return {
            ...state,
            title: '',
            todos: state.todos.concat(new Todo(state.todos.length + 1, state.title)),
            loading: false,
        };
    } else if (isAction(action, setDone)) {
        return { ...state, loading: true };
    } else if (isAction(action, setDoneSuccess)) {
        return {
            ...state,
            todos: state.todos.map(t => (t.id === action.payload ? t.setDone() : t)),
            loading: false,
        };
    } else {
        return state;
    }
};

export default IndexReducer;
