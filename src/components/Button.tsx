import * as React from 'react';

export interface ButtonProps {
  click(): void;
  readonly text: string;
}

const Button: React.StatelessComponent<ButtonProps> = ({ click, text }) => (
  <input className="btn" type="submit" onClick={() => click()} value={text} />
);

export default Button;
