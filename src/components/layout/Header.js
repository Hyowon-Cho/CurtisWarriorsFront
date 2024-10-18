import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 700;
  color: #6c63ff;
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  gap: 16px;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #6c63ff;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo to="/">RideShare</Logo>
      <Nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/ride-request">Request Ride</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
