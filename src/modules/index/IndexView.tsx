import * as React from 'react';
import { Dispatch, Action } from 'redux';
import Post, { IPost } from '../../components/Post';

export interface IIndexProps {
    name: string;
    post?: IPost;
    setName: (n: string) => Action;
    fetchPost: () => Action;
    dispatch: Dispatch<Action>;
}

const IndexView: React.StatelessComponent<IIndexProps> = ({ name, post, setName, fetchPost, dispatch }) => (
    <div className="index">
        <h1 className="index__header">{name}</h1>
        <input className="index__input" type="text" onChange={e => dispatch(setName(e.target.value))} />
        <br />
        <button className="index__button" onClick={() => dispatch(fetchPost())}>
            This button will be styled
        </button>
        {post && <Post post={post} />}
    </div>
);

export default IndexView;
