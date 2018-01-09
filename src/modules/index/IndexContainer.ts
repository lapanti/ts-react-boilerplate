import { connect } from 'react-redux';
import { State } from '../../redux/reducer';
import { setTitle, saveTodo, setDone } from './IndexReducer';
import IndexView, { IIndexState, IIndexDispatch, IIndexProps } from './IndexView';

const stateToProps = (state: State): IIndexState => ({
    title: state.index.title,
    todos: state.index.todos,
    loading: state.index.loading,
});

export default connect<IIndexState, IIndexDispatch, IIndexProps>(stateToProps, {
    setTitle,
    saveTodo,
    setDone,
})(IndexView);
