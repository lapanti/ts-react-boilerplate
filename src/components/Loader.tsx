import * as React from 'react';

const Loader: React.StatelessComponent<undefined> = () => console.log('Loader should show') || (
    <div className="loader">
        <div className="loader__spinner" />
    </div>
);

export default Loader;
