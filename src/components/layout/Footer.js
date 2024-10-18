import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
  color: #666;
  font-size: 14px;
`;

const Footer = () => {
  return <FooterContainer>&copy; {new Date().getFullYear()} RideShare. All rights reserved.</FooterContainer>;
};

export default Footer;
