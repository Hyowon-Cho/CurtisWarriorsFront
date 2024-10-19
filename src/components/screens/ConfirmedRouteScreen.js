import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import api from "../../services/api";
import { GoogleMap, useLoadScript, Polyline, Marker } from "@react-google-maps/api";

const waveAnimation = keyframes`
  0% { transform: translateX(0) translateZ(0) scaleY(1); }
  50% { transform: translateX(-25%) translateZ(0) scaleY(0.55); }
  100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #6c63ff, #4834d4);
  overflow: hidden;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: white;
  z-index: 2;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const ETAInfo = styled.div`
  font-size: 18px;
  margin-bottom: 5px;
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
  z-index: 2;
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
  z-index: 1;
`;

const ConfirmedRouteScreen = () => {
  const [routeData, setRouteData] = useState(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const response = await api.get("/bus-routes/current");
        setRouteData(response.data);
      } catch (error) {
        console.error("Failed to fetch route data", error);
      }
    };

    fetchRouteData();
  }, []);

  if (!isLoaded || !routeData) return <div>Loading...</div>;

  const { pickup_eta, dropoff_eta, waypoints } = routeData;

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  return (
    <Container>
      <Header>
        <Title>Your wave is here!</Title>
        <ETAInfo>Pickup ETA: {pickup_eta}</ETAInfo>
        <ETAInfo>Dropoff ETA: {dropoff_eta}</ETAInfo>
      </Header>
      <MapContainer>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={waypoints[0]}
          zoom={12}
          options={mapOptions}
        >
          <Polyline
            path={waypoints}
            options={{
              strokeColor: "#FFFFFF",
              strokeOpacity: 0.8,
              strokeWeight: 3,
            }}
          />
          {waypoints.map((waypoint, index) => (
            <Marker
              key={index}
              position={waypoint}
              label={index === 0 ? "Start" : index === waypoints.length - 1 ? "End" : `${index}`}
            />
          ))}
        </GoogleMap>
      </MapContainer>
      <Wave />
      <Wave style={{ opacity: 0.5, animationDuration: "15s" }} />
    </Container>
  );
};

export default ConfirmedRouteScreen;
