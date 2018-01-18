import * as React from 'react';
import { shallow } from 'enzyme';
import Button from '../Button';

describe('Button', () => {
    const click = jest.fn();
    const wrapper = shallow(<Button click={click} text="" />);

    it('should render correctly', () => expect(wrapper).toMatchSnapshot());

    it('should call the correct function on click', () => {
        const testTimes = 5;
        for (let i = 0; i < testTimes; i++) {
            wrapper.find('.btn').simulate('click');
        }
        expect(click).toHaveBeenCalledTimes(testTimes);
    });
});
