import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { createRideRequest } from "../../services/api";
import Map from "../common/Map";
import { FaMapMarkerAlt, FaClock, FaCreditCard, FaWave } from "react-icons/fa";
import rideWaveImage from "../../assets/ridewave.png";

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
  opacity: 1;
`;

const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  filter: brightness(0) invert(1);
`;

const TitleText = styled.h1`
  font-size: 28px;
  color: white;
  margin: 0;
  font-weight: 600;
`;

const RideFormContainer = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 460px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.18);
  z-index: 3;
  animation: ${fadeIn} 0.3s ease-out;

  @media (min-width: 1024px) {
    right: 24px;
    left: auto;
    transform: none;
  }
`;

const FormHeader = styled.div`
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const FormTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  color: black;
  font-weight: 600;
`;

const RideForm = styled.form`
  padding: 24px;
  display: grid;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: grid;
  gap: 12px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:focus-within {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }
`;

const InputIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background: ${(props) => props.background || "rgba(255, 255, 255, 0.2)"};
  color: white;
  border-radius: 12px;
  margin-right: 12px;
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  color: black;
  min-width: 0;

  &::placeholder {
    color: black;
  }

  &:focus {
    outline: none;
  }
`;

const Select = styled.select`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  color: black;
  cursor: pointer;
  appearance: none;

  &:focus {
    outline: none;
  }

  option {
    background: #4834d4;
    color: white;
  }
`;

const RequestButton = styled.button`
  width: 100%;
  padding: 16px;
  background: white;
  color: #4834d4;
  border: none;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: white;
  font-size: 14px;
  padding: 12px;
  background: rgba(255, 65, 54, 0.2);
  border-radius: 12px;
  text-align: center;
  backdrop-filter: blur(4px);
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

  useEffect(() => {
    if (loadError) {
      console.error("Error loading Google Maps script:", loadError);
      setError("Error loading maps. Please refresh the page.");
    }
  }, [loadError]);

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
        max_wait_time: parseInt(maxWaitTime) * 60,
        payment_method: paymentMethod,
      };

      console.log("Sending ride request data:", rideRequestData);

      const response = await createRideRequest(rideRequestData);
      console.log("Ride request response:", response);

      if (response.data) {
        onRequestRide(response.data);
      } else {
        setError("Failed to create ride request. No data in response.");
      }
    } catch (error) {
      console.error("Error submitting ride request:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
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
      setError("Failed to retrieve location details. Please try again.");
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

  const handleAutocompleteLoad = (autocompleteRef, type) => {
    if (autocompleteRef.current) {
      console.warn(`Autocomplete for ${type} was already initialized.`);
    }
  };

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

      <RideFormContainer>
        <FormHeader>
          <FormTitle>Join the wave of riders</FormTitle>
        </FormHeader>

        <RideForm onSubmit={handleSubmit}>
          <InputGroup>
            <InputWrapper>
              <InputIcon background="rgba(76, 175, 80, 0.3)">
                <FaMapMarkerAlt size={16} />
              </InputIcon>
              <Autocomplete
                onLoad={(autocomplete) => {
                  pickupAutocompleteRef.current = autocomplete;
                  handleAutocompleteLoad(pickupAutocompleteRef, "pickup");
                }}
                onPlaceChanged={() => {
                  const place = pickupAutocompleteRef.current.getPlace();
                  handlePlaceSelect(place, "pickup");
                }}
              >
                <StyledInput
                  placeholder="Where should we pick you up?"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
              </Autocomplete>
            </InputWrapper>

            <InputWrapper>
              <InputIcon background="rgba(244, 67, 54, 0.3)">
                <FaMapMarkerAlt size={16} />
              </InputIcon>
              <Autocomplete
                onLoad={(autocomplete) => {
                  dropoffAutocompleteRef.current = autocomplete;
                  handleAutocompleteLoad(dropoffAutocompleteRef, "dropoff");
                }}
                onPlaceChanged={() => {
                  const place = dropoffAutocompleteRef.current.getPlace();
                  handlePlaceSelect(place, "dropoff");
                }}
              >
                <StyledInput
                  placeholder="Where are you heading?"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                />
              </Autocomplete>
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <InputWrapper>
              <InputIcon background="rgba(255, 193, 7, 0.3)">
                <FaClock size={16} />
              </InputIcon>
              <StyledInput
                type="number"
                placeholder="How long can you wait? (min)"
                value={maxWaitTime}
                onChange={handleMaxWaitTimeChange}
                min="10"
                max="120"
              />
            </InputWrapper>

            <InputWrapper>
              <InputIcon background="rgba(51, 51, 51, 0.3)">
                <FaCreditCard size={16} />
              </InputIcon>
              <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
                <option value="paypal">PayPal</option>
              </Select>
            </InputWrapper>
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <RequestButton type="submit" disabled={!pickup || !dropoff || !maxWaitTime || error}>
            Catch the wave
          </RequestButton>
        </RideForm>
      </RideFormContainer>
    </HomeContainer>
  );
};

export default Home;
