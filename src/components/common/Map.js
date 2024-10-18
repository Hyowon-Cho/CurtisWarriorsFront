import React from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import styled from "styled-components";

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 37.7749, // Default to San Francisco
  lng: -122.4194,
};

const Map = ({ location }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <MapContainer>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={14} center={location || center}>
        {/* 여기에 마커나 다른 맵 요소들을 추가할 수 있습니다 */}
      </GoogleMap>
    </MapContainer>
  );
};

export default Map;
