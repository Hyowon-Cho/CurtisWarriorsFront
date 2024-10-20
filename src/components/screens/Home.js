import React, { useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { createRideRequest } from "../../services/api";
import Map from "../common/Map";
import { FaMapMarkerAlt, FaClock, FaCreditCard, FaChevronUp, FaBars, FaTimes } from "react-icons/fa";
import rideWaveImage from "../../assets/ridewave.png";

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const HomeContainer = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;
  background: linear-gradient(135deg, #6c63ff, #4834d4);
  overflow: hidden;
`;

const MapContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Logo = styled.img`
  width: 50px;
  height: 50px;
  filter: brightness(0) invert(1);
  object-fit: contain; /* Ensures the logo keeps its aspect ratio */
`;

const TitleText = styled.h1`
  font-size: 24px;
  color: white;
  margin: 0;
  font-weight: 600;
`;

const MenuButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const RideFormContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  z-index: 3;
  animation: ${slideUp} 0.3s ease-out;
  transition: transform 0.3s ease;
  transform: translateY(${(props) => (props.minimized ? "calc(100% - 60px)" : "0")});

  @media (min-width: 1024px) {
    width: 400px;
    right: 20px;
    left: auto;
    bottom: 20px;
    border-radius: 24px;
    transform: none;
  }
`;

const FormHeader = styled.div`
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  @media (min-width: 1024px) {
    justify-content: center;
  }
`;

const FormTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  transform: rotate(${(props) => (props.minimized ? "180deg" : "0")});

  @media (min-width: 1024px) {
    display: none;
  }
`;

const RideForm = styled.form`
  padding: 20px;
  display: grid;
  gap: 16px;
`;

const LocationGroup = styled.div`
  display: grid;
  gap: 8px;
  position: relative;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 12px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  position: relative;

  &:focus-within {
    border-color: #6c63ff;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
  }
`;

const InputIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  background: ${(props) => props.background || "#6c63ff"};
  color: white;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
  z-index: 2;
`;

const StyledInput = styled.input`
  flex: 1; /* Allows it to take up available space */
  border: none;
  background: transparent;
  font-size: 15px;
  color: #333;
  min-width: 0; /* Prevents it from shrinking */
  overflow: hidden; /* Hides overflow if needed */
  text-overflow: ellipsis; /* Adds ellipsis if text overflows */
  white-space: nowrap; /* Prevents text from wrapping */

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const OptionsGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Select = styled.select`
  width: 100%;
  border: none;
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 12px;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg width='14' height='8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l6 6 6-6' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
  }
`;

const RequestButton = styled.button`
  background: linear-gradient(135deg, #6c63ff, #4834d4);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(72, 52, 212, 0.2);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 13px;
  padding: 8px 12px;
  background-color: #fff1f1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Home = ({ onRequestRide, user }) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [maxWaitTime, setMaxWaitTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
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
        payment_method: paymentMethod,
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
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        setError(`Server error: ${error.response.status}. ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error("Error request:", error.request);
        setError("No response received from server. Please check your network connection.");
      } else {
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
      <Header>
        <LogoContainer>
          <Logo src={rideWaveImage} alt="RideWave" />
          <TitleText>RideWave</TitleText>
        </LogoContainer>
      </Header>

      <MapContainer>
        <Map pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} />
      </MapContainer>

      <RideFormContainer minimized={minimized}>
        <FormHeader>
          <FormTitle>Request a Ride</FormTitle>
          <ToggleButton minimized={minimized} onClick={() => setMinimized(!minimized)}>
            <FaChevronUp size={20} />
          </ToggleButton>
        </FormHeader>

        <RideForm onSubmit={handleSubmit}>
          <LocationGroup>
            <InputWrapper>
              <InputIcon background="#4CAF50">
                <FaMapMarkerAlt size={14} />
              </InputIcon>
              <Autocomplete
                onLoad={(autocomplete) => (pickupAutocompleteRef.current = autocomplete)}
                onPlaceChanged={() => {
                  const place = pickupAutocompleteRef.current.getPlace();
                  handlePlaceSelect(place, "pickup");
                }}
              >
                <StyledInput
                  placeholder="Enter pickup location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
              </Autocomplete>
            </InputWrapper>

            <InputWrapper>
              <InputIcon background="#F44336">
                <FaMapMarkerAlt size={14} />
              </InputIcon>
              <Autocomplete
                onLoad={(autocomplete) => (dropoffAutocompleteRef.current = autocomplete)}
                onPlaceChanged={() => {
                  const place = dropoffAutocompleteRef.current.getPlace();
                  handlePlaceSelect(place, "dropoff");
                }}
              >
                <StyledInput
                  placeholder="Enter destination"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                />
              </Autocomplete>
            </InputWrapper>
          </LocationGroup>

          <OptionsGroup>
            <InputWrapper>
              <InputIcon background="#FFC107">
                <FaClock size={14} />
              </InputIcon>
              <StyledInput
                type="number"
                placeholder="Max wait (min)"
                value={maxWaitTime}
                onChange={handleMaxWaitTimeChange}
                min="10"
                max="120"
              />
            </InputWrapper>

            <InputWrapper>
              <InputIcon background="#333">
                <FaCreditCard size={14} />
              </InputIcon>
              <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
                <option value="paypal">PayPal</option>
              </Select>
            </InputWrapper>
          </OptionsGroup>

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
