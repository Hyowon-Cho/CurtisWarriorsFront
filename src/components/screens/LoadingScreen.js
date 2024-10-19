import React from "react";
import styled, { keyframes } from "styled-components";

// Keyframes for cloud movement (maintaining opacity until near the end)
const moveCloud = keyframes`
  0% { transform: translateX(-100%); opacity: 0.8; } /* Start with slightly lower opacity */
  85% { opacity: 0.8; } /* Maintain slight transparency until near the end */
  100% { transform: translateX(100vw); opacity: 0; } /* Fade out as it exits */
`;

// Cloud styled component
const Cloud = styled.div`
  width: 200px;
  height: 60px;
  background: #fff;
  border-radius: 50px;
  position: absolute;
  left: -200px;
  animation: ${moveCloud} 30s linear infinite;
  opacity: 0.6; /* Set initial opacity */
  &:before,
  &:after {
    content: "";
    position: absolute;
    background: #fff;
    width: 100px;
    height: 80px;
    position: absolute;
    top: -15px;
    left: 10px;
    border-radius: 100px;
    transform: rotate(30deg);
  }
  &:after {
    width: 120px;
    height: 120px;
    top: -55px;
    left: auto;
    right: 15px;
  }
`;

// Function to generate random cloud positions with fewer clouds
const generateClouds = (count) => {
  const clouds = [];
  for (let i = 0; i < count; i++) {
    const randomTop = Math.floor(Math.random() * 70) + 10; // Random `top` between 10% and 80%
    const randomDelay = Math.random() * -15; // Random delay to stagger clouds
    clouds.push(<Cloud key={`cloud-${i}`} style={{ top: `${randomTop}%`, animationDelay: `${randomDelay}s` }} />);
  }
  return clouds;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to bottom, #87ceeb, #e0f6ff);
  overflow: hidden;
  position: relative;
`;

const LoadingMessage = styled.h2`
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DotContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #3498db;
  border-radius: 50%;
  margin: 0 3px;
  animation: dotPulse 1s infinite ease-in-out;

  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes dotPulse {
    0%,
    80%,
    100% {
      opacity: 0;
    }
    40% {
      opacity: 1;
    }
  }
`;

const LoadingScreen = () => (
  <Container>
    <LoadingMessage>Searching...</LoadingMessage>
    <DotContainer>
      <Dot />
      <Dot />
      <Dot />
    </DotContainer>
    {generateClouds(5)} {/* Reduced the number of clouds */}
  </Container>
);

export default LoadingScreen;
