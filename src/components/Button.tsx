import * as React from 'react';
import { Dispatch } from 'redux';
import { Actions } from '../redux/reducer';

export interface IButtonProps {
    click: () => Dispatch<Actions>;
    text: string;
}

const Button: React.StatelessComponent<IButtonProps> = ({ click, text }) => (
    <input className="btn" type="submit" onClick={() => click()} value={text} />
);

export default Button;
