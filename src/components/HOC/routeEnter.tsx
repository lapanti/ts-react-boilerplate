import * as React from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';

const routeEnter = (
  WrappedComponent: React.ComponentClass<any>,
  routeAction: Action,
) => {
  interface WrapperProps {
    routeEntered(): void;
  }

  class Wrapper extends React.Component<WrapperProps> {
    componentWillMount() {
      this.props.routeEntered();
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return connect<never, WrapperProps>(undefined, dispatch => ({
    routeEntered: () => dispatch(routeAction),
  }))(Wrapper);
};

export default routeEnter;
