import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #87ceeb, #e0f6ff);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Cloud = styled.div`
  width: 200px;
  height: 60px;
  background: #fff;
  border-radius: 200px;
  position: absolute;
  opacity: 0.8;

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

const Passenger = styled.div`
  width: 50px;
  height: 50px;
  background-color: #333;
  border-radius: 50%;
  position: absolute;
  animation: ${float} 3s ease-in-out infinite;
`;

const RouteContainer = styled.div`
  position: relative;
  width: 80%;
  height: 4px;
  background-color: #ddd;
  margin: 20px 0;
`;

const RouteLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #333;
  width: ${(props) => props.progress}%;
  transition: width 0.5s ease-in-out;
`;

const LoadingScreen = ({ pickup, dropoff }) => {
  const [progress, setProgress] = useState(0);
  const [isMatched, setIsMatched] = useState(false);
  const [otherPassenger, setOtherPassenger] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return oldProgress + 1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress > 30 && !otherPassenger) {
      setOtherPassenger({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
    }
    if (progress > 80) {
      setIsMatched(true);
    }
  }, [progress, otherPassenger]);

  return (
    <Container>
      <Cloud style={{ top: "10%", left: "10%" }} />
      <Cloud style={{ top: "30%", right: "20%" }} />
      <Cloud style={{ bottom: "20%", left: "30%" }} />
      <Passenger style={{ left: "40%", top: "40%" }} />
      {otherPassenger && <Passenger style={{ left: `${otherPassenger.x}%`, top: `${otherPassenger.y}%` }} />}
      <RouteContainer>
        <RouteLine progress={progress} style={{ borderStyle: isMatched ? "solid" : "dashed" }} />
      </RouteContainer>
      {isMatched && (
        <div>
          <h2>Ride Matched!</h2>
          <p>Pickup: {pickup.address}</p>
          <p>Dropoff: {dropoff.address}</p>
        </div>
      )}
    </Container>
  );
};

export default LoadingScreen;
