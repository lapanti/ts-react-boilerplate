import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { State, Actions } from '../../redux/reducer';
import { setTitle, saveTodo, setDone } from './IndexReducer';
import IndexView, { IIndexState, IIndexDispatch, IIndexProps } from './IndexView';

const stateToProps = (state: State): IIndexState => ({
    title: state.index.title,
    todos: state.index.todos,
    loading: state.index.loading,
});

const dispatchToProps = (dispatch: Dispatch<Actions>): IIndexDispatch => ({
    setTitle: bindActionCreators(setTitle, dispatch),
    saveTodo: bindActionCreators(saveTodo, dispatch),
    setDone: bindActionCreators(setDone, dispatch),
});

export default connect<IIndexState, IIndexDispatch, IIndexProps>(stateToProps, dispatchToProps)(IndexView);
