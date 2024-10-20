import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import api from "../../services/api";

const waveAnimation = keyframes`
  0% { transform: translateX(0) translateZ(0) scaleY(1); }
  50% { transform: translateX(-25%) translateZ(0) scaleY(0.55); }
  100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
`;

const rotateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #6c63ff, #4834d4);
  overflow: hidden;
  position: relative;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const LoadingMessage = styled.h2`
  font-size: 28px;
  color: white;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
`;

const SubMessage = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
  text-align: center;
`;

const RequestCount = styled.div`
  font-size: 48px;
  color: white;
  font-weight: bold;
  margin-bottom: 10px;
`;

const RequestLabel = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
`;

const ProgressIndicator = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: ${rotateAnimation} 1s linear infinite;
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

const LoadingScreen = ({ onRouteConfirmed, requestId }) => {
  const [requestCount, setRequestCount] = useState(0);
  const [shouldDepart, setShouldDepart] = useState(false);
  const [isRequestConfirmed, setIsRequestConfirmed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsResponse = await api.get("/ride-requests");
        if (requestsResponse.data && Array.isArray(requestsResponse.data)) {
          setRequestCount(requestsResponse.data.length);
        }

        const departResponse = await api.get(`/bus-routes/should-depart`);
        if (departResponse.data) {
          setShouldDepart(departResponse.data.should_depart);
          const isConfirmed = departResponse.data.confirmed_request_ids.includes(requestId);
          setIsRequestConfirmed(isConfirmed);

          if (departResponse.data.should_depart && isConfirmed) {
            // 요청 상태 확인
            const requestStatusResponse = await api.get(`/ride-requests/${requestId}`);
            if (requestStatusResponse.data && requestStatusResponse.data.status === "CONFIRMED") {
              onRouteConfirmed();
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [onRouteConfirmed, requestId]);

  return (
    <Container>
      <Content>
        <LoadingMessage>Join the wave of ride</LoadingMessage>
        <SubMessage>We are finding your best wave</SubMessage>
        <RequestCount>{requestCount}</RequestCount>
        <RequestLabel>Active Ride Requests</RequestLabel>
        <ProgressIndicator />
      </Content>
      <Wave />
      <Wave style={{ opacity: 0.5, animationDuration: "15s" }} />
    </Container>
  );
};

export default LoadingScreen;
