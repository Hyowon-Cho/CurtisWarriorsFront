import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: #6c63ff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;

  &:hover {
    transform: scale(1.05); /* Slightly enlarges the button on hover */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Adds a shadow effect */
  }

  &:active {
    transform: scale(0.95); /* Shrinks the button on click */
  }
`;

const Button = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;