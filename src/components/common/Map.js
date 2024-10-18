import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import styled from "styled-components";
import { MdMyLocation } from "react-icons/md";

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const LocationButton = styled.button`
  background-color: white;
  border: none;
  border-radius: 2px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  margin: 10px;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const libraries = ["places"];

const options = {
  disableDefaultUI: false,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  mapTypeId: "roadmap",
  controlSize: 30,
};

const Map = ({ pickupLocation, dropoffLocation }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [currentLocation, setCurrentLocation] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const onMapLoad = useCallback((map) => {
    setMap(map);

    const locationButton = document.createElement("div");
    ReactDOM.render(
      <LocationButton
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                map.setCenter(pos);
                setCurrentLocation(pos);
              },
              () => {
                console.error("Error: The Geolocation service failed.");
              }
            );
          } else {
            console.error("Error: Your browser doesn't support geolocation.");
          }
        }}
      >
        <MdMyLocation size={24} />
      </LocationButton>,
      locationButton
    );

    map.controls[window.google.maps.ControlPosition.LEFT_BOTTOM].push(locationButton);
  }, []);

  useEffect(() => {
    if (map && pickupLocation && dropoffLocation) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(pickupLocation);
      bounds.extend(dropoffLocation);
      map.fitBounds(bounds);
    }
  }, [map, pickupLocation, dropoffLocation]);

  const currentLocationIcon = {
    path: window.google && window.google.maps ? window.google.maps.SymbolPath.CIRCLE : 0,
    scale: 7,
    fillColor: "#4285F4",
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 2,
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <MapContainer>
      <GoogleMap
        mapContainerStyle={{
          ...mapContainerStyle,
          marginLeft: "10px",
        }}
        zoom={14}
        center={currentLocation || { lat: 0, lng: 0 }}
        options={options}
        onLoad={onMapLoad}
      >
        {currentLocation && <Marker position={currentLocation} icon={currentLocationIcon} />}
        {pickupLocation && (
          <Marker
            position={pickupLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
            }}
          />
        )}
        {dropoffLocation && (
          <Marker
            position={dropoffLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />
        )}
      </GoogleMap>
    </MapContainer>
  );
};

export default Map;
