import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { State, Actions } from '../../redux/reducer';
import { setName, fetchPost } from './IndexReducer';
import IndexView, { IIndexProps } from './IndexView';

export default connect<{}, {}, IIndexProps>((state: State) => ({
    name: state.index.name,
    post: state.index.post,
}), (dispatch: Dispatch<Actions>) => ({
    setName: bindActionCreators(setName, dispatch),
    fetchPost: bindActionCreators(fetchPost, dispatch),
}))(IndexView);
