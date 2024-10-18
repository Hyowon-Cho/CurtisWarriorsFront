import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "../common/Input";
import Button from "../common/Button";
import { dummyUsers } from "../../dummyData";

const ProfileContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Fetch user data from dummy data
    const user = dummyUsers[0];
    setName(user.name);
    setEmail(user.email);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", { name, email });
    // In a real app, you would send this data to the backend
    alert("Profile updated successfully!");
  };

  return (
    <ProfileContainer>
      <h1>Your Profile</h1>
      <Form onSubmit={handleSubmit}>
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit">Update Profile</Button>
      </Form>
    </ProfileContainer>
  );
};

export default Profile;
