import * as React from 'react';
import Todo from '../common/Todo';

export interface ITodoComponent {
    readonly todo: Todo;
    setDone(i: number): void;
}

const TodoComponent: React.StatelessComponent<ITodoComponent> = ({ todo, setDone }) =>
    <div className="todo">
        <input
            className="todo__checkbox"
            type="checkbox"
            checked={todo.done}
            onChange={() => !todo.done && setDone(todo.id)}
        />
        <span className="todo__number">
            {todo.id}:
        </span>
        <span className="todo__title">
            {todo.title}
        </span>
    </div>;

export default TodoComponent;
