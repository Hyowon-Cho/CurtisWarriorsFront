export const dummyUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];
  
  export const dummyRideRequests = [
    { id: '1', userId: '1', pickup: 'Central Park', dropoff: 'Times Square', maxWaitTime: 30 },
    { id: '2', userId: '2', pickup: 'Brooklyn Bridge', dropoff: 'Empire State Building', maxWaitTime: 45 },
  ];
  
  export const dummyBusRoutes = [
    { 
      id: '1', 
      busId: 'BUS-001', 
      pickupPoints: ['Central Park', 'Times Square'], 
      dropoffPoints: ['Brooklyn Bridge', 'Empire State Building'],
      departureTime: '2023-05-20T10:00:00Z',
      arrivalTime: '2023-05-20T11:30:00Z'
    },
    { 
      id: '2', 
      busId: 'BUS-002', 
      pickupPoints: ['Statue of Liberty', 'Wall Street'], 
      dropoffPoints: ['Central Park', 'Times Square'],
      departureTime: '2023-05-20T11:00:00Z',
      arrivalTime: '2023-05-20T12:30:00Z'
    },
  ];