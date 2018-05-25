import * as React from 'react';
import { shallow } from 'enzyme';
import { StaticRouter } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import { App } from '../App';

describe('App', () => {
  const index = (
    <StaticRouter context={{}}>
      <App />
    </StaticRouter>
  );
  const notFound = (
    <StaticRouter context={{}}>
      <App />
    </StaticRouter>
  );

  it('should render correctly', () => {
    expect(shallow(index)).toMatchSnapshot();
    expect(shallow(notFound)).toMatchSnapshot();
  });
});
