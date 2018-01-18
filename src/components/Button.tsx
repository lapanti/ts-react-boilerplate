import * as React from 'react';

export interface IButtonProps {
    click(): void;
    readonly text: string;
}

const Button: React.StatelessComponent<IButtonProps> = ({ click, text }) =>
    <input className="btn" type="submit" onClick={() => click()} value={text} />;

export default Button;
