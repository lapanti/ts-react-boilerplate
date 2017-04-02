import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { State, Actions } from '../../redux/reducer';
import { setTitle, saveTodo, setDone } from './IndexReducer';
import IndexView, { IIndexProps } from './IndexView';

export default connect<{}, {}, IIndexProps>((state: State) => ({
    title: state.index.title,
    todos: state.index.todos,
    loading: state.index.loading,
}), (dispatch: Dispatch<Actions>) => ({
    setTitle: bindActionCreators(setTitle, dispatch),
    saveTodo: bindActionCreators(saveTodo, dispatch),
    setDone: bindActionCreators(setDone, dispatch),
}))(IndexView);
