import { MiddlewareAPI } from 'redux';
import { Observable } from 'rxjs/observable';
import { ajax } from 'rxjs/observable/dom/ajax';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Epic, combineEpics, ActionsObservable } from 'redux-observable';
import * as ReduxUtils from '../../redux/utils';
import { IPost } from '../../components/Post';

export class IndexState {
    readonly name: string = 'Hello World';
    readonly post?: IPost;
}

export type SET_NAME = 'boilerplate/Index/SET_NAME';
export const SET_NAME: SET_NAME = 'boilerplate/Index/SET_NAME';
export type FETCH_POST = 'boilerplate/Index/FETCH_POST';
export const FETCH_POST: FETCH_POST = 'boilerplate/Index/FETCH_POST';
export type FETCH_POST_SUCCESS = 'boilerplate/Index/FETCH_POST_SUCCESS';
export const FETCH_POST_SUCCESS: FETCH_POST_SUCCESS = 'boilerplate/Index/FETCH_POST_SUCCESS';
export type FETCH_POST_FAIL = 'boilerplate/Index/FETCH_POST_FAIL';
export const FETCH_POST_FAIL: FETCH_POST_FAIL = 'boilerplate/Index/FETCH_POST_FAIL';

export type SetNameAction = { type: SET_NAME, payload: string };
export const setName = (name: string): SetNameAction => ({ type: SET_NAME, payload: name });
export type FetchPostAction = { type: FETCH_POST };
export const fetchPost = () => ({ type: FETCH_POST });
export type FetchPostSuccessAction = { type: FETCH_POST_SUCCESS, payload: IPost };
export const fetchPostSuccess = (payload: IPost) => ({ type: FETCH_POST_SUCCESS, payload });
export type FetchPostFail = { type: FETCH_POST_FAIL };
export const fetchPostFail = () => ({ type: FETCH_POST_FAIL });

type IndexActions = SetNameAction | FetchPostAction | FetchPostSuccessAction | ReduxUtils.DefaultAction;

export const fetchPostEpic: Epic<IndexActions, undefined> = (action$: ActionsObservable<IndexActions>): Observable<IndexActions> =>
    action$.ofType(FETCH_POST)
        .mergeMap(action => ajax.getJSON('https://jsonplaceholder.typicode.com/posts/1')
            .map((response: IPost) => fetchPostSuccess(response)));

const IndexReducer = (state: IndexState = new IndexState(), action: IndexActions): IndexState => {
    switch (action.type) {
        case SET_NAME:
            return { ...state, name: action.payload };
        case FETCH_POST_SUCCESS:
            return { ...state, post: action.payload };
        default:
            return state;
    }
};

export const IndexEpics = combineEpics(fetchPostEpic);

export default IndexReducer;
