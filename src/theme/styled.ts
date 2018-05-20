import * as styledComponents from 'styled-components';
import { MAIN_COLOR } from '../constants/styles';

export interface ThemeInterface {
  readonly primaryColor: string;
}

type StyledFunction<T> = styledComponents.ThemedStyledFunction<
  T,
  ThemeInterface
>;

const withProps = <T, U extends HTMLElement = HTMLElement>(
  styledFunction: StyledFunction<React.HTMLProps<U>>,
): StyledFunction<T & React.HTMLProps<U>> =>
  styledFunction as StyledFunction<T & React.HTMLProps<U>>;

const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<
  ThemeInterface
>;

export const theme = {
  primaryColor: MAIN_COLOR,
};

export default styled;
export { css, injectGlobal, keyframes, ThemeProvider, withProps };
