export const saveUserToSession = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
  };
  
  export const getUserFromSession = () => {
    const userString = sessionStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  };
  
  export const removeUserFromSession = () => {
    sessionStorage.removeItem('user');
  };
  
  export const saveRideRequestToSession = (rideRequest) => {
    if (rideRequest) {
      sessionStorage.setItem('rideRequest', JSON.stringify(rideRequest));
    } else {
      sessionStorage.removeItem('rideRequest');
    }
  };
  
  export const getRideRequestFromSession = () => {
    const rideRequestString = sessionStorage.getItem('rideRequest');
    return rideRequestString ? JSON.parse(rideRequestString) : null;
  };