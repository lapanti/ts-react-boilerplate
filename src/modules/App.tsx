import * as React from 'react';

const App: React.StatelessComponent<any> = props => (
    <div className="app-base">
        {props.children}
    </div>
);

export default App;
