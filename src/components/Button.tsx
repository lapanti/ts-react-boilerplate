import * as React from 'react';
import { Dispatch } from 'redux';
import { Actions } from '../redux/reducer';

export interface IButtonProps {
    click: () => Dispatch<Actions>;
    text: string;
}

const Button: React.StatelessComponent<IButtonProps> = ({ click, text }) => (
    <button className="button" onClick={() => click()}>
        {text}
    </button>
);

export default Button;
