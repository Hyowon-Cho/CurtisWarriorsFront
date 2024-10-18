import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";

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

const SVGContainer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
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

const LoadingScreen = ({ pickup, dropoff }) => {
  const [isMatched, setIsMatched] = useState(false);
  const [matchComplete, setMatchComplete] = useState(false);
  const [pickupETA, setPickupETA] = useState(null);
  const [dropoffETA, setDropoffETA] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMatched(true);
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

  return (
    <Container>
      <Cloud style={{ top: "10%", left: "10%" }} />
      <Cloud style={{ top: "30%", right: "20%" }} />
      <Cloud style={{ bottom: "20%", left: "30%" }} />
      
      {/* 공 렌더링 삭제 */}
      {/* <SVGContainer>{renderLines()}</SVGContainer> */}
      
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

