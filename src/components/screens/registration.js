import React, { useState } from "react";
import styled from "styled-components";
import { createUser } from "../../services/api";

const RegistrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to bottom right, #6c63ff, #4834d4);
`;

const RegistrationForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #6c63ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5a52d5;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
  font-size: 14px;
`;

const Registration = ({ onRegister }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser({ name, email });
      console.log("Registration response:", response); // 디버깅을 위한 로그
      if (response.data && response.data.user_id) {
        onRegister(response.data.user_id, response.data.name, response.data.email);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error); // 디버깅을 위한 로그
      setError("An error occurred during registration. Please try again.");
    }
  };

  return (
    <RegistrationContainer>
      <RegistrationForm onSubmit={handleSubmit}>
        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">Register</Button>
      </RegistrationForm>
    </RegistrationContainer>
  );
};

export default Registration;
