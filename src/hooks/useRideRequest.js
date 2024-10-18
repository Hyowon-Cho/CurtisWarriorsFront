import { useState } from 'react';
import { createRideRequest } from '../services/api';

const useRideRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestRide = async (rideData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createRideRequest(rideData);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.message || 'An error occurred while requesting a ride');
      throw err;
    }
  };

  return { requestRide, loading, error };
};

export default useRideRequest;