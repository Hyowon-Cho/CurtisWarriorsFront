import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #6c63ff;
    box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.2);
  }
`;

const Input = (props) => {
  return <StyledInput {...props} />;
};

export default Input;