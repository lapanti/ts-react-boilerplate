import * as React from 'react';
import { NavLink } from 'react-router-dom';

import styled from '../../../theme/styled';

const StyledHeader = styled.header`
  align-items: center;
  background-color: ${props => props.theme.primaryColor};
  display: flex;
  justify-content: flex-start;
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 2rem;
  margin: 0 2rem;
`;

const Category = styled(NavLink).attrs({
  activeStyle: {
    fontWeight: 'bold',
  },
})`
  color: black;
  cursor: pointer;
  font-size: 1.6rem;
  margin: 0 1rem;
  text-decoration: none;
`;

const Header: React.StatelessComponent<{}> = () => (
  <StyledHeader>
    <Title>HN PWA</Title>
    <Category to="/new">New</Category>
    <Category to="/top">Top</Category>
    <Category to="/best">Best</Category>
  </StyledHeader>
);

export default Header;
