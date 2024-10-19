import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import api from "../../services/api"; // Import to trigger ride requests
import waveImage from "../../assets/sea.png"; // Replace with your wave image path
import dolphinIcon from "../../assets/dolphin.png"; // Dolphin image

// Wave animation: slide right-to-left to create a scrolling effect
const scrollWave = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(100%); }
`;

// Dolphin animation: jumping effect
const moveDolphin = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); } /* Make it jump */
`;

// Styled components for waves
const WaveContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 200%;
  height: 150px;
  overflow: hidden;
`;

const Wave = styled.img`
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  animation: ${scrollWave} 15s linear infinite;
`;

// Dolphin styled component
const Dolphin = styled.img`
  width: 60px;
  position: absolute;
  bottom: 70px; /* Position above the wave */
  animation: ${moveDolphin} 2s ease-in-out infinite;
  opacity: 0.9;
  transition: opacity 0.5s;
`;

// Original dot animation for loading
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

// Container for the overall layout
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to bottom, #87cefa, #e0f6ff);
  overflow: hidden;
  position: relative;
`;

// Original loading message
const LoadingMessage = styled.h2`
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
`;

// Managing dolphins
const LoadingScreen = () => {
  const [dolphins, setDolphins] = useState([]);

  // Add new dolphins when ride request received
  const addDolphin = () => {
    if (dolphins.length >= 8) {
      dolphins.shift(); // Remove the oldest one if over the limit
    }
    const newDolphin = {
      id: Date.now(),
      left: `${Math.random() * 80 + 10}%`, // Random position
    };
    setDolphins([...dolphins, newDolphin]);
  };

  // Listen for new ride requests
  useEffect(() => {
    const fetchRideRequests = async () => {
      try {
        await api.createRideRequest();
        addDolphin(); // Add dolphin when new request is detected
      } catch (error) {
        console.error("Failed to fetch ride request", error);
      }
    };

    const interval = setInterval(fetchRideRequests, 5000); // Polling every 5 seconds
    return () => clearInterval(interval);
  }, [dolphins]);

  return (
    <Container>
      <LoadingMessage>Searching...</LoadingMessage>
      <DotContainer>
        <Dot />
        <Dot />
        <Dot />
      </DotContainer>
      <WaveContainer>
        <Wave src={waveImage} style={{ left: "0%" }} />
        <Wave src={waveImage} style={{ left: "100%" }} />
      </WaveContainer>
      {dolphins.map((dolphin) => (
        <Dolphin key={dolphin.id} src={dolphinIcon} style={{ left: dolphin.left }} />
      ))}
    </Container>
  );
};

export default LoadingScreen;
