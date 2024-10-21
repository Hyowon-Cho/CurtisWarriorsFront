import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import api from "../../services/api";
import { GoogleMap, useLoadScript, Polyline, Marker } from "@react-google-maps/api";
import { format, parseISO } from "date-fns";

const waveAnimation = keyframes`
  0% { transform: translateX(0) translateZ(0) scaleY(1); }
  50% { transform: translateX(-25%) translateZ(0) scaleY(0.55); }
  100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
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
  color: white;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  animation: ${fadeIn} 1s ease-out;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
`;

const ETAInfo = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
  text-align: center;
`;

const MapContainer = styled.div`
  width: 80%;
  height: 50vh;
  margin: 20px 0;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
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

const LoadingMessage = styled.div`
  font-size: 18px;
  margin: 20px 0;
`;

const ConfirmedRouteScreen = ({ requestId, routeId }) => {
  const [routeData, setRouteData] = useState(null);
  const [etaInfo, setEtaInfo] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (routeId && requestId) {
          console.log(`Fetching route data for route ${routeId}`);
          const routeResponse = await api.get(`/bus-routes/${routeId}`);
          console.log("Route data response:", routeResponse.data);
          setRouteData(routeResponse.data);

          console.log(`Fetching ETA for route ${routeId} and request ${requestId}`);
          const etaResponse = await api.get(`/bus-routes/${routeId}/eta/${requestId}`);
          console.log("ETA response:", etaResponse.data);
          setEtaInfo(etaResponse.data);
        } else {
          console.error("Missing routeId or requestId");
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [routeId, requestId]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
      {
        featureType: "all",
        elementType: "all",
        stylers: [{ saturation: -100 }, { gamma: 0.5 }],
      },
    ],
  };

  return (
    <Container>
      <Content>
        <Title>Your wave is here!</Title>
        {routeData && etaInfo ? (
          <>
            <ETAInfo>
              Pickup ETA: {etaInfo.pickup_eta ? format(parseISO(etaInfo.pickup_eta), "hh:mm a") : "Calculating..."}
            </ETAInfo>
            <ETAInfo>
              Dropoff ETA: {etaInfo.dropoff_eta ? format(parseISO(etaInfo.dropoff_eta), "hh:mm a") : "Calculating..."}
            </ETAInfo>
            <MapContainer>
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={routeData.pickup_points[0] || { lat: 0, lng: 0 }}
                zoom={12}
                options={mapOptions}
              >
                {routeData.pickup_points && routeData.pickup_points.length > 0 && (
                  <Polyline
                    path={[...routeData.pickup_points, ...routeData.dropoff_points]}
                    options={{
                      strokeColor: "#FFFFFF",
                      strokeOpacity: 0.8,
                      strokeWeight: 3,
                    }}
                  />
                )}
                {routeData.pickup_points &&
                  routeData.pickup_points.map((point, index) => (
                    <Marker
                      key={`pickup-${index}`}
                      position={{ lat: point.latitude, lng: point.longitude }}
                      label={`P${index + 1}`}
                    />
                  ))}
                {routeData.dropoff_points &&
                  routeData.dropoff_points.map((point, index) => (
                    <Marker
                      key={`dropoff-${index}`}
                      position={{ lat: point.latitude, lng: point.longitude }}
                      label={`D${index + 1}`}
                    />
                  ))}
              </GoogleMap>
            </MapContainer>
          </>
        ) : (
          <LoadingMessage>Riding the wave to get your route...</LoadingMessage>
        )}
      </Content>
      <Wave />
      <Wave style={{ opacity: 0.5, animationDuration: "15s" }} />
    </Container>
  );
};

export default ConfirmedRouteScreen;
