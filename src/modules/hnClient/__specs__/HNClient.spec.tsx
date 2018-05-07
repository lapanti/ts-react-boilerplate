import * as React from 'react';
import { shallow } from 'enzyme';
import createHistory from 'history/createBrowserHistory';
import { HNClient } from '../HNClient';
import Todo from '../../../common/Todo';

describe('HNClient', () => {
  const testTodo1 = new Todo(0, 'title');
  const testTodo2 = new Todo(1, 'testing', true);
  const testTitle = 'A title';
  const testSetTitle = jest.fn();
  const testSaveTodo = jest.fn();
  const testSetDone = jest.fn();
  const wrapperMinimalProps = shallow(
    <HNClient
      title=""
      todos={[]}
      loading={false}
      setTitle={testSetTitle}
      saveTodo={testSaveTodo}
      setDone={testSetDone}
      match={{ params: undefined, isExact: true, path: '', url: '' }}
      location={{ pathname: '', search: '', state: {}, hash: '', key: '' }}
      history={createHistory()}
    />,
  );
  const wrapperMaximumProps = shallow(
    <HNClient
      title={testTitle}
      todos={[testTodo1, testTodo2]}
      loading
      setTitle={testSetTitle}
      saveTodo={testSaveTodo}
      setDone={testSetDone}
      match={{ params: undefined, isExact: true, path: '', url: '' }}
      location={{ pathname: '', search: '', state: {}, hash: '', key: '' }}
      history={createHistory()}
    />,
  );

  it('should render with correct props', () => {
    expect(wrapperMinimalProps).toMatchSnapshot();
    expect(wrapperMaximumProps).toMatchSnapshot();
  });

  it('should call the correct functions when typing to input field', () => {
    const testValue = 'A_TEST_VALUE';
    wrapperMinimalProps
      .find('[type="text"]')
      .simulate('change', { target: { value: testValue } });
    expect(testSetTitle).toBeCalledWith(testValue);
  });
});
