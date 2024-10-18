import React, { useState } from "react";
import styled from "styled-components";
import Map from "../common/Map";
import Input from "../common/Input";
import Button from "../common/Button";
import useGeolocation from "../../hooks/useGeolocation";
import LoadingScreen from "./LoadingScreen";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
`;

const RideFormContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
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
`;

const InputIcon = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: ${({ color }) => color};
`;

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { location } = useGeolocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
  };

  if (isLoading) {
    return <LoadingScreen pickup={pickup} dropoff={dropoff} />;
  }

  return (
    <HomeContainer>
      <MapContainer>
        <Map location={location} />
      </MapContainer>
      <RideFormContainer>
        <RideForm onSubmit={handleSubmit}>
          <InputWithIcon>
            <InputIcon color="#4CAF50" />
            <Input placeholder="Pickup location" value={pickup} onChange={(e) => setPickup(e.target.value)} />
          </InputWithIcon>
          <InputWithIcon>
            <InputIcon color="#F44336" />
            <Input placeholder="Dropoff location" value={dropoff} onChange={(e) => setDropoff(e.target.value)} />
          </InputWithIcon>
          <Button type="submit" disabled={!pickup || !dropoff}>
            Request Ride
          </Button>
        </RideForm>
      </RideFormContainer>
    </HomeContainer>
  );
};

export default Home;
