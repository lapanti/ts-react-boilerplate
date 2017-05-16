import * as React from 'react';
import { shallow } from 'enzyme';
import PageNotFound from '../PageNotFound';

describe('PageNotFound', () => (
    it('should render correctly', () => (
        expect(shallow(<PageNotFound />)).toMatchSnapshot()
    ))
));
