import * as React from 'react';
import { Dispatch } from 'redux';
import { Actions } from '../../redux/reducer';
import Todo from '../../common/Todo';
import TodoComponent from '../../components/TodoComponent';
import Button from '../../components/Button';
import Loader from '../../components/Loader';

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
        {loading && <Loader />}
        <h1 className="index__header">Todo app</h1>
        <form className="index__form" onSubmit={e => e.preventDefault()}>
            <label className="index__form__label" htmlFor="newtodo">Add a new todo:</label>
            <input
                className="index__form__input"
                name="newtodo"
                type="text"
                autoFocus={true}
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <Button click={saveTodo} text="Add" />
        </form>
        <br />
        <main className="index__todo-container">
            {todos.map(t => <TodoComponent todo={t} setDone={setDone} key={t.id} />)}
        </main>
    </main>
);

export default IndexView;
