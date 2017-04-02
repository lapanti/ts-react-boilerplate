import * as React from 'react';
import { shallow } from 'enzyme';
import TodoComponent from '../TodoComponent';
import Todo from '../../classes/Todo';

describe('TodoComponent', () => {
    const testTodo1 = new Todo(1, 'Title');
    const testTodo2 = new Todo(0, 'Testing', true);
    const setDone = jest.fn();
    const wrapper1 = shallow(<TodoComponent todo={testTodo1} setDone={setDone} />);
    const wrapper2 = shallow(<TodoComponent todo={testTodo2} setDone={setDone} />);

    it('should render correctly', () => {
        expect(wrapper1).toMatchSnapshot();
        expect(wrapper2).toMatchSnapshot();
    });

    it('should call setDone correctly', () => {
        wrapper1.find('.todo__checkbox').simulate('change');
        expect(setDone).toBeCalledWith(testTodo1.number);
        expect(setDone).toHaveBeenCalledTimes(1);
        wrapper2.find('.todo__checkbox').simulate('change');
        expect(setDone).toHaveBeenCalledTimes(1);
    });
});
