import * as React from 'react';
import { shallow } from 'enzyme';
import createHistory from 'history/createBrowserHistory';

import { Header } from '../Header';

describe('<Header />', () =>
  it('should render with correct props', () =>
    expect(shallow(<Header />)).toMatchSnapshot()));
