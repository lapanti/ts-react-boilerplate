import * as React from 'react';
import { Dispatch } from 'redux';
import { Actions } from '../redux/reducer';
import Todo from '../classes/Todo';

export interface ITodoComponent {
    todo: Todo;
    setDone: (i: number) => Dispatch<Actions>;
}

const TodoComponent: React.StatelessComponent<ITodoComponent> = ({ todo, setDone }) => (
    <div className="todo">
        <input
            className="todo__checkbox"
            type="checkbox"
            checked={todo.done}
            onChange={() => !todo.done && setDone(todo.number)}
        />
        <span className="todo__number">{todo.number}:</span>
        <span className="todo__title">{todo.title}</span>
    </div>
);

export default TodoComponent;
