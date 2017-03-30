import * as React from 'react';

export interface IPostProps {
    post: IPost;
};

export interface IPost {
    userId: number;
    id: number;
    title: string;
    body: string;
};

const Post: React.StatelessComponent<IPostProps> = ({ post }) => (
    <div className="post">
        <h3 className="post__header">{post.title}</h3>
        <p className="post__body">{post.body}</p>
    </div>
);

export default Post;
