import * as React from 'react';
import { shallow } from 'enzyme';
import createHistory from 'history/createBrowserHistory';
import { App } from '../App';

describe('App', () => {
    const index = (
        <App
            match={{ params: undefined, isExact: true, path: '', url: '' }}
            location={{ pathname: '', search: '', state: {}, hash: '', key: '' }}
            history={createHistory()}
        />
    );
    const notFound = (
        <App
            match={{ params: undefined, isExact: false, path: '', url: '' }}
            location={{ pathname: '', search: '', state: {}, hash: '', key: '' }}
            history={createHistory()}
        />
    );

    it('should render correctly', () => {
        expect(shallow(index)).toMatchSnapshot();
        expect(shallow(notFound)).toMatchSnapshot();
    });
});
