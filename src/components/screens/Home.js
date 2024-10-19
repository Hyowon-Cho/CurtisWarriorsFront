import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { createRideRequest } from "../../services/api";
import Map from "../common/Map";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";

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

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 8px;
  width: 100%;
  flex-grow: 1;
  max-width: 100%;
`;

const AutocompleteWrapper = styled(Autocomplete)`
  width: 100%;
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  max-width: 100%;
  &:focus {
    outline: none;
  }
`;

const RequestButton = styled.button`
  background-color: #4caf50;
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

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
`;

const Home = ({ onRequestRide, user }) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [maxWaitTime, setMaxWaitTime] = useState("");
  const [error, setError] = useState("");

  const pickupAutocompleteRef = useRef(null);
  const dropoffAutocompleteRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(maxWaitTime) > 120 || parseInt(maxWaitTime) < 10) {
      setError("Maximum wait time should be between 10 and 120 minutes.");
      return;
    }
    setError("");

    if (!user || !user.userId) {
      setError("User information is missing. Please try logging in again.");
      return;
    }

    if (!pickupLocation || !dropoffLocation) {
      setError("Please select both pickup and drop-off locations.");
      return;
    }

    try {
      const rideRequestData = {
        user_id: user.userId,
        pickup_location: {
          latitude: pickupLocation.lat,
          longitude: pickupLocation.lng,
        },
        dropoff_location: {
          latitude: dropoffLocation.lat,
          longitude: dropoffLocation.lng,
        },
        max_wait_time: parseInt(maxWaitTime) * 60, // Convert minutes to seconds
      };

      console.log("Sending ride request data:", rideRequestData); // 요청 데이터 로깅

      const response = await createRideRequest(rideRequestData);
      console.log("Ride request response:", response); // 응답 로깅

      if (response.data) {
        onRequestRide(response.data); // Pass the ride request data to the parent component
      } else {
        setError("Failed to create ride request. No data in response.");
      }
    } catch (error) {
      console.error("Error submitting ride request:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        setError(`Server error: ${error.response.status}. ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        setError("No response received from server. Please check your network connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        setError(`Error: ${error.message}`);
      }
    }
  };

  const handlePlaceSelect = (place, type) => {
    if (place && place.geometry) {
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
    } else {
      console.error("Invalid place data:", place);
    }
  };

  const onPickupLoad = (autocomplete) => {
    pickupAutocompleteRef.current = autocomplete;
  };

  const onDropoffLoad = (autocomplete) => {
    dropoffAutocompleteRef.current = autocomplete;
  };

  const handleMaxWaitTimeChange = (e) => {
    const value = e.target.value;
    setMaxWaitTime(value);
    if (parseInt(value) > 120 || parseInt(value) < 10) {
      setError("Waiting Time should be between 10 and 120 minutes.");
    } else {
      setError("");
    }
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <HomeContainer>
      <MapContainer>
        <Map pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} />
      </MapContainer>
      <RideFormContainer>
        <RideForm onSubmit={handleSubmit}>
          <InputWrapper>
            <InputIcon color="#4CAF50">
              <FaMapMarkerAlt />
            </InputIcon>
            <AutocompleteWrapper
              onLoad={onPickupLoad}
              onPlaceChanged={() => {
                const place = pickupAutocompleteRef.current.getPlace();
                handlePlaceSelect(place, "pickup");
              }}
            >
              <StyledInput placeholder="Pick-Up Location" value={pickup} onChange={(e) => setPickup(e.target.value)} />
            </AutocompleteWrapper>
          </InputWrapper>
          <InputWrapper>
            <InputIcon color="#F44336">
              <FaMapMarkerAlt />
            </InputIcon>
            <AutocompleteWrapper
              onLoad={onDropoffLoad}
              onPlaceChanged={() => {
                const place = dropoffAutocompleteRef.current.getPlace();
                handlePlaceSelect(place, "dropoff");
              }}
            >
              <StyledInput
                placeholder="Drop-Off Location"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
              />
            </AutocompleteWrapper>
          </InputWrapper>
          <InputWrapper>
            <InputIcon color="#FFC107">
              <FaClock />
            </InputIcon>
            <StyledInput
              type="number"
              placeholder="Waiting Time (minutes)"
              value={maxWaitTime}
              onChange={handleMaxWaitTimeChange}
              min="10"
              max="120"
            />
          </InputWrapper>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <RequestButton type="submit" disabled={!pickup || !dropoff || !maxWaitTime || error}>
            Request Ride
          </RequestButton>
        </RideForm>
      </RideFormContainer>
    </HomeContainer>
  );
};

export default Home;
