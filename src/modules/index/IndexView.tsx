import * as React from 'react';
import { Dispatch } from 'redux';
import { Actions } from '../../redux/reducer';
import Todo from '../../common/Todo';
import TodoComponent from '../../components/TodoComponent';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

export interface IIndexProps {
    title: string;
    todos: Todo[];
    loading: boolean;
    setTitle: (n: string) => Dispatch<Actions>;
    saveTodo: () => Dispatch<Actions>;
    setDone: (i: number) => Dispatch<Actions>;
}

const IndexView: React.StatelessComponent<IIndexProps> = ({ title, todos, loading, setTitle, saveTodo, setDone }) => (
    <main className="index">
        {loading && <Loading />}
        <h1 className="index__header">Todo app</h1>
        <label htmlFor="newtodo">Add new todo</label>
        <input name="newtodo" className="index__input" type="text" onChange={e => setTitle(e.target.value)} />
        <Button click={saveTodo} text="Add" />
        <br />
        {todos.map(t => <TodoComponent todo={t} setDone={setDone} key={t.number} />)}
    </main>
);

export default IndexView;
