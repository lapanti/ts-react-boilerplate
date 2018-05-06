import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import Todo from '../../common/Todo';
import TodoComponent from '../../components/TodoComponent';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { State } from '../../redux/reducer';
import { setTitle, saveTodo, setDone } from './IndexReducer';

export interface IndexState {
  title: string;
  todos: Todo[];
  loading: boolean;
}

export interface IndexDispatch {
  setTitle(n: string): void;
  saveTodo(): void;
  setDone(i: number): void;
}

export type IndexProps = IndexState &
  IndexDispatch &
  RouteComponentProps<undefined>;

export const Index: React.StatelessComponent<IndexProps> = ({
  title,
  todos,
  loading,
  setTitle,
  saveTodo,
  setDone,
}) => (
  <main className="index">
    {loading && <Loader />}
    <h1 className="index__header">Todo app</h1>
    <form className="index__form" onSubmit={e => e.preventDefault()}>
      <label className="index__form__label" htmlFor="newtodo">
        Add a new todo:
      </label>
      <input
        className="index__form__input"
        name="newtodo"
        type="text"
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <Button click={saveTodo} text="Add" />
    </form>
    <br />
    <section className="index__todo-container">
      {todos.map(t => <TodoComponent todo={t} setDone={setDone} key={t.id} />)}
    </section>
  </main>
);

export default connect<IndexState, IndexDispatch, IndexProps, State>(
  (state): IndexState => ({
    title: state.index.title,
    todos: state.index.todos,
    loading: state.index.loading,
  }),
  {
    setTitle,
    saveTodo,
    setDone,
  },
)(Index);
