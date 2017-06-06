import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

const PageNotFound: React.StatelessComponent<RouteComponentProps<undefined>> = () => (
    <div className="page-not-found">
        404 - page not found
    </div>
);

export default PageNotFound;
