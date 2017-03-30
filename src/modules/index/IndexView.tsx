import * as React from 'react';
import { Dispatch } from 'redux';
import { Actions } from '../../redux/reducer';
import Post, { IPost } from '../../components/Post';

export interface IIndexProps {
    name: string;
    post?: IPost;
    setName: (n: string) => Dispatch<Actions>;
    fetchPost: () => Dispatch<Actions>;
}

const IndexView: React.StatelessComponent<IIndexProps> = ({ name, post, setName, fetchPost }) => (
    <div className="index">
        <h1 className="index__header">{name}</h1>
        <input className="index__input" type="text" onChange={e => setName(e.target.value)} />
        <br />
        <button className="index__button" onClick={() => fetchPost()}>
            This button will be styled
        </button>
        {post && <Post post={post} />}
    </div>
);

export default IndexView;
