import { connect } from 'react-redux';
import AppView, { IAppViewProps } from './AppView'; //tslint:disable-line:no-unused-variable

export default connect<{}, undefined, IAppViewProps>(() => ({}))(AppView);
