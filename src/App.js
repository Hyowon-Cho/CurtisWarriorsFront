import React, { useState, useEffect } from "react";
import Home from "./components/screens/Home";
import LoadingScreen from "./components/screens/LoadingScreen";
import Registration from "./components/screens/registration";
import ConfirmedRouteScreen from "./components/screens/ConfirmedRouteScreen";
import {
  saveUserToSession,
  getUserFromSession,
  saveRideRequestToSession,
  getRideRequestFromSession,
} from "./utils/sessionUtils";

const App = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [showConfirmedRoute, setShowConfirmedRoute] = useState(false);
  const [user, setUser] = useState(null);
  const [rideRequest, setRideRequest] = useState(null);
  const [confirmedRouteId, setConfirmedRouteId] = useState(null);

  useEffect(() => {
    const savedUser = getUserFromSession();
    const savedRideRequest = getRideRequestFromSession();
    if (savedUser) {
      setUser(savedUser);
    }
    if (savedRideRequest) {
      setRideRequest(savedRideRequest);
      setShowLoading(true);
    }
  }, []);

  const handleRegistration = (userId, name, email) => {
    const newUser = { userId, name, email };
    setUser(newUser);
    saveUserToSession(newUser);
  };

  const handleRideRequest = (requestData) => {
    setRideRequest(requestData);
    saveRideRequestToSession(requestData);
    setShowLoading(true);
  };

  const handleRouteConfirmed = (routeId) => {
    console.log("Route confirmed, updating state");
    setShowLoading(false);
    setShowConfirmedRoute(true);
    setConfirmedRouteId(routeId);
  };

  if (!user) {
    return <Registration onRegister={handleRegistration} />;
  }

  return (
    <div>
      {!showLoading && !showConfirmedRoute && <Home onRequestRide={handleRideRequest} user={user} />}
      {showLoading && <LoadingScreen onRouteConfirmed={handleRouteConfirmed} requestId={rideRequest?.request_id} />}
      {showConfirmedRoute && <ConfirmedRouteScreen requestId={rideRequest?.request_id} routeId={confirmedRouteId} />}
    </div>
  );
};

export default App;