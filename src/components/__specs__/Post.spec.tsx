import * as React from 'react';
import { shallow } from 'enzyme';
import Post, { IPost } from '../Post';

describe('Post', () => (
    it('render correctly', () => {
        const post: IPost = { userId: 0, id: 0, title: 'A_TITLE', body: 'A_BODY' };
        const wrapper = shallow(<Post post={post} />);
        expect(wrapper).toMatchSnapshot();
    })
));
