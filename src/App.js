import React, { useState } from "react";
import Home from "./components/screens/Home";
import LoadingScreen from "./components/screens/LoadingScreen";
import Registration from "./components/screens/registration";

const App = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const toggleLoadingScreen = () => {
    setShowLoading(!showLoading);
  };

  const handleRegistration = (newUserId) => {
    setUserId(newUserId);
  };

  if (!userId) {
    return <Registration onRegister={handleRegistration} />;
  }

  return (
    <div>
      {!showLoading && <Home onRequestRide={toggleLoadingScreen} userId={userId} />}
      {showLoading && <LoadingScreen />}
    </div>
  );
};

export default App;
