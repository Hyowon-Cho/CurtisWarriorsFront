import React, { useState, useCallback, useRef } from "react";
import styled from "styled-components";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import Map from "../common/Map";
import LoadingScreen from "./LoadingScreen";
import { FaMapMarkerAlt } from "react-icons/fa";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
`;

const MapContainer = styled.div`
  flex: 1;
  width: 100%;
`;

const RideFormContainer = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const RideForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputWithIcon = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 8px;
  overflow: visible;
  width: 100%;
`;

const InputIcon = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  color: ${({ color }) => color};
  flex-shrink: 0;
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  width: 100%;
  min-width: 0;
  &:focus {
    outline: none;
  }
`;


const RequestButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickupAutocompleteRef = useRef(null);
  const dropoffAutocompleteRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
  };

  const handlePlaceSelect = useCallback((place, type) => {
    if (place.geometry) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      if (type === "pickup") {
        setPickup(place.formatted_address);
        setPickupLocation(location);
      } else {
        setDropoff(place.formatted_address);
        setDropoffLocation(location);
      }
    }
  }, []);

  const onPickupLoad = (autocomplete) => {
    pickupAutocompleteRef.current = autocomplete;
  };

  const onDropoffLoad = (autocomplete) => {
    dropoffAutocompleteRef.current = autocomplete;
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  if (isLoading) {
    return <LoadingScreen pickup={pickup} dropoff={dropoff} />;
  }

  return (
    <HomeContainer>
      <MapContainer>
        <Map 
          pickupLocation={pickupLocation} 
          dropoffLocation={dropoffLocation}
        />
      </MapContainer>
      <RideFormContainer>
        <RideForm onSubmit={handleSubmit}>
          <InputWithIcon>
            <InputIcon color="#4CAF50">
              <FaMapMarkerAlt />
            </InputIcon>
            <Autocomplete
              onLoad={onPickupLoad}
              onPlaceChanged={() => {
                const place = pickupAutocompleteRef.current.getPlace();
                handlePlaceSelect(place, "pickup");
              }}
            >
              <StyledInput
                placeholder="Pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              />
            </Autocomplete>
          </InputWithIcon>
          <InputWithIcon>
            <InputIcon color="#F44336">
              <FaMapMarkerAlt />
            </InputIcon>
            <Autocomplete
              onLoad={onDropoffLoad}
              onPlaceChanged={() => {
                const place = dropoffAutocompleteRef.current.getPlace();
                handlePlaceSelect(place, "dropoff");
              }}
            >
              <StyledInput
                placeholder="Dropoff location"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
              />
            </Autocomplete>
          </InputWithIcon>
          <RequestButton type="submit" disabled={!pickup || !dropoff}>
            Request Ride
          </RequestButton>
        </RideForm>
      </RideFormContainer>
    </HomeContainer>
  );
};

export default Home;