import * as React from 'react';
import { shallow } from 'enzyme';
import IndexView from '../IndexView';
import Post, { IPost } from '../../../components/Post';

describe('IndexView', () => {
    const testPost: IPost = { userId: 0, id: 0, title: 'A_TITLE', body: 'A_BODY' };
    const testName = 'A_TEST_NAME';
    const testSetName = jest.fn();
    const testFetchPost = jest.fn();
    const testDispatch = jest.fn();
    const wrapperNoPost = shallow(<IndexView name={testName} setName={testSetName} fetchPost={testFetchPost} dispatch={testDispatch} />);

    it('should render with correct props', () => {
        expect(wrapperNoPost).toMatchSnapshot();
        const wrapperPost = shallow(<IndexView name={testName} post={testPost} setName={testSetName} fetchPost={testFetchPost} dispatch={testDispatch} />);
        expect(wrapperPost).toMatchSnapshot();
    });

    it('should call the correct functions when typing to input field', () => {
        const testValue = 'A_TEST_VALUE';
        wrapperNoPost.find('[type="text"]').simulate('change', { target: { testValue }});
        expect(testDispatch).toBeCalledWith(testSetName(testValue));
    });

    it('should call the correct functions on click', () => {
        wrapperNoPost.find('button').simulate('click');
        expect(testDispatch).toBeCalledWith(testFetchPost());
    });
});
