import React, { useState } from "react";
import Home from "./components/screens/Home";
import LoadingScreen from "./components/screens/LoadingScreen";

const App = () => {
  const [showLoading, setShowLoading] = useState(false);

  const toggleLoadingScreen = () => {
    setShowLoading(!showLoading);
  };

  return (
    <div>
      {!showLoading && <Home onRequestRide={toggleLoadingScreen} />}
      {showLoading && <LoadingScreen />}
    </div>
  );
};

export default App;
