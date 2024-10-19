import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { createUser } from "../../services/api";
import { FaUser, FaEnvelope, FaCar } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import carSideView from "../../assets/carSideView.png"; // Ensure you have this image in your assets folder
import ridewaveImage from "../../assets/ridewave.png"; // Assuming the image is stored here

const ImageContainer = styled.div`
  width: 200px; // You can adjust this to control the overall image size
  justify-content: center;
  margin: 0rem 0; // Adjust this to increase/decrease the padding above and below the image
  img {
    width: 100%;
    height: auto;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #6c63ff, #a29bfe);
  padding: 20px;
  background-size: cover;
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.85);
  padding: 2rem; // Reduce or increase this to adjust the padding inside the form
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px; // Adjust this to change the form size
  text-align: center;
  backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  color: #6c63ff;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid #ddd;
  border-radius: 30px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: #6c63ff;
    outline: none;
    box-shadow: 0 0 8px rgba(108, 99, 255, 0.5);
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c63ff;
  font-size: 1.2rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #6c63ff;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #4834d4;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.div`
  color: #ff4136;
  margin-bottom: 1rem;
  font-size: 14px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  margin-bottom: 1rem;
  font-size: 14px;
  text-align: center;
`;

const CheckboxGroup = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  font-size: 14px;

  input {
    margin-right: 10px;
  }
`;

const LoadingSpinner = styled(AiOutlineLoading3Quarters)`
  animation: ${keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `} 1s linear infinite;
  font-size: 1.2rem;
  margin-right: 10px;
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
      setError("You must accept the terms and conditions.");
      return;
    }

    if (name.length < 3 || !email.includes("@")) {
      setError("Please provide a valid name and email.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await createUser({ name, email });
      if (response.data && response.data.user_id) {
        onRegister(response.data.user_id, response.data.name, response.data.email);
        setSuccess("Registration successful! 🎉");
        setName("");
        setEmail("");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Title>
          <ImageContainer>
            <img src={ridewaveImage} alt="Carpool Service" />
          </ImageContainer>
          Join Our Wave of Ride
        </Title>

        <InputGroup>
          <InputIcon>
            <FaUser />
          </InputIcon>
          <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        </InputGroup>
        <InputGroup>
          <InputIcon>
            <FaEnvelope />
          </InputIcon>
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </InputGroup>
        <CheckboxGroup>
          <input type="checkbox" checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)} />
          <label>I accept the terms and conditions</label>
        </CheckboxGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Button type="submit" disabled={loading}>
          {loading && <LoadingSpinner />}
          <img src={carSideView} alt="Car" style={{ width: "30px", marginRight: "10px" }} />
          Register
        </Button>
      </Form>
    </FormContainer>
  );
};

export default Registration;
