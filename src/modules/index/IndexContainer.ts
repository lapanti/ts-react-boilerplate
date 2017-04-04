import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { State, Actions } from '../../redux/reducer';
import { setTitle, saveTodo, setDone } from './IndexReducer';
import IndexView, { IIndexProps } from './IndexView';

const stateToProps = (state: State) => ({
    title: state.index.title,
    todos: state.index.todos,
    loading: state.index.loading,
});

const dispatchToProps = (dispatch: Dispatch<Actions>) => ({
    setTitle: bindActionCreators(setTitle, dispatch),
    saveTodo: bindActionCreators(saveTodo, dispatch),
    setDone: bindActionCreators(setDone, dispatch),
});

export default connect<{}, {}, IIndexProps>(stateToProps, dispatchToProps)(IndexView);
