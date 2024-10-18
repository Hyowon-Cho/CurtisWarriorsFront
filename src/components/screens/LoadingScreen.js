import React, { useState, useEffect, useCallback, useRef } from "react";
import styled, { keyframes } from "styled-components";

const floatAnimation = keyframes`
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(var(--translateX), var(--translateY)); }
`;

const dashedLineAnimation = keyframes`
  to { stroke-dashoffset: -20; }
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

const Marker = styled.div`
  width: 30px;
  height: 30px;
  background: radial-gradient(circle at 30% 30%, var(--color), #000);
  border-radius: 50%;
  position: absolute;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  animation: ${floatAnimation} var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
  transition: all 0.5s ease-in-out;
  &:before {
    content: "";
    position: absolute;
    top: 5%;
    left: 5%;
    width: 90%;
    height: 90%;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
  }
`;

const SVGContainer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const DashedLine = styled.path`
  fill: none;
  stroke: #333;
  stroke-width: 2;
  stroke-dasharray: 5, 5;
  animation: ${dashedLineAnimation} 0.5s linear infinite;
`;

const MatchCompleteOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
`;

const LoadingMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  color: #fff;
  font-weight: bold;
`;

const dummyData = [
  { id: 1, x: 20, y: 20, color: "#FF5733" },
  { id: 2, x: 80, y: 20, color: "#33FF57" },
  { id: 3, x: 50, y: 80, color: "#3357FF" },
  { id: 4, x: 30, y: 60, color: "#F3FF33" },
  { id: 5, x: 70, y: 40, color: "#FF33F3" },
];

const LoadingScreen = ({ pickup, dropoff }) => {
  const [markers, setMarkers] = useState(dummyData);
  const [isMatched, setIsMatched] = useState(false);
  const [matchComplete, setMatchComplete] = useState(false);
  const [pickupETA, setPickupETA] = useState(null);
  const [dropoffETA, setDropoffETA] = useState(null);
  const animationRef = useRef();

  const updateMarkerPositions = useCallback(() => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) => ({
        ...marker,
        x: marker.x + (Math.random() - 0.5) * 0.5,
        y: marker.y + (Math.random() - 0.5) * 0.5,
      }))
    );
    animationRef.current = requestAnimationFrame(updateMarkerPositions);
  }, []);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(updateMarkerPositions);
    return () => cancelAnimationFrame(animationRef.current);
  }, [updateMarkerPositions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMatched(true);
      setMarkers((prevMarkers) => {
        const centerX = 50;
        const centerY = 50;
        return prevMarkers.map((marker) => ({
          ...marker,
          x: centerX + (Math.random() - 0.5) * 10,
          y: centerY + (Math.random() - 0.5) * 10,
        }));
      });
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMatched) {
      const timer = setTimeout(() => {
        setMatchComplete(true);
        setPickupETA(Math.floor(Math.random() * 10) + 5);
        setDropoffETA(Math.floor(Math.random() * 20) + 15);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isMatched]);

  const renderLines = () => {
    return markers.map((marker, index) => {
      if (index === markers.length - 1) return null;
      const nextMarker = markers[(index + 1) % markers.length];
      return (
        <DashedLine
          key={`line-${marker.id}-${nextMarker.id}`}
          d={`M${marker.x}% ${marker.y}% L${nextMarker.x}% ${nextMarker.y}%`}
        />
      );
    });
  };

  return (
    <Container>
      <Cloud style={{ top: "10%", left: "10%" }} />
      <Cloud style={{ top: "30%", right: "20%" }} />
      <Cloud style={{ bottom: "20%", left: "30%" }} />
      <SVGContainer>{renderLines()}</SVGContainer>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          style={{
            "--color": marker.color,
            "--translateX": `${(Math.random() - 0.5) * 40}px`,
            "--translateY": `${(Math.random() - 0.5) * 40}px`,
            "--duration": `${Math.random() * 10 + 20}s`,
            "--delay": `${Math.random() * 5}s`,
            left: `${marker.x}%`,
            top: `${marker.y}%`,
          }}
        />
      ))}
      {/* 로딩 메시지 추가 */}
      {!matchComplete && <LoadingMessage>Loading...</LoadingMessage>}
      {matchComplete && (
        <MatchCompleteOverlay>
          <h2>Match Complete!</h2>
          <p>Pickup: {pickup}</p>
          <p>Dropoff: {dropoff}</p>
          <p>Estimated pickup time: {pickupETA} minutes</p>
          <p>Estimated dropoff time: {dropoffETA} minutes</p>
        </MatchCompleteOverlay>
      )}
    </Container>
  );
};

export default LoadingScreen;
