import * as React from 'react';
import { shallow } from 'enzyme';
import createHistory from 'history/createBrowserHistory';
import AppView from '../AppView';

describe('AppView', () => {
    const index = (
        <AppView
            match={{ params: undefined, isExact: true, path: '', url: '' }}
            location={{ pathname: '', search: '', state: {}, hash: '', key: '' }}
            history={createHistory()}
        />
    );
    const notFound = (
        <AppView
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
