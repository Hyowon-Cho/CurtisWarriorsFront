import React, { useState } from "react";
import styled from "styled-components";
import Input from "../common/Input";
import Button from "../common/Button";
import { dummyRideRequests } from "../../dummyData";

const RideRequestContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
  white-space: nowrap;  /* 텍스트가 한 줄로 나오도록 */
  overflow: hidden;     /* 넘치는 텍스트 숨기기 */
  text-overflow: ellipsis; /* 넘치는 부분 '...'으로 표시 */
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

    // 유효성 검사: 빈 값이 있는지 확인
    if (!pickup || !dropoff || !maxWaitTime) {
      alert("All fields are required.");
      return;
    }

    // 대기 시간이 숫자이고 10에서 120 사이인지 확인
    const waitTime = parseInt(maxWaitTime);
    if (isNaN(waitTime) || waitTime < 10 || waitTime > 120) {
      alert("Maximum wait time should be between 10 and 120 minutes.");
      return;
    }

    const newRequest = {
      id: String(dummyRideRequests.length + 1),
      userId: "1", // Assuming user with ID 1
      pickup,
      dropoff,
      maxWaitTime: waitTime,
    };
    
    console.log("New ride request:", newRequest);
    // 실제 앱에서는 이 데이터를 백엔드로 전송하는 로직이 여기에 포함됨
    alert("Ride request submitted successfully!");
  };

  return (
    <RideRequestContainer>
      <h1>Request a Ride</h1>
      <Form onSubmit={handleSubmit}>
        <Input
          placeholder="Pickup location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          required
        />
        <Input
          placeholder="Dropoff location"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          required
        />
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