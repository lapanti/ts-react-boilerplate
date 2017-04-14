import * as React from 'react';

/* tslint:disable:no-any */
const App: React.StatelessComponent<any> = props => (
    /* tslint:enable:no-any */
    <div className="app-base">
        {props.children}
    </div>
);

export default App;
