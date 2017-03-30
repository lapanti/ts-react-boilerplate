import * as React from 'react';
import { Router, Route, browserHistory } from 'react-router';

/* tslint:disable:no-any */
const App: React.StatelessComponent<any> = props => (
    /* tslint:enable:no-any */
    <div className="app-base">
        {props.children}
    </div>
);

export default App;
