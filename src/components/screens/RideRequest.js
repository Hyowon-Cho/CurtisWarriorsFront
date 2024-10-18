import React, { useState } from "react";
import styled from "styled-components";
import Input from "../common/Input";
import Button from "../common/Button";
import { dummyRideRequests } from "../../dummyData";

const RideRequestContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RideRequest = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [maxWaitTime, setMaxWaitTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: String(dummyRideRequests.length + 1),
      userId: "1", // Assuming user with ID 1
      pickup,
      dropoff,
      maxWaitTime: parseInt(maxWaitTime),
    };
    console.log("New ride request:", newRequest);
    // In a real app, you would send this data to the backend
    alert("Ride request submitted successfully!");
  };

  return (
    <RideRequestContainer>
      <h1>Request a Ride</h1>
      <Form onSubmit={handleSubmit}>
        <Input placeholder="Pickup location" value={pickup} onChange={(e) => setPickup(e.target.value)} required />
        <Input placeholder="Dropoff location" value={dropoff} onChange={(e) => setDropoff(e.target.value)} required />
        <Input
          type="number"
          placeholder="Maximum wait time (minutes)"
          value={maxWaitTime}
          onChange={(e) => setMaxWaitTime(e.target.value)}
          min="10"
          max="120"
          required
        />
        <Button type="submit">Submit Request</Button>
      </Form>
    </RideRequestContainer>
  );
};

export default RideRequest;
