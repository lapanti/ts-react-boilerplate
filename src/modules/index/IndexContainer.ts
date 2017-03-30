import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { State } from '../../redux/reducer';
import * as IndexActions from './IndexReducer';
import IndexView, { IIndexProps } from './IndexView';

export default connect<{}, {}, IIndexProps>((state: State) => ({
    name: state.index.name,
    post: state.index.post,
    setName: IndexActions.setName,
    fetchPost: IndexActions.fetchPost,
}))(IndexView);
