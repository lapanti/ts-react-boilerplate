import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import { Epic, combineEpics, ActionsObservable } from 'redux-observable';
import { DefaultAction } from '../../redux/utils';
import Todo from '../../common/Todo';

const testDelay = 1000;

export class IndexState {
    readonly title: string = '';
    readonly todos: Todo[] = [];
    readonly loading: boolean = false;
}

export type SET_TITLE = 'boilerplate/Index/SET_TITLE';
export const SET_TITLE: SET_TITLE = 'boilerplate/Index/SET_TITLE';
export type SAVE_TODO = 'boilerplate/Index/SAVE_TODO';
export const SAVE_TODO: SAVE_TODO = 'boilerplate/Index/SAVE_TODO';
export type SAVE_TODO_SUCCESS = 'boilerplate/Index/SAVE_TODO_SUCCESS';
export const SAVE_TODO_SUCCESS: SAVE_TODO_SUCCESS = 'boilerplate/Index/SAVE_TODO_SUCCESS';
export type SET_DONE = 'boilerplate/Index/SET_DONE';
export const SET_DONE: SET_DONE = 'boilerplate/Index/SET_DONE';
export type SET_DONE_SUCCESS = 'boilerplate/Index/SET_DONE_SUCCESS';
export const SET_DONE_SUCCESS: SET_DONE_SUCCESS = 'boilerplate/Index/SET_DONE_SUCCESS';

export type SetTitleAction = { type: SET_TITLE, payload: string };
export const setTitle = (title: string): SetTitleAction => ({ type: SET_TITLE, payload: title });
export type SaveTodoAction = { type: SAVE_TODO };
export const saveTodo = (): SaveTodoAction => ({ type: SAVE_TODO });
export type SaveTodoSuccessAction = { type: SAVE_TODO_SUCCESS };
export const saveTodoSuccess = (): SaveTodoSuccessAction => ({ type: SAVE_TODO_SUCCESS });
export type SetDoneAction = { type: SET_DONE, payload: number };
export const setDone = (i: number) => ({ type: SET_DONE, payload: i });
export type SetDoneSuccessAction = { type: SET_DONE_SUCCESS, payload: number };
export const setDoneSuccess = (i: number): SetDoneSuccessAction => ({ type: SET_DONE_SUCCESS, payload: i });

export type IndexActions = SetTitleAction | SaveTodoAction | SaveTodoSuccessAction | SetDoneAction | SetDoneSuccessAction | DefaultAction;

export const saveTodoEpic: Epic<IndexActions, undefined> = (action$: ActionsObservable<IndexActions>): Observable<IndexActions> =>
    action$.ofType(SAVE_TODO)
        .delay(testDelay)
        .mapTo(saveTodoSuccess());

export const setDoneEpic: Epic<IndexActions, undefined> = (action$: ActionsObservable<IndexActions>): Observable<IndexActions> =>
    action$.ofType(SET_DONE)
        .delay(testDelay)
        .map((action: SetDoneAction) => setDoneSuccess(action.payload));

export const IndexEpics = combineEpics(saveTodoEpic, setDoneEpic);

const IndexReducer = (state: IndexState = new IndexState(), action: IndexActions = DefaultAction): IndexState => {
    switch (action.type) {
        case SET_TITLE:
            return { ...state, title: action.payload };
        case SAVE_TODO:
            return { ...state, loading: true };
        case SAVE_TODO_SUCCESS:
            return {
                ...state,
                title: '',
                todos: state.todos.concat(new Todo(state.todos.length + 1, state.title)),
                loading: false,
            };
        case SET_DONE:
            return { ...state, loading: true };
        case SET_DONE_SUCCESS:
            return {
                ...state,
                todos: state.todos.map(t => t.id === action.payload ? t.setDone() : t),
                loading: false,
            };
        default:
            return state;
    }
};

export default IndexReducer;
