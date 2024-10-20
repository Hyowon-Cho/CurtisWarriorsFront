import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { createUser } from "../../services/api";
import { FaUser, FaEnvelope } from "react-icons/fa";

const waveAnimation = keyframes`
  0% { transform: translateX(0) translateZ(0) scaleY(1); }
  50% { transform: translateX(-25%) translateZ(0) scaleY(0.55); }
  100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6c63ff, #4834d4);
  overflow: hidden;
  position: relative;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 440px;
  z-index: 2;
  padding: 0 20px;
`;

const FormCard = styled.form`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const Title = styled.h1`
  font-size: 32px;
  color: white;
  text-align: center;
  margin-bottom: 12px;
  font-weight: 600;
`;

const SubTitle = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 40px;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 16px 16px 48px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  font-size: 16px;
  color: white;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.8);
  font-size: 20px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  gap: 12px;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: white;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: white;
  color: #4834d4;
  border: none;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  text-align: center;
  margin: 16px 0;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;

  ${({ type }) =>
    type === "error" &&
    `
    background: rgba(255, 65, 54, 0.1);
    color: #ff4136;
  `}

  ${({ type }) =>
    type === "success" &&
    `
    background: rgba(40, 167, 69, 0.1);
    color: #28a745;
  `}
`;

const Wave = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23ffffff33'/%3E%3C/svg%3E");
  background-position: 0 bottom;
  background-repeat: repeat-x;
  animation: ${waveAnimation} 10s linear infinite;
`;

const Registration = ({ onRegister }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError("Please accept the terms and conditions to continue");
      return;
    }

    if (name.length < 3 || !email.includes("@")) {
      setError("Please provide a valid name and email");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await createUser({ name, email });
      if (response.data && response.data.user_id) {
        setSuccess("Welcome aboard! 🌊");
        onRegister(response.data.user_id, response.data.name, response.data.email);
      }
    } catch (error) {
      setError("Oops! Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <FormCard onSubmit={handleSubmit}>
          <Title>Join the wave</Title>
          <SubTitle>Start your journey with us today</SubTitle>

          <InputGroup>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaEnvelope />
            </InputIcon>
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              id="terms"
            />
            <CheckboxLabel htmlFor="terms">I agree to the terms and conditions</CheckboxLabel>
          </CheckboxContainer>

          {error && <Message type="error">{error}</Message>}
          {success && <Message type="success">{success}</Message>}

          <Button type="submit" disabled={loading}>
            {loading ? "Joining..." : "Join now"}
          </Button>
        </FormCard>
      </Content>
      <Wave />
      <Wave style={{ opacity: 0.5, animationDuration: "15s" }} />
    </Container>
  );
};

export default Registration;
