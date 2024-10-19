import React, { useState, useEffect } from "react";
import Home from "./components/screens/Home";
import LoadingScreen from "./components/screens/LoadingScreen";
import Registration from "./components/screens/registration";
import { saveUserToSession, getUserFromSession } from "./utils/sessionUtils";

const App = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = getUserFromSession();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const toggleLoadingScreen = () => {
    setShowLoading(!showLoading);
  };

  const handleRegistration = (userId, name, email) => {
    const newUser = { userId, name, email };
    setUser(newUser);
    saveUserToSession(newUser);
  };

  if (!user) {
    return <Registration onRegister={handleRegistration} />;
  }

  return (
    <div>
      {!showLoading && <Home onRequestRide={toggleLoadingScreen} user={user} />}
      {showLoading && <LoadingScreen />}
    </div>
  );
};

export default App;
