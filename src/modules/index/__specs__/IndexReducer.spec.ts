import * as nock from 'nock';
import { ActionsObservable } from 'redux-observable';
import configureStore from '../../../redux/store';
import IndexReducer, {
    SET_NAME,
    setName,
    fetchPost,
    fetchPostEpic,
    FETCH_POST,
    FETCH_POST_SUCCESS,
} from '../IndexReducer';

describe('IndexReducer', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    describe('setName', () => (
        it('should set the correct name as payload', () => {
            const payload = 'THIS_IS_A_TEST_NAME';
            const setNameAction = setName(payload);
            expect(setNameAction).toEqual({ type: SET_NAME, payload });
            const newState = IndexReducer(undefined, setNameAction);
            return expect(newState.name).toEqual(payload);
        })
    ));

    describe('fetchPostEpic', () => (
        it('should make the correct AJAX calls and then emit the correct action', async () => {
            const payload = { userId: 0, id: 0, title: 'TITLE', body: 'BODY' };
            const okay = 200;
            nock('https://jsonplaceholder.typicode.com')
                .get('/posts/1')
                .reply(okay, payload);
            const fetchAction = fetchPost();
            expect(fetchAction).toEqual({ type: FETCH_POST });
            return await fetchPostEpic(ActionsObservable.of(fetchAction))
                .subscribe(actionsReceived =>
                    expect(actionsReceived)
                        .toEqual([{ type: FETCH_POST_SUCCESS, payload }]));
        })
    ));
});
